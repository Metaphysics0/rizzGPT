import { requireAuth } from "$lib/server/auth";
import { JobProcessingService } from "$lib/server/services/job-processing.service";
import type { RizzGPTFormData } from "$lib/types";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request }) => {
  try {
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

    // Start background processing
    // This allows the function to respond immediately while processing continues
    const processingPromise = processJobInBackground(jobId, blobUrl, formData);

    // Since we're not using edge runtime, we'll handle background processing differently
    // The promise will complete independently after the response is sent
    processingPromise.catch((error) => {
      console.error(`Background job ${jobId} failed:`, error);
    });

    // Return immediately while processing continues in background
    return json({
      success: true,
      jobId,
      message: "Background processing started",
    });
  } catch (error) {
    console.error("Function error:", error);
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
