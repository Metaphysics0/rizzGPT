import type { Actions, PageServerLoad } from "./$types";
import { fail, isRedirect, redirect } from "@sveltejs/kit";
import { ConversationGenerationService } from "$lib/server/services/conversation-generation.service";
import { getRelationshipContextForUpload } from "$lib/utils/get-relationship-context-for-upload.util";
import type { RelationshipContext } from "$lib/types";

export const load: PageServerLoad = async ({ locals }) => {
  return {
    session: locals.session,
    user: locals.user,
  };
};

export const actions = {
  generateRizz: async ({ request, locals }) => {
    try {
      if (!locals.user) {
        return fail(401, { error: "Unauthorized" });
      }

      const formData = await request.formData();
      const fileName = formData.get("fileName") as string;

      if (!fileName) {
        return fail(400, { error: "File upload required" });
      }

      // Parse relationship context from form data
      const relationshipContext: RelationshipContext = {
        duration: Number(formData.get("duration")) || 0,
        objective: (formData.get("objective") as string) || "",
        notes: (formData.get("notes") as string) || "",
      };

      // Use existing utility to conditionally include relationship context
      const processedContext =
        getRelationshipContextForUpload(relationshipContext);

      const { conversationId } = await new ConversationGenerationService({
        fileName,
        userId: locals.user.id,
        userEmail: locals.user.email,
        ...(processedContext && { relationshipContext: processedContext }),
      }).initiateConversationGeneration();

      console.log("redirecting to conversation", conversationId);

      redirect(303, `/conversations/${conversationId}`);
    } catch (error) {
      if (isRedirect(error)) {
        throw error;
      }
      console.error("Generate Rizz form action error:", error);
      return fail(500, {
        error:
          error instanceof Error ? error.message : "Failed to generate rizz",
      });
    }
  },
} satisfies Actions;
