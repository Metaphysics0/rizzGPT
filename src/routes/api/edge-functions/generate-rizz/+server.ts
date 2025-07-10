import { BlobStorageService } from "$lib/server/services/blob-storage.service";
import { DatabaseService } from "$lib/server/services/database.service";
import { GeminiService } from "$lib/server/services/gemini.service";
import { QstashService } from "$lib/server/services/qstash.service";
import {
  jsonErrorResponse,
  jsonSuccessResponse,
  missingRequiredParametersErrorResponse,
  unknownErrorResponse,
} from "$lib/server/utils/api-response.util";
import type { RelationshipContext } from "$lib/types";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request }) => {
  try {
    const signatureValidation =
      await new QstashService().validateSignatureFromRequest(request);
    if (!signatureValidation.isValid) {
      console.error("Signature validation error:", signatureValidation.error);
      return signatureValidation.error!;
    }

    const { blobUrl, relationshipContext, userId, conversationId } = JSON.parse(
      signatureValidation.body!
    ) as {
      blobUrl: string;
      relationshipContext: RelationshipContext;
      userId: string;
      conversationId: string;
    };

    if (!blobUrl || !relationshipContext || !userId || !conversationId) {
      return missingRequiredParametersErrorResponse([
        "blobUrl",
        "relationshipContext",
        "userId",
        "conversationId",
      ]);
    }

    const dbService = new DatabaseService();
    const dbUser = await dbService.getUserById(userId);

    if (!dbUser) {
      return jsonErrorResponse("User not found in database", 401);
    }

    try {
      const file = await new BlobStorageService().downloadFileFromBlob(blobUrl);
      const generateRizzResponse = await new GeminiService().generateRizz({
        relationshipContext,
        file,
      });

      await dbService.updateConversation(conversationId, {
        rizzResponses: generateRizzResponse.responses,
        rizzResponseDescription: generateRizzResponse.explanation,
        matchName: generateRizzResponse.matchName,
        status: "completed",
      });

      return jsonSuccessResponse(generateRizzResponse);
    } catch (processingError) {
      await dbService.updateConversation(conversationId, {
        rizzResponses: [],
        rizzResponseDescription: `Error: ${
          processingError instanceof Error
            ? processingError.message
            : "Processing failed"
        }`,
        matchName: "Error",
        status: "completed",
      });
      throw processingError;
    }
  } catch (error) {
    console.error("Generate rizz endpoint error:", error);
    return unknownErrorResponse(error, "Processing failed");
  }
}) satisfies RequestHandler;
