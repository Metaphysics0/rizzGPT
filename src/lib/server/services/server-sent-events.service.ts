export interface SSEData {
  [key: string]: any;
}

export interface SSEOptions {
  pollIntervalMs?: number;
  closeOnCondition?: (data: SSEData) => boolean;
}

export class ServerSentEventsService {
  static readonly DEFAULT_POLL_INTERVAL = 2000;
  private static readonly SSE_HEADERS = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Cache-Control",
  } as const;

  createEventStream<T extends SSEData>(
    initialData: T,
    dataFetcher: () => Promise<T | null>,
    options: SSEOptions = {}
  ): Response {
    const stream = this.createReadableStream(initialData, dataFetcher, options);
    return new Response(stream, {
      headers: ServerSentEventsService.SSE_HEADERS,
    });
  }

  createEventStreamWithCleanup<T extends SSEData>(
    initialData: T,
    dataFetcher: () => Promise<T | null>,
    cleanupSignal: AbortSignal,
    options: SSEOptions = {}
  ): Response {
    const stream = this.createReadableStream(
      initialData,
      dataFetcher,
      options,
      cleanupSignal
    );
    return new Response(stream, {
      headers: ServerSentEventsService.SSE_HEADERS,
    });
  }

  private createReadableStream<T extends SSEData>(
    initialData: T,
    dataFetcher: () => Promise<T | null>,
    options: SSEOptions,
    cleanupSignal?: AbortSignal
  ): ReadableStream {
    const {
      pollIntervalMs = ServerSentEventsService.DEFAULT_POLL_INTERVAL,
      closeOnCondition,
    } = options;

    return new ReadableStream({
      start: (controller) => {
        const streamManager = new SSEStreamManager<T>(
          controller,
          dataFetcher,
          closeOnCondition,
          pollIntervalMs
        );

        streamManager.start(initialData);

        if (cleanupSignal) {
          cleanupSignal.addEventListener("abort", () =>
            streamManager.cleanup()
          );
        }

        return () => streamManager.cleanup();
      },
    });
  }
}

class SSEStreamManager<T extends SSEData> {
  private encoder = new TextEncoder();
  private pollInterval?: NodeJS.Timeout;
  private isClosed = false;

  constructor(
    private controller: ReadableStreamDefaultController<Uint8Array>,
    private dataFetcher: () => Promise<T | null>,
    private closeOnCondition?: (data: SSEData) => boolean,
    private pollIntervalMs: number = ServerSentEventsService.DEFAULT_POLL_INTERVAL
  ) {}

  start(initialData: T): void {
    this.sendData(initialData);
    this.startPolling();
  }

  cleanup(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = undefined;
    }

    if (!this.isClosed) {
      this.safeCloseController();
    }

    this.isClosed = true;
  }

  private startPolling(): void {
    this.pollInterval = setInterval(async () => {
      if (this.isClosed) {
        this.cleanup();
        return;
      }

      try {
        const updatedData = await this.dataFetcher();
        if (updatedData) {
          this.sendData(updatedData);

          if (this.closeOnCondition?.(updatedData)) {
            this.cleanup();
          }
        }
      } catch (error) {
        console.error("SSE polling error:", error);
      }
    }, this.pollIntervalMs);
  }

  private sendData(data: T): void {
    if (this.isClosed) return;

    try {
      const message = `data: ${JSON.stringify(data)}\n\n`;
      this.controller.enqueue(this.encoder.encode(message));
    } catch (error) {
      console.error("SSE controller error:", error);
      this.cleanup();
    }
  }

  private safeCloseController(): void {
    try {
      this.controller.close();
    } catch (error) {
      console.error("Error closing SSE controller:", error);
    }
  }
}
