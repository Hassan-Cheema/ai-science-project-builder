# Google Cloud Setup Guide - Step by Step

This guide will help you link your AI Student Hub project to Google Cloud.

## 📋 Prerequisites

- A Google account
- Node.js and npm installed
- Basic knowledge of terminal/command line

## 🚀 Step-by-Step Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click **"New Project"**
4. Enter a project name (e.g., "ai-student-hub")
5. Click **"Create"**
6. Wait for the project to be created
7. **Note your Project ID** (you'll need this later)

### Step 2: Enable Required APIs

1. In the Google Cloud Console, go to **"APIs & Services"** > **"Library"**
2. Search for and enable the following APIs:

   - **Cloud Translation API**
   - **Cloud Vision API**
   - **Cloud Text-to-Speech API**
   - **Cloud Speech-to-Text API**
   - **Cloud Storage API**
   - **Firestore API** (if you plan to use Firestore)

3. Wait a few minutes for the APIs to be enabled

### Step 3: Get Gemini API Key (for AI features)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Select your project (or create a new one)
5. **Copy the API key** - you'll add this to your `.env` file
6. Click **"Done"**

### Step 4: Create a Service Account (for server-side services)

1. In Google Cloud Console, go to **"IAM & Admin"** > **"Service Accounts"**
2. Click **"Create Service Account"**
3. Enter a name (e.g., "ai-student-hub-service")
4. Click **"Create and Continue"**
5. Grant the following roles:
   - **Storage Admin** (if using Cloud Storage)
   - **Cloud Translation API User** (if using Translation)
   - **Cloud Vision API User** (if using Vision)
   - **Cloud TTS User** (if using Text-to-Speech)
   - **Cloud Speech-to-Text API User** (if using Speech-to-Text)
   - **Cloud Datastore User** (if using Firestore)
6. Click **"Continue"** and then **"Done"**
7. Click on the service account you just created
8. Go to the **"Keys"** tab
9. Click **"Add Key"** > **"Create new key"**
10. Select **JSON** format
11. Click **"Create"** - this will download a JSON file
12. **Save this file** as `google-cloud-key.json` in your project root directory

### Step 5: Create a Storage Bucket (optional, if using Cloud Storage)

1. In Google Cloud Console, go to **"Cloud Storage"** > **"Buckets"**
2. Click **"Create"**
3. Enter a bucket name (must be globally unique, e.g., "ai-student-hub-storage")
4. Choose a location type (e.g., "Region" and select "us-central1")
5. Click **"Create"**
6. **Note the bucket name** - you'll add this to your `.env` file

### Step 6: Configure Environment Variables

1. In your project root, create or edit the `.env` file
2. Add the following variables:

```env
# Google Cloud Project ID (from Step 1)
GOOGLE_CLOUD_PROJECT_ID=your-project-id-here

# Service Account Key Path (from Step 4)
GOOGLE_APPLICATION_CREDENTIALS=./google-cloud-key.json

# Gemini API Key (from Step 3)
GOOGLE_GEMINI_API_KEY=your-gemini-api-key-here

# Cloud Storage Bucket (from Step 5, optional)
GOOGLE_CLOUD_STORAGE_BUCKET=your-bucket-name-here

# Optional: Region (default is us-central1)
GOOGLE_CLOUD_REGION=us-central1
```

3. Replace the placeholder values with your actual values
4. **Save the file**

### Step 7: Verify Setup

1. Make sure all required packages are installed:

   ```bash
   npm install
   ```

2. Test your setup by running:

   ```bash
   npm run dev
   ```

3. Visit `http://localhost:3000/api/test-google-cloud` in your browser
   - This will test all Google Cloud services and show you what's working

## 🔍 Verification Checklist

- [ ] Google Cloud project created
- [ ] Required APIs enabled
- [ ] Gemini API key obtained
- [ ] Service account created with proper roles
- [ ] Service account key downloaded as `google-cloud-key.json`
- [ ] Storage bucket created (if using Storage)
- [ ] `.env` file configured with all variables
- [ ] `google-cloud-key.json` is in `.gitignore` (it should be already)
- [ ] Test endpoint shows successful connections

## 🛠️ Troubleshooting

### Error: "Credentials not configured"

- Check that `GOOGLE_APPLICATION_CREDENTIALS` points to the correct path
- Verify the `google-cloud-key.json` file exists in your project root
- Make sure the file path uses forward slashes: `./google-cloud-key.json`

### Error: "API not enabled"

- Go back to Step 2 and make sure all required APIs are enabled
- Wait a few minutes for API changes to propagate

### Error: "Permission denied"

- Check that your service account has the required roles (Step 4)
- Verify the service account key file is correct

### Error: "Project not found"

- Double-check your `GOOGLE_CLOUD_PROJECT_ID` in `.env`
- Make sure the project ID matches exactly (it's case-sensitive)

### Error: "Bucket not found" (if using Storage)

- Verify the bucket name in `GOOGLE_CLOUD_STORAGE_BUCKET`
- Make sure the bucket exists in your Google Cloud project

## 📚 Next Steps

Once setup is complete, you can:

1. **Use Gemini AI** as an alternative to OpenAI:

   ```typescript
   import { createGeminiChatCompletion } from "@/lib/google-gemini";
   ```

2. **Store files** in Cloud Storage:

   ```typescript
   import { uploadFile } from "@/lib/google-storage";
   ```

3. **Translate text**:

   ```typescript
   import { translateText } from "@/lib/google-translation";
   ```

4. **Extract text from images**:
   ```typescript
   import { extractTextFromImage } from "@/lib/google-vision";
   ```

See the [README_GOOGLE_CLOUD.md](./README_GOOGLE_CLOUD.md) for more usage examples.

## 🔒 Security Best Practices

1. **Never commit** `google-cloud-key.json` to git (it's already in `.gitignore`)
2. **Never commit** your `.env` file
3. **Use environment variables** for all sensitive data
4. **Rotate credentials** regularly
5. **Limit service account permissions** to only what's needed
6. **Monitor usage** in Google Cloud Console to avoid unexpected charges

## 💰 Cost Management

Google Cloud offers free tiers for most services:

- **Gemini API**: Free tier available
- **Cloud Storage**: 5GB free per month
- **Translation**: 500K characters/month free
- **Vision**: 1,000 requests/month free
- **Text-to-Speech**: 4M characters/month free
- **Speech-to-Text**: 60 minutes/month free

Set up billing alerts in Google Cloud Console to monitor usage!

## 🆘 Need Help?

- Check the [detailed integration guide](./docs/GOOGLE_CLOUD_INTEGRATION.md)
- Visit [Google Cloud Documentation](https://cloud.google.com/docs)
- Test your setup at `/api/test-google-cloud`

Happy coding! 🚀
