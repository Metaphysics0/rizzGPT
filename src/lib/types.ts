import z from "zod/v4";
import type { Conversation } from "./server/database/types";

export interface RelationshipContext {
  duration: number;
  objective: string;
  notes: string;
}

export const RelationshipContextSchema = z.object({
  duration: z.number(),
  objective: z.string(),
  notes: z.string(),
}) satisfies z.ZodType<RelationshipContext>;

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

export type ConversationRole = "user" | "assistant";
export type ConversationStatus =
  | "initial"
  | "processing"
  | "refining"
  | "completed"
  | "failed";

export type ConversationType = "response-helper" | "first-move";
