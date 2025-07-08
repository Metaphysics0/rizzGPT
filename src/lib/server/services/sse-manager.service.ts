import type { JobStatus } from "../types";

/**
 * SSE Connection interface for tracking active connections
 */
interface SSEConnection {
  jobId: string;
  controller: ReadableStreamDefaultController;
  cleanup: () => void;
}

/**
 * SSE Manager Service for handling real-time job status updates
 *
 * This service manages Server-Sent Event connections and provides
 * real-time updates to clients waiting for job completion.
 */
export class SSEManagerService {
  private connections = new Map<string, SSEConnection[]>();
  private jobUpdateTimeouts = new Map<string, NodeJS.Timeout>();

  /**
   * Creates a new SSE stream for a job ID
   */
  createJobStatusStream(jobId: string): ReadableStream {
    return new ReadableStream({
      start: (controller) => {
        console.log(`Starting SSE stream for job ${jobId}`);

        // Add this connection to our tracking
        const connection: SSEConnection = {
          jobId,
          controller,
          cleanup: () => this.removeConnection(jobId, controller),
        };

        this.addConnection(jobId, connection);

        // Send initial status
        this.sendMessage(controller, {
          type: "status",
          data: {
            jobId,
            status: "processing",
            message: "Job processing started...",
          },
        });

        // Set up heartbeat to keep connection alive
        const heartbeat = setInterval(() => {
          try {
            this.sendMessage(controller, {
              type: "heartbeat",
              data: { timestamp: new Date().toISOString() },
            });
          } catch (error) {
            console.log(`Heartbeat failed for job ${jobId}, cleaning up`);
            clearInterval(heartbeat);
            this.removeConnection(jobId, controller);
          }
        }, 30000); // Every 30 seconds

        // Clean up on close
        controller.enqueue(`retry: 5000\n\n`); // Retry after 5 seconds if disconnected
      },

      cancel: () => {
        console.log(`SSE stream cancelled for job ${jobId}`);
        this.removeConnection(jobId, null);
      },
    });
  }

  /**
   * Send job status update to all connected clients for a specific job
   */
  sendJobUpdate(jobId: string, status: JobStatus): void {
    const connections = this.connections.get(jobId);
    if (!connections || connections.length === 0) {
      console.log(`No active connections for job ${jobId}`);
      return;
    }

    console.log(
      `Sending update to ${connections.length} connections for job ${jobId}:`,
      status
    );

    // Send to all connections for this job
    connections.forEach((connection, index) => {
      try {
        this.sendMessage(connection.controller, {
          type: "status",
          data: status,
        });

        // If job is completed or failed, close the connection after a delay
        if (status.status === "completed" || status.status === "failed") {
          setTimeout(() => {
            try {
              this.sendMessage(connection.controller, {
                type: "close",
                data: { message: "Job finished, closing connection" },
              });
              connection.controller.close();
            } catch (error) {
              console.log(
                `Error closing connection ${index} for job ${jobId}:`,
                error
              );
            }
          }, 1000); // 1 second delay to ensure message is received
        }
      } catch (error) {
        console.log(
          `Failed to send update to connection ${index} for job ${jobId}:`,
          error
        );
        // Remove failed connection
        this.removeConnection(jobId, connection.controller);
      }
    });

    // Clean up if job is finished
    if (status.status === "completed" || status.status === "failed") {
      setTimeout(() => {
        this.connections.delete(jobId);
        const timeout = this.jobUpdateTimeouts.get(jobId);
        if (timeout) {
          clearTimeout(timeout);
          this.jobUpdateTimeouts.delete(jobId);
        }
      }, 2000); // Clean up after 2 seconds
    }
  }

  /**
   * Send progress update for a job
   */
  sendJobProgress(jobId: string, progress: number, message?: string): void {
    const connections = this.connections.get(jobId);
    if (!connections || connections.length === 0) return;

    connections.forEach((connection) => {
      try {
        this.sendMessage(connection.controller, {
          type: "progress",
          data: {
            jobId,
            progress,
            message: message || `Processing... ${progress}%`,
          },
        });
      } catch (error) {
        console.log(
          `Failed to send progress to connection for job ${jobId}:`,
          error
        );
      }
    });
  }

  /**
   * Get number of active connections for a job
   */
  getConnectionCount(jobId: string): number {
    return this.connections.get(jobId)?.length || 0;
  }

  /**
   * Get total number of active connections across all jobs
   */
  getTotalConnections(): number {
    let total = 0;
    this.connections.forEach((connections) => {
      total += connections.length;
    });
    return total;
  }

  /**
   * Clean up all connections (useful for shutdown)
   */
  cleanup(): void {
    console.log("Cleaning up all SSE connections");
    this.connections.forEach((connections, jobId) => {
      connections.forEach((connection) => {
        try {
          this.sendMessage(connection.controller, {
            type: "error",
            data: { message: "Server shutting down" },
          });
          connection.controller.close();
        } catch (error) {
          console.log(`Error cleaning up connection for job ${jobId}:`, error);
        }
      });
    });
    this.connections.clear();

    // Clear all timeouts
    this.jobUpdateTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.jobUpdateTimeouts.clear();
  }

  /**
   * Add a connection to the tracking map
   */
  private addConnection(jobId: string, connection: SSEConnection): void {
    if (!this.connections.has(jobId)) {
      this.connections.set(jobId, []);
    }
    this.connections.get(jobId)!.push(connection);
    console.log(
      `Added connection for job ${jobId}. Total connections: ${this.getConnectionCount(
        jobId
      )}`
    );
  }

  /**
   * Remove a connection from tracking
   */
  private removeConnection(
    jobId: string,
    controller: ReadableStreamDefaultController | null
  ): void {
    const connections = this.connections.get(jobId);
    if (!connections) return;

    if (controller) {
      const index = connections.findIndex(
        (conn) => conn.controller === controller
      );
      if (index > -1) {
        connections.splice(index, 1);
        console.log(
          `Removed connection for job ${jobId}. Remaining: ${connections.length}`
        );
      }
    }

    // Remove job entry if no connections left
    if (connections.length === 0) {
      this.connections.delete(jobId);
      console.log(
        `No more connections for job ${jobId}, removed from tracking`
      );
    }
  }

  /**
   * Send a formatted SSE message
   */
  private sendMessage(
    controller: ReadableStreamDefaultController,
    message: {
      type: string;
      data: any;
    }
  ): void {
    const timestamp = new Date().toISOString();
    const formattedMessage = `event: ${message.type}\ndata: ${JSON.stringify({
      ...message.data,
      timestamp,
    })}\n\n`;

    controller.enqueue(formattedMessage);
  }
}

// Global instance for sharing across requests
export const sseManager = new SSEManagerService();
