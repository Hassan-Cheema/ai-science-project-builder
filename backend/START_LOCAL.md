# 🚀 Quick Start Guide - Running Locally

## Step 1: Install Python Dependencies

```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## Step 2: Set Up Environment Variables

```bash
# Copy example file
copy env.example .env  # Windows
cp env.example .env    # macOS/Linux
```

**Edit `.env` file and add at minimum:**
```env
# Get FREE key at: https://aistudio.google.com/
GEMINI_API_KEY=AIza-your-gemini-key-here
GEMINI_MODEL=gemini-1.5-flash

# Optional: OpenAI as fallback
OPENAI_API_KEY=sk-your-openai-key-here
OPENAI_MODEL=gpt-4o-mini

# Optional: Database (not required for basic functionality)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key

# Optional: Authentication
FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json

DEBUG=True
```

## Step 3: Start Backend

```bash
# Make sure you're in backend directory with venv activated
python main.py
```

**Backend will start at:** http://localhost:8000

**Test it:**
```bash
curl http://localhost:8000/health
```

## Step 4: Set Up Frontend (New Terminal)

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
copy env.example .env  # Windows
cp env.example .env    # macOS/Linux
```

**Edit `frontend/.env` file:**
```env
VITE_API_BASE_URL=http://localhost:8000

# Optional: Firebase for authentication
VITE_FIREBASE_API_KEY=your-key
VITE_FIREBASE_AUTH_DOMAIN=your-domain
VITE_FIREBASE_PROJECT_ID=your-project
```

## Step 5: Start Frontend

```bash
npm run dev
```

**Frontend will start at:** http://localhost:5173

## ✅ Test Your Setup

1. **Open browser:** http://localhost:5173
2. **Click "Try It Free"**
3. **Generate a project:**
   - Subject: Biology
   - Topic: Photosynthesis
   - Grade: 9-12
4. **Click "Generate Project"**
5. **Try AI Mentor:** http://localhost:5173/mentor

## 🎯 Quick Test Commands

```bash
# Test backend health
curl http://localhost:8000/health

# Test AI generation
curl "http://localhost:8000/api/idea?topic=biology&grade=9-12"

# Test graph generation
curl http://localhost:8000/api/graph

# View API docs
# Open: http://localhost:8000/docs
```

## 🐛 Troubleshooting

### Backend won't start?

**Check Python version:**
```bash
python --version  # Should be 3.11+
```

**Check if venv is activated:**
```bash
which python  # Should show venv path
```

**Check for port conflicts:**
```bash
# Windows
netstat -ano | findstr :8000

# macOS/Linux
lsof -i :8000
```

### Frontend won't start?

**Check Node version:**
```bash
node --version  # Should be 20+
```

**Clear cache and reinstall:**
```bash
rm -rf node_modules package-lock.json  # macOS/Linux
npm cache clean --force
npm install
```

### "No AI service configured" error?

**Make sure you have:**
1. Added GEMINI_API_KEY or OPENAI_API_KEY to `.env`
2. Restarted the backend after adding keys
3. No extra spaces or quotes around the key

### Import errors?

**Make sure you're in the right directory:**
```bash
# For backend
cd backend
python main.py

# For frontend
cd frontend
npm run dev
```

## 📊 What's Running?

When everything is working, you should have:

- ✅ **Backend** at http://localhost:8000
- ✅ **Frontend** at http://localhost:5173
- ✅ **API Docs** at http://localhost:8000/docs
- ✅ **Health Check** at http://localhost:8000/health

## 🎉 Success!

You should now see:
- Beautiful landing page
- Working project generator
- AI Mentor chat
- Graph generation
- PDF export

## 📚 Next Steps

1. **Customize your project**
2. **Add Firebase for authentication**
3. **Set up Supabase for database**
4. **Deploy to production** (see DEPLOYMENT_GUIDE.md)

---

**Need help?** Check the logs or open an issue!


