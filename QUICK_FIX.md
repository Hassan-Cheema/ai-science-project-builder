# 🔧 Quick Fix - Project Not Generating

## The Problem

Your `.env` file has placeholder API keys:
```env
GEMINI_API_KEY=your-gemini-api-key  ❌ Not a real key
OPENAI_API_KEY=                      ❌ Empty
```

The AI service needs a real API key to generate projects!

---

## ✅ Solution - Get FREE Gemini Key (Takes 2 minutes)

### Step 1: Get Your Free API Key

1. **Visit**: https://aistudio.google.com/
2. **Sign in** with your Google account
3. **Click** "Get API Key" in the top right
4. **Click** "Create API key in new project" (or use existing project)
5. **Copy** the key - it looks like: `AIzaSyD...` (starts with AIza)

### Step 2: Update backend/.env

**Open** `backend/.env` and replace the placeholder:

**Before:**
```env
GEMINI_API_KEY=your-gemini-api-key
```

**After:**
```env
GEMINI_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 3: Restart Backend

**Stop the backend** (Ctrl+C in the terminal) and restart:

```bash
cd backend
python main.py
```

### Step 4: Test It!

```bash
# Test in new terminal
curl "http://localhost:8000/api/idea?topic=biology"
```

You should get a project idea in ~3 seconds!

---

## 🚀 Alternative - Use OpenAI (Paid)

If you prefer OpenAI instead:

1. Get key from: https://platform.openai.com/api-keys
2. Update `.env`:
```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4o-mini
```
3. Restart backend

---

## 📝 Complete .env Template

Here's what your `backend/.env` should look like:

```env
# AI Service (Required - Choose at least one)
GEMINI_API_KEY=AIzaSyD_your_actual_key_here
GEMINI_MODEL=gemini-1.5-flash

# OR use OpenAI
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o-mini

# Optional: Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-key

# Optional: Firebase Auth
FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json

# Optional: Payments
LEMON_SQUEEZY_API_KEY=your-key
LEMON_SQUEEZY_STORE_ID=your-store-id

# Development
DEBUG=True
```

---

## ✅ Verification Steps

After adding your API key and restarting:

### 1. Check Backend Health
```bash
curl http://localhost:8000/health
```

Should show:
```json
{
  "services": {
    "gemini_available": true  ✅
  }
}
```

### 2. Generate Test Project
```bash
curl "http://localhost:8000/api/idea?topic=biology&grade=9-12"
```

Should return JSON with `title`, `idea`, `hypothesis` ✅

### 3. Try in Browser
- Go to: http://localhost:5173/try
- Fill in the form
- Click "Generate Project"
- Should see results in ~3-5 seconds ✅

---

## 🎯 Common Issues

### "429 Rate Limit" Error
- You've hit the free tier limit (1,500 requests/day)
- Wait 24 hours or upgrade to paid tier

### "Invalid API Key" Error
- Key is incorrect or has spaces
- Generate a new key
- Make sure no quotes around the key

### Still Hanging?
```bash
# Check backend logs
# You should see "Attempting Gemini AI generation..."
# If you see errors, the key is invalid
```

### Frontend Shows Error?
- Make sure backend is running: http://localhost:8000/health
- Check frontend .env has: `VITE_API_BASE_URL=http://localhost:8000`
- Clear browser cache and reload

---

## 🎉 Once Working

You'll be able to:
- ✅ Generate unlimited science projects (FREE with Gemini)
- ✅ Chat with AI Mentor
- ✅ Create graphs and visualizations
- ✅ Download PDF reports
- ✅ Save projects to database

---

## 💰 Cost Breakdown

| Service | Free Tier | Cost |
|---------|-----------|------|
| **Gemini** | 1,500 requests/day | FREE forever! |
| **OpenAI** | No free tier | ~$0.15-0.60 per 1M tokens |

**Recommendation**: Start with FREE Gemini! 🎉

---

## 📞 Still Not Working?

1. **Check the key format**:
   - Gemini: Starts with `AIza`
   - OpenAI: Starts with `sk-`

2. **No spaces or quotes**:
   ```env
   ✅ GEMINI_API_KEY=AIzaSyD123...
   ❌ GEMINI_API_KEY="AIzaSyD123..."
   ❌ GEMINI_API_KEY= AIzaSyD123...
   ```

3. **Restart backend after changes**:
   - Stop with Ctrl+C
   - Run `python main.py` again

4. **Check backend terminal** for error messages

---

**Once you add your API key, projects will generate in seconds!** 🚀


