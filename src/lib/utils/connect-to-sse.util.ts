export function connectToSSE({
  eventSourceUrl,
  onDataUpdate,
  onConnectionChange,
  onError,
}: {
  eventSourceUrl: string;
  onDataUpdate: (data: any) => void;
  onConnectionChange: (isConnected: boolean) => void;
  onError: (error: string | null) => void;
}): EventSource {
  const eventSource = new EventSource(eventSourceUrl);

  eventSource.onopen = () => {
    onConnectionChange(true);
    onError(null);
  };

  eventSource.onmessage = (event) => {
    try {
      const updatedData = JSON.parse(event.data);
      onDataUpdate(updatedData);
    } catch (e) {
      console.error("Failed to parse SSE data:", e);
      onError("Failed to parse server data");
    }
  };

  eventSource.onerror = () => {
    onConnectionChange(false);
    onError("Connection lost. Retrying...");
  };

  return eventSource;
}
