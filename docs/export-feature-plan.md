# Export Feature Implementation Plan

## Overview
Add export functionality to the profile optimization results page, allowing users to download their AI-generated analysis as a shareable report.

---

## ✅ Current Implementation Status

### Completed Features
- ✅ **PNG Export**: Screenshot of annotated image using `html-to-image`
- ✅ **PDF Export**: Full report with pdfmake
- ✅ **Dropdown UI**: User can choose between PDF or PNG export
- ✅ **Toast Notifications**: Success/error feedback
- ✅ **Loading States**: Visual feedback during export

### Tech Stack
- **AnnotatedImageCanvas**: CSS-positioned overlays on an `<img>` element
- **Data Structure**: Score, summary, and array of annotations with titles, suggestions, severity, and bounding boxes
- **User Value**: Actionable feedback for profile improvement

---

## 🎯 Implemented Approach: Two Export Options

### Option 1: Screenshot of Annotated Image (PNG) ✅
**Tool:** `html-to-image` library
- Captures the entire DOM element including CSS overlays with OKLCH color support
- Works perfectly with absolute-positioned annotations
- Simple implementation, no need to redraw bounding boxes
- **Implementation**: `src/lib/utils/export/image-capture.util.ts`

**Why:** Users can share/save their annotated profile for reference

---

### Option 2: PDF Report ✅
**Tool:** `pdfmake` with declarative document structure
- Clean, professional report format
- Better for printing/sharing with friends
- Includes both annotated image + detailed text annotations
- **Implementation**: `src/lib/utils/export/pdf-generator.ts`

**Why:** More comprehensive, easier to read all feedback at once

---

## 📋 What to Include in Export

### Essential (Must-Have)
1. **Overall Score** (X/10) with color indicator
2. **Summary** - The AI's overall assessment
3. **Annotated image** - Visual reference of issues
4. **All annotations** with:
   - Severity badge (Critical/Moderate/Minor)
   - Title (what's wrong)
   - Suggestion (how to fix)
   - Numbered to match bounding boxes

### Nice-to-Have
- Timestamp of analysis
- RizzGPT branding/watermark
- Priority order (Critical issues first)

---

## 🛠️ Implementation Approach

### ✅ Chosen: Hybrid Dropdown (Both Options)
- Single "Export Report" button with dropdown menu
- **Option 1**: "Export as PDF" → Full report with everything
- **Option 2**: "Export as Image" → PNG screenshot only
- **Pros**: Clean UI, maximum flexibility, professional UX
- **Cons**: None - best of both worlds!

### Why This Approach:
1. **More valuable**: Users can choose based on their needs
2. **Professional**: Dropdown provides polished, modern UX
3. **Complete**: PDF has image context + full text explanations
4. **Flexible**: Quick PNG share or comprehensive PDF report

### Implementation Details:
- Use `pdfmake` + `html-to-image` combo
- Capture annotated image for PDF page 1
- Programmatically add text sections for annotations
- Style with brand colors (purple gradients)
- Dropdown menu with clear descriptions for each option

### Libraries Used:
```bash
bun add pdfmake html-to-image
bun add -d @types/pdfmake
```

---

## 🎨 Suggested PDF Structure

```
┌─────────────────────────────────────────┐
│  🌟 RizzGPT Profile Analysis Report     │
│  Score: 7/10                            │
│  [Overall Summary]                      │
│                                         │
│  [Screenshot of annotated profile]     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  📋 Detailed Recommendations            │
│                                         │
│  🔴 CRITICAL ISSUES                     │
│  1. [Title]                             │
│     Suggestion: [Full text]             │
│                                         │
│  🟡 MODERATE ISSUES                     │
│  2. [Title]                             │
│     Suggestion: [Full text]             │
│                                         │
│  🟢 MINOR IMPROVEMENTS                  │
│  3. [Title]                             │
│     Suggestion: [Full text]             │
└─────────────────────────────────────────┘
```

---

## 📝 Implementation Checklist

### Phase 1: Setup ✅
- ✅ Install dependencies: `bun add pdfmake html-to-image`
- ✅ Create export utility functions in `/src/lib/utils/export/`
- ✅ Add TypeScript types for export options

### Phase 2: UI Components ✅
- ✅ Add "Export Report" dropdown button to page
- ✅ Add loading state during export generation
- ✅ Add success/error toast notifications
- ✅ Implement dropdown menu with both export options

### Phase 3: PDF Generation ✅
- ✅ Capture annotated image with `html-to-image`
- ✅ Generate PDF structure with `pdfmake`
- ✅ Add score card and summary to page 1
- ✅ Add annotated screenshot to page 1
- ✅ Add detailed annotations list starting page 2
- ✅ Sort annotations by severity (Critical → Moderate → Minor)
- ✅ Add RizzGPT branding/footer

### Phase 4: Polish ✅
- ✅ Add timestamp to report
- ✅ Style PDF with brand colors (purple-600, red, amber, green)
- ✅ Optimize image quality (pixelRatio: 2)
- [ ] Test on different screen sizes
- [ ] Add analytics tracking for export feature usage (future enhancement)

---

## Technical Implementation Details

### File Structure ✅
```
src/
  lib/
    utils/
      export/
        pdf-generator.ts         # pdfmake PDF generation logic ✅
        image-capture.util.ts    # html-to-image wrapper ✅
  ui/
    optimizer/
      GenerateExportButton.svelte  # Dropdown export button ✅
  routes/
    optimizer/
      [id]/
        +page.svelte            # Updated to pass data to export button ✅
```

### Key Functions ✅
```typescript
// pdf-generator.ts
export async function generateOptimizationPDF(
  data: {
    score: number;
    summary: string;
    annotations: Annotation[];
    timestamp?: Date;
  },
  imageElement: HTMLElement
): Promise<Blob>

// image-capture.util.ts
export async function convertHtmlToImage(
  element: HTMLElement,
  options?: CaptureOptions
): Promise<Blob | null>
```

### PDF Document Structure (pdfmake)
```typescript
- Page 1: Overview
  - Header: "RizzGPT Profile Analysis"
  - Timestamp
  - Score card (color-coded by score)
  - Summary section
  - Annotated image (captured via html-to-image)

- Page 2+: Detailed Recommendations
  - Critical Issues (🔴 red)
  - Moderate Issues (🟡 amber)
  - Minor Improvements (🟢 green)
  - Footer with RizzGPT branding
```

---

## User Flow ✅

1. User views their optimization results at `/optimizer/[id]`
2. User clicks "Export Report" button (dropdown opens)
3. User selects export format:
   - **"Export as PDF"** - Full report with annotations
   - **"Export as Image"** - PNG screenshot only
4. Loading spinner appears
5. System:
   - **For PDF**: Captures annotated image via html-to-image → Generates PDF with pdfmake → Combines image + text annotations
   - **For PNG**: Captures annotated image via html-to-image
6. Browser auto-downloads file:
   - PDF: `rizzgpt-profile-analysis-{date}.pdf`
   - PNG: `rizzgpt-profile-analysis-{date}.png`
7. Success toast: "PDF/Image exported successfully!"

---

## Future Enhancements (V2)
- Email report directly to user
- Share report via unique link
- Compare reports over time (before/after improvements)
- Export to other formats (Markdown, plain text)
- Include additional metrics/insights in report
