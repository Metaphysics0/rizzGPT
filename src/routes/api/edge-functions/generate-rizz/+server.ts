import { GenerateRizzJobHandler } from "$lib/server/job-handlers/generate-rizz/job-handler";
import type { GenerateRizzJobPayload } from "$lib/server/job-handlers/generate-rizz/job-payload.type";
import { QstashService } from "$lib/server/services/qstash.service";
import {
  jsonSuccessResponse,
  unknownErrorResponse,
} from "$lib/server/utils/api-response.util";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request }) => {
  try {
    const signatureValidation =
      await new QstashService().validateSignatureFromRequest(request);
    if (!signatureValidation.isValid) {
      console.error("Signature validation error:", signatureValidation.error);
      return signatureValidation.error!;
    }

    const jobPayload = JSON.parse(
      signatureValidation.body!
    ) as GenerateRizzJobPayload;

    const result = await new GenerateRizzJobHandler(jobPayload).call();

    return jsonSuccessResponse(result);
  } catch (error) {
    console.error("Generate rizz endpoint error:", error);
    return unknownErrorResponse(error, "Processing failed");
  }
}) satisfies RequestHandler;
