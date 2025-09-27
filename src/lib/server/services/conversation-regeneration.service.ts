import { actions } from "./db-actions.service";
import { backblazeStorageService } from "./backblaze-storage.service";
import { GeminiService } from "./llm/gemini";
import { PromptHelper } from "./llm/prompt-helper";
import { LLMInferenceType } from "./llm/types";
import type { Conversation } from "../database/types";

export interface RegenerateRizzRequest {
  conversationId: string;
  userId: string;
}

export class ConversationRegenerationService {
  private readonly geminiService: GeminiService;

  constructor() {
    this.geminiService = new GeminiService();
  }

  async regenerateRizzResponses(request: RegenerateRizzRequest) {
    const { conversationId, userId } = request;

    const conversation = await actions.getConversationById(conversationId);
    if (!conversation) throw new Error("Conversation not found");
    if (conversation.userId !== userId) throw new Error("Unauthorized");

    try {
      // Download the original file
      const file = await backblazeStorageService.downloadFile(
        conversation.initialUploadedConversationFileName
      );

      // Create modified prompt with previous responses context
      const prompt = this.createRegenerationPrompt(conversation);

      // Generate new responses
      const generateRizzResponse = await this.geminiService.generateContent({
        prompt,
        file,
      });

      // Append new responses to existing ones
      const updatedRizzResponses = [
        ...conversation.rizzResponses,
        ...generateRizzResponse.responses,
      ];

      // Update conversation with new responses
      await actions.updateConversation(conversationId, {
        rizzResponses: updatedRizzResponses,
        rizzResponseDescription: generateRizzResponse.explanation,
        // Keep original matchName unless it was "Processing..."
        ...(conversation.matchName === "Processing..." && {
          matchName: generateRizzResponse.matchName,
        }),
      });

      return {
        responses: generateRizzResponse.responses,
        explanation: generateRizzResponse.explanation,
        matchName: generateRizzResponse.matchName,
      };
    } catch (error) {
      console.error("Error regenerating rizz responses:", error);
      throw new Error("Failed to regenerate responses");
    }
  }

  private createRegenerationPrompt(conversation: Conversation): string {
    const { relationshipContext, rizzResponses: previousResponses } =
      conversation;

    const basePrompt = PromptHelper.generatePrompt({
      type: LLMInferenceType.GENERATE_RIZZ_RESPONSE,
      data: relationshipContext,
    });

    if (previousResponses.length === 0) {
      console.warn("[RegenerationService] Missing 3 existing responses.");
      return basePrompt;
    }

    // Get the last 3 responses (most recent generation)
    const lastThreeResponses = previousResponses.slice(-3);

    const regenerationContext = `
Previous responses generated:
${lastThreeResponses
  .map((response, index) => `${index + 1}. "${response}"`)
  .join("\n")}

Generate 3 NEW and DIFFERENT response options that avoid repeating the above suggestions. Be creative and offer fresh approaches.
`;

    return `${basePrompt}\n\n${regenerationContext}`;
  }
}
