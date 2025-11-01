// Environment variable validation and configuration

export const env = {
  // OpenAI Configuration
  openaiApiKey: process.env.OPENAI_API_KEY || '',

  // Stripe Configuration
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',

  // Application Configuration
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  nodeEnv: process.env.NODE_ENV || 'development',

  // Analytics
  gaId: process.env.NEXT_PUBLIC_GA_ID || '',
};

// Validate required environment variables
export function validateEnv() {
  const errors: string[] = [];

  if (!env.openaiApiKey) {
    errors.push('OPENAI_API_KEY is required');
  }

  if (errors.length > 0 && env.nodeEnv === 'production') {
    console.error('Environment validation failed:');
    errors.forEach(error => console.error(`  - ${error}`));
    throw new Error('Missing required environment variables');
  }

  return errors;
}

// Check if a feature is enabled
export const features = {
  stripe: Boolean(env.stripeSecretKey && env.stripePublishableKey),
  analytics: Boolean(env.gaId),
};

