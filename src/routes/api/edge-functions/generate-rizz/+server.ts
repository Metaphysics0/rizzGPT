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

    const { blobUrl, relationshipContext, userId } = JSON.parse(
      signatureValidation.body!
    ) as {
      blobUrl: string;
      relationshipContext: RelationshipContext;
      userId: string;
    };

    if (!blobUrl || !relationshipContext || !userId) {
      return missingRequiredParametersErrorResponse([
        "blobUrl",
        "relationshipContext",
        "userId",
      ]);
    }

    const dbService = new DatabaseService();
    const dbUser = await dbService.getUserById(userId);

    if (!dbUser) {
      return jsonErrorResponse("User not found in database", 401);
    }

    const file = await new BlobStorageService().downloadFileFromBlob(blobUrl);
    const generateRizzResponse = await new GeminiService().generateRizz({
      relationshipContext,
      file,
    });

    await dbService.createConversation({
      userId: dbUser.id,
      rizzResponses: generateRizzResponse.responses,
      rizzResponseDescription: generateRizzResponse.explanation,
      relationshipContext,
      initialUploadedConversationBlobUrl: blobUrl,
      matchName: generateRizzResponse.matchName,
      status: "initial",
    });

    return jsonSuccessResponse(generateRizzResponse);
  } catch (error) {
    console.error("Generate rizz endpoint error:", error);
    return unknownErrorResponse(error, "Processing failed");
  }
}) satisfies RequestHandler;
