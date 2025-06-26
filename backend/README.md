# Resume Editor Backend

FastAPI backend for the Resume Editor application.

## Features

- **AI Enhancement**: Mock AI endpoint to enhance resume sections
- **Resume Storage**: Save and retrieve resume data
- **File Persistence**: Automatic saving of resumes to JSON files
- **CORS Support**: Configured for frontend integration

## API Endpoints

### Base URL
```
http://localhost:8000
```

### Endpoints

#### GET /
Health check endpoint
- **Response**: `{"message": "Resume Editor API is running"}`

#### GET /health
Server health check endpoint for status monitoring
- **Response**:
  ```json
  {
    "status": "healthy",
    "timestamp": "2023-12-01T14:30:22.123456",
    "message": "Server is running"
  }
  ```

#### POST /ai-enhance
Enhance resume sections with AI
- **Request Body**:
  ```json
  {
    "section": "summary",
    "content": "Experienced developer..."
  }
  ```
- **Response**:
  ```json
  {
    "enhanced_content": "Dynamic and results-driven experienced developer..."
  }
  ```

#### POST /save-resume
Save resume data
- **Request Body**: Complete resume JSON object
- **Response**:
  ```json
  {
    "message": "Resume saved successfully",
    "resume_id": "resume_20231201_143022",
    "timestamp": "2023-12-01T14:30:22.123456"
  }
  ```

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv/Scripts/activate`
   - macOS/Linux: `source venv/bin/activate`

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

5. Access the API documentation at: http://localhost:8000/docs

## File Structure

```
backend/
├── main.py              # FastAPI application
├── requirements.txt     # Python dependencies
├── README.md           # This file
└── resumes/            # Directory for saved resume files (auto-created)
```

## Mock AI Enhancement

The AI enhancement endpoint uses mock logic to improve resume content:

- **Summary**: Adds professional language and expands short summaries
- **Experience**: Improves action verbs and professional terminology
