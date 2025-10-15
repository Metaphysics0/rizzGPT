# Profile Optimizer Feature

## Overview

The Profile Optimizer is an AI-powered tool that analyzes dating profile screenshots and provides visual, interactive annotations with specific improvement suggestions. It combines multiple profile screenshots into a horizontal collage and uses Gemini 2.0's vision capabilities to identify areas for enhancement.

## How It Works

1. **Upload**: Users upload 1-5 dating profile screenshots
2. **Processing**: Images are combined into a horizontal collage using FFmpeg
3. **AI Analysis**: Gemini 2.0 analyzes the collage and returns structured feedback with precise coordinates
4. **Visualization**: Interactive annotations appear as numbered badges overlaid on the profile images
5. **Interaction**: Users can click annotation badges to view detailed suggestions

## Technical Implementation

### Coordinate System
- Gemini returns bounding boxes in **normalized coordinates (0-1000)** using the format `[y_min, x_min, y_max, x_max]`
- Frontend converts these to actual pixel positions based on the displayed image dimensions
- Supports responsive scaling - annotations maintain correct positions across different screen sizes

### Annotation Types
- **Photo**: Feedback on specific photos (composition, lighting, expression)
- **Bio-text**: Suggestions for written profile content
- **Prompt**: Feedback on prompt answers
- **Overall**: General profile-level feedback

### Severity Levels
- **Critical** (Red): Major issues that significantly hurt profile appeal
- **Moderate** (Amber): Important improvements that would notably enhance the profile
- **Minor** (Green): Small tweaks or positive reinforcement

## User Experience

The feature provides a Figma/Canva-style annotation experience where users can:
- See all feedback points at a glance via numbered badges
- Click badges to reveal detailed, actionable suggestions
- Understand exactly which parts of their profile need improvement
- Get both positive reinforcement and constructive criticism

## Future Enhancements

Potential additions include:
- Regenerate optimization with different AI models
- Download annotated image as PDF report
- Side-by-side before/after comparisons
- Photo order recommendations with drag-and-drop
