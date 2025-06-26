# Resume Editor

A web-based Resume Editor that allows users to upload, edit, and enhance their resumes using AI-powered suggestions.

## Features

- **Upload Resume**: Accept .pdf or .docx files with mock parsing
- **Edit Resume**: Editable fields for name, experience, education, skills
- **AI Enhancement**: Enhance sections using AI suggestions
- **Save & Retrieve**: Save resume data via FastAPI backend which creates a folder in backend/resumes
- **Download**: Download final resume as JSON file

## Project Structure

```
resume-builder/
├── frontend/          # Next.js React application
├── backend/           # FastAPI Python backend
├── setup.sh          # Automated setup script
└── README.md         # This file
```

## Quick Setup (Recommended)

Run the automated setup script:

```bash
# On Windows (PowerShell)
bash setup.sh

# On macOS/Linux
chmod +x setup.sh
./setup.sh
```

## Manual Setup Instructions

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

6. The API will be available at [http://localhost:8000](http://localhost:8000)

## Running the Application

### Start Backend
```bash
cd backend
venv\Scripts\activate  # Windows
uvicorn main:app --reload
```

### Start Frontend (in a new terminal)
```bash
cd frontend
npm run dev
```

### Access the Application
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)


## API Endpoints

- `GET /`: Health check
- `POST /ai-enhance`: Enhance resume sections with AI
- `POST /save-resume`: Save resume data
- `GET /docs`: API documentation (Swagger UI)

## Technologies Used

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python, Pydantic
- **File Handling**: PDF/DOCX parsing (mock implementation)
- **Development**: Hot reload, CORS support, TypeScript validation 