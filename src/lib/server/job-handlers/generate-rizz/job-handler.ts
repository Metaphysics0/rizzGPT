import { databaseService } from "$lib/server/services/database.service";
import { UsageService } from "$lib/server/services/usage.service";
import { GeminiService } from "$lib/server/services/gemini.service";
import type { GenerateRizzJobPayload } from "./job-payload.type";
import { backblazeStorageService } from "$lib/server/services/backblaze-storage.service";

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
        this.jobPayload
      )}`
    );
    this.ensureRequiredFieldsArePresent();
    const { fileName, relationshipContext, conversationId } = this.jobPayload;

    try {
      const file = await backblazeStorageService.downloadFile(fileName);
      const generateRizzResponse = await this.geminiService.generateRizz({
        relationshipContext,
        file,
      });

      await databaseService.updateConversation(conversationId, {
        rizzResponses: generateRizzResponse.responses,
        rizzResponseDescription: generateRizzResponse.explanation,
        matchName: generateRizzResponse.matchName,
        status: "completed",
      });

      // Increment usage count after successful generation
      await this.usageService.incrementUsage(this.jobPayload.userId);

      return generateRizzResponse;
    } catch (processingError) {
      console.error("Error generating rizz", processingError);
      await databaseService.updateConversation(conversationId, {
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
        `Invalid job payload: ${missingFields.join(", ")} is required`
      );
    }
  }
}
