# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a dish name generator web app that suggests creative names for dishes based on uploaded photos. The app learns user naming preferences over time to provide increasingly personalized suggestions.

**Key Context:**
- Target users: 2 people (you and your husband) sharing the same account
- Design philosophy: Minimalist, text-only interface with no animations, colors, or fancy fonts
- Core interaction: Upload photo → Get 3 name suggestions → Select one → App learns preferences

## Product Requirements Location

The complete product and visual requirements are documented in:
- `product requirement.md.txt` - Full feature specifications, technical requirements, and success metrics
- `dish_name_webapp_visual.md` - Detailed UI/UX requirements and page layouts

**Important Requirements:**
- All name generation must use AI vision models (GPT-4/5 vision or similar) to analyze dish photos
- The app must learn from user selections to improve future suggestions
- Photos are temporary (deleted after processing for privacy)
- Interface must be purely text-based with minimalist design
- Three-page structure: Upload → Name Suggestion → History (optional)

## Architecture Guidelines

**Front-End:**
- Simple HTML/CSS/JavaScript or React
- Center-aligned, single-column layout (~600px wide on desktop)
- Responsive design for mobile and desktop
- Monospace or system default fonts only
- Black text on white background (no colors or styling)

**Back-End:**
- API endpoint for image upload and temporary storage
- Integration with AI vision API for dish image analysis
- Name generation combining image description + learned user preferences
- Simple database or local JSON store for:
  - User selection history
  - Preference profile (tone, keywords, style patterns)
  - Past dishes with chosen names

**AI/ML Logic:**
- Image analysis: Extract visual features and describe the dish
- Name generation: Use description + preference profile to generate 3 creative names
- Learning: Track selected names to identify preferred language tone, recurring keywords, and naming style
- Regeneration: Allow users to request new suggestions if unsatisfied

## Development Notes

**Privacy Requirements:**
- Photos must be deleted immediately after name generation
- Store only selected dish names and metadata (date, chosen name)
- No personal data collection beyond naming preferences

**User Flow:**
1. Upload photo (JPG/PNG only)
2. Generate button triggers AI analysis
3. Display 3 suggested names as clickable text options
4. User selects one name (or regenerates for new options)
5. Show confirmation and log selection for learning
6. Optional: View history of past named dishes

**Learning Algorithm Approach:**
- Analyze selected names for patterns (funny vs elegant vs descriptive)
- Track frequently chosen keywords and naming structures
- Adjust AI prompts for future generations based on learned preferences
- Measure improvement by tracking regeneration frequency (should decrease over time)

## Key Design Constraints

- No animations or transitions
- No custom fonts or typography styling
- No color schemes (black/white only)
- Minimal navigation (text links only)
- Focus on functionality over aesthetics
- Fast load times and simple rendering
