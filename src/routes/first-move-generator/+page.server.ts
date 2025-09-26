import { fail, isRedirect, redirect } from "@sveltejs/kit";
import { ConversationProcessorService } from "$lib/server/services/conversation-processor.service";
import { ImageCombinerService } from "$lib/server/services/image-combiner.service";
import type { Actions } from "./$types";

export const actions = {
  generateFirstMove: async ({ request, locals }) => {
    try {
      if (!locals.user) return fail(401, { error: "Unauthorized" });

      const formData = await request.formData();

      // Get multiple image file names
      const imageFileNames = formData.getAll("imageFileNames") as string[];
      if (!imageFileNames || imageFileNames.length === 0) {
        return fail(400, { error: "At least one image file is required" });
      }

      console.log(`[FirstMoveGenerator] Processing ${imageFileNames.length} images: ${JSON.stringify(imageFileNames)}`);

      // Combine multiple images into one using ffmpeg hstack
      const combinedFileName = await ImageCombinerService.combineImagesHorizontally(
        imageFileNames,
        locals.user.id
      );

      console.log(`[FirstMoveGenerator] Images combined into: ${combinedFileName}`);

      const { conversationId } = await new ConversationProcessorService({
        fileName: combinedFileName,
        userId: locals.user.id,
        userEmail: locals.user.email,
        conversationType: "first-move",
      }).initiateConversationProcessing();

      redirect(303, `/conversations/${conversationId}`);
    } catch (error) {
      if (isRedirect(error)) throw error;
      console.error("Generate First Move form action error:", error);
      return fail(500, {
        error:
          error instanceof Error ? error.message : "Failed to generate first moves",
      });
    }
  },
} satisfies Actions;