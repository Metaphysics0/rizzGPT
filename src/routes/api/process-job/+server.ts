import { requireAuth } from "$lib/server/auth";
import { JobProcessingService } from "$lib/server/services/job-processing.service";
import type { RizzGPTFormData } from "$lib/types";
import { json } from "@sveltejs/kit";
import { waitUntil } from "@vercel/functions";
import type { RequestHandler } from "./$types";

// Configure this function to use Edge Runtime for background processing
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

    const { blobUrl, formData, jobId } = (await request.json()) as {
      blobUrl: string;
      formData: RizzGPTFormData;
      jobId: string;
    };

    if (!blobUrl || !formData || !jobId) {
      return json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Start background processing using waitUntil
    // This allows the function to respond immediately while processing continues
    const processingPromise = processJobInBackground(jobId, blobUrl, formData);

    // Mark the promise as a background task
    // Use Vercel's waitUntil to run background processing
    try {
      waitUntil(processingPromise);
    } catch {
      // Fallback for non-edge environments (development)
      processingPromise.catch(console.error);
    }

    // Return immediately while processing continues in background
    return json({
      success: true,
      jobId,
      message: "Background processing started",
    });
  } catch (error) {
    console.error("Edge function error:", error);
    return json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to start background processing",
      },
      { status: 500 }
    );
  }
}) satisfies RequestHandler;

/**
 * Background processing function that runs independently
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
