'use client';

import { usePathname } from 'next/navigation';
import { SidebarNav } from './sidebar-nav';

export function SidebarWrapper() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  
  // Hide sidebar on homepage
  if (isHomePage) {
    return null;
  }
  
  return (
    <aside className="sidebar hidden lg:block">
      <SidebarNav />
    </aside>
  );
}
