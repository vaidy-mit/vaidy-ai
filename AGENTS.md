# Repository Guidelines

## Project Structure & Module Organization
- `src/app`: Next.js App Router pages and layouts (e.g., `src/app/page.tsx`, `src/app/profile/page.tsx`).
- `src/components`: Reusable React components.
- `src/data`: Static data objects (profile, featured items, etc.).
- `src/hooks`: Custom React hooks.
- `src/lib`: Shared utilities and helpers.
- `src/app/globals.css`: Global styles and Tailwind layer customizations.
- `public`: Static assets served at the site root (images, icons, etc.).

## Build, Test, and Development Commands
- `npm run dev`: Start the local Next.js dev server at `http://localhost:3000`.
- `npm run build`: Create a production build.
- `npm run start`: Run the production build locally.
- `npm run lint`: Run ESLint with Next.js + TypeScript rules.

## Coding Style & Naming Conventions
- Language: TypeScript + React (Next.js App Router).
- Formatting: follow existing file formatting; use 2-space indentation and trailing commas where already present.
- Imports: prefer path aliases with `@/` (maps to `src/`).
- Naming: React components use `PascalCase`, hooks use `useCamelCase`, and data objects use `camelCase`.
- Styling: use Tailwind utility classes; keep class lists readable and grouped by layout/typography/color.

## Testing Guidelines
- No dedicated test framework or test files are present yet.
- If adding tests, co-locate near the feature (e.g., `src/components/__tests__/...`) and document the test command in `package.json`.

## Commit & Pull Request Guidelines
- Commit messages follow Conventional Commits (e.g., `feat:`, `fix:`, `refactor:`).
- PRs should include a clear description of changes and rationale.
- For UI changes, include screenshots or a short screen recording.
- Link related issues when applicable.

## Deployment & Configuration Notes
- Deployments are handled via Vercel connected to the GitHub repo.
- If new environment variables are required, document them in the PR and add to Vercel project settings.
