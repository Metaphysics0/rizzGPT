import { backblazeStorageService } from "$lib/server/services/backblaze-storage.service";
import { actions } from "$lib/server/services/db-actions.service";
import { GeminiService } from "$lib/server/services/llm/gemini";
import { PromptHelper } from "$lib/server/services/llm/prompt-helper";
import { LLMInferenceType } from "$lib/server/services/llm/types";
import { UsageService } from "$lib/server/services/usage.service";
import type { OptimizeProfileJobPayload } from "./job-payload.type";

export class OptimizeProfileJobHandler {
  private readonly jobPayload: OptimizeProfileJobPayload;
  private readonly geminiService: GeminiService;
  private readonly usageService: UsageService;

  constructor(jobPayload: OptimizeProfileJobPayload) {
    this.jobPayload = jobPayload;
    this.geminiService = new GeminiService();
    this.usageService = new UsageService();
  }

  async call() {
    console.log(
      `[OptimizeProfileJobHandler] Starting background job - ${JSON.stringify(
        this.jobPayload,
      )}`,
    );
    this.ensureRequiredFieldsArePresent();
    const { fileName, optimizationId } = this.jobPayload;

    try {
      const file = await backblazeStorageService.downloadFile(fileName);

      const prompt = new PromptHelper().generatePrompt({
        type: LLMInferenceType.OPTIMIZE_PROFILE,
        data: undefined,
      });

      const profileOptimizationResponse =
        await this.geminiService.generateContent({
          prompt,
          file,
        });

      await actions.updateProfileOptimization(optimizationId, {
        overallScore: profileOptimizationResponse.overallScore,
        summary: profileOptimizationResponse.summary,
        annotations: profileOptimizationResponse.annotations,
        status: "completed",
      });

      // Record usage after successful generation
      await this.usageService.createUsageRecord({
        userId: this.jobPayload.userId,
        usageType: "profile-optimization",
        metadata: {
          optimizationId: this.jobPayload.optimizationId,
        },
      });

      return profileOptimizationResponse;
    } catch (processingError) {
      console.error("Error optimizing profile", processingError);
      await actions.updateProfileOptimization(optimizationId, {
        status: "failed",
      });
      throw processingError;
    }
  }

  private ensureRequiredFieldsArePresent() {
    const { fileName, optimizationId } = this.jobPayload;
    const missingFields: string[] = [];

    if (!fileName) missingFields.push("fileName");
    if (!optimizationId) missingFields.push("optimizationId");

    if (missingFields.length > 0) {
      throw new Error(
        `Invalid job payload: ${missingFields.join(", ")} is required`,
      );
    }
  }
}
