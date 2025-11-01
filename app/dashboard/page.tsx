'use client';

import {
    BookOpen,
    Briefcase,
    FileText,
    FlaskConical,
    HelpCircle,
    Lightbulb,
    RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { Suspense, lazy } from 'react';

const ArrowRight = lazy(() => import('lucide-react').then(module => ({ default: module.ArrowRight })));

const tools = [
  { name: 'Essay Helper', IconComponent: FileText, href: '/tools/essay-helper', desc: 'Write essays & create outlines' },
  { name: 'Resume Maker', IconComponent: Briefcase, href: '/tools/resume-maker', desc: 'Build pro resumes + PDF' },
  { name: 'Project Builder', IconComponent: FlaskConical, href: '/tools/project-builder', desc: 'Create science projects' },
  { name: 'Quiz Generator', IconComponent: HelpCircle, href: '/tools/quiz-generator', desc: 'Practice with AI quizzes' },
  { name: 'Notes Summarizer', IconComponent: BookOpen, href: '/tools/notes-summarizer', desc: 'Condense your notes' },
  { name: 'Idea Generator', IconComponent: Lightbulb, href: '/tools/idea-generator', desc: 'Brainstorm new ideas' },
  { name: 'Paraphraser', IconComponent: RefreshCw, href: '/tools/paraphraser', desc: 'Paraphrase & humanize text' },
];

const toolColors = [
  { gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50', border: 'border-blue-100' },
  { gradient: 'from-purple-500 to-pink-500', bg: 'bg-purple-50', border: 'border-purple-100' },
  { gradient: 'from-green-500 to-emerald-500', bg: 'bg-green-50', border: 'border-green-100' },
  { gradient: 'from-orange-500 to-red-500', bg: 'bg-orange-50', border: 'border-orange-100' },
  { gradient: 'from-indigo-500 to-blue-500', bg: 'bg-indigo-50', border: 'border-indigo-100' },
  { gradient: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-50', border: 'border-yellow-100' },
  { gradient: 'from-pink-500 to-rose-500', bg: 'bg-pink-50', border: 'border-pink-100' },
];

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-blue-50 border border-blue-100">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          <span className="text-sm font-medium text-blue-700">7 AI Tools Available</span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-3 tracking-tight">
          Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Choose a tool to get started
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map((tool, index) => {
          const colors = toolColors[index % toolColors.length];
          const IconComponent = tool.IconComponent;
          return (
            <Link key={tool.name} href={tool.href} className="hover-lift ai-glow">
              <div className={`group bg-white border ${colors.border} rounded-2xl p-6 transition-all duration-200 hover:border-gray-300 hover:shadow-md`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                  <Suspense fallback={<div className="w-5 h-5"></div>}>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
                  </Suspense>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                  {tool.name}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {tool.desc}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
