import html2canvas from "html2canvas";
import { downloadBlob } from "../file/trigger-client-side-download.util";

export interface CaptureOptions {
  scale?: number;
  backgroundColor?: string;
  useCORS?: boolean;
}

export async function captureElementAsCanvas(
  element: HTMLElement,
  options: CaptureOptions = {}
) {
  try {
    const {
      scale = 2, // Higher quality by default
      backgroundColor = "#ffffff",
      useCORS = true,
    } = options;
    return html2canvas(element, {
      scale,
      backgroundColor,
      useCORS,
      logging: false,
      allowTaint: false,
    });
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
  const canvas = await captureElementAsCanvas(element, options);
  const blob = await canvasToBlob(canvas);
  downloadBlob(blob, filename);
}
