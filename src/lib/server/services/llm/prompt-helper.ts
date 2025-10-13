import { getObjectiveById } from "$lib/constants/relationship-objectives.constant";
import type { RelationshipContext } from "$lib/types";
import dedent from "dedent";
import {
  FIRST_MOVE_GENERATOR_CONTEXT,
  FIRST_MOVE_GENERATOR_RESPONSE_FORMAT,
} from "./agent-context-prompts/first-move-generator.prompt";
import {
  FOLLOW_UP_MESSAGE_CONTEXT,
  FOLLOW_UP_MESSAGE_RESPONSE_FORMAT,
} from "./agent-context-prompts/follow-up-message.prompt";
import {
  PROFILE_OPTIMIZER_GLOBAL_CONTEXT,
  PROFILE_OPTIMIZER_RESPONSE_FORMAT,
} from "./agent-context-prompts/profile-optimizer.prompt";
import { LLMInferenceType, type LLMPromptContext } from "./types";

export class PromptHelper {
  generatePrompt(context: LLMPromptContext): string {
    switch (context.type) {
      case LLMInferenceType.GENERATE_RIZZ_RESPONSE:
        return this.generateRizzResponsePrompt(context.data);
      case LLMInferenceType.ANALYZE_DATING_BIO:
        return this.generateBioAnalysisPrompt();
      case LLMInferenceType.OPTIMIZE_PROFILE:
        return this.generateProfileOptimizerPrompt();
      default:
        throw new Error(`Unsupported inference type: ${context.type}`);
    }
  }

  private generateRizzResponsePrompt(
    relationshipContext?: RelationshipContext,
  ): string {
    return dedent`
      ${FOLLOW_UP_MESSAGE_CONTEXT}

      ${convertRelationshipContextToLLMPrompt(relationshipContext)}

      ${FOLLOW_UP_MESSAGE_RESPONSE_FORMAT}
    `;
  }

  private generateBioAnalysisPrompt(): string {
    return dedent`
      ${FIRST_MOVE_GENERATOR_CONTEXT}

      ${FIRST_MOVE_GENERATOR_RESPONSE_FORMAT}
    `;
  }

  private generateProfileOptimizerPrompt(): string {
    return dedent`
      ${PROFILE_OPTIMIZER_GLOBAL_CONTEXT}

      ${PROFILE_OPTIMIZER_RESPONSE_FORMAT}
    `;
  }
}

function convertRelationshipContextToLLMPrompt(
  relationshipContext?: RelationshipContext,
): string {
  if (!relationshipContext) return "";

  const { duration, objective, notes } = relationshipContext;
  const userContext: string[] = [];
  if (duration) {
    userContext.push(
      `- Communication Duration: ${duration}% on a scale from 'just started' to 'long established'`,
    );
  }
  if (objective) {
    const objectiveData = getObjectiveById(objective);
    const objectiveLabel = objectiveData?.label || objective;
    userContext.push(`- Relationship Objective: ${objectiveLabel}`);
  }
  if (notes) {
    userContext.push(`- Additional Notes from user: ${notes || "None"}`);
  }

  if (!userContext.length) return "";
  return dedent`
        User's Context:
        ${userContext.join("\n")}
      `;
}
