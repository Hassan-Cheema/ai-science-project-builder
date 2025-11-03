// Caching utilities using Upstash Redis
import { Redis } from '@upstash/redis';
import { env } from './env';

// Initialize Redis client if configured
const redis = env.upstashRedisUrl && env.upstashRedisToken
  ? new Redis({
      url: env.upstashRedisUrl,
      token: env.upstashRedisToken,
    })
  : null;

// Cache options
interface CacheOptions {
  ttl?: number; // Time to live in seconds (default: 1 hour)
  tags?: string[]; // Cache tags for invalidation
}

// Get cached value
export async function getCache<T>(key: string): Promise<T | null> {
  if (!redis) return null;

  try {
    const value = await redis.get<T>(key);
    return value;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

// Set cached value
export async function setCache<T>(
  key: string,
  value: T,
  options: CacheOptions = {}
): Promise<boolean> {
  if (!redis) return false;

  try {
    const ttl = options.ttl || 3600; // Default 1 hour
    
    // Store value with TTL
    await redis.setex(key, ttl, value);
    
    // Store tags for invalidation (if provided)
    if (options.tags && options.tags.length > 0) {
      for (const tag of options.tags) {
        await redis.sadd(`cache:tag:${tag}`, key);
        await redis.expire(`cache:tag:${tag}`, ttl);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Cache set error:', error);
    return false;
  }
}

// Delete cached value
export async function deleteCache(key: string): Promise<boolean> {
  if (!redis) return false;

  try {
    await redis.del(key);
    return true;
  } catch (error) {
    console.error('Cache delete error:', error);
    return false;
  }
}

// Invalidate cache by tag
export async function invalidateCacheByTag(tag: string): Promise<number> {
  if (!redis) return 0;

  try {
    const keys = await redis.smembers<string[]>(`cache:tag:${tag}`);
    if (keys.length === 0) return 0;

    // Delete all keys with this tag
    await redis.del(...keys);
    await redis.del(`cache:tag:${tag}`);
    
    return keys.length;
  } catch (error) {
    console.error('Cache invalidation error:', error);
    return 0;
  }
}

// Generate cache key from parameters
export function generateCacheKey(prefix: string, params: Record<string, unknown>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}:${JSON.stringify(params[key])}`)
    .join('|');
  
  // Use TextEncoder for edge runtime compatibility (Buffer is also available in edge)
  try {
    // Try using Buffer (available in Next.js edge runtime)
    return `cache:${prefix}:${Buffer.from(sortedParams).toString('base64url')}`;
  } catch {
    // Fallback for environments without Buffer
    const encoder = new TextEncoder();
    const data = encoder.encode(sortedParams);
    return `cache:${prefix}:${btoa(String.fromCharCode(...data)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')}`;
  }
}

