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
- **Pages**: Route components in `src/pages/` (Auth, Shop, Checkout, Admin, Brand)
- **Components**: Reusable UI components in `src/components/`
  - `AuthPage.tsx` - Authentication flow
  - `CustomerApp.tsx` - Customer shopping interface
  - `BrandDashboard.tsx` - Brand management interface
  - `SuperAdminDashboard.tsx` - Admin panel
  - `CheckoutFlow.tsx` - Purchase workflow
  - `DashboardLayout.tsx` - Common layout wrapper
- **UI Components**: shadcn/ui components in `src/components/ui/`

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
- **React Router** for navigation
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
- **Primary**: `tdstudiosny.com` (auto-deploys from main branch)
- **Secondary**: `tdstudiosdigital.com`
- **Optional**: `tdstudioshq.com`

### Workflow
1. Generate sitemap: `node scripts/generate-sitemap.mjs`
2. Build: `npm run build`
3. Push to `main` branch on `github.com/tdiorio2323/TD-STUDIOS-LOVABLE-SITE`
4. Vercel auto-deploys to production

## Build Configuration

- **Vite** as build tool with React SWC plugin
- **ESLint** with React hooks and TypeScript rules
- **PostCSS** with Tailwind CSS and Autoprefixer
- **Component tagging** enabled in development mode (Lovable integration)