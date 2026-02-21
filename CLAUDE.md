# vaidy-ai — Personal Website

Personal website for Vaidyanathan P K (Vaidy), Lead AI Engineer at Meta Reality Labs. Built with Next.js and deployed at [vaidy.ai](https://vaidy.ai).

## Repository

- **GitHub**: https://github.com/vaidy-mit/vaidy-ai
- **Live site**: https://vaidy.ai

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Data viz**: D3.js
- **AI**: Anthropic SDK (`@anthropic-ai/sdk`) for Claude-powered features
- **Fonts**: JetBrains Mono (code/mono), Space Grotesk (display)

## Project Structure

```
src/
  app/           # Next.js App Router pages
    api/         # API routes (Claude-powered tools)
    blog/        # Blog (coming soon)
    links/       # Links page
    patents/     # Patents timeline (D3.js)
    profile/     # Interactive resume (Terminal, Knowledge Graph, About views)
    projects/    # Projects showcase
      activity-suggester/
      meal-planner/
      potty-tracker/
      resume-builder/
    resume/      # Resume page
  components/    # React components
    Navigation/
    MealPlanner/
    ActivitySuggester/
    PottyTracker/
    ResumeBuilder/
  data/          # Static data (profile, experience, patents, skills, etc.)
  hooks/         # Custom React hooks
  lib/           # Utility functions and terminal commands
```

## Key Data Files

- `src/data/profile.ts` — Name, bio, contact info, highlights
- `src/data/experience.ts` — Work history (Meta, Amazon)
- `src/data/patents.ts` — 5 US patents
- `src/data/skills.ts` — Skills and technologies
- `src/data/education.ts` — Education background
- `src/data/achievements.ts` — Awards and recognitions
- `src/data/graph-nodes.ts` — Knowledge graph data for profile visualization

## Claude-Powered Features (AI Routes)

- `POST /api/generate-ingredients` — Meal planner ingredient generation
- `POST /api/suggest-activities` — Toddler activity suggester
- `POST /api/potty-coaching` — Potty training AI coach

All AI routes use the Anthropic SDK with Claude.

## Dev Commands

```bash
npm run dev     # Start dev server at http://localhost:3000
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint
```

## About the Owner

- **Name**: Vaidyanathan P K
- **Role**: Lead AI Engineer, Meta Reality Labs (Developer & Pro Platforms Group)
- **Location**: Seattle, WA
- **Email**: vaidy.39e@gmail.com
- **LinkedIn**: https://www.linkedin.com/in/vaidyanathan-pk-1a494086/

### Career Highlights
- Lead AI Engineer at Meta Reality Labs — building AI-driven developer platforms for Horizon (VR/MR/XR) used by 20K+ developers
- Built Rufus, Amazon's Gen AI shopping assistant (proposed at hackathon, acknowledged by CEO/S-Team)
- 5 US Patents in AI, Voice & Speech Recognition, Knowledge Systems
- Meta Connect 2025 Speaker — presented on agentic AI to 5,000+ developers; featured in keynote (100K+ viewers)
- ACM ICPC Regional Finalist
- 10+ years in tech (Meta, Amazon)
