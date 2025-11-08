// Enhanced Essay Generator API with advanced features
import { env } from '@/lib/env';
import { createAdvancedCompletion, DEFAULT_MODELS } from '@/lib/gemini-enhanced';
import { checkRateLimit } from '@/lib/rate-limit';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Runtime configuration
// Note: Edge runtime removed - Gemini SDK requires Node.js APIs
export const maxDuration = 60; // Max duration in seconds

// Input validation schema
const essayRequestSchema = z.object({
  topic: z.string().min(1, 'Topic is required').max(500, 'Topic too long'),
  words: z.string().regex(/^\d+$/, 'Word count must be a number'),
  essayType: z.enum(['classic', 'persuasive', 'personal', 'book-report', 'critique', 'compare']).default('classic'),
  writingStyle: z.enum(['standard', 'clone', 'custom']).default('standard'),
  customStyle: z.string().optional(),
  model: z.enum(['gemini-1.5-pro-latest', 'gemini-1.5-flash-latest', 'gemini-1.5-flash-8b-latest']).optional(),
  userId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous';
    const identifier = `essay:${clientIp}`;

    // Check rate limit
    const rateLimitResult = await checkRateLimit(identifier, 'free');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          limit: rateLimitResult.limit,
          remaining: rateLimitResult.remaining,
          reset: rateLimitResult.reset,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          },
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = essayRequestSchema.parse(body);
    const { topic, words, essayType, writingStyle, customStyle, model, userId } = validatedData;

    // Select model (default to Gemini Pro for better quality)
    const selectedModel = model || DEFAULT_MODELS.quality;

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
    const wordCount = parseInt(words);
    const maxTokens = Math.min(wordCount * 2, 8000); // Cap at 8000 tokens

    // Create enhanced completion
    const completion = await createAdvancedCompletion(
      [
        {
          role: 'system',
          content: `You are an expert academic essay writer with a PhD in English Literature. You create well-structured, insightful essays that meet academic standards. ${styleInstructions}

Your essays should:
- Have compelling introductions with clear thesis statements
- Include well-researched evidence and analysis
- Demonstrate critical thinking and original insights
- Use proper academic formatting and citations where appropriate
- Conclude with strong summaries that reinforce main points`,
        },
        {
          role: 'user',
          content: `${essayInstruction}

Topic: "${topic}"
Target Length: Approximately ${wordCount} words

Create a complete essay with:
1. Engaging introduction with clear thesis
2. Well-developed body paragraphs with evidence and analysis
3. Strong conclusion that reinforces main points

Make it well-researched, properly structured, and compelling. Ensure it meets academic standards and demonstrates critical thinking.`,
        },
      ],
      {
        model: selectedModel,
        temperature: 0.7,
        maxTokens,
        topP: 0.9,
        frequencyPenalty: 0.3,
        presencePenalty: 0.3,
        cache: true,
        cacheTTL: 7200, // Cache for 2 hours
      }
    );

    const result = completion.choices[0]?.message?.content || 'No essay generated.';

    // Log usage (if Supabase is configured)
    if (userId && env.supabaseUrl) {
      // Async logging (don't await)
      fetch(`${env.baseUrl}/api/log-usage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          tool: 'essay-helper',
          input: { topic, essayType, words },
          model: selectedModel,
        }),
      }).catch(() => {
        // Silently fail logging
      });
    }

    return NextResponse.json(
      {
        result,
        model: selectedModel,
        tokens: completion.usage?.total_tokens,
        remaining: rateLimitResult.remaining - 1,
      },
      {
        headers: {
          'X-RateLimit-Remaining': (rateLimitResult.remaining - 1).toString(),
          'X-RateLimit-Reset': rateLimitResult.reset.toString(),
        },
      }
    );
  } catch (error: unknown) {
    console.error('Error generating essay:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid request',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    const errorStatus = (error as { status?: number })?.status;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorString = errorMessage.toLowerCase();

    // Check if it's a Gemini API key error
    if (errorString.includes('api key') || errorString.includes('gemini') || errorString.includes('google') || errorStatus === 401) {
      return NextResponse.json(
        {
          error: 'Gemini API error: ' + errorMessage,
          hint: 'Please check your GOOGLE_GEMINI_API_KEY in .env file and restart the server',
        },
        { status: 401 }
      );
    }

    // Handle Gemini API errors
    if (errorStatus === 429) {
      return NextResponse.json(
        { error: 'Gemini API rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Return error message
    const responseMessage = env.nodeEnv === 'development'
      ? `Failed to generate essay: ${errorMessage}`
      : 'Failed to generate essay. Please try again.';

    return NextResponse.json(
      {
        error: responseMessage,
        details: env.nodeEnv === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
