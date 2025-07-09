import { requireAuth } from "$lib/server/auth";
import { JobProcessingService } from "$lib/server/services/job-processing.service";
import type { RizzGPTFormData } from "$lib/types";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

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

    // Since we're not using edge runtime, we'll handle background processing differently
    // The promise will complete independently after the response is sent
    processingPromise.catch((error) => {
      console.error(`Background job ${jobId} failed:`, error);
    });

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
