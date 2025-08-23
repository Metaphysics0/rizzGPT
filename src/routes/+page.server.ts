import { auth } from "$lib/server/auth";
import { ConversationGenerationService } from "$lib/server/services/conversation-generation.service";
import { RelationshipContextSchema } from "$lib/types";
import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad, RequestEvent } from "./$types";

export const load: PageServerLoad = async (event: RequestEvent) => {
  const session = await auth.api.getSession({
    headers: event.request.headers,
  });

  if (!session) {
    return redirect(302, "/auth/sign-in");
  }

  return session;
};

export const actions: Actions = {
  generateRizz: async ({ request }) => {
    const formData = await request.formData();
    const blobUrl = formData.get("blobUrl") as string;
    const relationshipContext = formData.get("relationshipContext") as string;

    const { conversationId } =
      await new ConversationGenerationService({
        blobUrl,
        ...(relationshipContext && {
          relationshipContext: RelationshipContextSchema.parse(
            JSON.parse(relationshipContext)
          ),
        }),
      }).initiateConversationGeneration();

    return redirect(302, `/conversations/${conversationId}`);
  },
};
