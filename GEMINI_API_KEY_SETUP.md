# Where to Put Your Gemini API Key

## Quick Setup Guide

### Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the API key

### Step 2: Add API Key to Your Project

You need to create a `.env` file in the **root directory** of your project (same folder as `package.json`).

#### Option A: Create .env File Manually

1. In your project root folder (`E:\AI-Student-Hub`), create a new file named `.env`
2. Add the following line:

```env
GOOGLE_GEMINI_API_KEY=your-actual-api-key-here
```

Replace `your-actual-api-key-here` with the API key you copied from Google AI Studio.

#### Option B: Copy from .env.example

1. Copy the `.env.example` file to `.env`
2. Replace `your-gemini-api-key-here` with your actual API key

### Step 3: Restart Your Development Server

After adding the API key:

```bash
# Stop your current server (Ctrl+C)
# Then restart it
npm run dev
```

## File Location

Your `.env` file should be located at:

```
E:\AI-Student-Hub\.env
```

## Important Notes

1. **Never commit `.env` to Git** - It's already in `.gitignore`, so your API key will stay secure
2. **No spaces around the `=` sign** - Use `KEY=value`, not `KEY = value`
3. **No quotes needed** - Just paste the key directly: `GOOGLE_GEMINI_API_KEY=AIzaSy...`
4. **Restart required** - Environment variables are loaded when the server starts

## Example .env File

```env
# Required: Gemini API Key
GOOGLE_GEMINI_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz

# Optional: Application URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development
```

## Verify It's Working

1. Make sure your `.env` file is in the root directory
2. Restart your development server
3. Visit `http://localhost:3000/api/test-google-cloud` to test
4. You should see "Gemini API Connection: success"

## Troubleshooting

### "Gemini API key is not configured" error

- Check that `.env` file exists in the root directory
- Verify the variable name is exactly: `GOOGLE_GEMINI_API_KEY`
- Make sure there are no extra spaces
- Restart your development server

### API key not working

- Verify the key is correct (copy it again from Google AI Studio)
- Make sure the key is active in Google AI Studio
- Check that you haven't exceeded rate limits

## Security Best Practices

- ✅ Keep your `.env` file local only
- ✅ Never share your API key
- ✅ Never commit `.env` to version control
- ✅ Use different keys for development and production
- ✅ Rotate keys regularly
