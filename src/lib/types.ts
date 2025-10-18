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
  | "conversationType"
>;

export type ConversationRole = "user" | "assistant";
export type ConversationStatus =
  | "initial"
  | "processing"
  | "refining"
  | "completed"
  | "failed";

export type ConversationType = "conversation-helper" | "first-move";

export type PlanType =
  | "the-conversationalist"
  | "the-date-magnet"
  | "the-rizz-master";
export interface UiPlan {
  uiPlanId: PlanType;
  name: string;
  description: string;
  price: string;
  period: string;
  discount?: string;
  features: string[];
  planId: string; // PayPal plan ID
}

export interface ComparisonItem {
  feature: string;
  rizzgptTooltip?: string;
  rizzgpt: boolean | "in-progress";
  competitor: boolean;
  competitorTooltip?: string;
}


// ANNOTATION TYPES
export type Box2D = [number, number, number, number]; // [y_min, x_min, y_max, x_max]

export interface PixelPosition {
  left: number;
  top: number;
  width: number;
  height: number;
}

export type AnnotationType = "photo" | "bio-text" | "prompt" | "overall";
export type AnnotationSeverity = "critical" | "moderate" | "minor";

export interface Annotation {
  id: string;
  type: AnnotationType;
  severity: AnnotationSeverity;
  title: string;
  suggestion: string;
  box_2d: Box2D; // Gemini's normalized coordinate format
}

export interface ProfileOptimization {
  id: string;
  userId: string;
  combinedImageFileName: string;
  overallScore: number;
  summary: string;
  annotations: Annotation[];
  status: "processing" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
}
