import { SHOULD_TRIGGER_BACKGROUND_JOB_LOCALLY_IF_IN_DEV_MODE } from "$env/static/private";
import { INITIAL_CONVERSATION_DESCRIPTION } from "$lib/constants/initial-conversation.constant";
import type { RelationshipContext } from "$lib/types";
import type { Conversation } from "../database/types";
import { GenerateRizzJobHandler } from "../job-handlers/generate-rizz/job-handler";
import type { GenerateRizzJobPayload } from "../job-handlers/generate-rizz/job-payload.type";
import { DatabaseService } from "./database.service";
import { QstashService } from "./qstash.service";

export interface ConversationGenerationRequest {
  blobUrl: string;
  relationshipContext?: RelationshipContext;
}

export interface ConversationGenerationResult {
  conversationId: string;
}

export class ConversationGenerationService {
  private readonly databaseService: DatabaseService;
  private readonly qstashService: QstashService;

  private conversationGenerationRequest: ConversationGenerationRequest;
  private backgroundJobUrl: string;

  constructor({
    conversationGenerationRequest,
    backgroundJobUrl,
  }: {
    conversationGenerationRequest: ConversationGenerationRequest;
    backgroundJobUrl: string;
  }) {
    this.databaseService = new DatabaseService();
    this.qstashService = new QstashService();
    this.backgroundJobUrl = backgroundJobUrl;
    this.conversationGenerationRequest = conversationGenerationRequest;
  }

  async initiateConversationGeneration(): Promise<ConversationGenerationResult> {
    const conversation = await this.createInitialConversation();
    await this.scheduleBackgroundProcessing(conversation);

    return {
      conversationId: conversation.id,
    };
  }

  private async createInitialConversation(): Promise<Conversation> {
    return await this.databaseService.createConversation({
      rizzResponses: [],
      rizzResponseDescription: INITIAL_CONVERSATION_DESCRIPTION,
      initialUploadedConversationBlobUrl:
        this.conversationGenerationRequest.blobUrl,
      ...(this.conversationGenerationRequest.relationshipContext && {
        relationshipContext:
          this.conversationGenerationRequest.relationshipContext,
      }),
      matchName: "Processing...",
      status: "processing",
    });
  }

  private async scheduleBackgroundProcessing(
    conversation: Conversation
  ): Promise<void> {
    const jobPayload: GenerateRizzJobPayload = {
      conversationId: conversation.id,
      blobUrl: this.conversationGenerationRequest.blobUrl,
      relationshipContext:
        this.conversationGenerationRequest.relationshipContext,
    };

    if (this.shouldTriggerBackgroundJobLocally) {
      console.log("Dev mode detected - Triggering background job locally");
      await new GenerateRizzJobHandler(jobPayload).call();
      return;
    }

    await this.qstashService.publish<GenerateRizzJobPayload>({
      url: this.backgroundJobUrl,
      body: jobPayload,
    });
  }

  private get shouldTriggerBackgroundJobLocally(): boolean {
    return (
      SHOULD_TRIGGER_BACKGROUND_JOB_LOCALLY_IF_IN_DEV_MODE === "true" &&
      process.env.NODE_ENV === "development"
    );
  }
}
