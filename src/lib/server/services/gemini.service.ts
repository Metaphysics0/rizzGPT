import { GEMINI_API_KEY } from "$env/static/private";
import { getObjectiveById } from "$lib/constants/relationship-objectives.constant";
import type { GeneratedResponse, RizzGPTFormData } from "$lib/types";
import { Buffer } from "node:buffer";
import { type GenerateContentResponse, GoogleGenAI } from "@google/genai";

export class GeminiService {
  private readonly client: GoogleGenAI;
  private readonly GEMINI_FLASH_MODEL = "gemini-2.5-flash-preview-04-17";

  constructor() {
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set");
    }

    this.client = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  }

  async generateRizz({
    rizzGPTFormData,
    file,
  }: {
    rizzGPTFormData: RizzGPTFormData;
    file: File;
  }): Promise<GeneratedResponse> {
    try {
      const imagePart = await this.fileToGenerativePart(file);
      const prompt = this.getGenerateRizzPrompt(rizzGPTFormData);

      const response: GenerateContentResponse =
        await this.client.models.generateContent({
          model: this.GEMINI_FLASH_MODEL,
          contents: { parts: [imagePart, { text: prompt }] },
          config: {
            responseMimeType: "application/json",
            temperature: 0.8,
            topP: 0.95,
          },
        });

      const jsonStr = this.formatJsonResponseForGemini(response);
      const parsedData = JSON.parse(jsonStr) as GeneratedResponse;
      if (
        !parsedData.responses ||
        !Array.isArray(parsedData.responses) ||
        !parsedData.explanation ||
        typeof parsedData.explanation !== "string"
      ) {
        throw new Error("Invalid JSON structure in response.");
      }
      return parsedData;
    } catch (e) {
      console.error("Failed to parse JSON response:", e);
      throw new Error(
        "AI returned an invalid response format. Please try again."
      );
    }
  }

  private async fileToGenerativePart(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const base64EncodedData = Buffer.from(arrayBuffer).toString("base64");

    return {
      inlineData: {
        mimeType: file.type,
        data: base64EncodedData,
      },
    };
  }

  private formatJsonResponseForGemini(response: GenerateContentResponse) {
    const text = response.text?.trim() || "";
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = text.match(fenceRegex);
    if (match?.[2]) return match[2].trim();

    return text;
  }

  private getGenerateRizzPrompt(formData: RizzGPTFormData) {
    const { duration, objective, notes } = formData;

    // Check if user has provided any meaningful relationship context
    const hasContext = Boolean(objective?.trim() || notes?.trim());

    // Convert objective ID to human-readable label if provided
    const objectiveData = getObjectiveById(objective);
    const objectiveLabel = objectiveData?.label || objective;

    let contextSection = "";
    if (hasContext) {
      contextSection = `
User's Context:
- Communication Duration: ${duration}% on a scale from 'just started' to 'long established'.
- Relationship Objective: ${objectiveLabel}
- Additional Notes from user: ${notes || "None"}

`;
    }

    return `
${this.GLOBAL_CONTEXT}

${contextSection}

${this.RESPONSE_FORMAT}
`;
  }

  private readonly GLOBAL_CONTEXT = `
You are RizzGPT, a witty and charming AI wingman for dating apps. Your goal is to help users craft the perfect response to keep conversations engaging, fun, and aligned with their dating objectives. 
Analyze the provided conversation screenshot/video and the user's context, then generate 3 unique, clever, and context-aware responses.
In the screenshot, messages on the right are from the user, and messages on the left are from their match. The last message is likely from the match.
`;

  private readonly RESPONSE_FORMAT = `
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
}
