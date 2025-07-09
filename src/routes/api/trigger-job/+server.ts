import { requireAuth } from "$lib/server/auth";
import { JobProcessingService } from "$lib/server/services/job-processing.service";
import type { RizzGPTFormData } from "$lib/types";
import { json } from "@sveltejs/kit";
import { waitUntil } from "@vercel/functions";
import type { RequestHandler } from "./$types";

// Configure for edge runtime to handle background processing
export const config = {
  runtime: "edge",
};

/**
 * Fallback endpoint for localhost development
 * Since onUploadCompleted doesn't work on localhost, this allows manual triggering
 */
export const POST = (async ({ request }) => {
  try {
    // Check authentication
    const authResult = await requireAuth(request);
    if (authResult.error) {
      return authResult.error;
    }

    const { blobUrl, formData, jobId } = (await request.json()) as {
      blobUrl: string;
      formData: RizzGPTFormData;
      jobId: string;
    };

    if (!blobUrl || !formData || !jobId) {
      return json({ error: "Missing required parameters" }, { status: 400 });
    }

    console.log(
      `🔧 [DEV] Manually triggering job ${jobId} for blob: ${blobUrl}`
    );

    // Start background processing
    const processingPromise = processJobInBackground(jobId, blobUrl, formData);

    // Use Vercel's waitUntil for background processing
    try {
      waitUntil(processingPromise);
    } catch {
      // Fallback for non-edge environments (development)
      processingPromise.catch(console.error);
    }

    return json({
      success: true,
      jobId,
      message: "Job processing started manually (dev mode)",
    });
  } catch (error) {
    console.error("Manual job trigger error:", error);
    return json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to trigger job processing",
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
  formData: RizzGPTFormData
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
