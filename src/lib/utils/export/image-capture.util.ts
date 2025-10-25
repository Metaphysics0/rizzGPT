import * as htmlToImage from "html-to-image";

export type CaptureOptions = Parameters<typeof htmlToImage.toBlob>[1];

export async function convertHtmlToImage(
  element: HTMLElement,
  options: CaptureOptions = {},
) {
  const {
    pixelRatio = 2,
    backgroundColor = "#ffffff",
    cacheBust = true,
  } = options;

  try {
    return htmlToImage.toBlob(element, {
      pixelRatio,
      backgroundColor,
      cacheBust,
    });
  } catch (error) {
    console.error("Failed to capture and download image:", error);
    throw new Error("Failed to capture and download image");
  }
}
