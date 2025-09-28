# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based multi-tenant cannabis menu application built with TypeScript, Vite, and Supabase. The app serves three distinct user roles:
- **Customers**: Browse and purchase cannabis products
- **Brands**: Manage their product catalog and orders
- **Super Admin**: Oversee all brands, products, and system operations

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
# Pre-commit hook runs lint-staged on *.{ts,tsx,css,md} files
# lint-staged automatically runs eslint --fix on staged files
```

### Database
```bash
# Supabase commands (if supabase CLI is installed)
supabase start       # Start local Supabase
supabase db reset    # Reset local database
supabase db push     # Push migrations to remote
```

## Architecture

### Frontend Structure
- **Pages**: Route components in `src/pages/` (Auth, Shop, Checkout, Admin, Brand, Candyman, MylarShop, LinkTest, NotFound)
- **Components**: Reusable UI components in `src/components/`
  - `AuthPage.tsx` - Authentication flow
  - `CustomerApp.tsx` - Customer shopping interface
  - `MylarCustomerApp.tsx` - Mylar product shopping interface
  - `BrandDashboard.tsx` - Brand management interface
  - `SuperAdminDashboard.tsx` - Admin panel
  - `CheckoutFlow.tsx` - Purchase workflow
  - `DashboardLayout.tsx` - Common layout wrapper
- **UI Components**: shadcn/ui components in `src/components/ui/`
- **Data**: Product catalogs in `src/data/` (products.ts, mylarProducts.ts)
- **Validation**: Zod schemas in `src/lib/validation.ts` for form validation
- **Error Handling**: Error boundaries in `src/components/ErrorBoundary.tsx`

### Authentication & Authorization
- Role-based routing handled in `src/pages/Index.tsx`
- User roles stored in `user_roles` table (admin, brand, customer)
- Authentication flow redirects users based on their role after login
- Session persistence using Supabase auth with localStorage

### Database Architecture (Supabase)
- **PostgreSQL backend** with Row Level Security (RLS)
- **Key tables**: products, user_roles, orders, order_items
- **Migration files** in `supabase/migrations/`
- **Generated types** in `src/integrations/supabase/types.ts`

### State Management
- **TanStack Query** for server state management
- **React Router** for navigation with lazy loading
- **React Hook Form** with Zod validation for form state
- **Local state** with React hooks for component state

### Styling
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for component library
- **CSS custom properties** for theming
- **Responsive design** with mobile-first approach

## Key Patterns

### Component Structure
- Use TypeScript interfaces for props
- Follow shadcn/ui patterns for consistent styling
- Implement responsive design with Tailwind breakpoints

### Data Fetching
- Use TanStack Query hooks for API calls
- Supabase client configured in `src/integrations/supabase/client.ts`
- Real-time subscriptions for live data updates

### Routing
- All routes defined in `src/App.tsx`
- Protected routes based on authentication state
- Role-based redirection in Index component

## Development Notes

- **Port**: Development server runs on port 5173
- **Alias**: `@/` maps to `src/` directory
- **Hot Reload**: Vite with React SWC for fast development
- **Type Safety**: Full TypeScript coverage with generated Supabase types
- **SEO**: Sitemap generation via `scripts/generate-sitemap.mjs`

## Deployment

### Production Domains
- **Primary**: `tdstudioshq.com` (auto-deploys from main branch)

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

### Git Repository
- **Primary repo**: `github.com/tdiorio2323/tdstudioshq`
- **Legacy repo**: `github.com/tdiorio2323/TD-STUDIOS-LOVABLE-SITE`
- **SSH setup** for tdiorio2323 account if needed:
  ```bash
  git remote set-url origin git@github.com:tdiorio2323/tdstudioshq.git
  ```

## Build Configuration

- **Vite** as build tool with React SWC plugin
- **ESLint** with React hooks and TypeScript rules
- **PostCSS** with Tailwind CSS and Autoprefixer
- **Component tagging** enabled in development mode (Lovable integration)
- **TypeScript** in strict mode with comprehensive type checking
- **Code splitting** at route level with React.lazy()
- **Bundle analysis** with rollup-plugin-visualizer