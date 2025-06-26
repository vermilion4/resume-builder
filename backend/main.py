from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List
import json
import os
from datetime import datetime

app = FastAPI(title="Resume Editor API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class AIEnhanceRequest(BaseModel):
    section: str
    content: str

class AIEnhanceResponse(BaseModel):
    enhanced_content: str

class ExperienceItem(BaseModel):
    id: str
    company: str
    position: str
    duration: str
    description: str

class EducationItem(BaseModel):
    id: str
    institution: str
    degree: str
    year: str

class ResumeData(BaseModel):
    name: str
    email: str
    phone: str
    summary: str
    experience: List[ExperienceItem]
    education: List[EducationItem]
    skills: List[str]

# In-memory storage for resumes (in production, use a database)
resume_storage: Dict[str, Any] = {}

@app.get("/")
async def root():
    return {"message": "Resume Editor API is running"}

@app.post("/ai-enhance", response_model=AIEnhanceResponse)
async def enhance_with_ai(request: AIEnhanceRequest):
    """
    Mock AI enhancement endpoint that improves resume sections
    """
    try:
        # Mock AI enhancement logic
        enhanced_content = mock_ai_enhancement(request.section, request.content)
        
        return AIEnhanceResponse(enhanced_content=enhanced_content)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error enhancing content: {str(e)}")

@app.post("/save-resume")
async def save_resume(resume_data: ResumeData):
    """
    Save resume data to storage
    """
    try:
        # Generate a unique ID for the resume
        resume_id = f"resume_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Store the resume data
        resume_storage[resume_id] = {
            "id": resume_id,
            "timestamp": datetime.now().isoformat(),
            "data": resume_data.model_dump()
        }
        
        # Optionally save to file for persistence
        save_resume_to_file(resume_id, resume_storage[resume_id])
        
        return {
            "message": "Resume saved successfully",
            "resume_id": resume_id,
            "timestamp": resume_storage[resume_id]["timestamp"]
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving resume: {str(e)}")

def mock_ai_enhancement(section: str, content: str) -> str:
    """
    Mock AI enhancement function that improves content based on section type
    """
    if not content.strip():
        return content
    
    # Different enhancement strategies based on section
    if section == "summary":
        enhanced = f"Dynamic and results-driven {content.lower()}"
        if "experienced" not in content.lower():
            enhanced = f"Experienced {enhanced}"
        if len(enhanced) < 100:
            enhanced += " with a proven track record of delivering exceptional results and driving organizational success."
    
    elif section == "experience":
        enhanced = content
        if "developed" not in content.lower():
            enhanced = enhanced.replace("worked on", "developed and implemented")
        if "improved" not in content.lower():
            enhanced = enhanced.replace("responsible for", "successfully improved")
    
    elif section == "skills":
        # For skills, just return as is since they're usually already concise
        enhanced = content
    
    else:
        # Default enhancement
        enhanced = f"Enhanced: {content}"
    
    return enhanced

def save_resume_to_file(resume_id: str, resume_data: Dict[str, Any]):
    """
    Save resume data to a JSON file for persistence
    """
    try:
        # Create resumes directory if it doesn't exist
        os.makedirs("resumes", exist_ok=True)
        
        # Save to file
        file_path = f"resumes/{resume_id}.json"
        with open(file_path, "w") as f:
            json.dump(resume_data, f, indent=2)
    
    except Exception as e:
        print(f"Warning: Could not save resume to file: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 