import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    console.log('=== API Route Called ===');
    
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    console.log('API key found, length:', process.env.OPENAI_API_KEY.length);

    const body = await request.json();
    const { topic, words, essayType = 'classic', writingStyle = 'standard', customStyle } = body;
    
    console.log('Received topic:', topic, 'words:', words, 'type:', essayType, 'style:', writingStyle);

    // Validate input
    if (!topic || typeof topic !== 'string') {
      return NextResponse.json(
        { error: 'Topic is required and must be a string' },
        { status: 400 }
      );
    }

    if (!words || typeof words !== 'string') {
      return NextResponse.json(
        { error: 'Word count is required' },
        { status: 400 }
      );
    }

    console.log(`Generating essay for topic: "${topic}" with ${words} words`);

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Build enhanced prompt based on essay type and style
    const essayTypeInstructions: Record<string, string> = {
      classic: 'Write a traditional academic essay with a clear thesis statement, supporting evidence, and logical structure.',
      persuasive: 'Write a persuasive essay that convincingly argues a specific viewpoint with strong evidence and rhetoric.',
      personal: 'Write a personal statement that showcases unique experiences, goals, and reflections in an authentic voice.',
      'book-report': 'Write a comprehensive book report analyzing characters, themes, plot, and literary elements.',
      critique: 'Write a critical analysis that evaluates strengths, weaknesses, and overall merit of the subject.',
      compare: 'Write a compare/contrast essay that analyzes similarities and differences with balanced perspective.',
    };

    const styleInstructions = writingStyle === 'custom' && customStyle
      ? `Match the writing style of this sample: "${customStyle.substring(0, 500)}"`
      : writingStyle === 'clone'
      ? 'Use a natural, student-friendly writing style that feels authentic and personal.'
      : 'Use a college-level academic tone with clear, professional language.';

    const essayInstruction = essayTypeInstructions[essayType] || essayTypeInstructions.classic;

    // Call OpenAI GPT-4o-mini
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert academic essay writer. You create well-structured, insightful essays that meet academic standards. ${styleInstructions}`,
        },
        {
          role: 'user',
          content: `${essayInstruction}

Topic: "${topic}"
Target Length: Approximately ${words} words

Create a complete essay with:
1. Engaging introduction with clear thesis
2. Well-developed body paragraphs with evidence and analysis  
3. Strong conclusion that reinforces main points

Make it well-researched, properly structured, and compelling.`,
        },
      ],
      temperature: 0.7,
      max_tokens: parseInt(words) * 2,
    });

    const result = completion.choices[0]?.message?.content || 'No essay generated.';

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('Error generating essay:', error);
    console.error('Error details:', {
      message: error?.message,
      status: error?.status,
      type: error?.type,
    });
    
    // Handle OpenAI API errors
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

    if (error?.code === 'ENOTFOUND' || error?.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { error: 'Network error. Please check your internet connection.' },
        { status: 500 }
      );
    }

    // Return more detailed error message in development
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? `Failed to generate essay: ${error?.message || 'Unknown error'}`
      : 'Failed to generate essay. Please try again.';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

