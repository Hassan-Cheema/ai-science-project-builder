'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out Auto Inventor',
    features: [
      '5 essays per month',
      '3 science projects per month',
      'Basic AI models',
      'Community support',
    ],
    priceId: null,
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: 'per month',
    description: 'Best for students and individuals',
    features: [
      'Unlimited essays',
      'Unlimited science projects',
      'Advanced AI models (GPT-4)',
      'Priority support',
      'Export to PDF',
      'No watermarks',
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    highlighted: true,
  },
  {
    name: 'Premium',
    price: '$19.99',
    period: 'per month',
    description: 'For power users and teams',
    features: [
      'Everything in Pro',
      'Early access to new tools',
      'Custom AI training',
      '1-on-1 support sessions',
      'API access',
      'Team collaboration (up to 5)',
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID,
    highlighted: false,
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string | null, planName: string) => {
    if (!priceId) {
      // Free plan - no checkout needed
      alert('You are already on the free plan!');
      return;
    }

    setLoading(planName);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          planName,
        }),
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
        setLoading(null);
        return;
      }

      // Redirect to Stripe Checkout URL directly
      if (data.sessionId) {
        window.location.href = `https://checkout.stripe.com/pay/${data.sessionId}`;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
      setLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          Simple Pricing
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose the plan that works for you
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {plans.map((plan) => (
          <div key={plan.name} className="relative">
            {plan.highlighted && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold px-4 py-1 rounded-full shadow-lg">
                  Most Popular
                </span>
              </div>
            )}

            <Card className={`h-full ${plan.highlighted ? 'border-2 border-blue-600 shadow-xl' : ''}`}>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <div className="mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
                <CardDescription className="text-base">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                      : ''
                  }`}
                  variant={plan.highlighted ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => handleSubscribe(plan.priceId || null, plan.name)}
                  disabled={loading === plan.name}
                >
                  {loading === plan.name ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </>
                  ) : plan.priceId ? (
                    'Subscribe Now'
                  ) : (
                    'Current Plan'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Frequently Asked Questions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">Can I cancel anytime?</h3>
            <p className="text-gray-600">
              Yes! You can cancel your subscription at any time. You'll retain access until the end of your billing period.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Do you offer refunds?</h3>
            <p className="text-gray-600">
              We offer a 7-day money-back guarantee. If you're not satisfied, contact us for a full refund.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Can I upgrade later?</h3>
            <p className="text-gray-600">
              Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
            <p className="text-gray-600">
              We accept all major credit cards (Visa, Mastercard, Amex) and debit cards through Stripe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
