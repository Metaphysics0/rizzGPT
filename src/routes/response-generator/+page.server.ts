import { fail, isRedirect, redirect } from "@sveltejs/kit";
import { ConversationGenerationService } from "$lib/server/services/conversation-generation.service";
import type { RelationshipContext } from "$lib/types";
import { areAllObjectValuesEmpty } from "$lib/utils/object/are-all-object-values-empty.util";
import type { Actions } from "./$types";

export const actions = {
  generateRizz: async ({ request, locals }) => {
    try {
      if (!locals.user) return fail(401, { error: "Unauthorized" });

      const formData = await request.formData();

      const fileName = formData.get("fileName") as string;
      if (!fileName) return fail(400, { error: "File upload missing" });

      const relationshipContext: RelationshipContext = JSON.parse(
        formData.get("relationshipContext") as string
      );

      const { conversationId } = await new ConversationGenerationService({
        fileName,
        userId: locals.user.id,
        userEmail: locals.user.email,
        ...(!areAllObjectValuesEmpty(relationshipContext) && {
          relationshipContext,
        }),
      }).initiateConversationGeneration();

      redirect(303, `/conversations/${conversationId}`);
    } catch (error) {
      if (isRedirect(error)) throw error;
      console.error("Generate Rizz form action error:", error);
      return fail(500, {
        error:
          error instanceof Error ? error.message : "Failed to generate rizz",
      });
    }
  },
} satisfies Actions;
