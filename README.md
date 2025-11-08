# 🚀 ScholarBar - AI-Powered Academic Tools

<div align="center">

![ScholarBar](public/logo.svg)

**Transform your academic journey with AI-powered tools**

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[Live Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## ✨ Features

### 🎯 **8 Powerful AI Tools**

1. **📝 Essay Helper** - Generate well-structured essays on any topic
2. **📋 Essay Outliner** - Create detailed essay outlines with structured formats
3. **🔨 Project Builder** - Create detailed project plans with streaming output
4. **📄 Resume Maker** - Build professional resumes with PDF download
5. **📚 Notes Summarizer** - Transform long notes into concise summaries
6. **❓ Quiz Generator** - Create custom quizzes for exam prep
7. **💡 Idea Generator** - Brainstorm creative ideas for projects and startups
8. **🔄 Paraphraser & Humanizer** - Rewrite text to sound natural and human-written

### 🎨 **Premium Design**

- ✅ Stunning animated hero section with gradient backgrounds
- ✅ Responsive layout with sidebar navigation
- ✅ Dark theme navbar with animated logo
- ✅ Professional footer with social links
- ✅ Smooth hover animations and transitions
- ✅ Loading spinners and interactive feedback
- ✅ Mobile-responsive design

### 🤖 **AI Integration**

- ✅ OpenAI GPT-4o-mini integration
- ✅ Streaming responses for real-time output
- ✅ Smart error handling and rate limit management
- ✅ Copy-to-clipboard functionality
- ✅ Professional AI prompts optimized for each tool

### 💰 **Monetization Ready**

- ✅ Stripe integration (pre-built checkout)
- ✅ Three pricing tiers (Free, Pro, Premium)
- ✅ Upgrade buttons and pricing page
- ✅ Payment success page

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and npm
- OpenAI API key
- (Optional) Stripe account for monetization

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/AI-Student-Hub.git
cd AI-Student-Hub

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and add your API keys

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🔧 Configuration

### Environment Variables

**📝 Copy `.env.example` to `.env.local` and fill in your values:**

```bash
# Copy the example file
cp .env.example .env.local

# Then edit .env.local and add your API keys
```

**Required Variables:**

```bash
OPENAI_API_KEY=sk-your-openai-api-key-here
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # Update with production URL after deploy
```

**Optional Variables** (see `.env.example` for complete list):

- Stripe keys (for payments)
- Supabase keys (for database)
- Upstash Redis (for caching)
- Google Analytics ID
- Sentry DSN (for error monitoring)
- Feature flags

**⚠️ Important:** Never commit `.env.local` to Git. It's already in `.gitignore`.

### Getting API Keys

1. **OpenAI API Key**: https://platform.openai.com/api-keys
2. **Stripe Keys**: https://dashboard.stripe.com/apikeys
3. **Google Analytics**: https://analytics.google.com

See `docs/STRIPE_SETUP.md` and `docs/BRANDING_SETUP.md` for detailed setup guides.

## 📁 Project Structure

```
AI-Student-Hub/
├── app/
│   ├── api/                    # API routes
│   │   ├── runEssay/          # Essay generation
│   │   ├── runOutline/        # Essay outline generation
│   │   ├── runProject/        # Project generation (streaming)
│   │   ├── runResume/         # Resume generation (streaming)
│   │   ├── runNotes/          # Notes summarization
│   │   ├── runQuiz/           # Quiz generation
│   │   ├── runIdea/           # Idea generation
│   │   ├── runParaphraser/    # Paraphraser & humanizer
│   │   └── stripe/            # Stripe checkout
│   ├── tools/                 # Tool pages
│   │   ├── essay-helper/
│   │   ├── essay-outliner/
│   │   ├── project-builder/
│   │   ├── resume-maker/
│   │   ├── notes-summarizer/
│   │   ├── quiz-generator/
│   │   ├── idea-generator/
│   │   └── paraphraser/
│   ├── components/            # Reusable components
│   │   ├── sidebar-nav.tsx
│   │   ├── mobile-sidebar.tsx
│   │   ├── footer.tsx
│   │   ├── analytics.tsx
│   │   └── resume-template.tsx
│   ├── dashboard/             # Dashboard page
│   ├── pricing/               # Pricing page
│   ├── about/                 # About page
│   ├── success/               # Payment success page
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Landing page
│   ├── sitemap.ts             # SEO sitemap
│   └── robots.ts              # Robots.txt
├── components/ui/             # Shadcn UI components
├── lib/
│   ├── stripe.ts              # Stripe configuration
│   └── utils.ts               # Utility functions
├── public/                    # Static assets
└── package.json
```

## 🎨 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Shadcn UI
- **Forms**: React Hook Form
- **AI**: OpenAI GPT-4o-mini
- **Payments**: Stripe
- **PDF Generation**: jsPDF + html2canvas

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start dev server at localhost:3000

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## 📱 Features by Tool

### 📝 Essay Helper

- Topic input & word count selection
- Real-time AI generation
- Copy to clipboard
- Streaming responses

### 📋 Essay Outliner

- Topic & essay type selection
- Multiple essay types (Classic, Persuasive, Personal Statement, etc.)
- Structured outlines with Roman numerals
- Step-by-step workflow
- Copy functionality

### 🔨 Project Builder

- Topic & grade level inputs
- Streaming project generation
- Detailed project plans with hypothesis, materials, procedures
- Copy functionality

### 📄 Resume Maker

- Professional resume template
- Multiple input fields (name, role, skills, experience, goals)
- Beautiful visual design with gradient header
- **PDF download** with one click
- ATS-friendly formatting

### 📚 Notes Summarizer

- Large textarea for notes
- Real-time word count
- Bullet-point summaries
- Fast processing

### ❓ Quiz Generator

- Topic & difficulty selection
- 5 questions with answers
- Formatted Q&A output
- Copy quiz functionality

### 💡 Idea Generator

- Topic & type selection
- 5 creative ideas as cards
- Gradient backgrounds
- Hover animations
- Copy all ideas

### 🔄 Paraphraser & Humanizer

- Two modes: Paraphrase and Humanize
- Text input with word count
- AI-powered rewriting
- Natural, human-like output

## 🎯 Pages

- **`/`** - Stunning landing page with hero section
- **`/dashboard`** - All tools overview
- **`/tools/*`** - Individual tool pages
- **`/pricing`** - Subscription plans
- **`/about`** - Company story and mission
- **`/success`** - Payment confirmation

## 🔐 Security

- ✅ API keys stored in environment variables
- ✅ Server-side API routes (never expose keys)
- ✅ Input validation on all endpoints
- ✅ Rate limit handling
- ✅ CORS and security headers

## 🚀 Deployment

### Quick Start (Vercel - Recommended)

**Your project is production-ready!** Follow these steps:

1. **Push to GitHub** (if not already)

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**

   - Go to [vercel.com](https://vercel.com) and sign in with GitHub
   - Click "New Project" and import your repository
   - Vercel will auto-detect Next.js settings

3. **Add Environment Variables**
   Go to **Settings → Environment Variables** and add:

   ```bash
   # Required
   OPENAI_API_KEY=sk-your-openai-key-here
   NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app  # Update after first deploy

   # Optional (see .env.example for full list)
   STRIPE_SECRET_KEY=sk_live_xxx
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
   ```

4. **Deploy & Update**
   - Click "Deploy" and wait for build to complete
   - After deployment, update `NEXT_PUBLIC_BASE_URL` with your actual Vercel URL
   - Redeploy to apply changes

**📋 Detailed Instructions:** See `DEPLOYMENT_CHECKLIST.md` for step-by-step guide

### Other Platforms

Works on any platform supporting Next.js:

- **Netlify**: Connect GitHub repo, auto-detects Next.js
- **Railway**: Deploy with Docker or direct Next.js
- **Render**: Connect GitHub repo, auto-detects Next.js
- **AWS Amplify**: Connect GitHub repo, auto-detects Next.js

**📚 See `docs/VERCEL_DEPLOYMENT_CHECKLIST.md` for detailed deployment guide**

## 📈 SEO & Analytics

- ✅ Open Graph meta tags
- ✅ Twitter Card support
- ✅ Sitemap generation
- ✅ Robots.txt configuration
- ✅ Google Analytics ready

## 🎨 Branding Assets

See `docs/BRANDING_SETUP.md` for:

- Favicon creation guide
- Logo specifications
- Social media image templates
- Analytics setup

## 💳 Monetization

See `docs/STRIPE_SETUP.md` for:

- Stripe product creation
- Price ID configuration
- Checkout integration
- Webhook setup

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- OpenAI for GPT-4o-mini API
- Vercel for Next.js framework
- Tailwind CSS for styling
- Shadcn UI for components

## 📞 Support

Need help? Contact us:

- Email: support@autoinventor.com
- Twitter: [@autoinventor](https://twitter.com/autoinventor)
- GitHub Issues: [Report a bug](https://github.com/yourusername/AI-Student-Hub/issues)

---

<div align="center">

**Built with ❤️ for students worldwide**

[Website](https://autoinventor.com) · [Dashboard](https://autoinventor.com/dashboard) · [Pricing](https://autoinventor.com/pricing)

</div>
