import type { ConversationType, RelationshipContext } from "$lib/types";
import type { Conversation } from "../database/types";
import { GenerateRizzJobHandler } from "../job-handlers/generate-rizz/job-handler";
import { AnalyzeBioJobHandler } from "../job-handlers/analyze-bio/job-handler";
import type { GenerateRizzJobPayload } from "../job-handlers/generate-rizz/job-payload.type";
import type { AnalyzeBioJobPayload } from "../job-handlers/analyze-bio/job-payload.type";
import { actions } from "./db-actions.service";
import { UsageService } from "./usage.service";
import { SubscriptionService } from "./subscription.service";
import { INITIAL_CONVERSATION_DESCRIPTION } from "$lib/constants/initial-conversation.constant";

export interface ConversationProcessorRequest {
  fileName: string;
  userId: string;
  userEmail: string;
  conversationType: ConversationType;
  relationshipContext?: RelationshipContext;
}

export class ConversationProcessorService {
  private readonly params: ConversationProcessorRequest;
  private readonly usageService: UsageService;
  private readonly subscriptionService: SubscriptionService;

  constructor(params: ConversationProcessorRequest) {
    this.params = params;
    this.usageService = new UsageService();
    this.subscriptionService = new SubscriptionService();
  }

  async initiateConversationProcessing() {
    console.log(
      `[ConversationProcessorService] Starting ${this.params.conversationType} processing - ${JSON.stringify(
        this.params
      )}`
    );

    // Check if user has active subscription
    const activeSubscription =
      await this.subscriptionService.getActiveSubscription(
        this.params.userEmail
      );

    if (!activeSubscription) {
      const hasExceeded = await this.usageService.hasExceededFreeLimit(
        this.params.userId
      );

      if (hasExceeded) {
        console.error(
          `[ConversationProcessorService] Failed to initiate processing - User has exceeded free limit - ${JSON.stringify(
            this.params
          )}`
        );
        throw new Error("Ran out of free generations!");
      }
    }

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
    if (this.params.conversationType === "response-helper") {
      const jobPayload: GenerateRizzJobPayload = {
        conversationId: conversation.id,
        fileName: this.params.fileName,
        relationshipContext: this.params.relationshipContext,
        userId: this.params.userId,
      };

      new GenerateRizzJobHandler(jobPayload).call().catch((error) => {
        console.error("Background job failed:", error);
        actions.updateConversationStatus(conversation.id, "failed");
      });
    } else if (this.params.conversationType === "first-move") {
      const jobPayload: AnalyzeBioJobPayload = {
        conversationId: conversation.id,
        fileName: this.params.fileName,
        userId: this.params.userId,
      };

      new AnalyzeBioJobHandler(jobPayload).call().catch((error) => {
        console.error("Background bio analysis job failed:", error);
        actions.updateConversationStatus(conversation.id, "failed");
      });
    }
  }

  private async createInitialConversation(): Promise<Conversation> {
    return actions.createConversation({
      userId: this.params.userId,
      rizzResponses: [],
      rizzResponseDescription: INITIAL_CONVERSATION_DESCRIPTION,
      initialUploadedConversationFileName: this.params.fileName,
      ...(this.params.relationshipContext && {
        relationshipContext: this.params.relationshipContext,
      }),
      matchName: "Processing...",
      status: "processing",
      conversationType: this.params.conversationType,
    });
  }
}