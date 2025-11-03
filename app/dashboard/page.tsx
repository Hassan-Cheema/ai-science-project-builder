'use client';

import {
    ArrowRight,
    BookOpen,
    Briefcase,
    FileText,
    FlaskConical,
    HelpCircle,
    Lightbulb,
    RefreshCw,
    Sparkles
} from 'lucide-react';
import Link from 'next/link';

const tools = [
  { name: 'Essay Helper', IconComponent: FileText, href: '/tools/essay-helper', desc: 'Write essays & create outlines', featured: false },
  { name: 'Resume Maker', IconComponent: Briefcase, href: '/tools/resume-maker', desc: 'Build pro resumes + PDF', featured: false },
  { name: 'Project Builder', IconComponent: FlaskConical, href: '/tools/project-builder', desc: 'Create science projects', featured: false },
  { name: 'Quiz Generator', IconComponent: HelpCircle, href: '/tools/quiz-generator', desc: 'Practice with AI quizzes', featured: false },
  { name: 'Notes Summarizer', IconComponent: BookOpen, href: '/tools/notes-summarizer', desc: 'Condense your notes', featured: false },
  { name: 'Idea Generator', IconComponent: Lightbulb, href: '/tools/idea-generator', desc: 'Brainstorm new ideas', featured: false },
  { name: 'Paraphraser', IconComponent: RefreshCw, href: '/tools/paraphraser', desc: 'Paraphrase & humanize text', featured: false },
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
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
          <Sparkles className="w-3 h-3 text-blue-500" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">7 Advanced AI Tools Available</span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
          Dashboard
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Choose a tool to get started with advanced AI capabilities
        </p>
      </div>

      {/* Featured Tools */}
      {tools.filter(t => t.featured).length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">✨ New & Featured</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {tools.filter(t => t.featured).map((tool, index) => {
              const colors = toolColors[index % toolColors.length];
              const IconComponent = tool.IconComponent;
              return (
                <Link key={tool.name} href={tool.href} className="hover-lift ai-glow block cursor-pointer no-underline" prefetch={true}>
                  <div className={`group bg-white dark:bg-gray-800 border-2 ${colors.border} dark:border-gray-700 rounded-2xl p-6 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg relative cursor-pointer`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                        <IconComponent className="w-7 h-7 text-white" strokeWidth={2.5} />
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                      {tool.name}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* All Tools Grid */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">All Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool, index) => {
            const colors = toolColors[index % toolColors.length];
            const IconComponent = tool.IconComponent;
            return (
              <Link key={tool.name} href={tool.href} className="hover-lift ai-glow block cursor-pointer no-underline" prefetch={true}>
                <div className={`group bg-white dark:bg-gray-800 border ${colors.border} dark:border-gray-700 rounded-2xl p-6 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md cursor-pointer`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-7 h-7 text-white" strokeWidth={2.5} />
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                    {tool.name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
