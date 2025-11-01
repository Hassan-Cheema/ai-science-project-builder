# 🎨 Branding Setup Guide for Auto Inventor

This guide will help you complete the branding setup for Auto Inventor.

## 📌 1. Favicon & Logo Setup

### Option A: Quick Emoji Favicon (Fastest)

Create a simple text-based favicon:

1. Go to https://favicon.io/favicon-generator/
2. Use these settings:
   - Text: "AI" or "🧠"
   - Background: Rounded
   - Font: Bold
   - Color: #4F46E5 (Indigo)
   - Background Color: White

3. Download and extract the files
4. Copy these files to your `/public` folder:
   - `favicon.ico`
   - `apple-touch-icon.png`
   - `favicon-16x16.png`
   - `favicon-32x32.png`

### Option B: Custom Logo (Recommended)

Use Canva or Figma to create a professional logo:

**Logo Specs:**
- Size: 512x512px
- Format: PNG with transparent background
- Design: Brain icon, gear icon, or "AI" text
- Colors: Indigo (#4F46E5), Purple (#9333EA), Pink (#EC4899)

**Files Needed:**
1. `logo.png` (512x512) - Main logo
2. `logo-white.png` - White version for dark backgrounds
3. `favicon.ico` - 32x32 favicon
4. `apple-touch-icon.png` - 180x180 for iOS
5. `og-image.png` - 1200x630 for social sharing

**Social Media Image (`og-image.png`):**
- Size: 1200x630px
- Include: Auto Inventor logo + tagline
- Text: "AI-Powered Academic Tools for Students"
- Background: Gradient (Indigo to Purple)

## 📊 2. Analytics Setup

### Google Analytics (Recommended)

1. **Create GA4 Property:**
   - Go to https://analytics.google.com
   - Create account → Create property
   - Property name: "Auto Inventor"
   - Select your timezone and currency
   - Choose "Web" platform

2. **Get Measurement ID:**
   - After setup, you'll get a Measurement ID like `G-XXXXXXXXXX`
   - Copy this ID

3. **Add to Auto Inventor:**

Create `app/components/analytics.tsx`:

```typescript
'use client';

import Script from 'next/script';

export function Analytics() {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
```

4. **Add to `.env.local`:**
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

5. **Import in `app/layout.tsx`:**
```typescript
import { Analytics } from './components/analytics';

// In the <body> tag:
<body>
  <Analytics />
  {/* rest of your content */}
</body>
```

### Plausible Analytics (Privacy-Focused Alternative)

1. **Sign up:** https://plausible.io
2. **Add your domain:** autoinventor.com
3. **Add script to `app/layout.tsx`:**

```typescript
import Script from 'next/script';

// In the <head> section (add to layout):
<Script
  defer
  data-domain="autoinventor.com"
  src="https://plausible.io/js/script.js"
  strategy="afterInteractive"
/>
```

### Umami Analytics (Self-Hosted)

1. Deploy Umami: https://umami.is/docs/install
2. Get your tracking code
3. Add to layout similar to Plausible

## 🔍 3. SEO Verification

### Google Search Console

1. Go to https://search.google.com/search-console
2. Add property: autoinventor.com
3. Verify ownership (DNS or HTML file)
4. Submit sitemap: autoinventor.com/sitemap.xml

### Create Sitemap

Create `app/sitemap.ts`:

```typescript
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://autoinventor.com';
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tools/essay-writer`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/project-builder`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/resume-maker`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];
}
```

### Create Robots.txt

Create `app/robots.ts`:

```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: 'https://autoinventor.com/sitemap.xml',
  };
}
```

## 🚀 4. Performance Optimization

### Enable Next.js Image Optimization

Already done! Next.js Image component automatically optimizes images.

### Add Loading States

All tools already have loading spinners ✓

### Enable Caching

Add to `next.config.ts`:

```typescript
const nextConfig = {
  reactCompiler: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on'
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN'
        },
      ],
    },
  ],
};

export default nextConfig;
```

## ✅ Completion Checklist

- [ ] Add favicon files to `/public`
- [ ] Create logo and social sharing image
- [ ] Set up Google Analytics
- [ ] Add Analytics component to layout
- [ ] Verify meta tags are working (use https://metatags.io)
- [ ] Create and submit sitemap
- [ ] Test on mobile devices
- [ ] Check page speed (https://pagespeed.web.dev)
- [ ] Verify OG images on social media (https://www.opengraph.xyz)

## 📈 Tracking Events (Optional)

Track specific actions in your tools:

```typescript
// Track essay generation
gtag('event', 'essay_generated', {
  'topic': topic,
  'word_count': wordCount,
});

// Track tool usage
gtag('event', 'tool_used', {
  'tool_name': 'Essay Writer',
});
```

---

**Need Help?**
- Favicon Generator: https://favicon.io
- Meta Tag Tester: https://metatags.io
- OG Image Tester: https://www.opengraph.xyz
- Google Analytics: https://analytics.google.com


