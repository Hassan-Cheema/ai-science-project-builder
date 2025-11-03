'use client';

import { SidebarNav } from './sidebar-nav';

export function SidebarWrapper() {
  return (
    <aside className="sidebar hidden lg:block">
      <SidebarNav />
    </aside>
  );
}
