/** biome-ignore-all lint/style/noNonNullAssertion: <explanation> */
import { requireAuth } from "$lib/server/auth";
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
import type { RizzGPTFormData } from "$lib/types";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request }) => {
  try {
    const signatureValidation =
      await new QstashService().validateSignatureFromRequest(request);
    if (!signatureValidation.isValid) {
      return signatureValidation.error!;
    }

    const { blobUrl, formData, userToken } = JSON.parse(
      signatureValidation.body!
    ) as {
      blobUrl: string;
      formData: RizzGPTFormData;
      userToken: string;
    };

    // 2. Validate Kinde authentication
    const authResult = await requireAuth(request);
    if (authResult.error) return authResult.error;

    if (!authResult.dbUser) {
      return jsonErrorResponse("User not found in database", 401);
    }

    // 3. Parse the validated body

    if (!blobUrl || !formData) {
      return missingRequiredParametersErrorResponse(["blobUrl", "formData"]);
    }

    // 4. Process the request with authenticated user
    const file = await new BlobStorageService().downloadFileFromBlob(blobUrl);
    const generateRizzResponse = await new GeminiService().generateRizz({
      rizzGPTFormData: formData,
      file,
    });

    await new DatabaseService().createConversation({
      userId: authResult.dbUser.id,
      rizzResponses: [generateRizzResponse.responses[0]],
      rizzResponseDescription: generateRizzResponse.explanation,
      initialUploadedConversationBlobUrl: blobUrl,
      relationshipContext: formData,
      matchName: generateRizzResponse.matchName,
      status: "initial",
    });

    return jsonSuccessResponse(generateRizzResponse);
  } catch (error) {
    console.error("Generate rizz endpoint error:", error);
    return unknownErrorResponse(error, "Processing failed");
  }
}) satisfies RequestHandler;
