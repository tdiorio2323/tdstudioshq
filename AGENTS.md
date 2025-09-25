# Repository Guidelines

## Project Structure & Module Organization
The Vite-powered front end lives in `src/`, with routed pages under `src/pages` and shared UI primitives in `src/components`. Add new views by defining the route component and wiring it through `src/App.tsx`. Feature-specific logic should stay close to its usage: hooks in `src/hooks`, utilities in `src/lib`, and third-party or Supabase clients in `src/integrations`. Public-facing assets belong in `public/`, while reusable graphics and icons sit in `src/assets/`. Database changes must be mirrored in `supabase/migrations` so deployments track schema history.

## Build, Test, and Development Commands
Run `npm install` to sync dependencies with `package-lock.json`. Use `npm run dev` for the local dev server at `http://localhost:5173` and `npm run preview` to smoke-test a built bundle. `npm run build` creates a production-ready output in `dist/`, while `npm run build:dev` targets staging environments. Lint with `npm run lint`; keep runs clean before opening a PR.

## Coding Style & Naming Conventions
Write components in TypeScript `.tsx` files using PascalCase names (`ProfileCard.tsx`). Custom hooks use camelCase prefixed with `use` (`useCheckoutRedirect`). Follow the repo’s two-space indentation, double quotes, and Tailwind-first styling. Reach for Radix UI primitives already wrapped under `src/components` before introducing new libraries. Import local modules via the `@/` alias to avoid brittle relative paths.

## Testing Guidelines
Automated tests are not yet configured. When adding coverage, colocate Vitest or React Testing Library specs beside the source as `ComponentName.test.tsx`. Until then, run `npm run dev`, exercise primary flows (`/`, `/auth`, `/checkout`), and confirm the console stays quiet. Capture any manual QA steps in the PR description for traceability.

## Commit & Pull Request Guidelines
Keep commits short, sentence-case imperatives (`Update checkout loader`). Document the scope in PR descriptions, link issues or Supabase migration IDs, and list required environment changes. Include screenshots or GIFs for UI adjustments and confirm `npm run lint` (and builds when applicable) before requesting review.

## Security & Configuration Tips
Store Supabase keys and other secrets in a local `.env` file and mirror required variables in shared docs. Never commit credentials or generated `.env` files. When touching migrations, note the run order and any manual backfill steps in the PR so others can reproduce the rollout.
