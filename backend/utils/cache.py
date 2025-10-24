"""
Simple in-memory caching for AI responses to reduce API costs
"""
import hashlib
import json
from datetime import datetime, timedelta
from typing import Any, Optional, Dict
from threading import Lock
from utils.logger import setup_logger

logger = setup_logger(__name__)


class CacheEntry:
    """Represents a single cache entry with expiration"""
    
    def __init__(self, value: Any, ttl_seconds: int = 3600):
        self.value = value
        self.created_at = datetime.now()
        self.expires_at = self.created_at + timedelta(seconds=ttl_seconds)
    
    def is_expired(self) -> bool:
        """Check if cache entry has expired"""
        return datetime.now() > self.expires_at
    
    def age_seconds(self) -> float:
        """Get age of cache entry in seconds"""
        return (datetime.now() - self.created_at).total_seconds()


class SimpleCache:
    """
    Thread-safe in-memory cache with TTL support
    
    Note: This is a simple implementation. For production with multiple workers,
    consider using Redis or Memcached.
    """
    
    def __init__(self, default_ttl: int = 3600, max_size: int = 1000):
        """
        Initialize cache
        
        Args:
            default_ttl: Default time-to-live in seconds (default: 1 hour)
            max_size: Maximum number of cache entries (default: 1000)
        """
        self._cache: Dict[str, CacheEntry] = {}
        self._lock = Lock()
        self.default_ttl = default_ttl
        self.max_size = max_size
        self._hits = 0
        self._misses = 0
    
    def _generate_key(self, *args, **kwargs) -> str:
        """Generate a hash key from arguments"""
        # Create a deterministic string from args and kwargs
        key_data = {
            'args': args,
            'kwargs': sorted(kwargs.items())
        }
        key_str = json.dumps(key_data, sort_keys=True)
        return hashlib.sha256(key_str.encode()).hexdigest()
    
    def get(self, key: str) -> Optional[Any]:
        """
        Get value from cache
        
        Args:
            key: Cache key
        
        Returns:
            Cached value or None if not found/expired
        """
        with self._lock:
            entry = self._cache.get(key)
            
            if entry is None:
                self._misses += 1
                return None
            
            if entry.is_expired():
                del self._cache[key]
                self._misses += 1
                logger.debug(f"Cache expired for key: {key[:16]}...")
                return None
            
            self._hits += 1
            logger.debug(f"Cache hit for key: {key[:16]}... (age: {entry.age_seconds():.1f}s)")
            return entry.value
    
    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        """
        Set value in cache
        
        Args:
            key: Cache key
            value: Value to cache
            ttl: Time-to-live in seconds (uses default if not specified)
        """
        with self._lock:
            # Enforce max size by removing oldest entries
            if len(self._cache) >= self.max_size:
                self._evict_oldest()
            
            ttl = ttl or self.default_ttl
            self._cache[key] = CacheEntry(value, ttl)
            logger.debug(f"Cached value for key: {key[:16]}... (ttl: {ttl}s)")
    
    def _evict_oldest(self) -> None:
        """Evict oldest cache entry"""
        if not self._cache:
            return
        
        oldest_key = min(self._cache.keys(), key=lambda k: self._cache[k].created_at)
        del self._cache[oldest_key]
        logger.debug(f"Evicted oldest cache entry: {oldest_key[:16]}...")
    
    def clear(self) -> None:
        """Clear all cache entries"""
        with self._lock:
            count = len(self._cache)
            self._cache.clear()
            logger.info(f"Cleared {count} cache entries")
    
    def stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        with self._lock:
            total_requests = self._hits + self._misses
            hit_rate = (self._hits / total_requests * 100) if total_requests > 0 else 0
            
            return {
                "size": len(self._cache),
                "max_size": self.max_size,
                "hits": self._hits,
                "misses": self._misses,
                "hit_rate": f"{hit_rate:.1f}%",
                "total_requests": total_requests
            }
    
    def cleanup_expired(self) -> int:
        """Remove all expired entries and return count"""
        with self._lock:
            expired_keys = [
                key for key, entry in self._cache.items()
                if entry.is_expired()
            ]
            
            for key in expired_keys:
                del self._cache[key]
            
            if expired_keys:
                logger.info(f"Cleaned up {len(expired_keys)} expired cache entries")
            
            return len(expired_keys)


# Global cache instances
ai_response_cache = SimpleCache(default_ttl=3600, max_size=500)  # 1 hour TTL for AI responses
graph_cache = SimpleCache(default_ttl=7200, max_size=200)  # 2 hour TTL for graphs


def cache_ai_response(func):
    """
    Decorator to cache AI service responses
    
    Usage:
        @cache_ai_response
        async def generate_project_idea(topic: str) -> dict:
            ...
    """
    async def wrapper(*args, **kwargs):
        # Generate cache key from arguments
        cache_key = ai_response_cache._generate_key(*args, **kwargs)
        
        # Try to get from cache
        cached_result = ai_response_cache.get(cache_key)
        if cached_result is not None:
            logger.info(f"Returning cached AI response for: {args}")
            return cached_result
        
        # Call the actual function
        result = await func(*args, **kwargs)
        
        # Cache the result
        ai_response_cache.set(cache_key, result)
        
        return result
    
    return wrapper

