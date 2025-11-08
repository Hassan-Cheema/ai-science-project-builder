'use client';

import { usePathname } from 'next/navigation';
import { SidebarNav } from './sidebar-nav';

export function SidebarWrapper() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  // Always render the same DOM structure to avoid hydration mismatch
  // The sidebar will be hidden via CSS on the home page
  return (
    <aside
      className={`sidebar hidden lg:block ${isHomePage ? '!hidden' : ''}`}
      suppressHydrationWarning
    >
      {!isHomePage && <SidebarNav />}
    </aside>
  );
}
