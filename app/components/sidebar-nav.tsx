'use client';

import {
    BookOpen,
    Briefcase,
    FileText,
    FlaskConical,
    HelpCircle,
    Info,
    LayoutDashboard,
    Lightbulb,
    RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', Icon: LayoutDashboard },
  { name: 'Essay Helper', href: '/tools/essay-helper', Icon: FileText },
  { name: 'Project Builder', href: '/tools/project-builder', Icon: FlaskConical },
  { name: 'Resume Maker', href: '/tools/resume-maker', Icon: Briefcase },
  { name: 'Notes Summarizer', href: '/tools/notes-summarizer', Icon: BookOpen },
  { name: 'Quiz Generator', href: '/tools/quiz-generator', Icon: HelpCircle },
  { name: 'Idea Generator', href: '/tools/idea-generator', Icon: Lightbulb },
  { name: 'Paraphraser', href: '/tools/paraphraser', Icon: RefreshCw },
  { name: 'About', href: '/about', Icon: Info },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
        const IconComponent = item.Icon;
        return (
          <Link key={item.href} href={item.href}>
            <div
              className={`w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3 group ${
                isActive
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <IconComponent
                className={`w-4 h-4 group-hover:scale-110 transition-transform flex-shrink-0 ${
                  isActive ? 'text-white' : 'text-gray-500'
                }`}
                strokeWidth={2}
              />
              <span>{item.name}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
