# 🚀 Auto Inventor - AI-Powered Academic Tools

<div align="center">

![Auto Inventor](public/logo.svg)

**Transform your academic journey with AI-powered tools**

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[Live Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## ✨ Features

### 🎯 **6 Powerful AI Tools**

1. **📝 Essay Writer** - Generate well-structured essays on any topic
2. **🔨 Science Project Builder** - Create detailed project plans with streaming output
3. **📄 Resume Maker** - Build professional resumes with PDF download
4. **📚 Notes Summarizer** - Transform long notes into concise summaries
5. **❓ Quiz Generator** - Create custom quizzes for exam prep
6. **💡 Idea Generator** - Brainstorm creative ideas for projects and startups

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

Create a `.env.local` file in the root directory:

```bash
# OpenAI API Key (Required)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Stripe Keys (Optional - for monetization)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_your_pro_price_id
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=price_your_premium_price_id

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Getting API Keys

1. **OpenAI API Key**: https://platform.openai.com/api-keys
2. **Stripe Keys**: https://dashboard.stripe.com/apikeys
3. **Google Analytics**: https://analytics.google.com

See `STRIPE_SETUP.md` and `BRANDING_SETUP.md` for detailed setup guides.

## 📁 Project Structure

```
AI-Student-Hub/
├── app/
│   ├── api/                    # API routes
│   │   ├── runEssay/          # Essay generation
│   │   ├── runProject/        # Project generation (streaming)
│   │   ├── runResume/         # Resume generation (streaming)
│   │   ├── runNotes/          # Notes summarization
│   │   ├── runQuiz/           # Quiz generation
│   │   ├── runIdea/           # Idea generation
│   │   └── stripe/            # Stripe checkout
│   ├── tools/                 # Tool pages
│   │   ├── essay-writer/
│   │   ├── project-builder/
│   │   ├── resume-maker/
│   │   ├── notes-summarizer/
│   │   ├── quiz-generator/
│   │   └── idea-generator/
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

### 📝 Essay Writer
- Topic input & word count selection
- Real-time AI generation
- Copy to clipboard
- Streaming responses

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

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

Works on any platform supporting Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

## 📈 SEO & Analytics

- ✅ Open Graph meta tags
- ✅ Twitter Card support
- ✅ Sitemap generation
- ✅ Robots.txt configuration
- ✅ Google Analytics ready

## 🎨 Branding Assets

See `BRANDING_SETUP.md` for:
- Favicon creation guide
- Logo specifications
- Social media image templates
- Analytics setup

## 💳 Monetization

See `STRIPE_SETUP.md` for:
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
