import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://scholarbar.com';

  const routes = [
    '',
    '/dashboard',
    '/pricing',
    '/tools/essay-helper',
    '/tools/essay-outliner',
    '/tools/project-builder',
    '/tools/resume-maker',
    '/tools/notes-summarizer',
    '/tools/quiz-generator',
    '/tools/idea-generator',
    '/tools/paraphraser',
    '/about',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly' as const,
    priority: route === '' ? 1.0 : route === '/dashboard' ? 0.9 : 0.8,
  }));
}
