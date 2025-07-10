import type { RelationshipContext } from "$lib/types";
import type { Conversation } from "../database/types";
import { DatabaseService } from "./database.service";
import { QstashService } from "./qstash.service";

export interface ConversationGenerationRequest {
  userId: string;
  blobUrl: string;
  relationshipContext: RelationshipContext;
}

export interface ConversationGenerationResult {
  conversationId: string;
}

export class ConversationGenerationService {
  private readonly databaseService: DatabaseService;
  private readonly qstashService: QstashService;

  constructor() {
    this.databaseService = new DatabaseService();
    this.qstashService = new QstashService();
  }

  async initiateConversationGeneration(
    request: ConversationGenerationRequest,
    backgroundJobUrl: string
  ): Promise<ConversationGenerationResult> {
    const conversation = await this.createInitialConversation(request);
    await this.scheduleBackgroundProcessing(
      conversation,
      request,
      backgroundJobUrl
    );

    return {
      conversationId: conversation.id,
    };
  }

  private async createInitialConversation(
    request: ConversationGenerationRequest
  ): Promise<Conversation> {
    return await this.databaseService.createConversation({
      userId: request.userId,
      rizzResponses: [],
      rizzResponseDescription: "Processing your conversation...",
      initialUploadedConversationBlobUrl: request.blobUrl,
      relationshipContext: request.relationshipContext,
      matchName: "Processing...",
      status: "processing",
    });
  }

  private async scheduleBackgroundProcessing(
    conversation: Conversation,
    request: ConversationGenerationRequest,
    backgroundJobUrl: string
  ): Promise<void> {
    await this.qstashService.publishWithAuth({
      url: backgroundJobUrl,
      body: {
        conversationId: conversation.id,
        blobUrl: request.blobUrl,
        relationshipContext: request.relationshipContext,
      },
      userId: request.userId,
    });
  }
}
