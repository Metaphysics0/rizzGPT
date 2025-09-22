import type { RelationshipContext } from "$lib/types";
import type { Conversation } from "../database/types";
import { GenerateRizzJobHandler } from "../job-handlers/generate-rizz/job-handler";
import type { GenerateRizzJobPayload } from "../job-handlers/generate-rizz/job-payload.type";
import { databaseService } from "./database.service";
import { UsageService } from "./usage.service";
import { SubscriptionService } from "./subscription.service";
import { INITIAL_CONVERSATION_DESCRIPTION } from "$lib/constants/initial-conversation.constant";

export interface ConversationGenerationRequest {
  fileName: string;
  relationshipContext?: RelationshipContext;
  userId: string;
  userEmail: string;
}

export class ConversationGenerationService {
  private readonly params: ConversationGenerationRequest;
  private readonly usageService: UsageService;
  private readonly subscriptionService: SubscriptionService;

  constructor(params: ConversationGenerationRequest) {
    this.params = params;
    this.usageService = new UsageService();
    this.subscriptionService = new SubscriptionService();
  }

  async initiateConversationGeneration() {
    console.log(
      `[ConversationGenerationService] Starting conversation generation - ${JSON.stringify(
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
          `[ConversationGenerationService] Failed to initiate conversation generation - User has exceeded free limit - ${JSON.stringify(
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
    const jobPayload: GenerateRizzJobPayload = {
      conversationId: conversation.id,
      fileName: this.params.fileName,
      relationshipContext: this.params.relationshipContext,
      userId: this.params.userId,
    };

    // We don't await the call() method, allowing it to run in the background
    new GenerateRizzJobHandler(jobPayload).call().catch((error) => {
      console.error("Background job failed:", error);
      databaseService.updateConversationStatus(conversation.id, "failed");
    });
  }

  private async createInitialConversation(): Promise<Conversation> {
    return databaseService.createConversation({
      userId: this.params.userId,
      rizzResponses: [],
      rizzResponseDescription: INITIAL_CONVERSATION_DESCRIPTION,
      initialUploadedConversationFileName: this.params.fileName,
      ...(this.params.relationshipContext && {
        relationshipContext: this.params.relationshipContext,
      }),
      matchName: "Processing...",
      status: "processing",
    });
  }
}
