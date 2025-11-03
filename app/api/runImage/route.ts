// AI Image Generation API using DALL-E 3
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { openai } from '@/lib/openai-enhanced';
import { checkRateLimit } from '@/lib/rate-limit';
import { env } from '@/lib/env';

// Runtime configuration
export const runtime = 'edge';
export const maxDuration = 60;

// Input validation schema
const imageRequestSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters').max(1000),
  size: z.enum(['1024x1024', '1792x1024', '1024x1792']).default('1024x1024'),
  quality: z.enum(['standard', 'hd']).default('standard'),
  style: z.enum(['vivid', 'natural']).default('vivid'),
  n: z.number().int().min(1).max(1).default(1), // DALL-E 3 only supports n=1
  userId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Check if image generation is enabled
    if (!env.enableImageGeneration) {
      return NextResponse.json(
        { error: 'Image generation is not enabled. Set ENABLE_IMAGE_GENERATION=true in your environment variables.' },
        { status: 403 }
      );
    }

    // Get client IP for rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous';
    const identifier = `image:${clientIp}`;

    // Check rate limit (stricter for image generation)
    const rateLimitResult = await checkRateLimit(identifier, 'free');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          limit: rateLimitResult.limit,
          remaining: rateLimitResult.remaining,
          reset: rateLimitResult.reset,
        },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = imageRequestSchema.parse(body);
    const { prompt, size, quality, style, userId } = validatedData;

    // Enhance prompt for better results
    const enhancedPrompt = `${prompt}. High quality, detailed, professional artwork.`;

    // Generate image using DALL-E 3
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: enhancedPrompt,
      size: size,
      quality: quality,
      style: style,
      n: 1,
    });

    if (!response.data || response.data.length === 0) {
      throw new Error('No image data returned from OpenAI');
    }

    const imageUrl = response.data[0]?.url;
    const revisedPrompt = response.data[0]?.revised_prompt;

    if (!imageUrl) {
      throw new Error('No image URL returned from OpenAI');
    }

    // Log usage
    if (userId && env.supabaseUrl) {
      fetch(`${env.baseUrl}/api/log-usage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          tool: 'image-generator',
          input: { prompt, size, quality, style },
        }),
      }).catch(() => {});
    }

    return NextResponse.json({
      imageUrl,
      revisedPrompt,
      remaining: rateLimitResult.remaining - 1,
    });
  } catch (error: unknown) {
    console.error('Error generating image:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      );
    }

    const errorStatus = (error as { status?: number })?.status;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Handle content policy violations
    if (errorStatus === 400 && errorMessage.includes('content_policy')) {
      return NextResponse.json(
        { error: 'Your prompt may contain content that violates our content policy. Please revise your prompt.' },
        { status: 400 }
      );
    }

    const responseMessage = env.nodeEnv === 'development'
      ? `Failed to generate image: ${errorMessage}`
      : 'Failed to generate image. Please try again.';

    return NextResponse.json({ error: responseMessage }, { status: 500 });
  }
}

