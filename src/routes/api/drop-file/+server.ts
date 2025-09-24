import { unknownErrorResponse } from "$lib/server/utils/response.util";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { backblazeStorageService } from "$lib/server/services/backblaze-storage.service";

// JUST FOR TESTING, TRY TO MAKE IT CLIENT SIDE UPLOAD
export const POST = (async ({ request, locals }) => {
  try {
    if (!locals.user) throw new Error("User not authorized");
    const formData = await request.formData();
    const file = getFileFromFormData(formData);
    const response = await backblazeStorageService.uploadFile({
      file,
      userId: locals.user.id,
    });
    console.log("BACKBLAZE STORAGE RESPONSE", response);

    // const response = await triggerClientFileUpload(file, locals.user!.id);
    // console.log("RESPONSE", response);

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
