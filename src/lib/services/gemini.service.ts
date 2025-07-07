import { browser } from '$app/environment';
import type { RizzGPTFormData, GeneratedResponse } from '$lib/types';
import { type GenerateContentResponse, GoogleGenAI } from '@google/genai';

// In Svelte, we'll get the API key from environment variables or a config
let ai: GoogleGenAI | null = null;

// Initialize the AI client when in browser
if (browser) {
	const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
	if (!apiKey) {
		console.error('VITE_GEMINI_API_KEY environment variable is not set.');
	} else {
		ai = new GoogleGenAI({ apiKey });
	}
}

const fileToGenerativePart = async (file: File) => {
	const base64EncodedData = await new Promise<string>((resolve) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
		reader.readAsDataURL(file);
	});
	return {
		inlineData: {
			mimeType: file.type,
			data: base64EncodedData
		}
	};
};

export const generateRizz = async (
	formData: RizzGPTFormData,
	file: File
): Promise<GeneratedResponse> => {
	if (!ai) {
		throw new Error('Gemini AI client is not initialized. Please check your API key.');
	}

	const { source, duration, objective, notes } = formData;

	const imagePart = await fileToGenerativePart(file);

	const prompt = `
You are RizzGPT, a witty and charming AI wingman for dating apps. Your goal is to help users craft the perfect response to keep conversations engaging, fun, and aligned with their dating objectives. 
Analyze the provided conversation screenshot/video and the user's context, then generate 3 unique, clever, and context-aware responses.
In the screenshot, messages on the right are from the user, and messages on the left are from their match. The last message is likely from the match.

User's Context:
- Dating App/Platform: ${source}
- Communication Duration: ${duration}% on a scale from 'just started' to 'long established'.
- Relationship Objective: ${objective.replace(/_/g, ' ')}
- Additional Notes from user: ${notes || 'None'}

Based on the conversation in the image, provide a brief analysis of the current conversation vibe and an explanation of why your suggested responses are a good fit. Then, provide 3 distinct response options for me to send next. Make the responses flirty, funny, or romantic, depending on the context. Keep them concise and natural-sounding.

Return the response as a valid JSON object with two keys: "explanation" (a string) and "responses" (an array of 3 strings).
Example: 
{
  "explanation": "The conversation has a playful and lighthearted vibe. Your match seems to appreciate humor. These responses aim to build on that by being witty and slightly teasing, encouraging more back-and-forth banter.",
  "responses": [
    "Response option 1",
    "Response option 2",
    "Response option 3"
  ]
}
`;

	const response: GenerateContentResponse = await ai.models.generateContent({
		model: 'gemini-2.5-flash-preview-04-17',
		contents: { parts: [imagePart, { text: prompt }] },
		config: {
			responseMimeType: 'application/json',
			temperature: 0.8,
			topP: 0.95
		}
	});

	let jsonStr = response.text?.trim() || '';
	const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
	const match = jsonStr.match(fenceRegex);
	if (match && match[2]) {
		jsonStr = match[2].trim();
	}

	try {
		const parsedData = JSON.parse(jsonStr) as GeneratedResponse;
		if (
			!parsedData.responses ||
			!Array.isArray(parsedData.responses) ||
			!parsedData.explanation ||
			typeof parsedData.explanation !== 'string'
		) {
			throw new Error('Invalid JSON structure in response.');
		}
		return parsedData;
	} catch (e) {
		console.error('Failed to parse JSON response:', e);
		console.error('Raw response text:', jsonStr);
		throw new Error('AI returned an invalid response format. Please try again.');
	}
};
