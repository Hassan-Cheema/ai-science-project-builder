# Google Cloud Integration - Quick Start Guide

This project now supports Google Cloud services! Here's how to get started.

## 🚀 Quick Setup

### 1. Install Required Packages

Install the Google Cloud packages you need:

```bash
# For Gemini AI (alternative to OpenAI)
npm install @google/generative-ai

# For Cloud Storage
npm install @google-cloud/storage

# For Translation
npm install @google-cloud/translate

# For Vision (OCR)
npm install @google-cloud/vision

# For Text-to-Speech
npm install @google-cloud/text-to-speech

# For Speech-to-Text
npm install @google-cloud/speech

# For Firestore (database)
npm install firebase-admin
```

Or install all at once:
```bash
npm install @google/generative-ai @google-cloud/storage @google-cloud/translate @google-cloud/vision @google-cloud/text-to-speech @google-cloud/speech firebase-admin
```

### 2. Set Up Google Cloud Project

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Note your Project ID

2. **Enable Required APIs**
   - Go to "APIs & Services" > "Library"
   - Enable the APIs you need:
     - Cloud Translation API
     - Cloud Vision API
     - Cloud Text-to-Speech API
     - Cloud Speech-to-Text API
     - Cloud Storage API
     - Firestore API (if using Firestore)

3. **Get Gemini API Key** (if using Gemini)
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create an API key
   - Copy the key

4. **Create Service Account** (for server-side services)
   - Go to "IAM & Admin" > "Service Accounts"
   - Create a new service account
   - Grant necessary roles (Storage Admin, Translation Admin, etc.)
   - Create and download JSON key
   - Save as `google-cloud-key.json` in project root
   - **Add to `.gitignore`!**

### 3. Configure Environment Variables

Add to your `.env` file:

```env
# Google Cloud Project
GOOGLE_CLOUD_PROJECT_ID=your-project-id

# Service Account (for server-side services)
GOOGLE_APPLICATION_CREDENTIALS=./google-cloud-key.json

# Google Gemini API (for AI)
GOOGLE_GEMINI_API_KEY=your-gemini-api-key

# Google Cloud Storage (optional)
GOOGLE_CLOUD_STORAGE_BUCKET=your-bucket-name

# Optional: Region
GOOGLE_CLOUD_REGION=us-central1
```

### 4. Create Storage Bucket (if using Storage)

```bash
# Using gcloud CLI
gsutil mb -p YOUR_PROJECT_ID -c STANDARD -l us-central1 gs://your-bucket-name
```

Or use the Google Cloud Console:
- Go to "Cloud Storage" > "Buckets"
- Create a new bucket

## 📖 Usage Examples

### Using Gemini AI

```typescript
import { createGeminiChatCompletion } from '@/lib/google-gemini';

const result = await createGeminiChatCompletion([
  { role: 'system', content: 'You are a helpful assistant.' },
  { role: 'user', content: 'Write a short essay about AI.' },
], {
  temperature: 0.7,
  maxTokens: 1000,
});

console.log(result.content);
```

### Using Cloud Storage

```typescript
import { uploadFile, downloadFile } from '@/lib/google-storage';

// Upload a file
const url = await uploadFile('essays/essay-123.pdf', fileBuffer, {
  contentType: 'application/pdf',
  makePublic: false,
});

// Download a file
const file = await downloadFile('essays/essay-123.pdf');
```

### Using Translation

```typescript
import { translateText } from '@/lib/google-translation';

const result = await translateText('Hello, world!', 'es');
console.log(result.translatedText); // "¡Hola, mundo!"
```

### Using Vision (OCR)

```typescript
import { extractTextFromImage } from '@/lib/google-vision';

const imageBuffer = Buffer.from(base64Image, 'base64');
const result = await extractTextFromImage(imageBuffer);
console.log(result.text);
```

### Using Text-to-Speech

```typescript
import { textToSpeech } from '@/lib/google-text-to-speech';

const audioBuffer = await textToSpeech('Hello, this is a test.', {
  languageCode: 'en-US',
  voiceName: 'en-US-Wavenet-A',
  audioEncoding: 'MP3',
});
```

### Using Firestore

```typescript
import { saveDocument, getDocument } from '@/lib/google-firestore';

// Save a document
await saveDocument('essays', {
  title: 'My Essay',
  content: 'Essay content...',
  userId: 'user-123',
});

// Get a document
const essay = await getDocument('essays', 'essay-id');
```

## 🔧 Integration with Existing Code

### Replace OpenAI with Gemini

You can modify your API routes to use Gemini as a fallback or alternative:

```typescript
// In app/api/runEssay/route.ts
import { createGeminiChatCompletion } from '@/lib/google-gemini';
import { createAdvancedCompletion } from '@/lib/openai-enhanced';

// Try OpenAI first, fallback to Gemini
try {
  const result = await createAdvancedCompletion(messages);
  return result;
} catch (error) {
  console.warn('OpenAI failed, using Gemini');
  const result = await createGeminiChatCompletion(messages);
  return result;
}
```

### Add Translation to Essays

```typescript
// In app/api/runEssay/route.ts
import { translateText } from '@/lib/google-translation';

// After generating essay
if (targetLanguage && targetLanguage !== 'en') {
  const translated = await translateText(essay, targetLanguage);
  return translated.translatedText;
}
```

## 📚 Documentation

For detailed documentation, see:
- [Full Integration Guide](./docs/GOOGLE_CLOUD_INTEGRATION.md)
- [Google Cloud Documentation](https://cloud.google.com/docs)
- [Google AI Studio](https://makersuite.google.com/)

## 💰 Cost Management

Google Cloud services have free tiers and pay-as-you-go pricing:

- **Gemini API**: Free tier available, then ~$0.000125 per 1K characters
- **Cloud Storage**: 5GB free, then $0.020/GB/month
- **Translation**: 500K characters/month free
- **Vision**: 1,000 requests/month free
- **Text-to-Speech**: 4M characters/month free
- **Speech-to-Text**: 60 minutes/month free
- **Firestore**: 1GB storage, 50K reads/day free

Monitor usage in Google Cloud Console and set up billing alerts!

## 🔒 Security Best Practices

1. **Never commit service account keys** - Add `google-cloud-key.json` to `.gitignore`
2. **Use environment variables** for all sensitive data
3. **Limit service account permissions** - Only grant necessary roles
4. **Use API keys** for client-side services (Gemini) when possible
5. **Rotate credentials** regularly

## 🆘 Troubleshooting

### "Credentials not configured" error
- Check that `GOOGLE_APPLICATION_CREDENTIALS` points to your service account key
- Or ensure `GOOGLE_CLOUD_PROJECT_ID` is set and using Application Default Credentials

### "API not enabled" error
- Enable the required API in Google Cloud Console
- Wait a few minutes for propagation

### "Permission denied" error
- Check service account has required roles
- Verify API is enabled for your project

### Rate limiting
- Implement caching (already done in the library)
- Use rate limiting similar to your existing setup
- Monitor quotas in Google Cloud Console

## 📝 Example API Route

See `app/api/google-example/route.ts` for a complete example of using all Google Cloud services.

## 🎯 Next Steps

1. Choose which Google Cloud services you want to use
2. Install the required packages
3. Set up authentication
4. Test with the example API route
5. Integrate into your existing API routes
6. Monitor costs and usage

Happy coding! 🚀

