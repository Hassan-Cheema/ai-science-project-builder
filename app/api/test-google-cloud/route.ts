// Test API route for Google Cloud integration
import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';

export async function GET(request: NextRequest) {
  const results: Array<{ service: string; status: 'success' | 'error' | 'skipped'; message: string }> = [];

  // Test 1: Environment Configuration
  results.push({
    service: 'Environment Variables',
    status: env.googleCloudProjectId || env.googleGeminiApiKey ? 'success' : 'skipped',
    message: env.googleCloudProjectId
      ? `Project ID: ${env.googleCloudProjectId}`
      : env.googleGeminiApiKey
      ? 'Gemini API key configured'
      : 'No Google Cloud configuration found',
  });

  // Test 2: Service Account Key File
  if (env.googleApplicationCredentials) {
    try {
      const fs = await import('fs');
      const path = env.googleApplicationCredentials;
      const exists = fs.existsSync(path);
      if (exists) {
        const keyData = JSON.parse(fs.readFileSync(path, 'utf-8'));
        results.push({
          service: 'Service Account Key',
          status: 'success',
          message: `Found key for project: ${keyData.project_id || 'unknown'}`,
        });
      } else {
        results.push({
          service: 'Service Account Key',
          status: 'error',
          message: `File not found: ${path}`,
        });
      }
    } catch (error) {
      results.push({
        service: 'Service Account Key',
        status: 'error',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  }

  // Test 3: Package Imports
  const packages = [
    '@google/genai',
    '@google-cloud/storage',
    '@google-cloud/translate',
    '@google-cloud/vision',
    '@google-cloud/text-to-speech',
    '@google-cloud/speech',
    'firebase-admin',
  ];

  for (const pkg of packages) {
    try {
      await import(pkg);
      results.push({
        service: pkg,
        status: 'success',
        message: 'Package imported successfully',
      });
    } catch (error) {
      results.push({
        service: pkg,
        status: 'error',
        message: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  }

  // Test 4: Library Imports
  const libraries = [
    { name: 'google-gemini', path: '@/lib/google-gemini' },
    { name: 'google-storage', path: '@/lib/google-storage' },
    { name: 'google-translation', path: '@/lib/google-translation' },
    { name: 'google-vision', path: '@/lib/google-vision' },
    { name: 'google-text-to-speech', path: '@/lib/google-text-to-speech' },
    { name: 'google-speech-to-text', path: '@/lib/google-speech-to-text' },
    { name: 'google-firestore', path: '@/lib/google-firestore' },
  ];

  for (const lib of libraries) {
    try {
      await import(lib.path);
      results.push({
        service: `lib/${lib.name}`,
        status: 'success',
        message: 'Library imported successfully',
      });
    } catch (error) {
      results.push({
        service: `lib/${lib.name}`,
        status: 'error',
        message: `Import error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  }

  // Test 5: Gemini API Connection (if key is available)
  if (env.googleGeminiApiKey) {
    try {
      const { createGeminiChatCompletion } = await import('@/lib/google-gemini');
      const result = await createGeminiChatCompletion([
        { role: 'user', content: 'Say "Hello" in one word only.' },
      ], {
        maxTokens: 10,
        cache: false,
      });

      results.push({
        service: 'Gemini API Connection',
        status: 'success',
        message: `Connected! Response: "${result.content.trim()}"`,
      });
    } catch (error) {
      results.push({
        service: 'Gemini API Connection',
        status: 'error',
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  } else {
    results.push({
      service: 'Gemini API Connection',
      status: 'skipped',
      message: 'Gemini API key not configured',
    });
  }

  // Test 6: Storage Client Initialization (if configured)
  if (env.googleCloudStorageBucket) {
    try {
      const { getStorageClient } = await import('@/lib/google-storage');
      const client = getStorageClient();
      results.push({
        service: 'Storage Client',
        status: 'success',
        message: 'Storage client initialized successfully',
      });
    } catch (error) {
      results.push({
        service: 'Storage Client',
        status: 'error',
        message: `Initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  } else {
    results.push({
      service: 'Storage Client',
      status: 'skipped',
      message: 'Storage bucket not configured',
    });
  }

  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  const skippedCount = results.filter(r => r.status === 'skipped').length;

  return NextResponse.json({
    summary: {
      total: results.length,
      success: successCount,
      errors: errorCount,
      skipped: skippedCount,
    },
    results,
    timestamp: new Date().toISOString(),
  });
}

