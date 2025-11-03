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
    const { topic, difficulty } = body;

    // Validate input
    if (!topic || typeof topic !== 'string') {
      return NextResponse.json(
        { error: 'Topic is required and must be a string' },
        { status: 400 }
      );
    }

    if (!difficulty || typeof difficulty !== 'string') {
      return NextResponse.json(
        { error: 'Difficulty is required' },
        { status: 400 }
      );
    }


    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Call OpenAI GPT-4o-mini
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert educator who creates engaging and educational quizzes. Your quizzes are well-formatted, clear, and appropriately challenging for the specified difficulty level.',
        },
        {
          role: 'user',
          content: `Generate a ${difficulty} level quiz about ${topic} with 5 questions and answers in bullet format.

Format the quiz as follows:
- Number each question (1, 2, 3, etc.)
- Provide clear, specific questions
- List the answer on a new line after each question
- Make questions appropriate for ${difficulty} difficulty level

Example format:
1. [Question text]
Answer: [Answer text]

2. [Question text]
Answer: [Answer text]

Please generate the quiz now.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const result = completion.choices[0]?.message?.content || 'No quiz generated.';

    return NextResponse.json({ result });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStatus = (error as { status?: number })?.status;
    const errorType = (error as { type?: string })?.type;
    console.error('Error generating quiz:', error);
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
      ? `Failed to generate quiz: ${errorMessage}`
      : 'Failed to generate quiz. Please try again.';

    return NextResponse.json(
      { error: responseMessage },
      { status: 500 }
    );
  }
}

