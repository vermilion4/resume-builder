from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List
import json
import os
from datetime import datetime

app = FastAPI(title="Resume Editor API", version="1.0.0")

# Get CORS origins from environment variable or use defaults
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
if os.getenv("ALLOW_NETLIFY"):
    cors_origins.extend([
        "https://*.netlify.app",
        "https://*.netlify.com"
    ])

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
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
        # Enhance professional summary with more compelling language
        enhanced = content
        
        # Add action words and professional language
        if "experienced" not in content.lower():
            enhanced = f"Experienced {enhanced}"
        
        # Add quantifiable achievements if not present
        if "5+" in content or "years" in content:
            if "proven track record" not in content.lower():
                enhanced += " with a proven track record of delivering high-impact solutions."
        else:
            enhanced += " with 5+ years of experience in web development and software engineering."
        
        # Add leadership/impact language
        if "leading" not in content.lower() and "mentored" not in content.lower():
            enhanced += " Skilled in leading development teams and mentoring junior developers."
        
        # Ensure it's compelling and professional
        if len(enhanced) < 150:
            enhanced += " Passionate about creating innovative solutions and driving business value through technology."
    
    elif section == "experience":
        # Enhance job descriptions with action verbs and quantifiable results
        enhanced = content
        
        # Replace weak verbs with strong action verbs
        replacements = {
            "worked on": "developed and implemented",
            "responsible for": "successfully managed and delivered",
            "helped": "collaborated to deliver",
            "did": "executed",
            "made": "created",
            "used": "leveraged",
            "did work": "performed",
            "was involved in": "played a key role in"
        }
        
        for weak, strong in replacements.items():
            if weak in enhanced.lower():
                enhanced = enhanced.replace(weak, strong)
        
        # Add quantifiable results if not present
        if "improved" in content.lower() and "%" not in content:
            enhanced = enhanced.replace("improved", "improved by 40%")
        
        # Add technical depth
        if "react" in content.lower() and "node.js" in content.lower():
            if "full-stack" not in content.lower():
                enhanced += " Utilized modern full-stack technologies including React, Node.js, and cloud services."
        
        # Add collaboration/leadership aspects
        if "team" not in content.lower() and "collaborated" not in content.lower():
            enhanced += " Collaborated with cross-functional teams to ensure project success."
    
    else:
        # Default enhancement for unknown sections
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