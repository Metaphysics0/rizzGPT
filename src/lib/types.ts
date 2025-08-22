import type { Conversation } from "./server/database/types";

export interface RelationshipContext {
  duration: number;
  objective: string;
  notes: string;
}

export interface GeneratedResponse {
  explanation: string;
  responses: string[];
  matchName: string;
}

export interface ClientFileUploadPayload {
  pathname: string;
  clientPayload?: string;
  callbackUrl: string;
}

export type ConversationsListItem = Pick<
  Conversation,
  | "id"
  | "matchName"
  | "createdAt"
  | "updatedAt"
  | "status"
  | "rizzResponseDescription"
>;
