import { GEMINI_API_KEY } from "$env/static/private";
import { Buffer } from "node:buffer";
import {
  type GenerateContentConfig,
  type GenerateContentResponse,
  GoogleGenAI,
  type Part,
} from "@google/genai";
import type { LLMRequest } from "./types";

export class GeminiService {
  private readonly client: GoogleGenAI;
  private readonly GEMINI_FLASH_MODEL = "gemini-2.5-flash-lite";

  constructor() {
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set");
    }

    this.client = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  }

  async generateContent(request: LLMRequest): Promise<any> {
    try {
      const parts: Part[] = [{ text: request.prompt }];

      if (request.file) {
        const imagePart = await this.fileToGenerativePart(request.file);
        parts.unshift(imagePart); // Add image before text
      }

      const defaultConfig: GenerateContentConfig = {
        responseMimeType: "application/json",
        temperature: 0.8,
        topP: 0.95,
      };

      const response = await this.client.models.generateContent({
        model: this.GEMINI_FLASH_MODEL,
        contents: { parts },
        config: { ...defaultConfig, ...request.config },
      });

      return this.parseGenerateContentResponse(response);
    } catch (e) {
      console.error("Gemini service error:", e);
      throw new Error("Gemini service failed. Please try again.");
    }
  }

  private async fileToGenerativePart(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const base64File = Buffer.from(arrayBuffer).toString("base64");

    return {
      inlineData: {
        mimeType: file.type,
        data: base64File,
      },
    };
  }

  private parseGenerateContentResponse(response: GenerateContentResponse) {
    const text = response.text?.trim() || "";
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = text.match(fenceRegex);
    const jsonStr = match?.[2] ? match[2].trim() : text;

    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      throw new Error("Invalid JSON structure in response.");
    }
  }
}
