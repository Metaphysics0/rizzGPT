import { EdgeFunctionEndpoints } from "$lib/constants/edge-function-endpoints.enum";
import type { RelationshipContext } from "$lib/types";

export class ApiService {
  async triggerGenerateRizz({
    relationshipContext,
    blobUrl,
  }: {
    relationshipContext?: RelationshipContext;
    blobUrl: string;
  }): Promise<{ conversationId: string }> {
    const response = await fetch(EdgeFunctionEndpoints.TRIGGER_GENERATE_RIZZ, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blobUrl, relationshipContext }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const { data } = await response.json();
    return data;
  }
}
