export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

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
  boundingBox: BoundingBox;
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
