import { backblazeStorageService } from "$lib/server/services/backblaze-storage.service";
import { actions } from "$lib/server/services/db-actions.service";
import { GeminiService } from "$lib/server/services/llm/gemini";
import { PromptHelper } from "$lib/server/services/llm/prompt-helper";
import { LLMInferenceType } from "$lib/server/services/llm/types";
import { UsageService } from "$lib/server/services/usage.service";
import type { AnalyzeBioJobPayload } from "./job-payload.type";

export class AnalyzeBioJobHandler {
  private readonly jobPayload: AnalyzeBioJobPayload;
  private readonly geminiService: GeminiService;
  private readonly usageService: UsageService;

  constructor(jobPayload: AnalyzeBioJobPayload) {
    this.jobPayload = jobPayload;
    this.geminiService = new GeminiService();
    this.usageService = new UsageService();
  }

  async call() {
    console.log(
      `[AnalyzeBioJobHandler] Starting background job - ${JSON.stringify(
        this.jobPayload,
      )}`,
    );
    this.ensureRequiredFieldsArePresent();
    const { fileName, conversationId } = this.jobPayload;

    try {
      const file = await backblazeStorageService.downloadFile(fileName);

      const prompt = new PromptHelper().generatePrompt({
        type: LLMInferenceType.ANALYZE_DATING_BIO,
        data: undefined,
      });

      const bioAnalysisResponse = await this.geminiService.generateContent({
        prompt,
        file,
      });

      await actions.updateConversation(conversationId, {
        rizzResponses: bioAnalysisResponse.responses,
        rizzResponseDescription: bioAnalysisResponse.explanation,
        matchName: bioAnalysisResponse.matchName,
        status: "completed",
      });

      // Record usage after successful generation
      await this.usageService.createUsageRecord({
        userId: this.jobPayload.userId,
        usageType: "conversation-helper-generation",
        metadata: {
          conversationId: this.jobPayload.conversationId,
        },
      });

      return bioAnalysisResponse;
    } catch (processingError) {
      console.error("Error analyzing bio", processingError);
      await actions.updateConversation(conversationId, {
        rizzResponses: [],
        rizzResponseDescription: `Error: ${
          processingError instanceof Error
            ? processingError.message
            : "Processing failed"
        }`,
        matchName: "Error",
        status: "completed",
      });
      throw processingError;
    }
  }

  private ensureRequiredFieldsArePresent() {
    const { fileName, conversationId } = this.jobPayload;
    const missingFields: string[] = [];

    if (!fileName) missingFields.push("fileName");
    if (!conversationId) missingFields.push("conversationId");

    if (missingFields.length > 0) {
      throw new Error(
        `Invalid job payload: ${missingFields.join(", ")} is required`,
      );
    }
  }
}
