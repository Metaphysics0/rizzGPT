import { generateRizz } from "$lib/server/gemini.service";
import type { RizzGPTFormData } from "$lib/types";
import type { Actions } from "./$types";

export const actions = {
  generateRizz: async (event) => {
    const formData = await event.request.formData();
    const file = formData.get("file") as File;

    const generatedResponse = await generateRizz({
      formData: getFormData(formData),
      file,
    });
    return {
      generatedResponse,
    };
  },
} satisfies Actions;

function getFormData(formData: FormData): RizzGPTFormData {
  const source = formData.get("source") as string;
  const duration = Number(formData.get("duration")) as number;
  const objective = formData.get("objective") as string;
  const notes = formData.get("notes") as string;

  return { source, duration, objective, notes };
}
