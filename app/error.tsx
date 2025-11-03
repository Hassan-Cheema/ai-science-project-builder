'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-4xl font-black text-gray-900 mb-4">Something Went Wrong</h1>
        <p className="text-xl text-gray-600 mb-8">
          We encountered an unexpected error. Don&apos;t worry, we&apos;re working on it.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-8 text-left">
            <p className="text-sm font-mono text-red-900 break-all">
              {error.message}
            </p>
          </div>
        )}
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={reset}
            className="bg-gray-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
          <Link href="/dashboard">
            <button className="border-2 border-gray-900 text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Go to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

