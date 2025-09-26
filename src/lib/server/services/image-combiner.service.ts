import { spawn } from "child_process";
import { writeFile, unlink, mkdir, readFile } from "fs/promises";
import { join } from "path";
import { backblazeStorageService } from "./backblaze-storage.service";
import { existsSync } from "fs";

export class ImageCombinerService {
  private static readonly TEMP_DIR = "/tmp/claude/image-combiner";

  static async combineImagesHorizontally(
    fileNames: string[],
    userId: string
  ): Promise<string> {
    if (fileNames.length === 0) {
      throw new Error("No files provided for combination");
    }

    if (fileNames.length === 1) {
      // If only one file, return it as-is
      return fileNames[0];
    }

    console.log(
      `[ImageCombinerService] Combining ${
        fileNames.length
      } images: ${JSON.stringify(fileNames)}`
    );

    // Ensure temp directory exists
    await this.ensureTempDir();

    const tempFiles: string[] = [];
    const combinedFileName = `combined_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}.jpg`;
    const combinedFilePath = join(this.TEMP_DIR, combinedFileName);

    try {
      // Download all images to temp files
      for (let i = 0; i < fileNames.length; i++) {
        const fileName = fileNames[i];
        const tempFileName = `temp_${i}_${Date.now()}.jpg`;
        const tempFilePath = join(this.TEMP_DIR, tempFileName);

        console.log(
          `[ImageCombinerService] Downloading ${fileName} to ${tempFilePath}`
        );
        const downloadedFile = await backblazeStorageService.downloadFile(
          fileName
        );
        const fileBuffer = await downloadedFile.arrayBuffer();
        await writeFile(tempFilePath, Buffer.from(fileBuffer));
        tempFiles.push(tempFilePath);
      }

      // Combine images using ffmpeg hstack
      await this.combineImagesWithFFmpeg(tempFiles, combinedFilePath);

      // Upload combined image back to storage
      const uploadedFileName = await this.uploadCombinedImage(
        combinedFilePath,
        combinedFileName,
        userId
      );

      console.log(
        `[ImageCombinerService] Successfully combined images into: ${uploadedFileName}`
      );
      return uploadedFileName;
    } finally {
      // Clean up temp files
      await this.cleanupTempFiles([...tempFiles, combinedFilePath]);
    }
  }

  private static async ensureTempDir(): Promise<void> {
    if (!existsSync(this.TEMP_DIR)) {
      await mkdir(this.TEMP_DIR, { recursive: true });
    }
  }

  private static async combineImagesWithFFmpeg(
    inputPaths: string[],
    outputPath: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      // Build ffmpeg command for horizontal stacking
      const ffmpegArgs = [];

      // Add input files
      for (const inputPath of inputPaths) {
        ffmpegArgs.push("-i", inputPath);
      }

      // Build filter_complex for hstack
      const filterInputs = inputPaths.map((_, i) => `[${i}:v]`).join("");
      const hstackFilter = `${filterInputs}hstack=inputs=${inputPaths.length}[v]`;

      ffmpegArgs.push(
        "-filter_complex",
        hstackFilter,
        "-map",
        "[v]",
        "-c:v",
        "mjpeg",
        "-q:v",
        "2", // High quality
        "-y", // Overwrite output file
        outputPath
      );

      console.log(
        `[ImageCombinerService] Running ffmpeg with args: ${JSON.stringify(
          ffmpegArgs
        )}`
      );

      const ffmpegProcess = spawn("ffmpeg", ffmpegArgs);

      let stderr = "";
      ffmpegProcess.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      ffmpegProcess.on("close", (code) => {
        if (code === 0) {
          console.log(`[ImageCombinerService] FFmpeg completed successfully`);
          resolve();
        } else {
          console.error(
            `[ImageCombinerService] FFmpeg failed with code ${code}`
          );
          console.error(`[ImageCombinerService] FFmpeg stderr: ${stderr}`);
          reject(new Error(`FFmpeg failed with exit code ${code}: ${stderr}`));
        }
      });

      ffmpegProcess.on("error", (error) => {
        console.error(`[ImageCombinerService] FFmpeg process error:`, error);
        reject(new Error(`Failed to start ffmpeg: ${error.message}`));
      });
    });
  }

  private static async uploadCombinedImage(
    localPath: string,
    fileName: string,
    userId: string
  ): Promise<string> {
    const imageBuffer = await readFile(localPath);

    const combinedFile = new File([new Uint8Array(imageBuffer)], fileName, {
      type: "image/jpeg",
    });

    // Upload to Backblaze
    const uploadResult = await backblazeStorageService.uploadFile({
      file: combinedFile,
      userId,
    });

    return uploadResult.fileName;
  }

  private static async cleanupTempFiles(filePaths: string[]): Promise<void> {
    for (const filePath of filePaths) {
      try {
        await unlink(filePath);
        console.log(`[ImageCombinerService] Cleaned up temp file: ${filePath}`);
      } catch (error) {
        // Ignore cleanup errors
        console.warn(
          `[ImageCombinerService] Failed to cleanup temp file ${filePath}:`,
          error
        );
      }
    }
  }
}
