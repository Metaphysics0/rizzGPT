import { getObjectiveById } from "$lib/constants/relationship-objectives.constant";
import type { RelationshipContext } from "$lib/types";
import dedent from "dedent";
import { LLMInferenceType, type LLMPromptContext } from "./types";

export class PromptHelper {
  static generatePrompt(context: LLMPromptContext): string {
    switch (context.type) {
      case LLMInferenceType.GENERATE_RIZZ_RESPONSE:
        return this.generateRizzResponsePrompt(context.data);
      case LLMInferenceType.ANALYZE_DATING_BIO:
        return this.generateBioAnalysisPrompt(context.data);
      default:
        throw new Error(`Unsupported inference type: ${context.type}`);
    }
  }

  private static generateRizzResponsePrompt(relationshipContext?: RelationshipContext): string {
    // If no relationship context provided, skip the context section
    if (!relationshipContext) {
      return `
${this.RIZZ_GLOBAL_CONTEXT}

${this.RIZZ_RESPONSE_FORMAT}
`;
    }

    const { duration, objective, notes } = relationshipContext;

    // Check if user has provided any meaningful relationship context
    const hasContext = Boolean(objective?.trim() || notes?.trim());

    // Convert objective ID to human-readable label if provided
    const objectiveData = getObjectiveById(objective);
    const objectiveLabel = objectiveData?.label || objective;

    let contextSection = "";
    if (hasContext) {
      contextSection = dedent`
User's Context:
- Communication Duration: ${duration}% on a scale from 'just started' to 'long established'.
- Relationship Objective: ${objectiveLabel}
- Additional Notes from user: ${notes || "None"}

`;
    }

    return `
${this.RIZZ_GLOBAL_CONTEXT}

${contextSection}

${this.RIZZ_RESPONSE_FORMAT}
`;
  }

  private static generateBioAnalysisPrompt(bioContext?: any): string {
    // Placeholder for future bio analysis prompt
    return `
${this.BIO_GLOBAL_CONTEXT}

${this.BIO_RESPONSE_FORMAT}
`;
  }

  private static readonly RIZZ_GLOBAL_CONTEXT = dedent`
You are RizzGPT, a witty and charming AI wingman for dating apps. Your goal is to help users craft the perfect response to keep conversations engaging, fun, and aligned with their dating objectives.
Analyze the provided conversation screenshot/video and the user's context, then generate 3 unique, clever, and context-aware responses.
In the provided screenshot/video, messages on the right are from the user, and messages on the left are from their match. The last message is likely from the match.
`;

  private static readonly RIZZ_RESPONSE_FORMAT = dedent`
Based on the conversation in the image, provide a brief analysis of the current conversation vibe and an explanation of why your suggested responses are a good fit. Then, provide 3 distinct response options for me to send next. Make the responses flirty, funny, or romantic, depending on the context. Keep them concise and natural-sounding.
Please also provide the name of the match in the conversation. If you cannot find the name, please come up with a name or short description related to the conversation, i.e. "Girl from the gym", "Guy from the bar", etc.

Return the response as a valid JSON object with three keys: "explanation" (a string), "responses" (an array of 3 strings), and "matchName" (a string).
Example:
{
  "matchName": "Sharon",
  "explanation": "The conversation has a playful and lighthearted vibe. Your match seems to appreciate humor. These responses aim to build on that by being witty and slightly teasing, encouraging more back-and-forth banter.",
  "responses": [
    "Response option 1",
    "Response option 2",
    "Response option 3"
  ]
}
`;

  private static readonly BIO_GLOBAL_CONTEXT = dedent`
You are RizzGPT, a dating profile expert. Your goal is to analyze dating profile bios and provide insights to help users improve their dating success.
Analyze the provided dating profile screenshot and provide constructive feedback.
`;

  private static readonly BIO_RESPONSE_FORMAT = dedent`
Based on the dating profile in the image, provide an analysis of the bio's strengths and areas for improvement.
Consider factors like personality showcase, conversation starters, red flags, and overall appeal.

Return the response as a valid JSON object with the following structure:
{
  "profileName": "Name from profile or 'Unknown'",
  "overallScore": 75,
  "strengths": ["Array of positive aspects"],
  "improvements": ["Array of suggested improvements"],
  "analysis": "Detailed analysis of the profile"
}
`;
}