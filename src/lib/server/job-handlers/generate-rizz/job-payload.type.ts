import type { RelationshipContext } from "$lib/types";

export interface GenerateRizzJobPayload {
  blobUrl: string;
  relationshipContext?: RelationshipContext;
  userId: string;
  conversationId: string;
}
