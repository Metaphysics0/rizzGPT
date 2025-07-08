import type { GeneratedResponse } from "$lib/types";
import { json } from "@sveltejs/kit";
import { list } from "@vercel/blob";
import type { RequestHandler } from "./$types";

interface JobResult {
  success: boolean;
  data?: GeneratedResponse;
  error?: string;
  processedAt: string;
}

export const GET = (async ({ params }) => {
  try {
    const { jobId } = params;

    if (!jobId) {
      return json({ error: "Job ID is required" }, { status: 400 });
    }

    try {
      // List blobs to find our result file
      const { blobs } = await list({
        prefix: `results/${jobId}.json`,
        limit: 1,
      });

      if (blobs.length === 0) {
        // Job result not found, still processing
        return json({
          status: "processing",
          jobId,
          message: "Job is still being processed...",
        });
      }

      // Fetch the result from the blob
      const resultUrl = blobs[0].url;
      const response = await fetch(resultUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch result: ${response.statusText}`);
      }

      const result: JobResult = await response.json();

      if (result.success) {
        return json({
          status: "completed",
          result: result.data,
          jobId,
          processedAt: result.processedAt,
        });
      } else {
        return json({
          status: "failed",
          error: result.error,
          jobId,
          processedAt: result.processedAt,
        });
      }
    } catch (fetchError) {
      // If we can't fetch the result, assume it's still processing
      console.log(`Job ${jobId} result not ready:`, fetchError);
      return json({
        status: "processing",
        jobId,
        message: "Job is still being processed...",
      });
    }
  } catch (error) {
    console.error("Job status check error:", error);
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
