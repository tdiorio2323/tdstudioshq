# Repository Guidelines

## Project Structure & Module Organization
- `src/pages` defines routed views; wire new routes in `src/App.tsx` to keep navigation consistent.
- `src/components` houses shared UI built with Radix primitives and Tailwind utilities; colocate feature-specific components under matching subfolders.
- `src/hooks`, `src/lib`, and `src/integrations` centralize custom logic, helpers, and Supabase or third-party clients; prefer re-using these instead of duplicating requests.
- Static assets live in `public/` and `src/assets/`; database migrations sit in `supabase/migrations` and should mirror any backend schema change.

## Build, Test, and Development Commands
- `npm install` – install dependencies (preferred over Bun to stay aligned with `package-lock.json`).
- `npm run dev` – start the Vite dev server with hot module reload at `http://localhost:5173`.
- `npm run build` – create a production bundle in `dist/`.
- `npm run build:dev` – produce a development-targeted build for staging checks.
- `npm run preview` – serve the bundled app locally.
- `npm run lint` – run ESLint with the shared TypeScript/React ruleset; ensure a clean run before committing.

## Coding Style & Naming Conventions
- Write React components in TypeScript (`.tsx`) with PascalCase filenames (e.g., `ProfileCard.tsx`); hooks use camelCase with a `use` prefix.
- Favor functional, composable components that rely on Tailwind utility classes; keep CSS overrides in `src/App.css` or feature-specific files.
- Stick with double quotes and two-space indentation as in existing modules; import local code via the `@/` alias configured in `tsconfig.json`.

## Testing Guidelines
- Automated tests are not yet configured; when adding them, place Vitest or React Testing Library specs alongside source files as `*.test.tsx` and mirror component names.
- Until automation lands, perform manual smoke tests by running `npm run dev`, navigating core routes (`/`, `/auth`, `/checkout`), and verifying console cleanliness.
- Document significant manual test steps in the PR description to aid reviewers.

## Commit & Pull Request Guidelines
- Follow the existing history’s short, sentence-case imperatives (e.g., `Add CTA buttons to Auth page`); include scope when touching multiple areas.
- Run `npm run lint` and relevant build commands before pushing; attach screenshots or GIFs for UI-facing changes.
- Reference linked issues or Supabase migration IDs in the description, and note any configuration updates (env keys, migrations) required for deployment.
