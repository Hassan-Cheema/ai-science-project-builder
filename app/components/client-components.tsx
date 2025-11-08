'use client';

import { Analytics } from './analytics';
import { ToastProvider } from './toast-provider';

export default function ClientComponents() {
  return (
    <>
      <Analytics />
      <ToastProvider />
    </>
  );
}

