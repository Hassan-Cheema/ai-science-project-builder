from openai import AsyncOpenAI
from config import settings
import json

# Initialize OpenAI client
client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None

# Try to import Gemini service
try:
    from .gemini_service import gemini_service
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

async def generate_project_idea(topic: str = None) -> dict:
    """
    Generate a science project idea and hypothesis using OpenAI or Gemini
    """
    # Try Gemini first (free), fallback to OpenAI
    if GEMINI_AVAILABLE and settings.GEMINI_API_KEY and gemini_service.available:
        try:
            return await gemini_service.generate_project_idea(topic or "general science", "8")
        except Exception as e:
            print(f"⚠️ Gemini failed, trying OpenAI fallback: {e}")
    
    # Fallback to OpenAI
    if not client:
        raise ValueError("No AI service configured (neither Gemini nor OpenAI)")
    
    prompt = f"""Generate a creative and feasible science project idea.
{'Topic: ' + topic if topic else 'Choose any interesting scientific topic.'}

Provide:
1. A catchy project title
2. A detailed project idea (2-3 paragraphs)
3. A testable hypothesis

Format your response as JSON with keys: title, idea, hypothesis"""

    try:
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
        return result
    
    except Exception as e:
        raise Exception(f"Failed to generate project idea: {str(e)}")

async def generate_report_content(idea: str, hypothesis: str, graph_description: str) -> str:
    """
    Generate a comprehensive markdown report combining idea, hypothesis, and graph analysis
    """
    # Try Gemini first (free), fallback to OpenAI
    if GEMINI_AVAILABLE and settings.GEMINI_API_KEY and gemini_service.available:
        try:
            return await gemini_service.generate_report(idea, hypothesis, graph_description)
        except Exception as e:
            print(f"⚠️ Gemini failed, trying OpenAI fallback: {e}")
    
    # Fallback to OpenAI
    if not client:
        raise ValueError("No AI service configured (neither Gemini nor OpenAI)")
    
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
        response = await client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": "You are a professional scientific writer who creates detailed, well-structured research reports."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        
        return response.choices[0].message.content
    
    except Exception as e:
        raise Exception(f"Failed to generate report: {str(e)}")

