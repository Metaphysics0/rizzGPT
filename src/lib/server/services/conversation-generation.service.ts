import { SHOULD_TRIGGER_BACKGROUND_JOB_LOCALLY_IF_IN_DEV_MODE } from "$env/static/private";
import { INITIAL_CONVERSATION_DESCRIPTION } from "$lib/constants/initial-conversation.constant";
import type { RelationshipContext } from "$lib/types";
import type { Conversation } from "../database/types";
import { GenerateRizzJobHandler } from "../job-handlers/generate-rizz/job-handler";
import type { GenerateRizzJobPayload } from "../job-handlers/generate-rizz/job-payload.type";
import { DatabaseService } from "./database.service";
import { QstashService } from "./qstash.service";

export interface ConversationGenerationRequest {
  userId: string;
  blobUrl: string;
  relationshipContext?: RelationshipContext;
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
      rizzResponseDescription: INITIAL_CONVERSATION_DESCRIPTION,
      initialUploadedConversationBlobUrl: request.blobUrl,
      ...(request.relationshipContext && {
        relationshipContext: request.relationshipContext,
      }),
      matchName: "Processing...",
      status: "processing",
    });
  }

  private async scheduleBackgroundProcessing(
    conversation: Conversation,
    request: ConversationGenerationRequest,
    backgroundJobUrl: string
  ): Promise<void> {
    if (
      SHOULD_TRIGGER_BACKGROUND_JOB_LOCALLY_IF_IN_DEV_MODE &&
      process.env.NODE_ENV === "development"
    ) {
      console.log("Dev mode detected - Triggering background job locally");
      const jobPayload: GenerateRizzJobPayload = {
        conversationId: conversation.id,
        blobUrl: request.blobUrl,
        relationshipContext: request.relationshipContext,
        userId: request.userId,
      };
      await new GenerateRizzJobHandler(jobPayload).call();
      return;
    }

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
