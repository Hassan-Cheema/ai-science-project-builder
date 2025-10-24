"""
AI Mentor Chat routes - Interactive Q&A and concept explanations
"""
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

from services.ai_service import generate_chat_response
from utils.logger import setup_logger
from utils.validators import validate_topic
from utils.exceptions import AIServiceError, ValidationError

logger = setup_logger(__name__)

router = APIRouter(prefix="/api/chat", tags=["ai-mentor"])


class ChatMessage(BaseModel):
    """Chat message model"""
    role: str  # 'user' or 'assistant'
    content: str
    timestamp: Optional[datetime] = None


class ChatRequest(BaseModel):
    """Chat request model"""
    message: str
    context: Optional[str] = None  # Project context for better answers
    history: Optional[List[ChatMessage]] = []


class ChatResponse(BaseModel):
    """Chat response model"""
    message: str
    timestamp: datetime
    suggestions: Optional[List[str]] = []


@router.post("/message", response_model=ChatResponse)
async def send_chat_message(request: ChatRequest):
    """
    Send a message to the AI Mentor and get an explanation
    
    - **message**: User's question or topic to explain
    - **context**: Optional project context for better answers
    - **history**: Previous conversation history
    
    Returns an educational explanation in simple terms
    """
    try:
        # Validate message
        if not request.message or len(request.message.strip()) < 2:
            raise ValidationError(
                "Message too short (minimum 2 characters)",
                field="message",
                value=len(request.message) if request.message else 0
            )
        
        if len(request.message) > 1000:
            raise ValidationError(
                "Message too long (maximum 1000 characters)",
                field="message",
                value=len(request.message)
            )
        
        logger.info(f"AI Mentor chat request: {request.message[:50]}...")
        
        # Generate response using AI
        response_text = await generate_chat_response(
            message=request.message,
            context=request.context,
            history=request.history
        )
        
        # Generate suggestions for follow-up questions
        suggestions = generate_suggestions(request.message, response_text)
        
        return ChatResponse(
            message=response_text,
            timestamp=datetime.utcnow(),
            suggestions=suggestions
        )
    
    except ValidationError:
        raise
    except AIServiceError:
        raise
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process chat message: {str(e)}"
        )


@router.post("/explain", response_model=ChatResponse)
async def explain_concept(
    concept: str = Query(..., description="Science concept to explain", max_length=200),
    grade: Optional[str] = Query("9-12", description="Grade level for explanation"),
    project_context: Optional[str] = Query(None, description="Related project context")
):
    """
    Get a simple explanation of a science concept
    
    - **concept**: The scientific concept to explain (e.g., "photosynthesis", "gravity")
    - **grade**: Grade level for age-appropriate explanation
    - **project_context**: Optional project context for better relevance
    
    Returns a clear, educational explanation
    """
    try:
        # Validate concept
        concept = validate_topic(concept)
        
        logger.info(f"Explaining concept: {concept} for grade {grade}")
        
        # Create explanation request
        prompt = f"Explain the concept of '{concept}' in simple terms suitable for grade {grade} students."
        
        if project_context:
            prompt += f" Relate it to this project context: {project_context}"
        
        # Generate explanation
        explanation = await generate_chat_response(
            message=prompt,
            context=project_context
        )
        
        # Generate related suggestions
        suggestions = [
            f"How can I demonstrate {concept} in an experiment?",
            f"What are real-world examples of {concept}?",
            f"What materials do I need to study {concept}?",
            "Can you suggest a hypothesis?"
        ]
        
        return ChatResponse(
            message=explanation,
            timestamp=datetime.utcnow(),
            suggestions=suggestions
        )
    
    except ValidationError:
        raise
    except AIServiceError:
        raise
    except Exception as e:
        logger.error(f"Explanation error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate explanation: {str(e)}"
        )


@router.post("/suggest-improvements")
async def suggest_improvements(
    project_idea: str,
    hypothesis: str
):
    """
    Get AI suggestions to improve a project
    
    - **project_idea**: The current project idea
    - **hypothesis**: The current hypothesis
    
    Returns suggestions for improvement
    """
    try:
        logger.info("Generating project improvement suggestions")
        
        prompt = f"""
        Review this science project and suggest improvements:
        
        Project Idea: {project_idea}
        Hypothesis: {hypothesis}
        
        Provide specific suggestions for:
        1. Making the hypothesis more testable
        2. Improving the experimental design
        3. Adding variables to control
        4. Enhancing data collection methods
        5. Strengthening the scientific approach
        
        Keep suggestions practical and grade-appropriate.
        """
        
        suggestions_text = await generate_chat_response(
            message=prompt,
            context=f"Project: {project_idea}"
        )
        
        return ChatResponse(
            message=suggestions_text,
            timestamp=datetime.utcnow()
        )
    
    except Exception as e:
        logger.error(f"Improvement suggestions error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate suggestions: {str(e)}"
        )


def generate_suggestions(user_message: str, ai_response: str) -> List[str]:
    """
    Generate follow-up question suggestions based on the conversation
    
    Args:
        user_message: User's message
        ai_response: AI's response
    
    Returns:
        List of suggested follow-up questions
    """
    # Basic suggestions based on common patterns
    suggestions = []
    
    user_lower = user_message.lower()
    
    if "how" in user_lower:
        suggestions.append("Can you give me an example?")
        suggestions.append("What materials would I need?")
    
    if "what" in user_lower:
        suggestions.append("How does this work in practice?")
        suggestions.append("Can you explain this differently?")
    
    if "why" in user_lower:
        suggestions.append("How can I demonstrate this?")
        suggestions.append("What experiment could show this?")
    
    # Generic helpful suggestions
    suggestions.extend([
        "Can you explain this more simply?",
        "How can I test this hypothesis?",
        "What are some common mistakes to avoid?"
    ])
    
    # Return up to 4 unique suggestions
    return list(dict.fromkeys(suggestions))[:4]

