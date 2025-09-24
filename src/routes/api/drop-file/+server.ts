import { unknownErrorResponse } from "$lib/server/utils/response.util";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { triggerClientFileUpload } from "$lib/utils/file/client-file-upload.util";

export const POST = (async ({ request, locals }) => {
  try {
    const formData = await request.formData();
    const file = getFileFromFormData(formData);
    const response = await triggerClientFileUpload(file, locals.user!.id);
    console.log("RESPONSE", response);

    // const response = await backblazeStorageService.getClientUploadUrl();
    return json({});
  } catch (error) {
    console.error("Upload token endpoint error:", error);
    return unknownErrorResponse(error, "Upload token generation failed");
  }
}) satisfies RequestHandler;

function getFileFromFormData(formData: FormData): File {
  const file = formData.get("file");

  if (!file) throw new Error("Missing file");
  if (!(file instanceof File)) throw new Error("Invalid input");

  return file;
}
