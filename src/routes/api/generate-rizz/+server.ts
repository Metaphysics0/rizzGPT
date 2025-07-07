import { GeminiService } from "$lib/server/gemini.service";
import type { RizzGPTFormData } from "$lib/types";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request }) => {
  try {
    const formData = await request.formData();
    const { rizzGPTFormData, file } = validateFormData(formData);

    const response = await new GeminiService().generateRizz({
      rizzGPTFormData,
      file,
    });

    return json(response);
  } catch (error) {
    console.error("Error in generate-rizz endpoint:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return json({ error: errorMessage }, { status: 500 });
  }
}) satisfies RequestHandler;

function validateFormData(formData: FormData) {
  const formDataJson = formData.get("formData");
  const file = formData.get("file");

  if (!formDataJson || !file) {
    throw new Error("Missing required form data or file");
  }

  if (!(file instanceof File)) {
    throw new Error("Invalid file format");
  }

  try {
    const parsedFormData = JSON.parse(
      formDataJson.toString()
    ) as RizzGPTFormData;

    if (!parsedFormData.source || !parsedFormData.objective) {
      throw new Error("Missing required fields: source and objective");
    }

    return {
      rizzGPTFormData: parsedFormData,
      file,
    };
  } catch (error) {
    console.error("Error parsing form data JSON:", error);
    throw new Error("Invalid form data JSON");
  }
}
