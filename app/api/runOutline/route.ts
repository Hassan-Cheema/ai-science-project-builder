import { NextRequest, NextResponse } from 'next/server';
import { createAdvancedCompletion } from '@/lib/gemini-enhanced';
import { env } from '@/lib/env';

export async function POST(request: NextRequest) {
  try {
    if (!env.googleGeminiApiKey) {
      console.error('GOOGLE_GEMINI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Gemini API key is not configured. Please set the GOOGLE_GEMINI_API_KEY environment variable.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { topic, essayType = 'classic' } = body;

    if (!topic || typeof topic !== 'string') {
      return NextResponse.json(
        { error: 'Topic is required and must be a string' },
        { status: 400 }
      );
    }

    const essayTypeInstructions: Record<string, string> = {
      classic: 'Create a traditional essay outline with introduction (hook, background, thesis), body paragraphs (topic sentences and supporting points), and conclusion.',
      persuasive: 'Create a persuasive essay outline with a strong position statement, supporting arguments with evidence, counterarguments, and a compelling conclusion.',
      personal: 'Create a personal statement outline with opening hook, personal experiences/stories, lessons learned, and future goals.',
      'book-report': 'Create a book report outline with introduction (book details), plot summary, character analysis, themes, and critical evaluation.',
      critique: 'Create a critical analysis outline with introduction, summary of work, strengths analysis, weaknesses analysis, and overall evaluation.',
      compare: 'Create a compare/contrast outline with introduction, point-by-point comparisons, contrasts, and synthesis conclusion.',
    };

    const instruction = essayTypeInstructions[essayType] || essayTypeInstructions.classic;

    const completion = await createAdvancedCompletion([
      {
        role: 'system',
        content: `You are an expert at creating essay outlines. You provide clear, detailed, and well-structured outlines that help students organize their thoughts.`,
      },
      {
        role: 'user',
        content: `${instruction}

Topic: "${topic}"

Create a detailed essay outline with:
- Roman numerals for main sections (I, II, III)
- Capital letters for main points (A, B, C)
- Numbers for supporting details (1, 2, 3)

Make it comprehensive and easy to follow.`,
      },
    ], {
      temperature: 0.7,
      maxTokens: 1500,
    });

    const result = completion.choices[0]?.message?.content || 'No outline generated.';

    return NextResponse.json({ result });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStatus = (error as { status?: number })?.status;
    console.error('Error generating outline:', error);

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

    const responseMessage = env.nodeEnv === 'development'
      ? `Failed to generate outline: ${errorMessage}`
      : 'Failed to generate outline. Please try again.';

    return NextResponse.json(
      { error: responseMessage },
      { status: 500 }
    );
  }
}
