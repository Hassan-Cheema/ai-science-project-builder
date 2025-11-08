import { NextRequest, NextResponse } from 'next/server';
import { createAdvancedCompletion } from '@/lib/gemini-enhanced';
import { env } from '@/lib/env';

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
    const { topic, type } = body;

    // Validate input
    if (!topic || typeof topic !== 'string') {
      return NextResponse.json(
        { error: 'Topic is required and must be a string' },
        { status: 400 }
      );
    }

    if (!type || typeof type !== 'string') {
      return NextResponse.json(
        { error: 'Type is required' },
        { status: 400 }
      );
    }


    // Call Gemini API
    const completion = await createAdvancedCompletion([
      {
        role: 'system',
        content: 'You are a creative innovator and idea generator. You create unique, practical, and inspiring ideas across various domains. Your ideas are well-thought-out and actionable.',
      },
      {
        role: 'user',
        content: `Generate 5 unique ${type} ideas related to ${topic}. For each, include a title and a short 2-line description.

Return the response in the following JSON format:
{
  "ideas": [
    {
      "title": "Idea Title Here",
      "description": "A concise 2-line description of the idea that explains what it is and why it's valuable."
    }
  ]
}

Make sure each idea is creative, unique, and relevant to ${topic}. The ideas should be appropriate for the ${type} category.`,
      },
    ], {
      temperature: 0.8, // Higher temperature for more creative ideas
      maxTokens: 1500,
      responseFormat: { type: "json_object" },
    });

    const resultText = completion.choices[0]?.message?.content || '{"ideas": []}';

    // Parse the JSON response
    let parsedResult;
    try {
      parsedResult = JSON.parse(resultText);
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    // Validate the structure
    if (!parsedResult.ideas || !Array.isArray(parsedResult.ideas)) {
      console.error('Invalid response structure:', parsedResult);
      return NextResponse.json(
        { error: 'Invalid response from AI' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ideas: parsedResult.ideas });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStatus = (error as { status?: number })?.status;
    const errorType = (error as { type?: string })?.type;

    console.error('Error generating ideas:', {
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
      ? `Failed to generate ideas: ${errorMessage}`
      : 'Failed to generate ideas. Please try again.';

    return NextResponse.json(
      { error: responseMessage },
      { status: 500 }
    );
  }
}
