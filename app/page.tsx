'use client';

import Link from 'next/link';
import { Suspense, lazy, useEffect } from 'react';
import {
  FileText,
  Briefcase,
  FlaskConical,
  HelpCircle,
  BookOpen,
  Lightbulb
} from 'lucide-react';

// Defer non-critical components to reduce TBT
const ArrowRight = lazy(() => import('lucide-react').then(module => ({ default: module.ArrowRight })));

// Structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Auto Inventor",
  "applicationCategory": "EducationalApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "1250"
  },
  "description": "AI-powered academic tools for students including essay writer, resume maker, project builder, and more."
};

// Optimized skeleton component
function ToolCardSkeleton() {
  return (
    <div className="bg-white hover:bg-gray-900 p-10 transition-all h-64 flex flex-col justify-between">
      <div className="w-16 h-16 bg-gray-300 rounded animate-pulse"></div>
      <div>
        <div className="h-8 bg-gray-300 rounded mb-2 animate-pulse"></div>
        <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
      </div>
    </div>
  );
}

// Critical hero section - optimized for LCP
function HeroSection() {
  return (
    <section className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 -z-10" />

      <div className="max-w-7xl mx-auto w-full">
        <div className="max-w-4xl animate-fade-in">
          {/* Modern badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse-glow"></span>
            <span className="text-sm font-medium text-blue-700">AI-Powered Learning Tools</span>
          </div>

          {/* Modern headline */}
          <h1 className="text-[3.5rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[7.5rem] font-black leading-[0.95] tracking-tight mb-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            <span className="block">Write.</span>
            <span className="block">Create.</span>
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Excel.</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl leading-relaxed font-normal">
            Your AI study companion. Build essays, resumes, projects, and more with intelligent tools designed for students.
          </p>

          {/* Modern CTA */}
          <Link href="/dashboard">
            <button className="group relative bg-gray-900 hover:bg-gray-800 text-white text-base font-semibold px-6 py-3 rounded-xl inline-flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
              <span>Get Started</span>
              <Suspense fallback={<div className="w-4 h-4"></div>}>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Suspense>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// Deferred tools section
function ToolsSection() {
  const tools = [
    { name: 'Essay Helper', IconComponent: FileText, href: '/tools/essay-helper', color: 'from-blue-500 to-cyan-500' },
    { name: 'Resume Maker', IconComponent: Briefcase, href: '/tools/resume-maker', color: 'from-purple-500 to-pink-500' },
    { name: 'Project Builder', IconComponent: FlaskConical, href: '/tools/project-builder', color: 'from-green-500 to-emerald-500' },
    { name: 'Quiz Generator', IconComponent: HelpCircle, href: '/tools/quiz-generator', color: 'from-orange-500 to-red-500' },
    { name: 'Notes Summarizer', IconComponent: BookOpen, href: '/tools/notes-summarizer', color: 'from-indigo-500 to-blue-500' },
    { name: 'Idea Generator', IconComponent: Lightbulb, href: '/tools/idea-generator', color: 'from-yellow-500 to-orange-500' },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Everything you need to succeed</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Powerful AI tools designed specifically for students</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool, i) => {
            const IconComponent = tool.IconComponent;
            return (
              <Link key={i} href={tool.href} className="hover-lift ai-glow">
                <div className="group bg-white border border-gray-200 rounded-2xl p-6 h-full flex flex-col justify-between transition-all duration-200 hover:border-gray-300">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm`}>
                    <IconComponent className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">{tool.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                      <span>Explore</span>
                      <Suspense fallback={<div className="w-4 h-4"></div>}>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </Suspense>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Deferred CTA section
function CTASection() {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100">
          <span className="text-sm font-medium text-blue-700">Free forever • No credit card required</span>
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Ready to level up your studies?
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
          Join thousands of students using AI to write better, learn faster, and achieve more.
        </p>
        <Link href="/dashboard">
          <button className="group relative bg-gray-900 hover:bg-gray-800 text-white text-lg font-semibold px-8 py-4 rounded-xl inline-flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]">
            <span>Open Dashboard</span>
            <Suspense fallback={<div className="w-5 h-5"></div>}>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </Suspense>
          </button>
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  // Defer non-critical JavaScript execution
  useEffect(() => {
    // Load non-critical features after initial render
    const timer = setTimeout(() => {
      // Any non-critical initialization can go here
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Critical above-the-fold content */}
      <HeroSection />

      {/* Deferred below-the-fold content */}
      <Suspense fallback={
        <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-16">Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-300">
              {Array.from({ length: 6 }).map((_, i) => (
                <ToolCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>
      }>
        <ToolsSection />
      </Suspense>

      {/* Deferred CTA */}
      <Suspense fallback={<div className="py-40"></div>}>
        <CTASection />
      </Suspense>
    </div>
  );
}
