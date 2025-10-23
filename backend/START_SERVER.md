# 🚀 How to Start the Backend Server

## Quick Start (Easiest Method)

### Windows PowerShell:
```powershell
cd backend
.\run.ps1
```

### Windows Command Prompt:
```cmd
cd backend
run.bat
```

## Manual Start

### Step 1: Navigate to backend directory
```powershell
cd backend
```

### Step 2: Activate virtual environment

**PowerShell:**
```powershell
.\venv\Scripts\Activate.ps1
```

**Command Prompt:**
```cmd
venv\Scripts\activate.bat
```

### Step 3: Start the server
```bash
uvicorn main:app --reload
```

## Verify Server is Running

Open your browser to:
- **API Home**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

Or test from PowerShell:
```powershell
Invoke-WebRequest -Uri http://localhost:8000/health
```

## Expected Output

When the server starts successfully, you should see:
```
INFO:     Will watch for changes in these directories: ['D:\\ai-science-builder\\backend']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [XXXX] using WatchFiles
INFO:     Started server process [XXXX]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

## Stop the Server

Press `CTRL+C` in the terminal where the server is running.

## Troubleshooting

### Issue: "uvicorn: command not found"
**Solution**: Make sure you activated the virtual environment first.

### Issue: "Address already in use"
**Solution**: Another process is using port 8000. Either stop that process or change the port:
```bash
uvicorn main:app --reload --port 8001
```

### Issue: Module import errors
**Solution**: Make sure you're in the `backend` directory when starting the server, not the root project directory.

### Issue: OpenAI API errors
**Solution**: The `/api/idea` and `/api/report` endpoints require an OpenAI API key. Either:
1. Add your API key to `backend/.env`
2. Use the `/api/graph` endpoint which works without an API key

## Next Steps

Once the server is running:
1. Visit http://localhost:8000/docs for interactive API documentation
2. Test the endpoints
3. Set up your `.env` file with API keys for full functionality

