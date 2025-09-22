import { BackblazeStorageService } from "$lib/server/services/backblaze-storage.service";
import { error, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params, locals }) => {
  try {
    if (!locals.user) throw error(401, "Unauthorized");
    if (!params.fileName) throw error(400, "Filename required");

    const filePath = `uploads/${locals.user.id}/${params.fileName}`;
    const signedUrl = await new BackblazeStorageService().getSignedDownloadUrl(
      filePath
    );

    redirect(302, signedUrl);
  } catch (err) {
    console.error("File download error:", err);
    throw error(500, "Failed to access file");
  }
};
