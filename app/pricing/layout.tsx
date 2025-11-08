import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Choose the perfect plan for your academic needs. Free, Pro, and Premium plans available. Start free and upgrade as you grow.',
  openGraph: {
    title: 'Pricing | ScholarBar',
    description: 'Simple, transparent pricing for AI-powered academic tools. Free plan available forever.',
    url: '/pricing',
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
