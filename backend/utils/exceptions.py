"""
Custom exception classes for better error handling
"""
from typing import Optional, Any, Dict


class AIServiceError(Exception):
    """Base exception for AI service errors"""
    def __init__(
        self,
        message: str,
        service: str = "unknown",
        original_error: Optional[Exception] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        self.message = message
        self.service = service
        self.original_error = original_error
        self.details = details or {}
        super().__init__(self.message)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert exception to dictionary for API responses"""
        return {
            "error": self.__class__.__name__,
            "message": self.message,
            "service": self.service,
            "details": self.details
        }


class GeminiServiceError(AIServiceError):
    """Exception raised for Gemini API errors"""
    def __init__(self, message: str, original_error: Optional[Exception] = None, **kwargs):
        super().__init__(message, service="gemini", original_error=original_error, **kwargs)


class OpenAIServiceError(AIServiceError):
    """Exception raised for OpenAI API errors"""
    def __init__(self, message: str, original_error: Optional[Exception] = None, **kwargs):
        super().__init__(message, service="openai", original_error=original_error, **kwargs)


class DatabaseError(Exception):
    """Exception raised for database operations"""
    def __init__(
        self,
        message: str,
        operation: str = "unknown",
        table: Optional[str] = None,
        original_error: Optional[Exception] = None
    ):
        self.message = message
        self.operation = operation
        self.table = table
        self.original_error = original_error
        super().__init__(self.message)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "error": "DatabaseError",
            "message": self.message,
            "operation": self.operation,
            "table": self.table
        }


class ValidationError(Exception):
    """Exception raised for input validation errors"""
    def __init__(
        self,
        message: str,
        field: Optional[str] = None,
        value: Optional[Any] = None
    ):
        self.message = message
        self.field = field
        self.value = value
        super().__init__(self.message)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "error": "ValidationError",
            "message": self.message,
            "field": self.field
        }


class AuthenticationError(Exception):
    """Exception raised for authentication errors"""
    def __init__(self, message: str = "Authentication failed"):
        self.message = message
        super().__init__(self.message)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "error": "AuthenticationError",
            "message": self.message
        }


class RateLimitError(Exception):
    """Exception raised when rate limit is exceeded"""
    def __init__(
        self,
        message: str = "Rate limit exceeded",
        retry_after: Optional[int] = None
    ):
        self.message = message
        self.retry_after = retry_after
        super().__init__(self.message)
    
    def to_dict(self) -> Dict[str, Any]:
        result = {
            "error": "RateLimitError",
            "message": self.message
        }
        if self.retry_after:
            result["retry_after"] = self.retry_after
        return result

