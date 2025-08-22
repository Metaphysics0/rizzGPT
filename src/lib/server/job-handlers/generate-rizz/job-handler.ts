import { BlobStorageService } from "$lib/server/services/blob-storage.service";
import { DatabaseService } from "$lib/server/services/database.service";
import { GeminiService } from "$lib/server/services/gemini.service";
import type { GenerateRizzJobPayload } from "./job-payload.type";

export class GenerateRizzJobHandler {
  private readonly jobPayload: GenerateRizzJobPayload;
  private readonly dbService: DatabaseService;
  private readonly blobStorageService: BlobStorageService;
  private readonly geminiService: GeminiService;

  constructor(jobPayload: GenerateRizzJobPayload) {
    this.jobPayload = jobPayload;
    this.dbService = new DatabaseService();
    this.blobStorageService = new BlobStorageService();
    this.geminiService = new GeminiService();
  }

  async call() {
    this.ensureRequiredFieldsArePresent();
    const { blobUrl, relationshipContext, conversationId } =
      this.jobPayload;

    try {
      const file = await this.blobStorageService.downloadFileFromBlobUrl(
        blobUrl
      );
      const generateRizzResponse = await this.geminiService.generateRizz({
        relationshipContext,
        file,
      });

      await this.dbService.updateConversation(conversationId, {
        rizzResponses: generateRizzResponse.responses,
        rizzResponseDescription: generateRizzResponse.explanation,
        matchName: generateRizzResponse.matchName,
        status: "completed",
      });

      return generateRizzResponse;
    } catch (processingError) {
      console.error("Error generating rizz", processingError);
      await this.dbService.updateConversation(conversationId, {
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
    const { blobUrl, conversationId } = this.jobPayload;
    const missingFields: string[] = [];

    if (!blobUrl) missingFields.push("blobUrl");
    if (!conversationId) missingFields.push("conversationId");

    if (missingFields.length > 0) {
      throw new Error(
        `Invalid job payload: ${missingFields.join(", ")} is required`
      );
    }
  }
}
