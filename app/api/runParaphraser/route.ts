import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { text, mode = 'paraphrase' } = body;

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

    if (!['paraphrase', 'humanize'].includes(mode)) {
      return NextResponse.json(
        { error: 'Mode must be either "paraphrase" or "humanize"' },
        { status: 400 }
      );
    }


    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Build prompt based on mode
    const systemPrompt = mode === 'humanize'
      ? 'You are an expert at making AI-generated text sound natural and human-written. Your task is to rewrite text to feel authentic, natural, and human-like. Remove AI-like patterns, vary sentence structure, add natural flow, and make it sound like a real person wrote it. Preserve the original meaning while making it sound completely human and original.'
      : 'You are an expert at paraphrasing text while maintaining the original meaning. Your task is to rewrite the text using different words, phrases, and sentence structures while keeping the core message and meaning intact. Make the paraphrased version clear, natural, and well-written.';

    const userPrompt = mode === 'humanize'
      ? `Rewrite the following text to make it sound natural and human-written. Remove any AI-like patterns and make it feel authentic:\n\n${text}`
      : `Paraphrase the following text while maintaining its original meaning:\n\n${text}`;

    // Call OpenAI GPT-4o-mini
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: mode === 'humanize' ? 0.8 : 0.7,
      max_tokens: Math.min(4000, text.length * 3),
    });

    const result = completion.choices[0]?.message?.content || 'No result generated.';

    return NextResponse.json({ result });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStatus = (error as { status?: number })?.status;
    const errorType = (error as { type?: string })?.type;
    console.error('Error processing text:', error);
    console.error('Error details:', {
      message: errorMessage,
      status: errorStatus,
      type: errorType,
    });

    // Handle OpenAI API errors
    if (errorStatus === 401) {
      return NextResponse.json(
        { error: 'Invalid OpenAI API key. Please check your OPENAI_API_KEY in .env.local' },
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
    const responseMessage = process.env.NODE_ENV === 'development'
      ? `Failed to process text: ${errorMessage}`
      : 'Failed to process text. Please try again.';

    return NextResponse.json(
      { error: responseMessage },
      { status: 500 }
    );
  }
}
