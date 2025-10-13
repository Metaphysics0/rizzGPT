import { backblazeStorageService } from "$lib/server/services/backblaze-storage.service";
import { actions } from "$lib/server/services/db-actions.service";
import { GeminiService } from "$lib/server/services/llm/gemini";
import { PromptHelper } from "$lib/server/services/llm/prompt-helper";
import { LLMInferenceType } from "$lib/server/services/llm/types";
import { UsageService } from "$lib/server/services/usage.service";
import type { GenerateRizzJobPayload } from "./job-payload.type";

export class GenerateRizzJobHandler {
  private readonly jobPayload: GenerateRizzJobPayload;
  private readonly geminiService: GeminiService;
  private readonly usageService: UsageService;

  constructor(jobPayload: GenerateRizzJobPayload) {
    this.jobPayload = jobPayload;
    this.geminiService = new GeminiService();
    this.usageService = new UsageService();
  }

  async call() {
    console.log(
      `[GenerateRizzJobHandler] Starting background job - ${JSON.stringify(
        this.jobPayload,
      )}`,
    );
    this.ensureRequiredFieldsArePresent();
    const { fileName, relationshipContext, conversationId } = this.jobPayload;

    try {
      const file = await backblazeStorageService.downloadFile(fileName);

      const prompt = new PromptHelper().generatePrompt({
        type: LLMInferenceType.GENERATE_RIZZ_RESPONSE,
        data: relationshipContext,
      });

      const generateRizzResponse = await this.geminiService.generateContent({
        prompt,
        file,
      });

      await actions.updateConversation(conversationId, {
        rizzResponses: generateRizzResponse.responses,
        rizzResponseDescription: generateRizzResponse.explanation,
        matchName: generateRizzResponse.matchName,
        status: "completed",
      });

      // Record usage after successful generation
      await this.usageService.createUsageRecord({
        userId: this.jobPayload.userId,
        usageType: "first-move-generation",
        metadata: {
          conversationId: this.jobPayload.conversationId,
        },
      });

      return generateRizzResponse;
    } catch (processingError) {
      console.error("Error generating rizz", processingError);
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
