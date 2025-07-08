import { GeminiService } from "$lib/server/gemini.service";
import type { RizzGPTFormData } from "$lib/types";
import { json } from "@sveltejs/kit";
import { put } from "@vercel/blob";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request, fetch }) => {
  try {
    const { blobUrl, formData, jobId } = (await request.json()) as {
      blobUrl: string;
      formData: RizzGPTFormData;
      jobId: string;
    };

    if (!blobUrl || !formData || !jobId) {
      return json({ error: "Missing required parameters" }, { status: 400 });
    }

    console.log(`Processing job ${jobId} for blob: ${blobUrl}`);

    // Download file from blob storage
    const fileResponse = await fetch(blobUrl);
    if (!fileResponse.ok) {
      throw new Error(
        `Failed to download file from blob: ${fileResponse.statusText}`
      );
    }

    const arrayBuffer = await fileResponse.arrayBuffer();
    const contentType =
      fileResponse.headers.get("content-type") || "image/jpeg";

    // Extract original filename from URL or use default
    const urlPath = new URL(blobUrl).pathname;
    const filename = urlPath.split("/").pop() || "uploaded-file";

    const file = new File([arrayBuffer], filename, {
      type: contentType,
    });

    // Process with Gemini
    const geminiService = new GeminiService();
    const response = await geminiService.generateRizz({
      rizzGPTFormData: formData,
      file,
    });

    // Store successful result in blob with jobId
    const resultBlob = await put(
      `results/${jobId}.json`,
      JSON.stringify({
        success: true,
        data: response,
        processedAt: new Date().toISOString(),
      }),
      { access: "public" }
    );

    console.log(
      `Job ${jobId} completed successfully, result stored at: ${resultBlob.url}`
    );

    return json({
      success: true,
      resultUrl: resultBlob.url,
      jobId,
    });
  } catch (error) {
    console.error("Processing error:", error);

    try {
      // Store error result for the job
      const { jobId } = await request.json();
      const errorResult = {
        success: false,
        error: error instanceof Error ? error.message : "Processing failed",
        processedAt: new Date().toISOString(),
      };

      const errorBlob = await put(
        `results/${jobId}.json`,
        JSON.stringify(errorResult),
        { access: "public" }
      );

      console.log(`Job ${jobId} failed, error stored at: ${errorBlob.url}`);

      return json(
        {
          success: false,
          error: errorResult.error,
          resultUrl: errorBlob.url,
          jobId,
        },
        { status: 500 }
      );
    } catch (storeError) {
      console.error("Failed to store error result:", storeError);
      return json(
        {
          success: false,
          error: "Processing failed and unable to store error result",
        },
        { status: 500 }
      );
    }
  }
}) satisfies RequestHandler;
