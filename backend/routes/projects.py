"""
Project routes - API endpoints for project generation and management
"""
from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional
from datetime import datetime
import uuid

from models import IdeaResponse, GraphResponse, ReportResponse, Project
from services.ai_service import generate_project_idea, generate_report_content
from services.graph_service import generate_sample_bar_chart, generate_custom_chart
from supabase import Client

# Import database utilities directly
import sys
import os
# Add parent directory to path to avoid package conflicts
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import directly from database.py (not the database/ package)
import importlib.util
spec = importlib.util.spec_from_file_location("db_utils", os.path.join(os.path.dirname(os.path.dirname(__file__)), "database.py"))
db_utils = importlib.util.module_from_spec(spec)
spec.loader.exec_module(db_utils)
get_db = db_utils.get_db
from utils.logger import setup_logger
from utils.validators import (
    validate_topic,
    validate_grade,
    validate_chart_type,
    validate_title,
    validate_list_input
)
from utils.exceptions import ValidationError, AIServiceError, DatabaseError

logger = setup_logger(__name__)

router = APIRouter(prefix="/api", tags=["projects"])

@router.get("/idea", response_model=IdeaResponse)
async def get_project_idea(
    topic: Optional[str] = Query(None, description="Optional topic for the project idea", max_length=200),
    grade: Optional[str] = Query("9-12", description="Grade level (K-5, 6-8, 9-12, college)"),
    subject: Optional[str] = Query(None, description="Subject area", max_length=100),
    save_to_db: bool = Query(False, description="Whether to save the project to database"),
    db: Client = Depends(get_db)
):
    """
    Generate an AI-powered science project idea and hypothesis
    
    - **topic**: Optional specific topic (e.g., "photosynthesis", "gravity")
    - **grade**: Grade level for appropriate difficulty
    - **subject**: Subject area (biology, chemistry, physics, etc.)
    - **save_to_db**: Whether to save the generated project to database
    
    Returns project title, detailed idea, and testable hypothesis
    """
    try:
        # Validate inputs
        if topic:
            topic = validate_topic(topic)
        
        if grade:
            grade = validate_grade(grade)
        
        # Combine subject and topic if both provided
        if subject and topic:
            topic_text = f"{subject} - {topic}"
        elif subject:
            topic_text = subject
        else:
            topic_text = topic
        
        logger.info(f"Generating idea for: topic={topic_text}, grade={grade}")
        
        # Generate the idea using AI
        result = await generate_project_idea(topic_text, grade)
        
        project_id = None
        
        # Optionally save to Supabase
        if save_to_db:
            project_data = {
                "id": str(uuid.uuid4()),
                "title": result.get("title", "Untitled Project"),
                "subject": subject,
                "grade": grade,
                "topic": topic,
                "idea": result.get("idea", ""),
                "hypothesis": result.get("hypothesis", ""),
                "materials": result.get("materials"),
                "procedure": result.get("procedure"),
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            }
            
            try:
                response = db.table("projects").insert(project_data).execute()
                project_id = project_data["id"]
                logger.info(f"Project saved to database: {project_id}")
            except Exception as db_error:
                logger.error(f"Database save failed: {db_error}")
                raise DatabaseError(
                    "Failed to save project to database",
                    operation="insert",
                    table="projects",
                    original_error=db_error
                )
        
        return IdeaResponse(
            title=result.get("title", "Untitled Project"),
            idea=result.get("idea", ""),
            hypothesis=result.get("hypothesis", ""),
            project_id=project_id
        )
    
    except ValidationError:
        raise
    except AIServiceError:
        raise
    except DatabaseError:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in get_project_idea: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/graph", response_model=GraphResponse)
async def get_graph(
    title: Optional[str] = Query("Sample Data Analysis", description="Chart title", max_length=200),
    chart_type: Optional[str] = Query("bar", description="Type of chart: bar, line, scatter, pie"),
    categories: Optional[str] = Query(None, description="Comma-separated category names"),
    values: Optional[str] = Query(None, description="Comma-separated values")
):
    """
    Generate a data visualization chart and return as base64 encoded PNG image
    
    - **title**: Chart title
    - **chart_type**: Type of chart (bar, line, scatter, pie, histogram)
    - **categories**: Comma-separated list of category labels
    - **values**: Comma-separated list of numeric values
    
    If categories/values not provided, generates sample data
    """
    try:
        # Validate inputs
        if title:
            title = validate_title(title)
        
        chart_type = validate_chart_type(chart_type)
        
        logger.info(f"Generating {chart_type} chart: {title}")
        
        # Parse and validate categories and values
        cat_list = validate_list_input(categories, "categories", max_items=50, allow_empty=True)
        
        val_list = None
        if values:
            try:
                val_str_list = validate_list_input(values, "values", max_items=50, allow_empty=True)
                val_list = [float(v) for v in val_str_list]
            except (ValueError, TypeError) as e:
                raise ValidationError(
                    "Values must be numeric (comma-separated numbers)",
                    field="values",
                    value=values
                )
        
        # Validate matching lengths
        if cat_list and val_list and len(cat_list) != len(val_list):
            raise ValidationError(
                f"Categories and values must have the same length (got {len(cat_list)} and {len(val_list)})",
                field="categories,values"
            )
        
        # Generate the appropriate chart
        if chart_type == "bar" and cat_list and val_list:
            image_base64, description = generate_sample_bar_chart(
                title=title,
                categories=cat_list,
                values=val_list
            )
        elif cat_list and val_list:
            data = {'categories': cat_list, 'values': val_list}
            image_base64, description = generate_custom_chart(
                chart_type=chart_type,
                title=title,
                data=data
            )
        else:
            # Generate with default sample data
            logger.info("No data provided, generating sample data")
            image_base64, description = generate_sample_bar_chart(title=title)
        
        logger.info(f"Graph generated successfully: {len(image_base64)} bytes")
        
        return GraphResponse(
            graph_base64=image_base64,
            description=description
        )
    
    except ValidationError:
        raise
    except Exception as e:
        logger.error(f"Failed to generate graph: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate graph: {str(e)}")

@router.post("/report", response_model=ReportResponse)
async def generate_report(
    project_id: Optional[str] = Query(None, description="Project ID to generate report for"),
    idea: Optional[str] = Query(None, description="Project idea (if not using project_id)"),
    hypothesis: Optional[str] = Query(None, description="Project hypothesis (if not using project_id)"),
    graph_description: Optional[str] = Query("Sample graph data", description="Description of graph data"),
    save_to_db: bool = Query(False, description="Whether to save report to database"),
    db: Client = Depends(get_db)
):
    """
    Generate a comprehensive markdown report merging idea, hypothesis, and graph analysis
    """
    try:
        # If project_id provided, fetch from database
        if project_id:
            try:
                response = db.table("projects").select("*").eq("id", project_id).execute()
                if response.data and len(response.data) > 0:
                    project = response.data[0]
                    idea = project.get("idea", "")
                    hypothesis = project.get("hypothesis", "")
                else:
                    raise HTTPException(status_code=404, detail="Project not found")
            except Exception as db_error:
                raise HTTPException(status_code=500, detail=f"Database error: {str(db_error)}")
        
        # Validate that we have the required data
        if not idea or not hypothesis:
            raise HTTPException(
                status_code=400, 
                detail="Either project_id or both idea and hypothesis must be provided"
            )
        
        # Generate the report using OpenAI
        report_content = await generate_report_content(idea, hypothesis, graph_description)
        
        # Optionally save to database
        if save_to_db and project_id:
            try:
                update_data = {
                    "report": report_content,
                    "updated_at": datetime.utcnow().isoformat()
                }
                db.table("projects").update(update_data).eq("id", project_id).execute()
            except Exception as db_error:
                print(f"Failed to update project with report: {db_error}")
        
        return ReportResponse(
            report=report_content,
            project_id=project_id
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate report: {str(e)}")

@router.get("/projects", response_model=list[Project])
async def list_projects(
    limit: int = Query(10, ge=1, le=100),
    db: Client = Depends(get_db)
):
    """
    List all projects from the database
    """
    try:
        response = db.table("projects").select("*").limit(limit).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch projects: {str(e)}")

@router.get("/projects/{project_id}", response_model=Project)
async def get_project(
    project_id: str,
    db: Client = Depends(get_db)
):
    """
    Get a specific project by ID
    """
    try:
        response = db.table("projects").select("*").eq("id", project_id).execute()
        if response.data and len(response.data) > 0:
            return response.data[0]
        else:
            raise HTTPException(status_code=404, detail="Project not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch project: {str(e)}")

