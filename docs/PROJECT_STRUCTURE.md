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
│   │   └── sidebar-wrapper.tsx  # Sidebar wrapper component
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
├── components/                  # Shared UI components
│   └── ui/                      # shadcn/ui components
│       ├── button.tsx           # Button component
│       └── card.tsx             # Card component
│
├── lib/                         # Utility libraries
│   ├── env.ts                   # Environment variables
│   ├── stripe.ts                # Stripe configuration
│   └── utils.ts                 # Utility functions
│
├── public/                      # Static assets
│   ├── logo.svg                 # App logo
│   └── ...                      # Other static files
│
├── docs/                        # Documentation
│   ├── BRANDING_SETUP.md
│   ├── OPTIMIZATION_COMPLETE.md
│   ├── PERFORMANCE_OPTIMIZATION_COMPLETE.md
│   ├── PRODUCTION_READY.md
│   ├── PROJECT_STRUCTURE.md     # This file
│   └── STRIPE_SETUP.md
│
├── components.json              # shadcn/ui configuration
├── next.config.ts               # Next.js configuration
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Project README
```

## 🎯 Organization Principles

1. **App Router Structure**: All routes follow Next.js 13+ App Router conventions
2. **Component Separation**:
   - Shared UI components in `components/ui/`
   - App-specific components in `app/components/`
3. **API Organization**: Each API endpoint has its own folder under `app/api/`
4. **Tool Pages**: Each tool has its own folder under `app/tools/`
5. **Documentation**: All documentation files are in the `docs/` folder

## 📝 Naming Conventions

- **Components**: PascalCase (e.g., `SidebarNav.tsx`)
- **Pages**: lowercase with hyphens (e.g., `essay-helper/page.tsx`)
- **API Routes**: camelCase (e.g., `runEssay/route.ts`)
- **Utilities**: camelCase (e.g., `utils.ts`)
