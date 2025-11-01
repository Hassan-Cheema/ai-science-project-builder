"""
Security middleware for adding security headers
"""
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Optional


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Adds security headers to all responses
    """
    
    def __init__(
        self,
        app,
        enable_hsts: bool = True,
        enable_csp: bool = True,
        csp_directives: Optional[str] = None
    ):
        super().__init__(app)
        self.enable_hsts = enable_hsts
        self.enable_csp = enable_csp
        self.csp_directives = csp_directives or (
            "default-src 'self'; "
            "img-src 'self' data: https:; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
            "style-src 'self' 'unsafe-inline'; "
            "font-src 'self' data:; "
            "connect-src 'self' https://firebasestorage.googleapis.com https://identitytoolkit.googleapis.com;"
        )
    
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # X-Content-Type-Options: Prevent MIME type sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"
        
        # X-Frame-Options: Prevent clickjacking
        response.headers["X-Frame-Options"] = "DENY"
        
        # X-XSS-Protection: Enable browser XSS protection
        response.headers["X-XSS-Protection"] = "1; mode=block"
        
        # Referrer-Policy: Control referrer information
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        
        # Permissions-Policy: Control browser features
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        
        # HSTS: Force HTTPS (only enable in production with HTTPS)
        if self.enable_hsts:
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        
        # Content-Security-Policy: Prevent XSS and other injection attacks
        if self.enable_csp:
            response.headers["Content-Security-Policy"] = self.csp_directives
        
        return response

