import { backblazeStorageService } from "./backblaze-storage.service";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";
import { writeFile, unlink, mkdir, readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

/**
 * Optimized image combiner service using fluent-ffmpeg.
 * Performance optimizations:
 * - Parallel downloads with Promise.all()
 * - Efficient temp file management
 * - Parallel cleanup operations
 */
export class ImageCombinerService {
  private static readonly TEMP_DIR = "/tmp/image-combiner";

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
      // Download all images in parallel
      console.log(`[ImageCombinerService] Starting parallel downloads...`);
      const downloadPromises = fileNames.map(async (fileName, index) => {
        const tempFileName = `temp_${index}_${Date.now()}.jpg`;
        const tempFilePath = join(this.TEMP_DIR, tempFileName);

        console.log(`[ImageCombinerService] Downloading ${fileName}...`);
        const downloadedFile = await backblazeStorageService.downloadFile(
          fileName
        );
        const fileBuffer = await downloadedFile.arrayBuffer();

        await writeFile(tempFilePath, Buffer.from(fileBuffer));
        tempFiles.push(tempFilePath);

        return {
          index,
          fileName,
          tempFilePath,
        };
      });

      const downloadedImages = await Promise.all(downloadPromises);
      console.log(
        `[ImageCombinerService] All ${downloadedImages.length} images downloaded in parallel`
      );

      // Sort by index to ensure correct order
      downloadedImages.sort((a, b) => a.index - b.index);
      const sortedTempFiles = downloadedImages.map((img) => img.tempFilePath);

      // Execute FFmpeg processing
      await this.executeFFmpegHStack(sortedTempFiles, combinedFilePath);

      // Upload combined image
      const uploadedFileName = await this.uploadCombinedImageFromFile(
        combinedFilePath,
        combinedFileName,
        userId
      );

      console.log(
        `[ImageCombinerService] Successfully combined images into: ${uploadedFileName}`
      );
      return uploadedFileName;
    } finally {
      // Clean up temp files (don't include combinedFilePath if it doesn't exist)
      await this.cleanupTempFiles(tempFiles);
    }
  }

  private static async ensureTempDir(): Promise<void> {
    if (!existsSync(this.TEMP_DIR)) {
      await mkdir(this.TEMP_DIR, { recursive: true });
    }
  }

  private static async executeFFmpegHStack(
    inputPaths: string[],
    outputPath: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log(
        `[ImageCombinerService] Processing ${inputPaths.length} images with fluent-ffmpeg`
      );

      // Build filter_complex for hstack
      const filterInputs = inputPaths.map((_, i) => `[${i}:v]`).join("");
      const hstackFilter = `${filterInputs}hstack=inputs=${inputPaths.length}[v]`;

      console.log(`[ImageCombinerService] Using filter: ${hstackFilter}`);

      // Create fluent-ffmpeg command
      ffmpeg.setFfmpegPath(ffmpegInstaller.path);
      let command = ffmpeg();

      // Add all input files
      inputPaths.forEach((inputPath) => {
        command = command.input(inputPath);
      });

      // Configure the command with simpler approach
      command
        .outputOptions([
          `-filter_complex`,
          hstackFilter,
          `-map`,
          `[v]`,
          `-c:v`,
          `mjpeg`,
          `-q:v`,
          `2`,
          `-y`, // Overwrite output file
        ])
        .output(outputPath)
        .on("start", (commandLine) => {
          console.log(`[ImageCombinerService] FFmpeg command: ${commandLine}`);
        })
        .on("progress", (progress) => {
          console.log(
            `[ImageCombinerService] Processing: ${Math.round(
              progress.percent || 0
            )}% done`
          );
        })
        .on("end", () => {
          console.log(
            `[ImageCombinerService] FFmpeg processing completed successfully`
          );
          resolve();
        })
        .on("error", (error) => {
          console.error(
            `[ImageCombinerService] FFmpeg processing failed:`,
            error
          );
          reject(new Error(`FFmpeg failed: ${error.message}`));
        })
        .run();
    });
  }

  private static async uploadCombinedImageFromFile(
    filePath: string,
    fileName: string,
    userId: string
  ): Promise<string> {
    console.log(`[ImageCombinerService] Uploading combined image: ${fileName}`);

    const imageBuffer = await readFile(filePath);
    const combinedFile = new File([new Uint8Array(imageBuffer)], fileName, {
      type: "image/jpeg",
    });

    // Upload to Backblaze
    const uploadResult = await backblazeStorageService.uploadFile({
      file: combinedFile,
      userId,
    });

    console.log(
      `[ImageCombinerService] Upload completed: ${uploadResult.fileName}`
    );
    return uploadResult.fileName;
  }

  private static async cleanupTempFiles(filePaths: string[]): Promise<void> {
    const cleanupPromises = filePaths.map(async (filePath) => {
      try {
        await unlink(filePath);
        console.log(`[ImageCombinerService] Cleaned up temp file: ${filePath}`);
      } catch (error) {
        // Ignore cleanup errors (file might not exist)
        console.warn(
          `[ImageCombinerService] Failed to cleanup temp file ${filePath}:`,
          error
        );
      }
    });

    await Promise.all(cleanupPromises);
    console.log(`[ImageCombinerService] Temp file cleanup completed`);
  }
}
