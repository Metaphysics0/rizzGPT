export enum LLMInferenceType {
  GENERATE_RIZZ_RESPONSE = 'GENERATE_RIZZ_RESPONSE',
  ANALYZE_DATING_BIO = 'ANALYZE_DATING_BIO'
}

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