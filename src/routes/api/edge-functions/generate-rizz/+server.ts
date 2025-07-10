import { BlobStorageService } from "$lib/server/services/blob-storage.service";
import { DatabaseService } from "$lib/server/services/database.service";
import { GeminiService } from "$lib/server/services/gemini.service";
import {
  jsonSuccessResponse,
  unknownErrorResponse,
} from "$lib/server/utils/api-response.util";
import type { RizzGPTFormData } from "$lib/types";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request }) => {
  try {
    // TODO: get user id from kinde auth and validate kinde access token

    const { blobUrl, formData } = (await request.json()) as {
      blobUrl: string;
      formData: RizzGPTFormData;
    };

    const file = await new BlobStorageService().downloadFileFromBlob(blobUrl);
    const generateRizzResponse = await new GeminiService().generateRizz({
      rizzGPTFormData: formData,
      file,
    });

    const conversation = await new DatabaseService().createConversation({
      // TODO: get user id from kinde auth
      userId: "123",
      rizzResponses: [generateRizzResponse.responses[0]],
      rizzResponseDescription: generateRizzResponse.explanation,
      initialUploadedConversationBlobUrl: blobUrl,
      relationshipContext: formData,
      matchName: generateRizzResponse.matchName,
      status: "initial",
    });

    return jsonSuccessResponse(generateRizzResponse);
  } catch (error) {
    return unknownErrorResponse(error, "Processing failed");
  }
}) satisfies RequestHandler;
