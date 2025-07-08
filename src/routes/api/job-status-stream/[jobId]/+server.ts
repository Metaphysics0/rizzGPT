import { sseManager } from "$lib/server/services";
import type { RequestHandler } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";

/**
 * SSE endpoint for real-time job status updates
 *
 * GET /api/job-status-stream/[jobId]
 *
 * Returns a Server-Sent Events stream that provides real-time updates
 * for a specific job. Clients should use EventSource to connect.
 */
export const GET: RequestHandler = async ({ params, request }) => {
  try {
    const { jobId } = params;

    if (!jobId?.trim()) {
      throw error(400, "Job ID is required");
    }

    // Validate job ID format (should be UUID)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(jobId)) {
      throw error(400, "Invalid job ID format");
    }

    console.log(`Starting SSE stream for job ${jobId}`);

    // Create the SSE stream
    const stream = sseManager.createJobStatusStream(jobId);

    // Return response with proper SSE headers
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Cache-Control",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "X-Accel-Buffering": "no", // Disable nginx buffering
      },
    });
  } catch (err) {
    console.error("SSE endpoint error:", err);

    if (err && typeof err === "object" && "status" in err) {
      throw err; // Re-throw SvelteKit errors
    }

    throw error(500, {
      message:
        err instanceof Error ? err.message : "Failed to start status stream",
    });
  }
};

/**
 * Handle OPTIONS request for CORS preflight
 */
export const OPTIONS: RequestHandler = async () => {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    },
  });
};
