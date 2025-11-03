'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Optimized: use useMemo to avoid unnecessary re-renders
  const className = useMemo(() => {
    const isHomePage = pathname === '/';
    return isHomePage ? 'main-content full-width-content' : 'main-content content-area';
  }, [pathname]);

  return (
    <main className={className}>
      {children}
    </main>
  );
}
