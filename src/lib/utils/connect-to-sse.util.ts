export function connectToSSE({
  eventSourceUrl,
  itemToUpdate,
  isConnected,
  error,
}: {
  eventSourceUrl: string;
  itemToUpdate: any;
  isConnected: boolean;
  error: string | null;
}): EventSource {
  const eventSource = new EventSource(eventSourceUrl);

  eventSource.onmessage = (event) => {
    try {
      const updatedData = JSON.parse(event.data);
      itemToUpdate = { ...itemToUpdate, ...updatedData };
    } catch (e) {
      console.error("Failed to parse SSE data:", e);
    }
  };

  eventSource.onerror = () => {
    isConnected = false;
    error = "Connection lost. Retrying...";

    setTimeout(() => {
      if (eventSource?.readyState === EventSource.CLOSED) {
        connectToSSE({ eventSourceUrl, itemToUpdate, isConnected, error });
      }
    }, 3000);
  };

  return eventSource;
}
