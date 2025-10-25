import * as htmlToImage from "html-to-image";
import { downloadBlob } from "../file/trigger-client-side-download.util";

export interface CaptureOptions {
  pixelRatio?: number;
  backgroundColor?: string;
  cacheBust?: boolean;
}

export async function captureElementAsCanvas(
  element: HTMLElement,
  options: CaptureOptions = {}
) {
  const {
    pixelRatio = 2,
    backgroundColor = "#ffffff",
    cacheBust = true,
  } = options;

  try {
    const canvas = await htmlToImage.toCanvas(element, {
      pixelRatio,
      backgroundColor,
      cacheBust,
    });

    return canvas;
  } catch (error) {
    console.error("Failed to capture element:", error);
    throw new Error("Failed to capture image");
  }
}

export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string = "image/png",
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        blob
         ? resolve(blob)
         : reject(new Error("Failed to convert canvas to blob"));
      },
      type,
      quality
    );
  });
}

export async function captureAndDownloadImage(
  element: HTMLElement,
  filename: string,
  options: CaptureOptions = {}
) {
  const {
    pixelRatio = 2,
    backgroundColor = "#ffffff",
    cacheBust = true,
  } = options;

  try {
    const blob = await htmlToImage.toBlob(element, {
      pixelRatio,
      backgroundColor,
      cacheBust,
    });

    if (!blob) throw new Error("Failed to generate image blob");

    downloadBlob(blob, filename);
  } catch (error) {
    console.error("Failed to capture and download image:", error);
    throw new Error("Failed to capture and download image");
  }
}
