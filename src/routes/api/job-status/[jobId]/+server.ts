import { BlobStorageService } from "$lib/server/services/blob-storage.service";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

/**
 * LEGACY: Polling-based job status endpoint
 *
 * This endpoint is kept as a fallback for when Server-Sent Events fail.
 * The primary method for job status updates is now the SSE endpoint at
 * /api/job-status-stream/[jobId]
 *
 * GET /api/job-status/[jobId]
 */
export const GET = (async ({ params }) => {
  try {
    const { jobId } = params;

    if (!jobId) {
      return json({ error: "Job ID is required" }, { status: 400 });
    }

    // Use blob storage service to get job result
    const blobService = new BlobStorageService();
    const jobStatus = await blobService.getJobResult(jobId);

    return json(jobStatus);
  } catch (error) {
    console.error("Status endpoint error:", error);
    return json(
      {
        error:
          error instanceof Error ? error.message : "Failed to check job status",
        status: "error",
      },
      { status: 500 }
    );
  }
}) satisfies RequestHandler;
