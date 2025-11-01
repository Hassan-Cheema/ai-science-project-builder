"""
Centralized logging configuration for the AI Science Builder backend
"""
import logging
import sys
from typing import Optional
from datetime import datetime
from config import settings

class ColoredFormatter(logging.Formatter):
    """Custom formatter with colors for different log levels"""
    
    COLORS = {
        'DEBUG': '\033[36m',      # Cyan
        'INFO': '\033[32m',       # Green
        'WARNING': '\033[33m',    # Yellow
        'ERROR': '\033[31m',      # Red
        'CRITICAL': '\033[35m',   # Magenta
        'RESET': '\033[0m'        # Reset
    }
    
    def format(self, record):
        log_color = self.COLORS.get(record.levelname, self.COLORS['RESET'])
        reset = self.COLORS['RESET']
        
        # Format: [TIME] LEVEL - MODULE - MESSAGE
        formatted_time = datetime.fromtimestamp(record.created).strftime('%Y-%m-%d %H:%M:%S')
        formatted_msg = f"[{formatted_time}] {log_color}{record.levelname:8}{reset} - {record.name} - {record.getMessage()}"
        
        if record.exc_info:
            formatted_msg += f"\n{self.formatException(record.exc_info)}"
        
        return formatted_msg


def setup_logger(name: str, level: Optional[int] = None) -> logging.Logger:
    """
    Setup and configure a logger with consistent formatting
    
    Args:
        name: Logger name (usually __name__)
        level: Logging level (defaults to DEBUG if settings.DEBUG else INFO)
    
    Returns:
        Configured logger instance
    """
    logger = logging.getLogger(name)
    
    # Set level based on DEBUG setting if not specified
    if level is None:
        level = logging.DEBUG if settings.DEBUG else logging.INFO
    logger.setLevel(level)
    
    # Remove existing handlers to avoid duplicates
    logger.handlers.clear()
    
    # Console handler with colored output
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(ColoredFormatter())
    logger.addHandler(console_handler)
    
    # Prevent propagation to root logger
    logger.propagate = False
    
    return logger


# Create default application logger
app_logger = setup_logger("ai_science_builder")

