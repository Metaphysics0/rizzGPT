import { requireAuth } from "$lib/server/auth";
import { BlobStorageService } from "$lib/server/services/blob-storage.service";
import { JobProcessingService } from "$lib/server/services/job-processing.service";
import { json } from "@sveltejs/kit";
import type { HandleUploadBody } from "@vercel/blob/client";
import { waitUntil } from "@vercel/functions";
import type { RequestHandler } from "./$types";

// Configure for edge runtime to handle background processing
export const config = {
  runtime: "edge",
};

export const POST = (async ({ request }) => {
  try {
    // Check authentication
    const authResult = await requireAuth(request);
    if (authResult.error) {
      return authResult.error;
    }

    const body = (await request.json()) as HandleUploadBody;

    if (!body) {
      return json({ error: "Request body is required" }, { status: 400 });
    }

    const blobService = new BlobStorageService();

    // Handle the upload with automatic job processing on completion
    const response = await blobService.handleClientUpload(
      request,
      body,
      async ({ blob, tokenPayload }) => {
        // Parse the payload if it contains form data
        if (!tokenPayload) {
          console.log("❌ No tokenPayload received");
          return;
        }

        const { formData, jobId } = JSON.parse(tokenPayload);
        if (!formData || !jobId) {
          console.log("❌ Missing formData or jobId in payload");
          return;
        }

        console.log(`🚀 Starting background job ${jobId}`);

        const processingPromise = processJobInBackground(
          jobId,
          blob.url,
          formData
        );

        // Use Vercel's waitUntil for background processing
        try {
          waitUntil(processingPromise);
        } catch {
          // Fallback for non-edge environments (development)
          processingPromise.catch(console.error);
        }
      }
    );

    return json(response);
  } catch (error) {
    console.error("Upload token endpoint error:", error);
    return json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Upload token generation failed",
      },
      { status: 500 }
    );
  }
}) satisfies RequestHandler;

/**
 * Background processing function for uploaded files
 */
async function processJobInBackground(
  jobId: string,
  blobUrl: string,
  formData: any
): Promise<void> {
  try {
    console.log(
      `Starting background job ${jobId} processing for blob: ${blobUrl}`
    );

    const jobService = new JobProcessingService();
    await jobService.processJobSafe(jobId, blobUrl, formData);

    console.log(`Background job ${jobId} completed successfully`);
  } catch (error) {
    console.error(`Background job ${jobId} failed:`, error);
    // Error handling is already done in the JobProcessingService
  }
}
