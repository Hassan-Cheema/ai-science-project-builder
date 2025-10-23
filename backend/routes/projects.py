from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional
from datetime import datetime
import uuid

from models import IdeaResponse, GraphResponse, ReportResponse, Project
from services.ai_service import generate_project_idea, generate_report_content
from services.graph_service import generate_sample_bar_chart, generate_custom_chart
from database import get_db
from supabase import Client

router = APIRouter(prefix="/api", tags=["projects"])

@router.get("/idea", response_model=IdeaResponse)
async def get_project_idea(
    topic: Optional[str] = Query(None, description="Optional topic for the project idea"),
    save_to_db: bool = Query(False, description="Whether to save the project to database"),
    db: Client = Depends(get_db)
):
    """
    Generate an AI-powered science project idea and hypothesis using OpenAI GPT-4o mini
    """
    try:
        # Generate the idea using OpenAI
        result = await generate_project_idea(topic)
        
        project_id = None
        
        # Optionally save to Supabase
        if save_to_db:
            project_data = {
                "id": str(uuid.uuid4()),
                "title": result.get("title", "Untitled Project"),
                "idea": result.get("idea", ""),
                "hypothesis": result.get("hypothesis", ""),
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            }
            
            try:
                response = db.table("projects").insert(project_data).execute()
                project_id = project_data["id"]
            except Exception as db_error:
                # If database save fails, continue but log the error
                print(f"Database save failed: {db_error}")
        
        return IdeaResponse(
            title=result.get("title", "Untitled Project"),
            idea=result.get("idea", ""),
            hypothesis=result.get("hypothesis", ""),
            project_id=project_id
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/graph", response_model=GraphResponse)
async def get_graph(
    title: Optional[str] = Query("Sample Data Analysis", description="Chart title"),
    chart_type: Optional[str] = Query("bar", description="Type of chart: bar, line, scatter"),
    categories: Optional[str] = Query(None, description="Comma-separated category names"),
    values: Optional[str] = Query(None, description="Comma-separated values")
):
    """
    Generate a bar chart (or other chart types) and return as base64 encoded image
    """
    try:
        # Parse categories and values if provided
        cat_list = None
        val_list = None
        
        if categories:
            cat_list = [c.strip() for c in categories.split(",")]
        if values:
            val_list = [float(v.strip()) for v in values.split(",")]
        
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
            image_base64, description = generate_sample_bar_chart(title=title)
        
        return GraphResponse(
            graph_base64=image_base64,
            description=description
        )
    
    except Exception as e:
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

