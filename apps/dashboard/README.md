# Verdict Dashboard

Live demo dashboard for the Verdict PR review tool. Built for IBM Bob Hackathon 2026.

## Features

- **Landing Page**: Hook page with tagline and killer line teaser
- **Analyze Page**: PR analysis interface with confidence score animation
- **Killer Line Callout**: Glowing red callout box highlighting cross-temporal insights
- **Verdict Banner**: Visual signal (🔴 DO NOT MERGE, ⚠️ REVIEW REQUIRED, ✅ LOOKS GOOD)
- **6-Layer Analysis Display**: Renders all synthesis sections from Verdict output

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React 18

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Demo Flow

1. Land on `/` - See tagline and killer line teaser
2. Click "Try Verdict" → Navigate to `/analyze`
3. Pre-filled PR URL: `https://github.com/Yashash4/fastapi-tokenauth/pull/1`
4. Click "Analyze" → Confidence score animates from 94% to 12% over 3 seconds
5. Results render with:
   - Verdict banner (🔴 DO NOT MERGE)
   - TL;DR with killer line in glowing callout
   - All 6 analysis layers (Semantic Diff, Blast Radius, Test Audit, History, Questions)

## Design

Dark developer aesthetic inspired by Vercel, Linear, and Supabase. Deep slate/black background with red danger signals for the killer line and DO NOT MERGE verdict.

## Data Source

Analysis data is hardcoded from `demo/hero-pr-result.md` in the project root. This is a live demo, not connected to the Python pipeline.

## Killer Line Treatment

The killer line ("Surviving mutation M-1 is the same code path that caused INC-2024-0431") appears in a glowing red callout box with:
- Red border with glow animation
- Warning emoji (⚠️)
- "Killer Line Detected" badge
- Monospace font for the line itself
- Explanatory text below

This is the visual hero moment of the entire demo.