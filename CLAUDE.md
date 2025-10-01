# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based TD Studios portfolio and e-commerce application built with TypeScript, Vite, and shadcn/ui. The app serves multiple purposes:
- **Landing Page** (`/`): Video background homepage with navigation to various TD Studios properties
- **Shop** (`/shop`): E-commerce interface for TD Studios merchandise (apparel, hats)
- **Mylars** (`/mylars`, `/mylars/:slug`): Custom mylar product catalog with SEO optimization
- **Admin/Brand**: Legacy multi-tenant dashboard features

## Commands

### Development
```bash
npm run dev          # Start development server (localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build
npm run sitemap      # Generate sitemap.xml
npm run lint         # Run ESLint for code linting
npm run typecheck    # Run TypeScript type checking
```

### Testing
```bash
npm run test:e2e                      # Run all Playwright tests
npx playwright test                    # Alternative command for all tests
npx playwright test tests/mylars.spec.ts  # Run specific test file
npx playwright test --headed              # Run tests with browser UI
npx playwright test --debug               # Run tests in debug mode
SLUG=3designs npx playwright test        # Run tests with environment variable
```

### Git Hooks & Linting
```bash
npm run prepare      # Install Husky git hooks
# Pre-commit hook (.husky/pre-commit) runs:
#   1. npm run lint (ESLint with auto-fix via lint-staged)
#   2. npm run typecheck (TypeScript type checking)
#   3. npm run test:e2e (Playwright tests, continues on failure)
```

### Database (Legacy)
```bash
# Supabase commands (if supabase CLI is installed)
# Note: Database features are legacy - most products are static in src/data/
supabase start       # Start local Supabase
supabase db reset    # Reset local database
supabase db push     # Push migrations to remote
```

## Architecture

### Frontend Structure
- **Pages** in `src/pages/`:
  - `Auth.tsx` - Landing page with video background and navigation buttons
  - `Shop.tsx` - Product shop for TD Studios merchandise
  - `MylarShop.tsx` - Mylar product catalog with dynamic slug routing
  - `Checkout.tsx` - Checkout flow
  - `Admin.tsx`, `Brand.tsx` - Legacy admin interfaces
  - `Candyman.tsx`, `LinkTest.tsx` - Special pages
  - `NotFound.tsx` - 404 handler
- **Main Components** in `src/components/`:
  - `CustomerApp.tsx` - Shop interface with cart, filtering, and search
  - `MylarCustomerApp.tsx` - Mylar product browsing with SEO metadata
  - `CheckoutFlow.tsx` - Purchase workflow
  - `BrandDashboard.tsx`, `SuperAdminDashboard.tsx` - Admin interfaces
  - `DashboardLayout.tsx` - Layout wrapper
  - `ErrorBoundary.tsx` - Global error handling
- **UI Components**: shadcn/ui library in `src/components/ui/`
  - Custom components: `liquid-glass.tsx`, `optimized-image.tsx`
- **Data Layer**:
  - `src/data/products.ts` - Shop product catalog (apparel, hats)
  - `src/data/mylarProducts.ts` - Mylar product catalog
- **Utilities**:
  - `src/lib/validation.ts` - Zod schemas for form validation
  - `src/lib/safeLink.tsx` - External link security helpers
  - `src/lib/money.ts` - Currency formatting utilities
  - `src/lib/config.ts` - Application configuration

### Routing & Navigation
- All routes defined in `src/App.tsx` with lazy loading for performance
- Error boundaries wrap each route for graceful error handling
- Landing page (`Auth.tsx`) navigates to:
  - External: `tdstudiosny.com` (AGENCY), `tdstudiosdigital.com` (DIGITAL)
  - Internal: `/shop`, `/mylars`
  - WhatsApp contact link

### SEO & Metadata
- React Helmet Async for dynamic meta tags
- Structured data (JSON-LD) for products
- Open Graph tags for social sharing
- Canonical URLs and sitemap generation
- Product-specific metadata in mylar pages

### State Management
- **React hooks** for local component state (cart, filters, search)
- **TanStack Query** for server state (if using Supabase features)
- **React Router** for navigation with lazy loading
- **React Hook Form** with Zod validation for checkout forms

### Styling
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for component library (buttons, cards, dialogs, etc.)
- **Custom CSS** for animations (glossy effects, video backgrounds)
- **Responsive design** with mobile-first approach
- **Theme variants**: Platinum button styles, custom gradients

## Key Patterns

### Product Data Structure
```typescript
// src/data/products.ts and src/data/mylarProducts.ts
type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  image: string;  // Images stored in /public/products/
  category: string;
  active?: boolean;
}
```

### Cart Management
- Local state with `useState<CartItem[]>`
- CartItem extends Product with `quantity` and optional `size`
- Total calculation and item updates in CustomerApp

### External Link Safety
- Use `ext` helper from `src/lib/safeLink.tsx`
- Pattern: `window.open(url, ext.target, ext.rel)`
- Ensures `rel="noopener noreferrer"` for security

## Development Notes

- **Port**: Development server runs on port 5173
- **Path Alias**: `@/` maps to `src/` directory (configured in tsconfig and vite.config)
- **Hot Reload**: Vite with React SWC for fast development
- **Type Safety**: Full TypeScript coverage in strict mode
- **SEO**: Sitemap generation via `scripts/generate-sitemap.mjs`
- **Static Assets**: Store product images in `/public/products/` for optimal loading
- **Video Background**: Landing page uses `/public/td-studios-home-background.mp4`
- **Testing**: Playwright E2E tests in `/tests/` directory
  - Tests validate page loads, metadata, and SEO tags
  - Can run with environment variables like `SLUG=3designs`

## Deployment

### Production Domains
- **Primary**: `tdstudioshq.com` (auto-deploys from main branch, Deployment Protection disabled)
- **DNS Configuration** (via Wix):
  - `A @` → `76.76.21.21`
  - `CNAME www` → `cname.vercel-dns.com`

### Related TD Studios Projects
- `tdstudiosny.com` → td-luxury-site project
- `tdstudiosdigital.com` → tdstudioscannamenu-22 project

### Workflow
1. Run linting and type checking: `npm run lint && npm run typecheck`
2. Run tests: `npm run test:e2e`
3. Generate sitemap: `npm run sitemap`
4. Build: `npm run build`
5. Push to `main` branch on `github.com/tdiorio2323/tdstudioshq`
6. Vercel auto-deploys to production

### Verification
```bash
curl -I https://tdstudioshq.com           # Check site response
dig +short tdstudioshq.com                # Verify A record
dig +short www.tdstudioshq.com            # Verify CNAME
```

### Git Repository
- **Primary repo**: `github.com/tdiorio2323/tdstudioshq`
- **Legacy repo**: `github.com/tdiorio2323/TD-STUDIOS-LOVABLE-SITE`
- **Lovable integration**: Project URL is `lovable.dev/projects/dbcb82db-3a5c-4d43-86a6-c004351ecb04`
  - Changes via Lovable auto-commit to this repo
- **SSH setup** for tdiorio2323 account if needed:
  ```bash
  git remote set-url origin git@github.com:tdiorio2323/tdstudioshq.git
  ssh-keygen -t ed25519 -C "tyler@tdstudiosny.com" -f ~/.ssh/id_ed25519 -N ""
  eval "$(ssh-agent -s)"
  ssh-add ~/.ssh/id_ed25519
  gh auth login
  gh ssh-key add ~/.ssh/id_ed25519.pub -t "MBP Lovable Site"
  ```

## Build Configuration

- **Vite** as build tool with React SWC plugin
- **ESLint** with React hooks and TypeScript rules (eslint.config.js)
- **PostCSS** with Tailwind CSS and Autoprefixer
- **Tailwind Config**: Typography plugin included (tailwind.config.ts)
- **Component tagging** enabled in development mode (Lovable integration)
- **TypeScript** in strict mode with comprehensive type checking
- **Code splitting** at route level with React.lazy()
- **Bundle analysis** with rollup-plugin-visualizer
- **Husky** for git hooks with lint-staged

## Important Project Context

- This is primarily a **portfolio and e-commerce site** for TD Studios
- Product data is **static** (stored in `src/data/`), not database-driven
- The **landing page** (`/`) is the main entry point with navigation to other properties
- **External properties** linked: tdstudiosny.com (Agency), tdstudiosdigital.com (Digital)
- **Internal pages**: `/shop` (merchandise), `/mylars` (custom product catalog)
- Admin/Brand features are **legacy** from original multi-tenant architecture