import { JobProcessingService } from "$lib/server/services/job-processing.service";
import type { RizzGPTFormData } from "$lib/types";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request }) => {
  try {
    const { blobUrl, formData, jobId } = (await request.json()) as {
      blobUrl: string;
      formData: RizzGPTFormData;
      jobId: string;
    };

    if (!blobUrl || !formData || !jobId) {
      return json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Use job processing service to handle the processing
    const jobService = new JobProcessingService();
    await jobService.processJobSafe(jobId, blobUrl, formData);

    return json({
      success: true,
      jobId,
      message: "Job processing started",
    });
  } catch (error) {
    console.error("Process endpoint error:", error);
    return json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to start job processing",
      },
      { status: 500 }
    );
  }
}) satisfies RequestHandler;
