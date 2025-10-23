# 🚀 Quick Start Guide

## Your AI Science Builder is Ready!

The backend server is now running at: **http://localhost:8000**

## 📍 Important URLs

- **API Home**: http://localhost:8000
- **API Docs (Swagger)**: http://localhost:8000/docs
- **Alternative Docs (ReDoc)**: http://localhost:8000/redoc

## 🎯 Available API Endpoints

### 1. Generate AI Project Idea
```bash
GET http://localhost:8000/api/idea?topic=robotics&save_to_db=false
```

**Example Response:**
```json
{
  "title": "Building an Autonomous Line-Following Robot",
  "idea": "Detailed project description...",
  "hypothesis": "Testable hypothesis...",
  "project_id": null
}
```

### 2. Generate Data Visualization
```bash
GET http://localhost:8000/api/graph?title=Test%20Results&categories=A,B,C,D&values=45,62,58,71
```

**Example Response:**
```json
{
  "graph_base64": "iVBORw0KGgoAAAANSUhEUgAA...",
  "description": "Bar chart showing 4 categories..."
}
```

### 3. Generate Comprehensive Report
```bash
POST http://localhost:8000/api/report?idea=Solar%20power%20project&hypothesis=More%20sunlight%20increases%20power
```

## 🔧 Setup Requirements

### Environment Variables

Before using the API, set up your `.env` file in the `backend` directory:

```env
# Required for AI features
OPENAI_API_KEY=sk-your-openai-key-here

# Required for database features
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key

# Optional for authentication
FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json

# Optional for payments
LEMON_SQUEEZY_API_KEY=your-api-key
```

**⚠️ Note:** Without an OpenAI API key, the `/idea` and `/report` endpoints won't work.

## 🧪 Test the API

### Option 1: Use the Browser
1. Go to http://localhost:8000/docs
2. Try the `/api/graph` endpoint (doesn't require API keys)
3. Click "Try it out"
4. Execute the request

### Option 2: Use the Example Client

We've created a Python script to test all endpoints:

```bash
# Navigate to backend directory
cd backend

# Run the example client
python example_client.py
```

This will:
- Generate a project idea
- Create a graph visualization
- Generate a comprehensive report
- Save files: `sample_graph.png` and `sample_report.md`

### Option 3: Use cURL

```bash
# Test health check
curl http://localhost:8000/health

# Generate a graph (no API key needed)
curl "http://localhost:8000/api/graph?title=My%20Data&values=10,20,30,40,50"

# Generate an idea (requires OpenAI API key)
curl "http://localhost:8000/api/idea?topic=chemistry"
```

## 📦 What's Included

### Backend (`/backend`)
- ✅ FastAPI server with async endpoints
- ✅ OpenAI GPT-4o mini integration for ideas & reports
- ✅ Matplotlib for data visualizations
- ✅ Supabase client for database operations
- ✅ Firebase Admin SDK for authentication
- ✅ Lemon Squeezy payment integration (placeholder)
- ✅ Complete API documentation

### Frontend (`/frontend`)
- ✅ React 18 with Vite
- ✅ Tailwind CSS for styling
- ✅ React Router for navigation
- ✅ Firebase client for authentication
- ✅ Supabase client for database
- ✅ Pre-built auth pages and dashboard
- ✅ Responsive UI components

## 🎨 Next Steps

### 1. Set Up Your API Keys

**Get OpenAI API Key:**
- Visit: https://platform.openai.com/api-keys
- Create a new API key
- Add to `backend/.env`

**Get Supabase Credentials:**
- Visit: https://supabase.com
- Create a project
- Get URL and anon key from Settings > API
- Run the SQL schema: `backend/supabase_schema.sql`

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at: http://localhost:5173

### 3. Test the Full Stack

1. Open http://localhost:5173 in your browser
2. Sign up for an account
3. Navigate to the dashboard
4. The frontend will communicate with your backend API

## 📚 Documentation

- **Backend API**: See `backend/README.md`
- **Main Project**: See `README.md`
- **Database Schema**: See `backend/supabase_schema.sql`

## 🐛 Troubleshooting

### "uvicorn: command not found" or "ModuleNotFoundError: No module named 'app'"

**Solution**: Use the startup scripts provided:

**PowerShell:**
```powershell
cd backend
.\run.ps1
```

**Command Prompt:**
```cmd
cd backend
run.bat
```

Or manually:
```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload
```

**Important**: Run `uvicorn main:app` (NOT `app.main:app`) from the `backend` directory

### "OpenAI API key not configured"
The AI-powered endpoints require an OpenAI API key. Set it in `backend/.env`:
```env
OPENAI_API_KEY=sk-your-key-here
```

### "Database error"
Make sure you've:
1. Created a Supabase project
2. Added credentials to `backend/.env`
3. Run the schema SQL in Supabase SQL Editor

### Server won't start
Check if port 8000 is already in use:
```bash
# Windows
netstat -ano | findstr :8000

# Kill the process if needed
taskkill /PID <process_id> /F
```

## 🎉 You're All Set!

Visit **http://localhost:8000/docs** to explore your API interactively!

---

**Questions?** Check the README files or open an issue.

