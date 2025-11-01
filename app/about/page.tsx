import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Auto Inventor's mission to empower students with AI-powered academic tools.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-16">
      {/* Hero Section */}
      <div>
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
          About Auto Inventor
        </h1>
        <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed">
          We're democratizing access to AI-powered academic tools for students worldwide.
        </p>
      </div>

      {/* Mission Section */}
      <div className="border-2 border-gray-200 rounded-2xl p-8 sm:p-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
          We bridge the gap between cutting-edge AI and everyday academic needs. Every student deserves access to tools that help them write better, create more, and study smarter.
        </p>
      </div>

      {/* Story Section */}
      <div className="mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed mb-4">
            Auto Inventor started as a simple idea: what if students had access to the same powerful AI tools that professionals use? We saw countless students struggling with time management, writing assignments, and preparing for their futures. That's when we knew we had to build something different.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Today, Auto Inventor provides 6 powerful AI tools completely free, helping thousands of students write essays, generate project ideas, create professional resumes, summarize lengthy notes, and prepare for exams with custom quizzes.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Accessibility</h3>
            <p className="text-gray-600">
              We believe powerful AI tools should be accessible to everyone, regardless of budget.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Quality</h3>
            <p className="text-gray-600">
              We use state-of-the-art AI models to deliver high-quality, reliable results every time.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation</h3>
            <p className="text-gray-600">
              We continuously improve and expand our tools to meet evolving student needs.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gray-900 rounded-xl p-8 sm:p-10 mb-12 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">6</div>
            <div className="text-gray-300">AI-Powered Tools</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">100%</div>
            <div className="text-gray-300">Free to Use</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">24/7</div>
            <div className="text-gray-300">Available</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 sm:p-12 text-white">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-lg sm:text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
          Join thousands of students already using Auto Inventor to accelerate their academic success.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/dashboard">
            <button className="bg-white text-indigo-600 hover:bg-gray-100 font-bold px-8 py-4 rounded-full text-lg transition-colors shadow-lg">
              Explore Tools
            </button>
          </Link>
          <Link href="/pricing">
            <button className="border-2 border-white text-white hover:bg-white/10 font-bold px-8 py-4 rounded-full text-lg transition-colors">
              View Pricing
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

