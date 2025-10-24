"""
AI Service - Unified interface for AI providers (Gemini + OpenAI)
"""
from typing import Optional
from openai import AsyncOpenAI
from config import settings
import json
from utils.logger import setup_logger
from utils.exceptions import AIServiceError, GeminiServiceError, OpenAIServiceError
from utils.cache import cache_ai_response

logger = setup_logger(__name__)

# Initialize OpenAI client
client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None

# Try to import Gemini service
try:
    from .gemini_service import gemini_service
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    logger.warning("Gemini service not available")

@cache_ai_response
async def generate_project_idea(topic: Optional[str] = None, grade: str = "8") -> dict:
    """
    Generate a science project idea and hypothesis using AI (Gemini or OpenAI)
    
    Args:
        topic: Optional topic for the project
        grade: Grade level (default: "8")
    
    Returns:
        Dictionary with title, idea, and hypothesis
    
    Raises:
        AIServiceError: If all AI services fail
    """
    logger.info(f"Generating project idea for topic: {topic}, grade: {grade}")
    
    # Try Gemini first (free), fallback to OpenAI
    if GEMINI_AVAILABLE and settings.GEMINI_API_KEY and gemini_service.available:
        try:
            logger.info("Attempting Gemini AI generation...")
            result = await gemini_service.generate_project_idea(topic or "general science", grade)
            logger.info(f"✅ Gemini generation successful: {result.get('title', 'No title')[:50]}")
            return result
        except Exception as e:
            logger.warning(f"⚠️ Gemini failed: {str(e)}, trying OpenAI fallback")
    
    # Fallback to OpenAI
    if not client:
        error_msg = "No AI service configured (neither Gemini nor OpenAI)"
        logger.error(error_msg)
        raise AIServiceError(error_msg)
    
    prompt = f"""Generate a creative and feasible science project idea.
{'Topic: ' + topic if topic else 'Choose any interesting scientific topic.'}
Grade Level: {grade}

Provide:
1. A catchy project title
2. A detailed project idea (2-3 paragraphs)
3. A testable hypothesis

Format your response as JSON with keys: title, idea, hypothesis"""

    try:
        logger.info("Attempting OpenAI generation...")
        response = await client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": "You are a creative science educator who helps students design interesting and feasible science projects."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.8,
            response_format={"type": "json_object"}
        )
        
        result = json.loads(response.choices[0].message.content)
        logger.info(f"✅ OpenAI generation successful: {result.get('title', 'No title')[:50]}")
        return result
    
    except Exception as e:
        logger.error(f"❌ OpenAI generation failed: {str(e)}")
        raise OpenAIServiceError(f"Failed to generate project idea: {str(e)}", original_error=e)

async def generate_chat_response(
    message: str,
    context: Optional[str] = None,
    history: Optional[list] = None
) -> str:
    """
    Generate AI mentor chat response for educational explanations
    
    Args:
        message: User's question or message
        context: Optional project context
        history: Optional conversation history
    
    Returns:
        AI-generated educational response
    
    Raises:
        AIServiceError: If all AI services fail
    """
    logger.info(f"Generating chat response for: {message[:50]}...")
    
    # Build conversation context
    system_prompt = """You are an enthusiastic science education mentor. Your role is to:
- Explain scientific concepts in simple, age-appropriate terms
- Encourage curiosity and scientific thinking
- Provide practical examples and demonstrations
- Help students understand the "why" behind science
- Make science fun and accessible

Always be encouraging, clear, and patient. Use analogies and real-world examples."""
    
    user_prompt = message
    if context:
        user_prompt = f"Project Context: {context}\n\nQuestion: {message}"
    
    # Try Gemini first
    if GEMINI_AVAILABLE and settings.GEMINI_API_KEY and gemini_service.available:
        try:
            logger.info("Attempting Gemini chat response...")
            
            # Use Gemini's generate_content for chat
            full_prompt = f"{system_prompt}\n\n{user_prompt}"
            response = gemini_service.model.generate_content(full_prompt)
            
            result = response.text.strip()
            logger.info("✅ Gemini chat response successful")
            return result
        except Exception as e:
            logger.warning(f"⚠️ Gemini failed: {str(e)}, trying OpenAI fallback")
    
    # Fallback to OpenAI
    if not client:
        error_msg = "No AI service configured (neither Gemini nor OpenAI)"
        logger.error(error_msg)
        raise AIServiceError(error_msg)
    
    try:
        logger.info("Attempting OpenAI chat response...")
        
        messages = [{"role": "system", "content": system_prompt}]
        
        # Add history if provided
        if history:
            for msg in history[-5:]:  # Last 5 messages for context
                messages.append({
                    "role": msg.get("role", "user"),
                    "content": msg.get("content", "")
                })
        
        messages.append({"role": "user", "content": user_prompt})
        
        response = await client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=messages,
            temperature=0.7,
            max_tokens=500
        )
        
        result = response.choices[0].message.content
        logger.info("✅ OpenAI chat response successful")
        return result
    
    except Exception as e:
        logger.error(f"❌ OpenAI chat failed: {str(e)}")
        raise OpenAIServiceError(f"Failed to generate chat response: {str(e)}", original_error=e)


async def generate_report_content(idea: str, hypothesis: str, graph_description: str) -> str:
    """
    Generate a comprehensive markdown report combining idea, hypothesis, and graph analysis
    
    Args:
        idea: The project idea
        hypothesis: The hypothesis
        graph_description: Description of the graph/data
    
    Returns:
        Markdown formatted report
    
    Raises:
        AIServiceError: If all AI services fail
    """
    logger.info("Generating comprehensive report...")
    
    # Try Gemini first (free), fallback to OpenAI
    if GEMINI_AVAILABLE and settings.GEMINI_API_KEY and gemini_service.available:
        try:
            logger.info("Attempting Gemini report generation...")
            result = await gemini_service.generate_report(idea, hypothesis, graph_description)
            logger.info("✅ Gemini report generation successful")
            return result
        except Exception as e:
            logger.warning(f"⚠️ Gemini failed: {str(e)}, trying OpenAI fallback")
    
    # Fallback to OpenAI
    if not client:
        error_msg = "No AI service configured (neither Gemini nor OpenAI)"
        logger.error(error_msg)
        raise AIServiceError(error_msg)
    
    prompt = f"""Create a comprehensive science project report in markdown format.

Project Idea: {idea}

Hypothesis: {hypothesis}

Graph Data Description: {graph_description}

Include the following sections:
1. Executive Summary
2. Introduction
3. Hypothesis
4. Methodology
5. Data Analysis (reference the graph)
6. Expected Results
7. Conclusion
8. Future Work

Make it professional and detailed."""

    try:
        logger.info("Attempting OpenAI report generation...")
        response = await client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": "You are a professional scientific writer who creates detailed, well-structured research reports."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        
        result = response.choices[0].message.content
        logger.info("✅ OpenAI report generation successful")
        return result
    
    except Exception as e:
        logger.error(f"❌ OpenAI report generation failed: {str(e)}")
        raise OpenAIServiceError(f"Failed to generate report: {str(e)}", original_error=e)

