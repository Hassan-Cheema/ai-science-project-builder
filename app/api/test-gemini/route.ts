// Simple test endpoint to verify Gemini API connection
import { env } from '@/lib/env';
import { createAdvancedCompletion } from '@/lib/gemini-enhanced';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!env.googleGeminiApiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'GOOGLE_GEMINI_API_KEY is not configured in .env file',
        },
        { status: 500 }
      );
    }

    // Test simple completion
    const result = await createAdvancedCompletion(
      [
        {
          role: 'user',
          content: 'Say "Hello, Gemini is working!" in one sentence.',
        },
      ],
      {
        maxTokens: 50,
        cache: false,
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Gemini API is working!',
      response: result.choices[0]?.message?.content || 'No response',
      usage: result.usage,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error('Gemini test error:', errorMessage);
    console.error('Error stack:', errorStack);

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        stack: env.nodeEnv === 'development' ? errorStack : undefined,
        hint: 'Check your GOOGLE_GEMINI_API_KEY in .env file and restart the server',
      },
      { status: 500 }
    );
  }
}
