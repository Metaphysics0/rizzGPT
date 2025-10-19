import html2canvas from "html2canvas";
import { downloadBlob } from "../file/trigger-client-side-download.util";

export interface CaptureOptions {
  scale?: number;
  backgroundColor?: string;
  useCORS?: boolean;
}

/**
 * Converts oklch/modern color to rgb/rgba by using canvas context
 */
function convertColorToRgb(color: string): string {
  // If already rgb/rgba, return as-is
  if (color.startsWith('rgb')) {
    return color;
  }

  // Create a temporary canvas to convert the color
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');

  if (!ctx) return color;

  try {
    // Set the color and read it back - browser will convert to rgba
    ctx.fillStyle = color;
    return ctx.fillStyle; // This will be in rgb()/rgba() format
  } catch (e) {
    console.warn('Failed to convert color:', color);
    return color;
  }
}

/**
 * Converts modern CSS colors (oklch, etc.) to rgb/rgba for html2canvas compatibility
 * by copying all computed styles as inline styles
 */
function convertModernColorsToRgb(element: HTMLElement): void {
  const allElements = [element, ...element.querySelectorAll("*")] as HTMLElement[];

  allElements.forEach((el) => {
    const computedStyle = window.getComputedStyle(el);

    // Properties that might contain oklch colors
    const colorProperties = [
      'color',
      'background-color',
      'border-color',
      'border-top-color',
      'border-right-color',
      'border-bottom-color',
      'border-left-color',
      'border-block-start-color',
      'border-block-end-color',
      'border-inline-start-color',
      'border-inline-end-color',
      'outline-color',
      'text-decoration-color',
      'caret-color',
      'column-rule-color',
      'fill',
      'stroke'
    ];

    colorProperties.forEach((prop) => {
      const value = computedStyle.getPropertyValue(prop);
      if (value && value !== 'transparent' && value !== 'rgba(0, 0, 0, 0)') {
        // Convert oklch to rgb
        const rgbValue = convertColorToRgb(value);
        // Set as inline style (use kebab-case for setProperty)
        el.style.setProperty(prop, rgbValue);
      }
    });
  });
}

export async function captureElementAsCanvas(
  element: HTMLElement,
  options: CaptureOptions = {}
) {
  const {
    scale = 2,
    useCORS = true,
  } = options;

  // Clone the element to avoid modifying the original
  const clone = element.cloneNode(true) as HTMLElement;

  // Append to body first so computed styles are available
  clone.style.position = "absolute";
  clone.style.left = "-9999px";
  clone.style.top = "0";
  clone.style.backgroundColor = "#ffffff"; // Set white background directly
  document.body.appendChild(clone);

  try {
    // Wait a tick for styles to compute
    await new Promise(resolve => setTimeout(resolve, 0));

    // Convert modern CSS colors to rgb/rgba
    convertModernColorsToRgb(clone);

    // Don't specify backgroundColor in options to avoid oklch parsing
    const canvas = await html2canvas(clone, {
      scale,
      backgroundColor: undefined, // Let it use the element's own background
      useCORS,
      logging: true, // Enable logging to see what's happening
      allowTaint: false,
      foreignObjectRendering: false, // Disable foreign objects which can cause issues
    });

    return canvas;
  } catch (error) {
    console.error("Failed to capture element:", error);
    throw new Error("Failed to capture image");
  } finally {
    // Always clean up the clone
    document.body.removeChild(clone);
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
