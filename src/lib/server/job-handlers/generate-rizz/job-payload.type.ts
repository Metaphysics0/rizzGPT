import type { RelationshipContext } from "$lib/types";

export interface GenerateRizzJobPayload {
  blobUrl: string;
  relationshipContext?: RelationshipContext;
  conversationId: string;
  userId: string;
}
