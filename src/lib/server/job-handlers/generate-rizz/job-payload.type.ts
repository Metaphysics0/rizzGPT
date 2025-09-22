import type { RelationshipContext } from "$lib/types";

export interface GenerateRizzJobPayload {
  fileName: string;
  relationshipContext?: RelationshipContext;
  conversationId: string;
  userId: string;
}
