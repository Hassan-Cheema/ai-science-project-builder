import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://auto-inventor.com';

  const routes = [
    '',
    '/dashboard',
    '/tools/essay-helper',
    '/tools/essay-writer',
    '/tools/essay-outliner',
    '/tools/project-builder',
    '/tools/resume-maker',
    '/tools/notes-summarizer',
    '/tools/quiz-generator',
    '/tools/idea-generator',
    '/about',
    '/pricing',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly' as const,
    priority: route === '' ? 1.0 : route === '/dashboard' ? 0.9 : 0.8,
  }));
}
