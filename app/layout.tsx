import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Analytics } from "./components/analytics";
import { Footer } from "./components/footer";
import { LayoutWrapper } from "./components/layout-wrapper";
import { MobileSidebar } from "./components/mobile-sidebar";
import { SidebarWrapper } from "./components/sidebar-wrapper";
import "./globals.css";

// Optimize font loading for better LCP
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false, // Only preload primary font
  fallback: ['monospace'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    default: "Auto Inventor - AI-Powered Academic Tools for Students",
    template: "%s | Auto Inventor"
  },
  description: "Transform your academic journey with Auto Inventor's AI-powered tools. Generate essays, build projects, create resumes, summarize notes, and more - all powered by advanced AI technology.",
  keywords: ["AI tools", "essay writer", "resume maker", "study tools", "academic assistant", "student tools", "AI writing", "project builder", "quiz generator"],
  authors: [{ name: "Auto Inventor Team" }],
  creator: "Auto Inventor",
  publisher: "Auto Inventor",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Auto Inventor - AI-Powered Academic Tools",
    description: "Transform your academic journey with AI-powered tools for essays, resumes, projects, and more.",
    siteName: "Auto Inventor",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Auto Inventor - AI Academic Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Auto Inventor - AI-Powered Academic Tools",
    description: "Transform your academic journey with AI-powered tools for essays, resumes, projects, and more.",
    images: ["/og-image.png"],
    creator: "@autoinventor",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Critical resource hints for LCP optimization */}
        <link rel="preload" href="/fonts/geist-sans.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />

        {/* Critical CSS inline for faster rendering - optimized for LCP */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical above-the-fold styles */
            body {
              font-family: ${geistSans.style.fontFamily}, system-ui, sans-serif;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
              margin: 0;
              padding: 0;
              background: white;
            }
            .font-sans { font-family: ${geistSans.style.fontFamily}, system-ui, sans-serif; }
            .font-mono { font-family: ${geistMono.style.fontFamily}, monospace; }

            /* Critical layout styles */
            .navbar { position: fixed; top: 0; left: 0; right: 0; height: 4rem; background: rgba(255,255,255,0.8); backdrop-filter: blur(12px) saturate(180%); border-bottom: 1px solid rgba(0,0,0,0.06); z-index: 50; }
            .main-content { padding-top: 4rem !important; min-height: 100vh; background: white; }
            .sidebar { position: fixed; left: 0; top: 4rem; bottom: 0; width: 16rem; background: rgba(255,255,255,0.95); backdrop-filter: blur(12px); border-right: 1px solid rgba(0,0,0,0.06); padding: 1.5rem; overflow-y: auto; z-index: 40; }
            .content-area { margin-left: 16rem !important; padding: 4rem 1.5rem 2rem !important; }
            .full-width-content { margin-left: 0 !important; padding: 4rem 0 0 0 !important; }

            /* Hide sidebar on mobile */
            @media (max-width: 1023px) {
              .sidebar { display: none; }
              .content-area { margin-left: 0 !important; padding: 4rem 1.5rem 2rem !important; }
              .full-width-content { margin-left: 0 !important; padding: 4rem 0 0 0 !important; }
            }

            /* Critical text styles */
            h1 { font-size: clamp(2.5rem, 8vw, 9rem); font-weight: 900; line-height: 1; margin: 0; }
            .hero-text { font-size: clamp(1.25rem, 4vw, 3rem); line-height: 1.4; margin: 0; }
          `
        }} />

        {/* Service Worker Registration - Deferred for better TBT */}
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(registration) {
                    console.log('SW registered: ', registration);
                  })
                  .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                  });
              });
            }
          `
        }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Analytics />

        {/* Optimized navbar with critical styles */}
        <header className="navbar">
          <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto">
            {/* Left side - Mobile menu + Logo */}
            <div className="flex items-center gap-4">
              <MobileSidebar />
              <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                <span className="text-xl font-bold text-gray-900">Auto Inventor</span>
              </Link>
            </div>

            {/* Right side - Navigation */}
            <div className="flex items-center gap-4">
              <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors hidden sm:block">
                Pricing
              </Link>
              <Link href="/dashboard">
                <button className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                  Dashboard
                </button>
              </Link>
            </div>
          </div>
        </header>

        {/* Desktop Sidebar - Hidden on home page */}
        <SidebarWrapper />

        {/* Main Content */}
        <LayoutWrapper>
          {children}
          <Footer />
        </LayoutWrapper>
      </body>
    </html>
  );
}
