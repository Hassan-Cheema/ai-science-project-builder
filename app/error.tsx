'use client';

import Link from 'next/link';
import { useEffect } from 'react';

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
    <div className="min-h-[80vh] flex items-center justify-center px-4" role="alert">
      <div className="text-center max-w-2xl">
        <div className="text-6xl mb-6 animate-pulse">⚠️</div>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Something Went Wrong</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          We encountered an unexpected error. Don&apos;t worry, we&apos;re working on it.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-4 mb-8 text-left">
            <p className="text-sm font-mono text-red-900 dark:text-red-200 break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-700 dark:text-red-300 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={reset}
            className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            aria-label="Try again"
          >
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="border-2 border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 inline-block text-center"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
