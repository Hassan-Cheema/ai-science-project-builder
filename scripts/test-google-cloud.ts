// Test script for Google Cloud integration
// Run with: npx tsx scripts/test-google-cloud.ts

import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') });
dotenv.config({ path: resolve(process.cwd(), '.env') });

async function testGoogleCloud() {
  console.log('🧪 Testing Google Cloud Integration...\n');

  const results: Array<{ service: string; status: '✅' | '❌'; message: string }> = [];

  // Test 1: Environment Variables
  console.log('1. Checking environment variables...');
  const hasProjectId = !!process.env.GOOGLE_CLOUD_PROJECT_ID;
  const hasCredentials = !!process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const hasGeminiKey = !!process.env.GOOGLE_GEMINI_API_KEY;
  const hasStorageBucket = !!process.env.GOOGLE_CLOUD_STORAGE_BUCKET;

  results.push({
    service: 'Environment Variables',
    status: hasProjectId || hasGeminiKey ? '✅' : '❌',
    message: hasProjectId
      ? `Project ID: ${process.env.GOOGLE_CLOUD_PROJECT_ID}`
      : hasGeminiKey
      ? 'Gemini API key found'
      : 'No Google Cloud configuration found',
  });

  // Test 2: Service Account Key File
  if (hasCredentials) {
    console.log('2. Checking service account key file...');
    try {
      const fs = await import('fs');
      const path = process.env.GOOGLE_APPLICATION_CREDENTIALS || '';
      const exists = fs.existsSync(path);
      if (exists) {
        const keyData = JSON.parse(fs.readFileSync(path, 'utf-8'));
        results.push({
          service: 'Service Account Key',
          status: '✅',
          message: `Found key for project: ${keyData.project_id || 'unknown'}`,
        });
      } else {
        results.push({
          service: 'Service Account Key',
          status: '❌',
          message: `File not found: ${path}`,
        });
      }
    } catch (error) {
      results.push({
        service: 'Service Account Key',
        status: '❌',
        message: `Error reading key file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  }

  // Test 3: Package Imports
  console.log('3. Testing package imports...');
  const packages = [
    { name: '@google/genai', test: async () => {
      const mod = await import('@google/genai');
      return !!mod;
    }},
    { name: '@google-cloud/storage', test: async () => {
      const mod = await import('@google-cloud/storage');
      return !!mod;
    }},
    { name: '@google-cloud/translate', test: async () => {
      const mod = await import('@google-cloud/translate');
      return !!mod;
    }},
    { name: '@google-cloud/vision', test: async () => {
      const mod = await import('@google-cloud/vision');
      return !!mod;
    }},
    { name: '@google-cloud/text-to-speech', test: async () => {
      const mod = await import('@google-cloud/text-to-speech');
      return !!mod;
    }},
    { name: '@google-cloud/speech', test: async () => {
      const mod = await import('@google-cloud/speech');
      return !!mod;
    }},
    { name: 'firebase-admin', test: async () => {
      const mod = await import('firebase-admin');
      return !!mod;
    }},
  ];

  for (const pkg of packages) {
    try {
      const result = await pkg.test();
      results.push({
        service: pkg.name,
        status: result ? '✅' : '❌',
        message: result ? 'Package imported successfully' : 'Package import failed',
      });
    } catch (error) {
      results.push({
        service: pkg.name,
        status: '❌',
        message: `Import error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  }

  // Test 4: Library Imports
  console.log('4. Testing library imports...');
  const libraries = [
    { name: 'google-gemini', test: async () => {
      await import('../lib/google-gemini');
      return true;
    }},
    { name: 'google-storage', test: async () => {
      await import('../lib/google-storage');
      return true;
    }},
    { name: 'google-translation', test: async () => {
      await import('../lib/google-translation');
      return true;
    }},
    { name: 'google-vision', test: async () => {
      await import('../lib/google-vision');
      return true;
    }},
    { name: 'google-text-to-speech', test: async () => {
      await import('../lib/google-text-to-speech');
      return true;
    }},
    { name: 'google-speech-to-text', test: async () => {
      await import('../lib/google-speech-to-text');
      return true;
    }},
    { name: 'google-firestore', test: async () => {
      await import('../lib/google-firestore');
      return true;
    }},
  ];

  for (const lib of libraries) {
    try {
      await lib.test();
      results.push({
        service: `lib/${lib.name}`,
        status: '✅',
        message: 'Library imported successfully',
      });
    } catch (error) {
      results.push({
        service: `lib/${lib.name}`,
        status: '❌',
        message: `Import error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  }

  // Test 5: Gemini API (if key is available)
  if (hasGeminiKey) {
    console.log('5. Testing Gemini API connection...');
    try {
      const { createGeminiChatCompletion } = await import('../lib/google-gemini');
      const result = await createGeminiChatCompletion([
        { role: 'user', content: 'Say "Hello" in one word.' },
      ], {
        maxTokens: 10,
        cache: false,
      });

      results.push({
        service: 'Gemini API',
        status: '✅',
        message: `Connected! Response: ${result.content.substring(0, 50)}...`,
      });
    } catch (error) {
      results.push({
        service: 'Gemini API',
        status: '❌',
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  }

  // Print Results
  console.log('\n📊 Test Results:\n');
  console.log('─'.repeat(60));
  results.forEach(({ service, status, message }) => {
    console.log(`${status} ${service.padEnd(40)} ${message}`);
  });
  console.log('─'.repeat(60));

  const successCount = results.filter(r => r.status === '✅').length;
  const totalCount = results.length;
  console.log(`\n✅ Passed: ${successCount}/${totalCount}`);

  if (successCount === totalCount) {
    console.log('\n🎉 All tests passed! Google Cloud integration is working.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
  }
}

// Run tests
testGoogleCloud().catch(console.error);
