// Gemini returns normalized coordinates (0-1000) in [y_min, x_min, y_max, x_max] format
export type Box2D = [number, number, number, number]; // [y_min, x_min, y_max, x_max]

export interface PixelPosition {
  left: number;
  top: number;
  width: number;
  height: number;
}

export type AnnotationType = "photo" | "bio-text" | "prompt" | "overall";
export type AnnotationSeverity = "critical" | "moderate" | "minor";

export interface Annotation {
  id: string;
  type: AnnotationType;
  severity: AnnotationSeverity;
  title: string;
  suggestion: string;
  box_2d: Box2D; // Gemini's normalized coordinate format
}

export interface ProfileOptimization {
  id: string;
  userId: string;
  combinedImageFileName: string;
  overallScore: number;
  summary: string;
  annotations: Annotation[];
  status: "processing" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
}
