// Rate limiting using Upstash Redis
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { env } from './env';

// Initialize Redis client if configured
const redis = env.upstashRedisUrl && env.upstashRedisToken
  ? new Redis({
      url: env.upstashRedisUrl,
      token: env.upstashRedisToken,
    })
  : null;

// Create rate limiters for different use cases
export const rateLimiters = {
  // General API rate limiter: 30 requests per 60 seconds
  api: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(30, '60 s'),
        analytics: true,
        prefix: '@upstash/ratelimit/api',
      })
    : null,

  // AI generation rate limiter: 10 requests per 60 seconds
  aiGeneration: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '60 s'),
        analytics: true,
        prefix: '@upstash/ratelimit/ai',
      })
    : null,

  // Free tier: 5 requests per 60 seconds
  free: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '60 s'),
        analytics: true,
        prefix: '@upstash/ratelimit/free',
      })
    : null,

  // Pro tier: 50 requests per 60 seconds
  pro: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(50, '60 s'),
        analytics: true,
        prefix: '@upstash/ratelimit/pro',
      })
    : null,

  // Premium tier: 200 requests per 60 seconds
  premium: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(200, '60 s'),
        analytics: true,
        prefix: '@upstash/ratelimit/premium',
      })
    : null,
};

// Helper function to check rate limit
export async function checkRateLimit(
  identifier: string,
  tier: 'free' | 'pro' | 'premium' = 'free'
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  // If Redis is not configured, allow all requests (for development)
  if (!redis) {
    return { success: true, limit: 999, remaining: 999, reset: Date.now() + 60000 };
  }

  const limiter = rateLimiters[tier] || rateLimiters.free;
  if (!limiter) {
    return { success: true, limit: 999, remaining: 999, reset: Date.now() + 60000 };
  }

  const result = await limiter.limit(identifier);
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}

