'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Always start with content-area to match SSR
  const [className, setClassName] = useState('main-content content-area');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Mark as mounted and update className after hydration
    setMounted(true);
    const isHomePage = pathname === '/';
    setClassName(isHomePage ? 'main-content full-width-content' : 'main-content content-area');
  }, [pathname]);

  // Update on pathname change after mount
  useEffect(() => {
    if (!mounted) return;
    const isHomePage = pathname === '/';
    setClassName(isHomePage ? 'main-content full-width-content' : 'main-content content-area');
  }, [pathname, mounted]);

  return (
    <main className={className}>
      {children}
    </main>
  );
}
