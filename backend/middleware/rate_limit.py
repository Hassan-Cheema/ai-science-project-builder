"""
Rate limiting middleware for API endpoints
"""
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Dict, Optional
from datetime import datetime, timedelta
from collections import defaultdict
from threading import Lock
from utils.logger import setup_logger
from utils.exceptions import RateLimitError

logger = setup_logger(__name__)


class RateLimitEntry:
    """Track requests for a client"""
    
    def __init__(self, window_seconds: int = 60):
        self.requests = []
        self.window_seconds = window_seconds
    
    def add_request(self) -> None:
        """Add a new request timestamp"""
        self.requests.append(datetime.now())
        self._cleanup_old_requests()
    
    def _cleanup_old_requests(self) -> None:
        """Remove requests outside the time window"""
        cutoff = datetime.now() - timedelta(seconds=self.window_seconds)
        self.requests = [req for req in self.requests if req > cutoff]
    
    def get_request_count(self) -> int:
        """Get number of requests in current window"""
        self._cleanup_old_requests()
        return len(self.requests)
    
    def time_until_next_allowed(self) -> float:
        """Calculate seconds until next request is allowed"""
        if not self.requests:
            return 0
        
        self._cleanup_old_requests()
        oldest_request = min(self.requests)
        window_end = oldest_request + timedelta(seconds=self.window_seconds)
        remaining = (window_end - datetime.now()).total_seconds()
        
        return max(0, remaining)


class RateLimiter:
    """
    In-memory rate limiter
    
    Note: For production with multiple workers, use Redis-based rate limiting
    """
    
    def __init__(
        self,
        requests_per_minute: int = 60,
        requests_per_hour: int = 1000,
        window_seconds: int = 60
    ):
        self.requests_per_minute = requests_per_minute
        self.requests_per_hour = requests_per_hour
        self.window_seconds = window_seconds
        
        self._minute_limits: Dict[str, RateLimitEntry] = defaultdict(
            lambda: RateLimitEntry(60)
        )
        self._hour_limits: Dict[str, RateLimitEntry] = defaultdict(
            lambda: RateLimitEntry(3600)
        )
        self._lock = Lock()
    
    def _get_client_id(self, request: Request) -> str:
        """Get client identifier from request"""
        # Try to get client IP
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            return forwarded.split(",")[0].strip()
        
        client = request.client
        if client:
            return f"{client.host}:{client.port}"
        
        return "unknown"
    
    def check_rate_limit(self, client_id: str) -> tuple[bool, Optional[int]]:
        """
        Check if client has exceeded rate limits
        
        Returns:
            (is_allowed, retry_after_seconds)
        """
        with self._lock:
            # Check minute limit
            minute_entry = self._minute_limits[client_id]
            minute_count = minute_entry.get_request_count()
            
            if minute_count >= self.requests_per_minute:
                retry_after = int(minute_entry.time_until_next_allowed()) + 1
                logger.warning(
                    f"Rate limit exceeded (per minute) for client: {client_id} "
                    f"({minute_count}/{self.requests_per_minute})"
                )
                return False, retry_after
            
            # Check hour limit
            hour_entry = self._hour_limits[client_id]
            hour_count = hour_entry.get_request_count()
            
            if hour_count >= self.requests_per_hour:
                retry_after = int(hour_entry.time_until_next_allowed()) + 1
                logger.warning(
                    f"Rate limit exceeded (per hour) for client: {client_id} "
                    f"({hour_count}/{self.requests_per_hour})"
                )
                return False, retry_after
            
            # Record the request
            minute_entry.add_request()
            hour_entry.add_request()
            
            return True, None
    
    def get_stats(self, client_id: str) -> Dict[str, int]:
        """Get rate limit stats for a client"""
        with self._lock:
            return {
                "requests_per_minute": self._minute_limits[client_id].get_request_count(),
                "limit_per_minute": self.requests_per_minute,
                "requests_per_hour": self._hour_limits[client_id].get_request_count(),
                "limit_per_hour": self.requests_per_hour
            }


class RateLimitMiddleware(BaseHTTPMiddleware):
    """FastAPI middleware for rate limiting"""
    
    def __init__(
        self,
        app,
        requests_per_minute: int = 60,
        requests_per_hour: int = 1000,
        excluded_paths: Optional[list] = None
    ):
        super().__init__(app)
        self.rate_limiter = RateLimiter(requests_per_minute, requests_per_hour)
        self.excluded_paths = excluded_paths or ["/health", "/docs", "/redoc", "/openapi.json"]
    
    async def dispatch(self, request: Request, call_next):
        # Skip rate limiting for excluded paths
        if request.url.path in self.excluded_paths:
            return await call_next(request)
        
        # Get client ID
        client_id = self.rate_limiter._get_client_id(request)
        
        # Check rate limit
        is_allowed, retry_after = self.rate_limiter.check_rate_limit(client_id)
        
        if not is_allowed:
            raise HTTPException(
                status_code=429,
                detail=f"Rate limit exceeded. Try again in {retry_after} seconds.",
                headers={"Retry-After": str(retry_after)} if retry_after else {}
            )
        
        # Add rate limit headers to response
        response = await call_next(request)
        
        stats = self.rate_limiter.get_stats(client_id)
        response.headers["X-RateLimit-Limit-Minute"] = str(self.rate_limiter.requests_per_minute)
        response.headers["X-RateLimit-Remaining-Minute"] = str(
            max(0, self.rate_limiter.requests_per_minute - stats["requests_per_minute"])
        )
        response.headers["X-RateLimit-Limit-Hour"] = str(self.rate_limiter.requests_per_hour)
        response.headers["X-RateLimit-Remaining-Hour"] = str(
            max(0, self.rate_limiter.requests_per_hour - stats["requests_per_hour"])
        )
        
        return response

