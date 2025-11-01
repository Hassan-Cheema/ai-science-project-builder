# Project Structure

This document outlines the organized structure of the AI Student Hub project.

## 📁 Directory Structure

```
AI-Student-Hub/
├── app/                          # Next.js App Router directory
│   ├── api/                      # API routes
│   │   ├── runEssay/            # Essay generation API
│   │   ├── runIdea/             # Idea generation API
│   │   ├── runNotes/            # Notes summarization API
│   │   ├── runOutline/          # Essay outline API
│   │   ├── runParaphraser/      # Paraphrase & humanize API
│   │   ├── runProject/          # Project builder API
│   │   ├── runQuiz/             # Quiz generator API
│   │   ├── runResume/           # Resume builder API
│   │   └── stripe/              # Stripe payment integration
│   │       └── checkout/
│   ├── components/              # App-specific components
│   │   ├── analytics.tsx        # Analytics component
│   │   ├── footer.tsx           # Footer component
│   │   ├── layout-wrapper.tsx   # Layout wrapper for routing
│   │   ├── mobile-sidebar.tsx   # Mobile navigation
│   │   ├── resume-template.tsx  # Resume template component
│   │   ├── sidebar-nav.tsx      # Desktop sidebar navigation
│   │   ├── sidebar-wrapper.tsx  # Sidebar wrapper component
│   │   └── ui/                  # Shared UI components (shadcn/ui)
│   │       ├── button.tsx       # Button component
│   │       └── card.tsx         # Card component
│   ├── tools/                   # Tool pages
│   │   ├── essay-helper/        # Essay helper landing
│   │   ├── essay-outliner/      # Essay outliner tool
│   │   ├── essay-writer/        # Essay writer tool
│   │   ├── idea-generator/      # Idea generator tool
│   │   ├── notes-summarizer/    # Notes summarizer tool
│   │   ├── paraphraser/         # Paraphraser & humanizer tool
│   │   ├── project-builder/     # Project builder tool
│   │   ├── quiz-generator/      # Quiz generator tool
│   │   └── resume-maker/        # Resume maker tool
│   ├── about/                   # About page
│   ├── dashboard/               # Dashboard page
│   ├── pricing/                 # Pricing page
│   ├── success/                 # Payment success page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   ├── error.tsx                # Error boundary
│   ├── loading.tsx              # Loading component
│   ├── not-found.tsx            # 404 page
│   ├── robots.ts                # Robots.txt
│   └── sitemap.ts               # Sitemap generator
│
├── components/                  # Legacy/shared UI components (optional)
│   └── ui/                      # shadcn/ui components (duplicate location)
│
├── lib/                         # Utility libraries
│   ├── env.ts                   # Environment variables
│   ├── stripe.ts                # Stripe configuration
│   └── utils.ts                 # Utility functions
│
├── public/                      # Static assets
│   ├── logo.svg                 # App logo
│   ├── favicon.ico              # Favicon
│   └── ...                      # Other static files
│
├── docs/                        # Documentation
│   ├── ASSETS.md                # Assets documentation
│   ├── BRANDING_SETUP.md        # Branding setup guide
│   ├── DEPLOYMENT_GUIDE.md      # Deployment instructions
│   ├── FINAL_SETUP_SUMMARY.md   # Final setup summary
│   ├── IMPROVEMENTS_CHECKLIST.md # Improvements checklist
│   ├── OPTIMIZATION_COMPLETE.md  # Optimization documentation
│   ├── PERFORMANCE_OPTIMIZATION_COMPLETE.md # Performance docs
│   ├── PRODUCTION_READY.md      # Production readiness
│   ├── PROJECT_IMPROVEMENTS_SUMMARY.md # Project improvements
│   ├── PROJECT_STRUCTURE.md     # This file
│   ├── QUICK_FIX.md             # Quick fixes guide
│   └── STRIPE_SETUP.md          # Stripe setup guide
│
├── components.json              # shadcn/ui configuration
├── eslint.config.mjs            # ESLint configuration
├── next.config.ts               # Next.js configuration
├── next-env.d.ts                # Next.js TypeScript declarations
├── package.json                 # Dependencies
├── package-lock.json            # Lock file
├── postcss.config.mjs           # PostCSS configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Project README
```

## 🎯 Organization Principles

1. **App Router Structure**: All routes follow Next.js 13+ App Router conventions
2. **Component Separation**:
   - Shared UI components in `app/components/ui/` (preferred)
   - App-specific components in `app/components/`
   - Legacy components may exist in `components/ui/` (for compatibility)
3. **API Organization**: Each API endpoint has its own folder under `app/api/`
4. **Tool Pages**: Each tool has its own folder under `app/tools/`
5. **Documentation**: All documentation files are in the `docs/` folder
6. **No Legacy Folders**: Removed `backend/`, `frontend/`, and Docker files (these were from a different project)

## 📝 Naming Conventions

- **Components**: PascalCase (e.g., `SidebarNav.tsx`)
- **Pages**: lowercase with hyphens (e.g., `essay-helper/page.tsx`)
- **API Routes**: camelCase (e.g., `runEssay/route.ts`)
- **Utilities**: camelCase (e.g., `utils.ts`)
- **Documentation**: UPPERCASE_WITH_UNDERSCORES.md (e.g., `PROJECT_STRUCTURE.md`)

## 🧹 Cleanup Notes

- ✅ Removed `backend/` folder (different project - FastAPI)
- ✅ Removed `frontend/` folder (different project - React/Vite)
- ✅ Removed Docker files (`docker-compose.yml`, `docker-compose.dev.yml`, `env.docker.example`)
- ✅ Moved all documentation to `docs/` folder
- ✅ Consolidated UI components in `app/components/ui/`
