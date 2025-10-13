import type { ConversationType } from "$lib/types";

export enum LLMInferenceType {
  GENERATE_RIZZ_RESPONSE = "GENERATE_RIZZ_RESPONSE",
  ANALYZE_DATING_BIO = "ANALYZE_DATING_BIO",
  OPTIMIZE_PROFILE = "OPTIMIZE_PROFILE",
}

export const conversationTypeToLLMInferenceTypeMap: Record<
  ConversationType,
  LLMInferenceType
> = {
  "first-move": LLMInferenceType.ANALYZE_DATING_BIO,
  "conversation-helper": LLMInferenceType.GENERATE_RIZZ_RESPONSE,
};

export interface LLMPromptContext {
  type: LLMInferenceType;
  data?: any;
}

export interface LLMRequest {
  prompt: string;
  file?: File;
  config?: {
    responseMimeType?: string;
    temperature?: number;
    topP?: number;
  };
}
