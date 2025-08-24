import type { RelationshipContext } from "$lib/types";
import type { Conversation } from "../database/types";
import { GenerateRizzJobHandler } from "../job-handlers/generate-rizz/job-handler";
import type { GenerateRizzJobPayload } from "../job-handlers/generate-rizz/job-payload.type";
import { DatabaseService } from "./database.service";
import { INITIAL_CONVERSATION_DESCRIPTION } from "$lib/constants/initial-conversation.constant";

export interface ConversationGenerationRequest {
  blobUrl: string;
  relationshipContext?: RelationshipContext;
  userId: string;
}

export interface ConversationGenerationResult {
  conversationId: string;
}

export class ConversationGenerationService {
  private readonly databaseService: DatabaseService;

  private readonly params: ConversationGenerationRequest;

  constructor(conversationGenerationRequest: ConversationGenerationRequest) {
    this.databaseService = new DatabaseService();
    this.params = conversationGenerationRequest;
  }

  async initiateConversationGeneration(): Promise<ConversationGenerationResult> {
    console.log(
      `Starting conversation generation - ${JSON.stringify(this.params)}`
    );
    const conversation = await this.createInitialConversation();
    console.log(
      `Initial conversation created - ${JSON.stringify(conversation)}`
    );

    this.processInBackground(conversation);

    return {
      conversationId: conversation.id,
    };
  }

  private processInBackground(conversation: Conversation): void {
    const jobPayload: GenerateRizzJobPayload = {
      conversationId: conversation.id,
      blobUrl: this.params.blobUrl,
      relationshipContext: this.params.relationshipContext,
    };

    // We don't await the call() method, allowing it to run in the background
    new GenerateRizzJobHandler(jobPayload).call().catch((error) => {
      console.error("Background job failed:", error);
      this.databaseService.updateConversationStatus(conversation.id, "failed");
    });
  }

  private async createInitialConversation(): Promise<Conversation> {
    return this.databaseService.createConversation({
      userId: this.params.userId,
      rizzResponses: [],
      rizzResponseDescription: INITIAL_CONVERSATION_DESCRIPTION,
      initialUploadedConversationBlobUrl: this.params.blobUrl,
      ...(this.params.relationshipContext && {
        relationshipContext: this.params.relationshipContext,
      }),
      matchName: "Processing...",
      status: "processing",
    });
  }
}
