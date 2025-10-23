from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProjectBase(BaseModel):
    title: str
    idea: str
    hypothesis: str
    graph_data: Optional[str] = None  # Base64 encoded image
    report: Optional[str] = None  # Markdown report

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    idea: Optional[str] = None
    hypothesis: Optional[str] = None
    graph_data: Optional[str] = None
    report: Optional[str] = None

class Project(ProjectBase):
    id: str
    user_id: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class IdeaResponse(BaseModel):
    title: str
    idea: str
    hypothesis: str
    project_id: Optional[str] = None

class GraphResponse(BaseModel):
    graph_base64: str
    description: str

class ReportResponse(BaseModel):
    report: str
    project_id: Optional[str] = None

