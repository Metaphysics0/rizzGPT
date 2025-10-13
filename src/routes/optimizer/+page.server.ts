import { OptimizeProfileJobHandler } from "$lib/server/job-handlers/optimize-profile/job-handler";
import { actions as dbActions } from "$lib/server/services/db-actions.service";
import { ImageCombinerService } from "$lib/server/services/image-combiner.service";
import { fail, isRedirect, redirect, type Actions } from "@sveltejs/kit";

export const actions = {
  optimize: async ({ request, locals }) => {
    try {
      if (!locals.user) return fail(401, { error: "Unauthorized" });

      const formData = await request.formData();
      const imageFileNames = formData.getAll("imageFileNames") as string[];
      if (!imageFileNames || imageFileNames.length === 0) {
        return fail(400, { error: "At least one image file is required" });
      }

      // Combine multiple images into one using ffmpeg hstack
      const combinedFileName =
        await ImageCombinerService.combineImagesHorizontally(
          imageFileNames,
          locals.user.id,
        );

      const optimization = await dbActions.createProfileOptimization({
        userId: locals.user.id!,
        combinedImageFileName: combinedFileName,
        status: "processing",
      });

      await new OptimizeProfileJobHandler({
        userId: locals.user.id,
        optimizationId: optimization.id,
        fileName: combinedFileName,
      }).call();

      redirect(303, `/optimizer/${optimization.id}`);
    } catch (e) {
      if (isRedirect(e)) throw e;
      return fail(500, "Something went wrong");
    }
  },
} satisfies Actions;
