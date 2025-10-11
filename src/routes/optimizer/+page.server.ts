import { ImageCombinerService } from "$lib/server/services/image-combiner.service";
import { fail, type Actions } from "@sveltejs/kit";

export const actions = {
  optimize: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: "Unauthorized" });

    const formData = await request.formData();
    const imageFileNames = formData.getAll("imageFileNames") as string[];
    if (!imageFileNames || imageFileNames.length === 0) {
      return fail(400, { error: "At least one image file is required" });
    }

    console.log(
      `[FirstMoveGenerator] Processing ${
        imageFileNames.length
      } images: ${JSON.stringify(imageFileNames)}`
    );

    // Combine multiple images into one using ffmpeg hstack
    const combinedFileName =
      await ImageCombinerService.combineImagesHorizontally(
        imageFileNames,
        locals.user.id
      );

    console.log(
      `[FirstMoveGenerator] Images combined into: ${combinedFileName}`
    );
  },
} satisfies Actions;
