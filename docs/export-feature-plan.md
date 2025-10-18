# Export Feature Implementation Plan

## Overview
Add export functionality to the profile optimization results page, allowing users to download their AI-generated analysis as a shareable report.

---

## Current Implementation
- **AnnotatedImageCanvas**: CSS-positioned overlays on an `<img>` element
- **Data Structure**: Score, summary, and array of annotations with titles, suggestions, severity, and bounding boxes
- **User Value**: Actionable feedback for profile improvement

---

## 🎯 Recommended Approach: Two Export Options

### Option 1: Screenshot of Annotated Image (PNG)
**Tool:** `html2canvas` library (most popular, 60k+ stars)
- Captures the entire DOM element including CSS overlays
- Works perfectly with absolute-positioned annotations
- Simple implementation, no need to redraw bounding boxes

**Why:** Users can share/save their annotated profile for reference

---

### Option 2: PDF Report
**Tool:** `jsPDF` with markdown-like structure
- Clean, professional report format
- Better for printing/sharing with friends
- Can include both image + detailed text annotations

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

## 🛠️ Implementation Options

### A. Simple & Fast: Screenshot Only
- Add "Export as Image" button to OptimizerHeader
- Use `html2canvas` to capture AnnotatedImageCanvas
- Download as PNG
- **Pros**: Quick, visual, shareable
- **Cons**: Annotations might be small/hard to read

### B. Better UX: PDF Report (RECOMMENDED)
- Add "Export Report" button
- Generate PDF with:
  - Page 1: Score card + screenshot of annotated image
  - Page 2+: Detailed list of all annotations with full suggestions
- **Pros**: Professional, comprehensive, printable
- **Cons**: Slightly more complex, larger file size

### C. Hybrid: Both Options
- "Export Image" button → PNG screenshot
- "Export Full Report" button → PDF with everything
- **Pros**: Maximum flexibility
- **Cons**: Two buttons might be cluttered

---

## 💡 Recommendation: PDF Report (Option B)

### Why:
1. **More valuable**: Users get actionable steps they can reference later
2. **Professional**: Looks polished, can share with friends for feedback
3. **Complete**: Image context + full text explanations
4. **Printable**: Can physically review while editing profile

### Implementation:
- Use `jsPDF` + `html2canvas` combo
- Capture annotated image for page 1
- Programmatically add text sections for annotations
- Style with your color scheme (purple/pink gradients)

### Libraries needed:
```bash
bun add jspdf html2canvas
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

### Phase 1: Setup
- [ ] Install dependencies: `bun add jspdf html2canvas`
- [ ] Create export utility function in `/src/lib/utils/export/`
- [ ] Add TypeScript types for export options

### Phase 2: UI Components
- [ ] Add "Export Report" button to `OptimizerHeader.svelte`
- [ ] Add loading state during PDF generation
- [ ] Add success/error toast notifications

### Phase 3: PDF Generation
- [ ] Capture annotated image with `html2canvas`
- [ ] Generate PDF structure with `jsPDF`
- [ ] Add score card and summary to page 1
- [ ] Add annotated screenshot to page 1
- [ ] Add detailed annotations list starting page 2
- [ ] Sort annotations by severity (Critical → Moderate → Minor)
- [ ] Add RizzGPT branding/footer

### Phase 4: Polish
- [ ] Add timestamp to report
- [ ] Style PDF with brand colors
- [ ] Test on different screen sizes
- [ ] Optimize image quality vs file size
- [ ] Add analytics tracking for export feature usage

---

## Technical Implementation Details

### File Structure
```
src/
  lib/
    utils/
      export/
        pdf-generator.ts         # Main PDF generation logic
        image-capture.ts         # html2canvas wrapper
        types.ts                 # Export-related types
  ui/
    optimizer/
      OptimizerHeader.svelte    # Add export button here
      ExportButton.svelte       # New component (optional)
```

### Key Functions
```typescript
// pdf-generator.ts
export async function generateOptimizationReport(
  optimization: ProfileOptimization,
  imageElement: HTMLElement
): Promise<Blob>

// image-capture.ts
export async function captureAnnotatedImage(
  element: HTMLElement
): Promise<string> // Returns base64 image
```

---

## User Flow

1. User views their optimization results at `/optimizer/[id]`
2. User clicks "Export Report" button in OptimizerHeader
3. Loading spinner appears
4. System:
   - Captures annotated image via html2canvas
   - Generates PDF with jsPDF
   - Combines image + text annotations
5. Browser auto-downloads PDF: `rizzgpt-profile-analysis-{date}.pdf`
6. Success toast: "Report downloaded successfully!"

---

## Future Enhancements (V2)
- Email report directly to user
- Share report via unique link
- Compare reports over time (before/after improvements)
- Export to other formats (Markdown, plain text)
- Include additional metrics/insights in report
