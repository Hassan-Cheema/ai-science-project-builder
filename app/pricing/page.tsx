'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Crown, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const PRICING_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: '',
    features: [
      '5 essays per month',
      '3 science projects per month',
      'Basic AI models',
      'Community support',
      'All 7 AI tools access',
      'Basic resume templates',
    ],
    limits: {
      essays: 5,
      projects: 3,
    },
    icon: Sparkles,
    gradient: 'from-gray-500 to-gray-600',
    popular: false,
  },
  pro: {
    name: 'Pro',
    price: 9.99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || '',
    features: [
      'Unlimited essays',
      'Unlimited science projects',
      'Advanced AI models (GPT-4)',
      'Priority support',
      'Export to PDF',
      'No watermarks',
      'All 7 AI tools access',
      'Premium resume templates',
    ],
    limits: {
      essays: -1,
      projects: -1,
    },
    icon: Zap,
    gradient: 'from-blue-500 to-purple-500',
    popular: true,
  },
  premium: {
    name: 'Premium',
    price: 19.99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID || '',
    features: [
      'Everything in Pro',
      'Early access to new tools',
      'Custom AI training',
      '1-on-1 support sessions',
      'API access',
      'Team collaboration (up to 5)',
      'Advanced analytics',
      'White-label options',
    ],
    limits: {
      essays: -1,
      projects: -1,
    },
    icon: Crown,
    gradient: 'from-purple-500 to-pink-500',
    popular: false,
  },
};

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: typeof PRICING_PLANS.pro) => {
    if (!plan.priceId) {
      alert('This plan is not yet configured. Please contact support.');
      return;
    }

    setIsLoading(plan.name.toLowerCase());

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: plan.priceId,
          planName: plan.name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error instanceof Error ? error.message : 'Failed to start checkout. Please try again.');
      setIsLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
          <Sparkles className="w-3 h-3 text-blue-500" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Choose Your Plan</span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Start free and upgrade as you grow. All plans include access to our 7 powerful AI tools.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Free Plan */}
        <Card className={`relative ${PRICING_PLANS.free.popular ? 'border-2 border-blue-500 shadow-lg' : ''}`}>
          <CardHeader className="text-center pb-8">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${PRICING_PLANS.free.gradient} flex items-center justify-center mx-auto mb-4`}>
              <PRICING_PLANS.free.icon className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {PRICING_PLANS.free.name}
            </CardTitle>
            <div className="mb-4">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">${PRICING_PLANS.free.price}</span>
              <span className="text-gray-600 dark:text-gray-400">/month</span>
            </div>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Perfect for getting started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-3">
              {PRICING_PLANS.free.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              variant="outline"
              className="w-full"
              size="lg"
              asChild
            >
              <Link href="/dashboard">Get Started Free</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className={`relative ${PRICING_PLANS.pro.popular ? 'border-2 border-blue-500 shadow-xl scale-105' : ''}`}>
          {PRICING_PLANS.pro.popular && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </span>
            </div>
          )}
          <CardHeader className="text-center pb-8">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${PRICING_PLANS.pro.gradient} flex items-center justify-center mx-auto mb-4`}>
              <PRICING_PLANS.pro.icon className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {PRICING_PLANS.pro.name}
            </CardTitle>
            <div className="mb-4">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">${PRICING_PLANS.pro.price}</span>
              <span className="text-gray-600 dark:text-gray-400">/month</span>
            </div>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              For serious students and professionals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-3">
              {PRICING_PLANS.pro.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              onClick={() => handleSubscribe(PRICING_PLANS.pro)}
              disabled={isLoading !== null || !PRICING_PLANS.pro.priceId}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              size="lg"
            >
              {isLoading === 'pro' ? 'Processing...' : 'Subscribe to Pro'}
            </Button>
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card className={`relative ${PRICING_PLANS.premium.popular ? 'border-2 border-blue-500 shadow-lg' : ''}`}>
          <CardHeader className="text-center pb-8">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${PRICING_PLANS.premium.gradient} flex items-center justify-center mx-auto mb-4`}>
              <PRICING_PLANS.premium.icon className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {PRICING_PLANS.premium.name}
            </CardTitle>
            <div className="mb-4">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">${PRICING_PLANS.premium.price}</span>
              <span className="text-gray-600 dark:text-gray-400">/month</span>
            </div>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              For teams and power users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-3">
              {PRICING_PLANS.premium.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              onClick={() => handleSubscribe(PRICING_PLANS.premium)}
              disabled={isLoading !== null || !PRICING_PLANS.premium.priceId}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              size="lg"
            >
              {isLoading === 'premium' ? 'Processing...' : 'Subscribe to Premium'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="mt-20 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Can I change plans later?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              What payment methods do you accept?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              We accept all major credit cards through Stripe. Your payment information is securely processed and never stored on our servers.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Is there a free trial?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Yes! Our Free plan is available forever with no credit card required. You can try all features before upgrading.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              What happens if I exceed my plan limits?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Free plan users will be prompted to upgrade when they reach their limits. Pro and Premium plans have unlimited access.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-16 text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-white">
        <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
        <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
          Our support team is here to help you choose the perfect plan for your needs.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button size="lg" variant="secondary" className="bg-white text-indigo-600 hover:bg-gray-100" asChild>
            <Link href="/dashboard">Try Free Plan</Link>
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
