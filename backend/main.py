"""
AI Science Builder API
Main application entry point
"""
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from dotenv import load_dotenv
import os
import sys

# Add backend directory to path for imports
sys.path.insert(0, os.path.dirname(__file__))

# Import custom modules
from routes.projects import router as projects_router
from middleware.rate_limit import RateLimitMiddleware
from middleware.security import SecurityHeadersMiddleware
from utils.logger import setup_logger, app_logger
from utils.exceptions import AIServiceError, DatabaseError, ValidationError
from config import settings

load_dotenv()

logger = setup_logger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="AI Science Builder API",
    version="2.0.0",
    description="AI-powered science project builder with Google Gemini (FREE) and OpenAI GPT-4o mini, featuring comprehensive visualizations and PDF reports",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Security Headers Middleware (first, so it applies to all responses)
app.add_middleware(
    SecurityHeadersMiddleware,
    enable_hsts=not settings.DEBUG,  # Only enable HSTS in production
    enable_csp=True
)

# Rate Limiting Middleware
app.add_middleware(
    RateLimitMiddleware,
    requests_per_minute=60,
    requests_per_hour=1000,
    excluded_paths=["/health", "/", "/docs", "/redoc", "/openapi.json"]
)

# CORS middleware configuration
allowed_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost",
    "http://127.0.0.1:5173"
]

# Add production origins from environment
if os.getenv("FRONTEND_URL"):
    allowed_origins.append(os.getenv("FRONTEND_URL"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["X-RateLimit-Limit-Minute", "X-RateLimit-Remaining-Minute"]
)

# Exception Handlers
@app.exception_handler(AIServiceError)
async def ai_service_exception_handler(request: Request, exc: AIServiceError):
    """Handle AI service errors"""
    logger.error(f"AI Service Error: {exc.message}")
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content=exc.to_dict()
    )

@app.exception_handler(DatabaseError)
async def database_exception_handler(request: Request, exc: DatabaseError):
    """Handle database errors"""
    logger.error(f"Database Error: {exc.message}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=exc.to_dict()
    )

@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    """Handle validation errors"""
    logger.warning(f"Validation Error: {exc.message}")
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content=exc.to_dict()
    )

@app.exception_handler(RequestValidationError)
async def request_validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle Pydantic validation errors"""
    logger.warning(f"Request Validation Error: {exc}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "ValidationError",
            "message": "Invalid request parameters",
            "details": exc.errors()
        }
    )

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Handle HTTP exceptions"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": "HTTPException",
            "message": exc.detail
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions"""
    logger.error(f"Unexpected error: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "InternalServerError",
            "message": "An unexpected error occurred" if not settings.DEBUG else str(exc)
        }
    )

# Startup Event
@app.on_event("startup")
async def startup_event():
    """Run startup tasks"""
    logger.info("🚀 Starting AI Science Builder API v2.0.0")
    logger.info(f"Debug mode: {settings.DEBUG}")
    logger.info(f"Gemini configured: {bool(settings.GEMINI_API_KEY)}")
    logger.info(f"OpenAI configured: {bool(settings.OPENAI_API_KEY)}")
    logger.info(f"Supabase configured: {bool(settings.SUPABASE_URL)}")

# Shutdown Event
@app.on_event("shutdown")
async def shutdown_event():
    """Run shutdown tasks"""
    logger.info("🛑 Shutting down AI Science Builder API")
    # Clean up resources here if needed

# Include routers
app.include_router(projects_router)

from routes.chat import router as chat_router
app.include_router(chat_router)

# Root endpoint
@app.get("/", tags=["system"])
async def root():
    """Root endpoint with API information"""
    return {
        "name": "AI Science Builder API",
        "version": "2.0.0",
        "status": "running",
        "description": "AI-powered science project generator",
        "ai_services": {
            "gemini": bool(settings.GEMINI_API_KEY),
            "openai": bool(settings.OPENAI_API_KEY)
        },
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "idea": "/api/idea",
            "graph": "/api/graph",
            "report": "/api/report",
            "projects": "/api/projects",
            "cache_stats": "/api/cache/stats"
        }
    }

# Health check endpoint
@app.get("/health", tags=["system"])
async def health_check():
    """
    Health check endpoint for monitoring
    
    Returns service status and configuration info
    """
    from utils.cache import ai_response_cache, graph_cache
    
    return {
        "status": "healthy",
        "version": "2.0.0",
        "debug_mode": settings.DEBUG,
        "services": {
            "gemini_available": bool(settings.GEMINI_API_KEY),
            "openai_available": bool(settings.OPENAI_API_KEY),
            "database_available": bool(settings.SUPABASE_URL and settings.SUPABASE_KEY),
            "firebase_available": bool(settings.FIREBASE_CREDENTIALS_PATH)
        },
        "cache": {
            "ai_responses": ai_response_cache.stats(),
            "graphs": graph_cache.stats()
        }
    }

# Cache stats endpoint
@app.get("/api/cache/stats", tags=["monitoring"])
async def get_cache_stats():
    """Get cache statistics"""
    from utils.cache import ai_response_cache, graph_cache
    
    return {
        "ai_responses": ai_response_cache.stats(),
        "graphs": graph_cache.stats()
    }

# Cache clear endpoint (for admin/development)
@app.post("/api/cache/clear", tags=["monitoring"])
async def clear_cache():
    """Clear all caches (development only)"""
    if not settings.DEBUG:
        raise StarletteHTTPException(
            status_code=403,
            detail="Cache clearing only allowed in debug mode"
        )
    
    from utils.cache import ai_response_cache, graph_cache
    
    ai_response_cache.clear()
    graph_cache.clear()
    
    logger.info("All caches cleared")
    return {"message": "All caches cleared successfully"}

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting server with uvicorn...")
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info" if not settings.DEBUG else "debug"
    )

