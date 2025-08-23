import { ConversationGenerationService } from "$lib/server/services/conversation-generation.service";
import { RelationshipContextSchema } from "$lib/types";
import { publicProcedure, router } from "./t";
import { z } from "zod";

export const appRouter = router({
  generateRizz: publicProcedure
    .input(
      z.object({
        blobUrl: z.string(),
        relationshipContext: RelationshipContextSchema.optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { conversationId } = await new ConversationGenerationService({
        blobUrl: input.blobUrl,
        relationshipContext: input.relationshipContext,
      }).initiateConversationGeneration();
      return { conversationId };
    }),
});

export type AppRouter = typeof appRouter;
