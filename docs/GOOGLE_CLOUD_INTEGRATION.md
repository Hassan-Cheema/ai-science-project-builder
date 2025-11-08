# Google Cloud Integration Guide

This guide explains how to integrate various Google Cloud services into your AI Student Hub project.

## Table of Contents

1. [Setup & Authentication](#setup--authentication)
2. [Google Gemini API (AI Alternative)](#google-gemini-api)
3. [Google Cloud Storage](#google-cloud-storage)
4. [Google Cloud Translation API](#google-cloud-translation-api)
5. [Google Cloud Vision API](#google-cloud-vision-api)
6. [Google Cloud Text-to-Speech](#google-cloud-text-to-speech)
7. [Google Cloud Speech-to-Text](#google-cloud-speech-to-text)
8. [Firestore (Database Alternative)](#firestore-database)
9. [Cloud Functions / Cloud Run](#cloud-functions--cloud-run)
10. [Best Practices](#best-practices)

---

## Setup & Authentication

### 1. Install Google Cloud SDK

```bash
npm install @google-cloud/storage @google-cloud/translate @google-cloud/vision @google-cloud/text-to-speech @google-cloud/speech @google-ai/generativelanguage firebase-admin
```

Or install specific packages as needed:

```bash
# For Gemini AI
npm install @google/generative-ai

# For Cloud Storage
npm install @google-cloud/storage

# For Translation
npm install @google-cloud/translate

# For Vision
npm install @google-cloud/vision

# For Text-to-Speech
npm install @google-cloud/text-to-speech

# For Speech-to-Text
npm install @google-cloud/speech

# For Firestore
npm install firebase-admin
```

### 2. Set Up Authentication

**Option A: Service Account Key (Recommended for Server-side)**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable APIs you need
4. Go to "IAM & Admin" > "Service Accounts"
5. Create a service account and download JSON key
6. Save it as `google-cloud-key.json` in your project root (add to `.gitignore`)

**Option B: Application Default Credentials (Recommended for Production)**

```bash
# Install gcloud CLI
# Then authenticate:
gcloud auth application-default login
```

**Option C: Environment Variables (For API Keys)**
For APIs like Gemini that support API keys, you can use environment variables.

### 3. Update Environment Variables

Add to your `.env` file:

```env
# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=./google-cloud-key.json
GOOGLE_CLOUD_STORAGE_BUCKET=your-bucket-name

# Google Gemini API (Alternative to OpenAI)
GOOGLE_GEMINI_API_KEY=your-gemini-api-key

# Optional: Region-specific settings
GOOGLE_CLOUD_REGION=us-central1
```

---

## Google Gemini API

Google Gemini is Google's AI model that can serve as an alternative or complement to OpenAI.

### Implementation Example

See `lib/google-gemini.ts` for a complete implementation that mirrors your OpenAI setup.

**Key Features:**

- Similar API to OpenAI
- Supports streaming
- Multiple model options (Gemini Pro, Gemini Pro Vision)
- Cost-effective alternative

---

## Google Cloud Storage

Use GCS for storing user files, generated content, images, and other assets.

### Use Cases:

- Store generated essays/resumes as PDFs
- Store user-uploaded images
- Store cached AI responses
- Backup user data

### Implementation Example

See `lib/google-storage.ts` for complete implementation.

**Basic Usage:**

```typescript
import { uploadFile, downloadFile, deleteFile } from "@/lib/google-storage";

// Upload a file
const url = await uploadFile("essays/user-123.pdf", fileBuffer);

// Download a file
const file = await downloadFile("essays/user-123.pdf");

// Delete a file
await deleteFile("essays/user-123.pdf");
```

---

## Google Cloud Translation API

Add multi-language support to your application.

### Use Cases:

- Translate generated essays to different languages
- Support international students
- Translate user inputs before processing

### Implementation Example

See `lib/google-translation.ts` for complete implementation.

**Basic Usage:**

```typescript
import { translateText, detectLanguage } from "@/lib/google-translation";

// Translate text
const translated = await translateText("Hello", "es"); // Spanish

// Detect language
const language = await detectLanguage("Bonjour le monde");
```

---

## Google Cloud Vision API

Analyze images and extract text (OCR).

### Use Cases:

- Extract text from uploaded images (notes, documents)
- Analyze images for content moderation
- Extract handwritten notes

### Implementation Example

See `lib/google-vision.ts` for complete implementation.

**Basic Usage:**

```typescript
import { extractTextFromImage, analyzeImage } from "@/lib/google-vision";

// Extract text from image
const text = await extractTextFromImage(imageBuffer);

// Analyze image content
const analysis = await analyzeImage(imageBuffer);
```

---

## Google Cloud Text-to-Speech

Convert generated text to speech.

### Use Cases:

- Audio versions of generated essays
- Study notes as audio
- Accessibility features

### Implementation Example

See `lib/google-text-to-speech.ts` for complete implementation.

**Basic Usage:**

```typescript
import { textToSpeech } from "@/lib/google-text-to-speech";

// Convert text to speech
const audioBuffer = await textToSpeech("Hello world", "en-US");
```

---

## Google Cloud Speech-to-Text

Convert speech to text.

### Use Cases:

- Voice input for essays
- Transcribe study notes from audio
- Voice commands

### Implementation Example

See `lib/google-speech-to-text.ts` for complete implementation.

**Basic Usage:**

```typescript
import { speechToText } from "@/lib/google-speech-to-text";

// Convert speech to text
const text = await speechToText(audioBuffer);
```

---

## Firestore (Database)

Firestore is Google's NoSQL database, similar to Supabase.

### Use Cases:

- Store user data
- Store generated content
- User preferences and settings
- Analytics data

### Implementation Example

See `lib/google-firestore.ts` for complete implementation.

**Basic Usage:**

```typescript
import { db } from "@/lib/google-firestore";

// Save data
await db.collection("essays").doc("essay-123").set({
  title: "My Essay",
  content: "...",
  userId: "user-123",
  createdAt: new Date(),
});

// Read data
const essay = await db.collection("essays").doc("essay-123").get();
```

---

## Cloud Functions / Cloud Run

Deploy serverless functions or containers.

### Use Cases:

- Background processing
- Scheduled tasks
- Heavy computation offloading
- Webhook handlers

### Example: Cloud Function for Essay Generation

```typescript
// functions/generateEssay.ts
import { onRequest } from "firebase-functions/v2/https";
import { generateEssay } from "./essayService";

export const generateEssayFunction = onRequest(async (req, res) => {
  const { topic, words } = req.body;
  const essay = await generateEssay(topic, words);
  res.json({ essay });
});
```

---

## Best Practices

### 1. Error Handling

Always wrap Google Cloud API calls in try-catch blocks:

```typescript
try {
  const result = await googleCloudService.doSomething();
} catch (error) {
  console.error("Google Cloud error:", error);
  // Handle gracefully
}
```

### 2. Rate Limiting

Google Cloud APIs have rate limits. Implement rate limiting similar to your existing setup:

```typescript
import { checkRateLimit } from "@/lib/rate-limit";
```

### 3. Cost Management

- Use caching to avoid redundant API calls
- Monitor usage in Google Cloud Console
- Set up billing alerts
- Use appropriate pricing tiers

### 4. Security

- Never commit service account keys
- Use environment variables for sensitive data
- Implement proper authentication
- Use IAM roles with least privilege

### 5. Caching

Integrate with your existing cache system:

```typescript
import { getCache, setCache } from "@/lib/cache";
```

### 6. Fallbacks

Implement fallbacks when using multiple AI providers:

```typescript
try {
  return await openaiCall();
} catch (error) {
  console.warn("OpenAI failed, falling back to Gemini");
  return await geminiCall();
}
```

---

## Cost Estimates

Approximate costs (as of 2024):

- **Gemini API**: ~$0.000125 per 1K characters (cheaper than GPT-4)
- **Cloud Storage**: $0.020 per GB/month
- **Translation API**: $20 per 1M characters
- **Vision API**: $1.50 per 1,000 images
- **Text-to-Speech**: $4 per 1M characters
- **Speech-to-Text**: $0.006 per 15 seconds
- **Firestore**: $0.18 per 100K document reads

---

## Next Steps

1. Choose which Google Cloud services you want to integrate
2. Install the necessary packages
3. Set up authentication
4. Implement the service wrappers (see example files)
5. Update your API routes to use Google Cloud services
6. Test thoroughly
7. Monitor costs and usage

---

## Support & Resources

- [Google Cloud Documentation](https://cloud.google.com/docs)
- [Google AI Studio (Gemini)](https://makersuite.google.com/app/apikey)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
