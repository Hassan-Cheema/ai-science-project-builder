import { env } from '@/lib/env';
import { createStreamingCompletion } from '@/lib/gemini-enhanced';
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
    const { name, role, skills, experience, careerGoal } = body;

    // Validate input
    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Name is required and must be a string' },
        { status: 400 }
      );
    }

    if (!role || typeof role !== 'string') {
      return NextResponse.json(
        { error: 'Role is required and must be a string' },
        { status: 400 }
      );
    }

    if (!skills || typeof skills !== 'string') {
      return NextResponse.json(
        { error: 'Skills are required' },
        { status: 400 }
      );
    }

    if (!experience || typeof experience !== 'string') {
      return NextResponse.json(
        { error: 'Experience is required' },
        { status: 400 }
      );
    }


    // Build the prompt
    const prompt = `Create a professional, ATS-friendly resume for the following candidate:

Name: ${name}
Target Role: ${role}
${careerGoal ? `Career Goal: ${careerGoal}\n` : ''}
Skills: ${skills}

Work Experience:
${experience}

Please format the resume with the following sections (use section headers in ALL CAPS):

PROFESSIONAL SUMMARY
Write a compelling 2-3 sentence summary highlighting key strengths and value proposition.

CORE COMPETENCIES
List key skills organized by category (Technical Skills, Soft Skills, Tools, etc.)
Use bullet points with • symbol

PROFESSIONAL EXPERIENCE
Format each position as:
[Job Title] | [Company Name] | [Dates]
• Achievement/responsibility with action verbs
• Quantified results where possible
• 3-5 bullet points per role

EDUCATION
[Degree] in [Field] | [University] | [Year]
Include relevant coursework or honors if applicable

CERTIFICATIONS & ADDITIONAL INFORMATION
List any relevant certifications, languages, or professional development

Format instructions:
- Use ALL CAPS for section headers
- Use • for bullet points
- Keep it professional and ATS-friendly
- Focus on achievements and impact
- Tailor content for ${role} position`;

    // Call Gemini API with streaming
    const stream = createStreamingCompletion([
      {
        role: 'system',
        content: `You are an expert resume writer and career coach with 15+ years of experience. You create professional, ATS-optimized resumes that get interviews. Your resumes are well-formatted, achievement-focused, and tailored to the target role.`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ], {
      temperature: 0.7,
      maxTokens: 2000,
    });

    // Create a readable stream for the response
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        } catch (streamError) {
          console.error('Streaming error:', streamError);
          const errorMsg = streamError instanceof Error ? streamError.message : 'Streaming failed';
          controller.enqueue(encoder.encode(`\n\n[Error: ${errorMsg}]`));
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStatus = (error as { status?: number })?.status;
    const errorType = (error as { type?: string })?.type;
    console.error('Error generating resume:', error);
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
      ? `Failed to generate resume: ${errorMessage}`
      : 'Failed to generate resume. Please try again.';

    return NextResponse.json(
      { error: responseMessage },
      { status: 500 }
    );
  }
}
