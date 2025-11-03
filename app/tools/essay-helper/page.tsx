'use client';

import { ArrowRight, FileText, List, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function EssayHelperPage() {
  return (
    <div className="-m-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen flex items-center">
      <div className="max-w-5xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-7xl md:text-8xl font-black text-gray-900 mb-6">
            Essay Helper
          </h1>
          <p className="text-2xl text-gray-600 font-light max-w-2xl mx-auto">
            Write complete essays or create structured outlines with AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Essay Writer Card */}
          <Link 
            href="/tools/essay-writer" 
            className="block cursor-pointer no-underline" 
            prefetch={true}
          >
            <div className="group bg-white border-2 border-gray-200 hover:border-gray-900 rounded-3xl p-12 transition-all duration-200 hover:shadow-xl hover:scale-[1.01] cursor-pointer relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <ArrowRight className="w-8 h-8 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-2 transition-all" />
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Essay Writer
              </h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Generate complete, well-structured essays on any topic. Multi-step wizard guides you through topic, length, type, and style.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">4-step process</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Word count: 300-3000</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Multiple essay types</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Custom writing styles</span>
                </div>
              </div>

              <div className="mt-8 inline-flex items-center gap-2 text-blue-600 font-semibold group-hover:text-blue-700">
                Start Writing
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Essay Outliner Card */}
          <Link 
            href="/tools/essay-outliner" 
            className="block cursor-pointer no-underline" 
            prefetch={true}
          >
            <div className="group bg-white border-2 border-gray-200 hover:border-gray-900 rounded-3xl p-12 transition-all duration-200 hover:shadow-xl hover:scale-[1.01] cursor-pointer relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <List className="w-8 h-8 text-white" />
                </div>
                <ArrowRight className="w-8 h-8 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-2 transition-all" />
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Essay Outliner
              </h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Create detailed, structured outlines with Roman numerals, main points, and supporting details. Perfect for planning before writing.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">2-step process</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">6 essay types</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Roman numerals structure</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Main points & details</span>
                </div>
              </div>

              <div className="mt-8 inline-flex items-center gap-2 text-purple-600 font-semibold group-hover:text-purple-700">
                Create Outline
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 text-gray-500 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Powered by GPT-4o-mini AI</span>
          </div>
        </div>
      </div>
    </div>
  );
}
