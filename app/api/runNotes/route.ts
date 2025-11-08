import { env } from '@/lib/env';
import { createAdvancedCompletion } from '@/lib/gemini-enhanced';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!env.googleGeminiApiKey) {
      console.error('GOOGLE_GEMINI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Gemini API key is not configured. Please set the GOOGLE_GEMINI_API_KEY environment variable.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { text } = body;

    // Validate input
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      );
    }

    if (text.trim().length < 10) {
      return NextResponse.json(
        { error: 'Text must be at least 10 characters long' },
        { status: 400 }
      );
    }


    // Call Gemini API
    const completion = await createAdvancedCompletion([
      {
        role: 'system',
        content: 'You are an expert at summarizing academic content and creating concise, clear study notes. You extract key information and present it in an organized, easy-to-study format.',
      },
      {
        role: 'user',
        content: `Summarize the following text into concise study notes with bullet points:\n\n${text}`,
      },
    ], {
      temperature: 0.7,
      maxTokens: 1500,
    });

    const result = completion.choices[0]?.message?.content || 'No summary generated.';

    return NextResponse.json({ result });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStatus = (error as { status?: number })?.status;
    const errorType = (error as { type?: string })?.type;
    console.error('Error summarizing notes:', error);
    console.error('Error details:', {
      message: errorMessage,
      status: errorStatus,
      type: errorType,
    });

    // Handle Gemini API errors
    if (errorStatus === 401) {
      return NextResponse.json(
        { error: 'Invalid Gemini API key. Please check your GOOGLE_GEMINI_API_KEY environment variable.' },
        { status: 401 }
      );
    }

    if (errorStatus === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    const errorCode = (error as { code?: string })?.code;
    if (errorCode === 'ENOTFOUND' || errorCode === 'ECONNREFUSED') {
      return NextResponse.json(
        { error: 'Network error. Please check your internet connection.' },
        { status: 500 }
      );
    }

    // Return more detailed error message in development
    const responseMessage = env.nodeEnv === 'development'
      ? `Failed to summarize notes: ${errorMessage}`
      : 'Failed to summarize notes. Please try again.';

    return NextResponse.json(
      { error: responseMessage },
      { status: 500 }
    );
  }
}
