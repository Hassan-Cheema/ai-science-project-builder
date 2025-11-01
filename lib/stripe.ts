import Stripe from 'stripe';

// Stripe configuration - only initialize if API key is present
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-09-30.clover',
      typescript: true,
    })
  : null;

export const PRICING_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: '', // No Stripe price ID for free tier
    features: [
      '5 essays per month',
      '3 science projects per month',
      'Basic AI models',
      'Community support',
    ],
    limits: {
      essays: 5,
      projects: 3,
    },
  },
  pro: {
    name: 'Pro',
    price: 9.99,
    priceId: process.env.STRIPE_PRO_PRICE_ID || '',
    features: [
      'Unlimited essays',
      'Unlimited science projects',
      'Advanced AI models (GPT-4)',
      'Priority support',
      'Export to PDF',
      'No watermarks',
    ],
    limits: {
      essays: -1, // -1 means unlimited
      projects: -1,
    },
  },
  premium: {
    name: 'Premium',
    price: 19.99,
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID || '',
    features: [
      'Everything in Pro',
      'Early access to new tools',
      'Custom AI training',
      '1-on-1 support sessions',
      'API access',
      'Team collaboration (up to 5)',
    ],
    limits: {
      essays: -1,
      projects: -1,
    },
  },
};
