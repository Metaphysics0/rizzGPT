import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import type { TDocumentDefinitions, Content } from "pdfmake/interfaces";
import { convertHtmlToImage } from "./image-capture.util";
import type { Annotation } from "$lib/types";

interface PDFReportData {
  score: number;
  summary: string;
  annotations: Annotation[];
  timestamp?: Date;
}

const BRAND_COLORS = {
  purple: "#9333ea", // purple-600
  purpleDark: "#7e22ce", // purple-700
  red: "#ef4444", // red-500
  amber: "#f59e0b", // amber-500
  green: "#10b981", // green-500
  gray: "#6b7280", // gray-500
  lightGray: "#f3f4f6", // gray-100
};

const severityConfig = {
  critical: {
    color: BRAND_COLORS.red,
    label: "CRITICAL ISSUES",
    emoji: "🔴",
  },
  moderate: {
    color: BRAND_COLORS.amber,
    label: "MODERATE ISSUES",
    emoji: "🟡",
  },
  minor: {
    color: BRAND_COLORS.green,
    label: "MINOR IMPROVEMENTS",
    emoji: "🟢",
  },
};

function getScoreColor(score: number): string {
  if (score >= 8) return BRAND_COLORS.green;
  if (score >= 6) return BRAND_COLORS.amber;
  return BRAND_COLORS.red;
}

function groupAnnotationsBySeverity(annotations: Annotation[]) {
  return {
    critical: annotations.filter((a) => a.severity === "critical"),
    moderate: annotations.filter((a) => a.severity === "moderate"),
    minor: annotations.filter((a) => a.severity === "minor"),
  };
}

function createAnnotationList(
  annotations: Annotation[],
  startNumber: number,
): Content[] {
  if (annotations.length === 0) return [];

  return annotations.map((annotation, index) => ({
    stack: [
      {
        text: `${startNumber + index}. ${annotation.title}`,
        style: "annotationTitle",
        marginBottom: 4,
      },
      {
        text: annotation.suggestion,
        style: "annotationText",
        marginBottom: 12,
      },
    ],
  }));
}

async function captureAnnotatedImageAsBase64(
  element: HTMLElement,
): Promise<string | null> {
  try {
    const blob = await convertHtmlToImage(element, {
      pixelRatio: 2,
      backgroundColor: "#ffffff",
    });

    if (!blob) return null;

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Failed to capture image:", error);
    return null;
  }
}

export async function generateOptimizationPDF(
  data: PDFReportData,
  imageElement: HTMLElement,
): Promise<Blob> {
  const { score, summary, annotations, timestamp = new Date() } = data;

  const imageBase64 = await captureAnnotatedImageAsBase64(imageElement);

  const grouped = groupAnnotationsBySeverity(annotations);
  let annotationCounter = 1;

  const content: Content[] = [
    // header
    {
      text: "RizzGPT Profile Analysis",
      style: "header",
      color: BRAND_COLORS.purple,
    },
    {
      text: `Generated on ${timestamp.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`,
      style: "timestamp",
      marginBottom: 20,
    },

    // Score Card
    {
      table: {
        widths: ["*"],
        body: [
          [
            {
              stack: [
                {
                  text: "Overall Profile Score",
                  style: "scoreLabel",
                },
                {
                  text: `${score}/10`,
                  style: "scoreValue",
                  color: getScoreColor(score),
                },
              ],
              fillColor: BRAND_COLORS.lightGray,
              margin: [10, 10, 10, 10],
            },
          ],
        ],
      },
      layout: "noBorders",
      marginBottom: 15,
    },

    // Summary
    {
      text: "Summary",
      style: "sectionHeader",
    },
    {
      text: summary,
      style: "summaryText",
      marginBottom: 20,
    },

    // Annotated Image
    ...(imageBase64
      ? [
          {
            text: "Annotated Profile",
            style: "sectionHeader",
          } as Content,
          {
            image: imageBase64,
            width: 500,
            alignment: "center" as const,
            marginBottom: 20,
          } as Content,
        ]
      : []),

    // Page break before detailed annotations
    { text: "", pageBreak: "after" as const },

    // Detailed Recommendations Header
    {
      text: "Detailed Recommendations",
      style: "header",
      color: BRAND_COLORS.purple,
      marginTop: 0,
    },
  ];

  // Add annotations by severity
  const severityOrder: Array<"critical" | "moderate" | "minor"> = [
    "critical",
    "moderate",
    "minor",
  ];

  for (const severity of severityOrder) {
    const severityAnnotations = grouped[severity];
    if (severityAnnotations.length > 0) {
      const config = severityConfig[severity];

      content.push(
        {
          text: `${config.emoji} ${config.label}`,
          style: "severityHeader",
          color: config.color,
          marginTop: 15,
          marginBottom: 10,
        },
        ...createAnnotationList(severityAnnotations, annotationCounter),
      );

      annotationCounter += severityAnnotations.length;
    }
  }

  // Footer
  content.push({
    text: "\n\nGenerated with RizzGPT - AI-Powered Dating Profile Analysis",
    style: "footer",
    alignment: "center",
    marginTop: 30,
  });

  const docDefinition: TDocumentDefinitions = {
    content,
    styles: {
      header: {
        fontSize: 24,
        bold: true,
        marginBottom: 5,
      },
      timestamp: {
        fontSize: 10,
        color: BRAND_COLORS.gray,
        italics: true,
      },
      scoreLabel: {
        fontSize: 12,
        color: BRAND_COLORS.gray,
        marginBottom: 5,
      },
      scoreValue: {
        fontSize: 36,
        bold: true,
      },
      sectionHeader: {
        fontSize: 16,
        bold: true,
        marginBottom: 8,
        color: BRAND_COLORS.purpleDark,
      },
      summaryText: {
        fontSize: 12,
        lineHeight: 1.5,
      },
      severityHeader: {
        fontSize: 14,
        bold: true,
      },
      annotationTitle: {
        fontSize: 12,
        bold: true,
      },
      annotationText: {
        fontSize: 11,
        lineHeight: 1.4,
        color: BRAND_COLORS.gray,
      },
      footer: {
        fontSize: 9,
        color: BRAND_COLORS.gray,
        italics: true,
      },
    },
    defaultStyle: {
      font: "Roboto",
    },
    pageMargins: [40, 40, 40, 40],
  };

  return new Promise((resolve, reject) => {
    try {
      const pdfDocGenerator = pdfMake.createPdf(docDefinition);
      pdfDocGenerator.getBlob((blob) => resolve(blob));
    } catch (error) {
      reject(error);
    }
  });
}
