from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv

# Import routes
from routes.projects import router as projects_router

load_dotenv()

app = FastAPI(
    title="AI Science Builder API", 
    version="1.0.0",
    description="AI-powered science project builder with OpenAI GPT-4o mini and Matplotlib visualizations"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(projects_router)

# Health check endpoint
@app.get("/")
async def root():
    return {
        "message": "AI Science Builder API", 
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "idea": "/api/idea",
            "graph": "/api/graph",
            "report": "/api/report",
            "projects": "/api/projects"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Example protected endpoint
@app.get("/api/protected")
async def protected_route():
    return {"message": "This is a protected route"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

