// Environment variable validation and configuration
import { z } from 'zod';

// Environment schema for validation
const envSchema = z.object({
  // OpenAI Configuration (optional - deprecated, using Gemini instead)
  OPENAI_API_KEY: z.string().optional(),

  // Stripe Configuration
  STRIPE_SECRET_KEY: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),

  // Supabase Configuration (for database and vector storage)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // Upstash Redis Configuration (for caching and rate limiting)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Application Configuration
  NEXT_PUBLIC_BASE_URL: z.string().url().default('http://localhost:3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Analytics & Monitoring
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  SENTRY_DSN: z.string().url().optional(),

  // Feature Flags
  ENABLE_VECTOR_SEARCH: z.string().transform(val => val === 'true').default('false'),
  ENABLE_IMAGE_GENERATION: z.string().transform(val => val === 'true').default('false'),
  ENABLE_CODE_GENERATION: z.string().transform(val => val === 'true').default('true'),

  // Google Cloud / Gemini Configuration
  GOOGLE_CLOUD_PROJECT_ID: z.string().optional(),
  GOOGLE_APPLICATION_CREDENTIALS: z.string().optional(),
  GOOGLE_CLOUD_STORAGE_BUCKET: z.string().optional(),
  GOOGLE_GEMINI_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  GOOGLE_TRANSLATE_API_KEY: z.string().optional(),
  GOOGLE_CLOUD_REGION: z.string().optional(),
  GOOGLE_GENAI_USE_VERTEXAI: z.string().optional(),
});

// Parse and validate environment variables
function getEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment variable validation failed:');
      error.errors.forEach(err => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });

      if (process.env.NODE_ENV === 'production') {
        throw new Error('Missing required environment variables');
      }
    }
    throw error;
  }
}

export const env = {
  // OpenAI Configuration
  openaiApiKey: process.env.OPENAI_API_KEY || '',

  // Stripe Configuration
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',

  // Supabase Configuration
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',

  // Upstash Redis Configuration
  upstashRedisUrl: process.env.UPSTASH_REDIS_REST_URL || '',
  upstashRedisToken: process.env.UPSTASH_REDIS_REST_TOKEN || '',

  // Application Configuration
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  nodeEnv: process.env.NODE_ENV || 'development',

  // Analytics & Monitoring
  gaId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
  sentryDsn: process.env.SENTRY_DSN || '',

  // Feature Flags
  enableVectorSearch: process.env.ENABLE_VECTOR_SEARCH === 'true',
  enableImageGeneration: process.env.ENABLE_IMAGE_GENERATION === 'true',
  enableCodeGeneration: process.env.ENABLE_CODE_GENERATION !== 'false',

  // Google Cloud Configuration
  googleCloudProjectId: process.env.GOOGLE_CLOUD_PROJECT_ID || '',
  googleApplicationCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS || '',
  googleCloudStorageBucket: process.env.GOOGLE_CLOUD_STORAGE_BUCKET || '',
  googleGeminiApiKey: process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  googleTranslateApiKey: process.env.GOOGLE_TRANSLATE_API_KEY || '',
  googleCloudRegion: process.env.GOOGLE_CLOUD_REGION || 'us-central1',
  googleGenaiUseVertexAi: (process.env.GOOGLE_GENAI_USE_VERTEXAI || '').toLowerCase() === 'true',
};

// Validate required environment variables
export function validateEnv() {
  const errors: string[] = [];

  if (!env.googleGeminiApiKey) {
    errors.push('GOOGLE_GEMINI_API_KEY or GEMINI_API_KEY is required');
  }

  if (env.googleGenaiUseVertexAi && !env.googleCloudProjectId) {
    errors.push('GOOGLE_CLOUD_PROJECT_ID is required when GOOGLE_GENAI_USE_VERTEXAI is true');
  }

  if (errors.length > 0 && env.nodeEnv === 'production') {
    console.error('❌ Environment validation failed:');
    errors.forEach(error => console.error(`  - ${error}`));
    throw new Error('Missing required environment variables');
  }

  return errors;
}

// Check if a feature is enabled
export const features = {
  stripe: Boolean(env.stripeSecretKey && env.stripePublishableKey),
  analytics: Boolean(env.gaId),
  supabase: Boolean(env.supabaseUrl && env.supabaseAnonKey),
  redis: Boolean(env.upstashRedisUrl && env.upstashRedisToken),
  vectorSearch: env.enableVectorSearch,
  imageGeneration: env.enableImageGeneration,
  codeGeneration: env.enableCodeGeneration,
  monitoring: Boolean(env.sentryDsn),
  googleCloud: Boolean(env.googleCloudProjectId || env.googleGeminiApiKey),
  googleGemini: Boolean(env.googleGeminiApiKey),
  googleStorage: Boolean(env.googleCloudStorageBucket),
  googleFirestore: Boolean(env.googleCloudProjectId),
  vertexEnabled: env.googleGenaiUseVertexAi,
};

// Export validated env (for use in runtime)
// Lazy initialization to avoid module-level errors
export function getValidatedEnv() {
  return getEnv();
}
