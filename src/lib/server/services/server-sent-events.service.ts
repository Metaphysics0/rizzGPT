export interface SSEData {
  [key: string]: any;
}

export interface SSEOptions {
  pollIntervalMs?: number;
  closeOnCondition?: (data: SSEData) => boolean;
}

export class ServerSentEventsService {
  createEventStream<T extends SSEData>(
    initialData: T,
    dataFetcher: () => Promise<T | null>,
    options: SSEOptions = {}
  ): Response {
    const { pollIntervalMs = 2000, closeOnCondition } = options;

    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        let pollInterval: NodeJS.Timeout;

        const sendData = (data: T) => {
          const message = `data: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(encoder.encode(message));
        };

        const startPolling = async () => {
          sendData(initialData);

          pollInterval = setInterval(async () => {
            try {
              const updatedData = await dataFetcher();
              if (updatedData) {
                sendData(updatedData);

                if (closeOnCondition?.(updatedData)) {
                  clearInterval(pollInterval);
                  controller.close();
                }
              }
            } catch (error) {
              console.error("SSE polling error:", error);
            }
          }, pollIntervalMs);
        };

        startPolling();

        return () => {
          if (pollInterval) {
            clearInterval(pollInterval);
          }
        };
      },
    });

    return new Response(stream, {
      headers: this.getSSEHeaders(),
    });
  }

  createEventStreamWithCleanup<T extends SSEData>(
    initialData: T,
    dataFetcher: () => Promise<T | null>,
    cleanupSignal: AbortSignal,
    options: SSEOptions = {}
  ): Response {
    const { pollIntervalMs = 2000, closeOnCondition } = options;

    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        let pollInterval: NodeJS.Timeout;

        const sendData = (data: T) => {
          const message = `data: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(encoder.encode(message));
        };

        const cleanup = () => {
          if (pollInterval) {
            clearInterval(pollInterval);
          }
          controller.close();
        };

        const startPolling = async () => {
          sendData(initialData);

          pollInterval = setInterval(async () => {
            try {
              const updatedData = await dataFetcher();
              if (updatedData) {
                sendData(updatedData);

                if (closeOnCondition?.(updatedData)) {
                  cleanup();
                }
              }
            } catch (error) {
              console.error("SSE polling error:", error);
            }
          }, pollIntervalMs);
        };

        cleanupSignal.addEventListener("abort", cleanup);
        startPolling();

        return cleanup;
      },
    });

    return new Response(stream, {
      headers: this.getSSEHeaders(),
    });
  }

  private getSSEHeaders(): Record<string, string> {
    return {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
    };
  }
}
