import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    console.log('=== Essay Outline API Route Called ===');
    
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { topic, essayType = 'classic' } = body;
    
    console.log('Received topic:', topic, 'type:', essayType);

    if (!topic || typeof topic !== 'string') {
      return NextResponse.json(
        { error: 'Topic is required and must be a string' },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const essayTypeInstructions: Record<string, string> = {
      classic: 'Create a traditional essay outline with introduction (hook, background, thesis), body paragraphs (topic sentences and supporting points), and conclusion.',
      persuasive: 'Create a persuasive essay outline with a strong position statement, supporting arguments with evidence, counterarguments, and a compelling conclusion.',
      personal: 'Create a personal statement outline with opening hook, personal experiences/stories, lessons learned, and future goals.',
      'book-report': 'Create a book report outline with introduction (book details), plot summary, character analysis, themes, and critical evaluation.',
      critique: 'Create a critical analysis outline with introduction, summary of work, strengths analysis, weaknesses analysis, and overall evaluation.',
      compare: 'Create a compare/contrast outline with introduction, point-by-point comparisons, contrasts, and synthesis conclusion.',
    };

    const instruction = essayTypeInstructions[essayType] || essayTypeInstructions.classic;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
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
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const result = completion.choices[0]?.message?.content || 'No outline generated.';

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('Error generating outline:', error);
    
    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid OpenAI API key. Please check your OPENAI_API_KEY in .env.local' },
        { status: 401 }
      );
    }
    
    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    const errorMessage = process.env.NODE_ENV === 'development' 
      ? `Failed to generate outline: ${error?.message || 'Unknown error'}`
      : 'Failed to generate outline. Please try again.';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

