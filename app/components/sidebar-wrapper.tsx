'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SidebarNav } from './sidebar-nav';

export function SidebarWrapper() {
  const pathname = usePathname();
  const [isHomePage, setIsHomePage] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsHomePage(pathname === '/');
  }, [pathname]);

  // During SSR, always show sidebar to match server render
  // After hydration, hide if on home page
  if (mounted && isHomePage) {
    return null;
  }

  return (
    <aside className="sidebar hidden lg:block">
      <SidebarNav />
    </aside>
  );
}
