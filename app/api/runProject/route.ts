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
    const { topic, grade, budget, goal } = body;

    // Validate input
    if (!topic || typeof topic !== 'string') {
      return NextResponse.json(
        { error: 'Topic is required and must be a string' },
        { status: 400 }
      );
    }

    if (!grade || typeof grade !== 'string') {
      return NextResponse.json(
        { error: 'Grade is required' },
        { status: 400 }
      );
    }

    if (!budget || typeof budget !== 'string' || !['Low', 'Medium', 'High'].includes(budget)) {
      return NextResponse.json(
        { error: 'Budget is required and must be Low, Medium, or High' },
        { status: 400 }
      );
    }

    if (!goal || typeof goal !== 'string' || !['Demo', 'Competition', 'Research'].includes(goal)) {
      return NextResponse.json(
        { error: 'Goal is required and must be Demo, Competition, or Research' },
        { status: 400 }
      );
    }


    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Build context-aware instructions based on budget and goal
    const budgetGuidance = {
      Low: 'Use only basic household items and inexpensive materials (under $20). Focus on creativity with common items like baking soda, vinegar, paper, string, etc. Provide exact quantities and where to obtain materials. Include alternatives if certain items are not available.',
      Medium: 'Include standard lab supplies and materials typically available in school science labs ($20-$100). Can include items like test tubes, basic chemicals, measuring tools, etc. Specify exact brands/models when helpful. Provide alternatives for expensive items.',
      High: 'Can utilize professional-grade equipment and specialized materials ($100+). Include advanced tools, sensors, specialized components, or professional laboratory equipment if appropriate. Provide detailed specifications, suppliers, and alternatives.',
    };

    const goalGuidance = {
      Demo: 'Focus on visual impact and clear demonstration of scientific principles. Make it engaging for an audience, easy to observe, and clearly illustrates the concept. Include presentation techniques, visual aids suggestions, and audience engagement tips.',
      Competition: 'Create a project suitable for science fair competition with rigorous methodology, strong scientific validity, measurable results, and potential for innovation. Emphasize originality, thoroughness, professional presentation, data visualization, and what judges look for.',
      Research: 'Design a comprehensive research project with clear objectives, detailed methodology, data collection procedures, analysis methods, statistical considerations, and potential for deeper investigation. Focus on scientific rigor, reproducibility, ethical considerations, and contributing to knowledge.',
    };

    const gradeLevelGuidance: Record<string, string> = {
      '5': 'Elementary level - Simple concepts, hands-on activities, visual learning, basic vocabulary',
      '6': 'Middle elementary - Slightly more complex concepts, introduction to variables, basic measurement',
      '7': 'Upper elementary - More structured experiments, introduction to scientific method, data recording',
      '8': 'Middle school - Scientific method application, more detailed analysis, introduction to scientific writing',
      '9': 'High school freshman - Scientific rigor, detailed methodology, data analysis, written reports',
      '10': 'High school sophomore - Advanced methodology, statistical analysis, peer review considerations',
      '11': 'High school junior - College-level concepts, sophisticated analysis, research paper format',
      '12': 'High school senior - Advanced research, publication-ready quality, original contribution potential',
    };

    // Use GPT-4o for world-class quality (best model for comprehensive responses)
    const useModel = 'gpt-4o';

    // Call OpenAI with enhanced prompt for world-class results
    const stream = await openai.chat.completions.create({
      model: useModel,
      messages: [
        {
          role: 'system',
          content: `You are a world-renowned science educator, curriculum designer, and research scientist with decades of experience creating award-winning science projects. You have a PhD in Science Education, have mentored hundreds of science fair winners, and your projects have won international competitions.

Your expertise includes:
- Creating projects that are both educationally rigorous and engaging
- Designing experiments with clear scientific methodology
- Ensuring age-appropriate complexity and safety
- Writing comprehensive, detailed project plans that students can follow independently
- Integrating real-world applications and cutting-edge research connections
- Providing actionable insights and professional-quality guidance

CRITICAL REQUIREMENTS FOR WORLD-CLASS OUTPUT:
1. Be EXTREMELY detailed and comprehensive - every section should be thorough and well-developed
2. Use professional scientific terminology appropriate for the grade level
3. Include specific measurements, quantities, and procedures - no vague instructions
4. Connect concepts to real-world applications and current scientific research
5. Provide multiple learning pathways and extensions
6. Include troubleshooting tips and common mistakes to avoid
7. Make it inspiring and motivating for students
8. Format beautifully with clear structure using markdown (## for main sections, ### for subsections)
9. NEVER use JSON - use beautifully formatted text
10. Write as if this will be published or presented professionally`,
        },
        {
          role: 'user',
          content: `Create a WORLD-CLASS, comprehensive, award-winning science project plan that would impress judges, educators, and researchers. This must be publication-quality and competition-ready.

PROJECT SPECIFICATIONS:
======================

Topic: ${topic}
Grade Level: Grade ${grade} (${gradeLevelGuidance[grade] || 'Appropriate complexity for this level'})
Budget: ${budget} Budget
  ${budgetGuidance[budget as keyof typeof budgetGuidance]}
Project Goal: ${goal}
  ${goalGuidance[goal as keyof typeof goalGuidance]}

REQUIRED OUTPUT STRUCTURE (BE EXTREMELY DETAILED):
===================================================

## PROJECT TITLE
[Create a captivating, professional title that clearly conveys the project focus. Make it memorable and scientific yet accessible.]

## EXECUTIVE SUMMARY
[Write a compelling 4-6 sentence summary that explains: What the project is, why it matters, what will be learned, and why it's scientifically significant. This should be engaging enough to hook any reader.]

## LEARNING OBJECTIVES
[Provide 4-6 specific, measurable learning objectives. Use action verbs (students will understand, analyze, demonstrate, etc.). Connect to educational standards where relevant.]

By completing this project, students will:
- [Specific objective 1]
- [Specific objective 2]
- [Continue with detailed objectives]

## BACKGROUND & SCIENTIFIC CONTEXT
[Provide 3-4 paragraphs of rich scientific background: Explain the scientific principles involved, historical context, current research in this area, and real-world applications. Make connections to cutting-edge science and recent discoveries. This should demonstrate deep scientific knowledge.]

## HYPOTHESIS
[Write a clear, testable hypothesis in proper scientific format: "If [independent variable], then [dependent variable], because [scientific reasoning]." Provide detailed reasoning for why this hypothesis is scientifically sound.]

## MATERIALS & EQUIPMENT LIST
[Organize materials by category. Include exact quantities, specifications, brands (when relevant), and individual costs. Total should align with ${budget} budget. Also include alternatives/substitutions.]

### Required Materials:
- Category 1: [Name]
  - Item with exact quantity and specifications (Cost: $X)
  - Item with exact quantity and specifications (Cost: $X)

- Category 2: [Name]
  - [Continue with all items]

Total Estimated Cost: $XX.XX (within ${budget} budget)
Alternative Materials: [Provide substitutions if items aren't available]

## DETAILED METHODOLOGY

### Phase 1: Preparation & Setup
[Detailed preparation steps with specific measurements and setup instructions]

### Phase 2: Procedure
[Provide comprehensive, numbered step-by-step instructions. Each step should include:
- Exact actions to take
- Specific measurements
- Time requirements
- What to observe
- Common pitfalls to avoid
- Quality control checks]

1. [Step Name]
   - Action: [Detailed action]
   - Measurement: [Exact measurements]
   - Expected Observation: [What to look for]
   - Important: [Warnings or tips]

2. [Continue with 10-15 detailed steps minimum]

### Phase 3: Data Collection Protocol
[Provide detailed instructions on HOW to collect data, WHEN to collect it, WHAT format to use, and HOW MANY trials/samples needed]

## DATA COLLECTION & RECORDING

### Variables
- Independent Variable: [Clearly defined with units]
- Dependent Variable: [Clearly defined with units]
- Control Variables: [List all controlled variables and why they matter]
- Control Group: [If applicable, describe the control]

### Data Tables
[Provide template data tables with proper headers, units, and expected data ranges]

### Measurements & Observations
[Detail exactly what measurements to take, how often, what tools to use, and precision required]

## EXPECTED RESULTS & PREDICTIONS

[Provide detailed predictions of what results should show, including:
- Expected patterns or trends
- Quantitative predictions with ranges
- Visual representations (graphs/charts students should expect)
- Scientific explanations for why these results are expected
- Potential variations and what they mean]

## ANALYSIS & INTERPRETATION

### Data Analysis Methods
[Explain how to analyze the data: calculations, statistical methods, graph types, etc.]

### Interpretation Guide
[Provide detailed explanations of what different results mean scientifically. Include:
- How to interpret positive/negative correlations
- What statistical significance means (if applicable)
- How to connect results to scientific principles
- What unexpected results might indicate]

### Discussion Points
[4-6 key discussion points connecting results to broader scientific concepts]

## EXPERIMENTAL CONTROLS & VALIDITY

[Explain all control measures taken to ensure valid results:
- What controls are included and why
- How to ensure reproducibility
- Variables being controlled
- Potential sources of error and how to minimize them]

## SAFETY CONSIDERATIONS

[Comprehensive safety section including:
- Required safety equipment
- Hazard identification
- Adult supervision requirements
- Emergency procedures
- Material safety data considerations
- Age-appropriate safety protocols]

## VARIABLES TO TEST & EXTENSIONS

[Provide 4-6 specific variables students could test to extend the project, with brief explanations of what each would investigate]

## ADVANCED EXTENSIONS & RESEARCH CONNECTIONS

[Suggest 3-4 sophisticated extensions that connect to:
- Current scientific research
- Real-world applications
- Interdisciplinary connections
- Future research directions
- Career connections]

## REFERENCES & FURTHER READING

[Provide 4-6 high-quality references: scientific papers, educational resources, books, or websites for deeper learning]

## PRESENTATION & DOCUMENTATION GUIDE
[Based on ${goal} goal, provide comprehensive presentation advice:
- Display board layout suggestions
- Key points to highlight
- Visual aid recommendations
- Oral presentation tips
- Documentation requirements
- What evaluators/judges look for]

## TROUBLESHOOTING GUIDE
[Common problems and solutions:
- Problem 1: [Description] -> Solution: [Detailed fix]
- Problem 2: [Description] -> Solution: [Detailed fix]
- Continue with 5-6 common issues]

## SUCCESS CRITERIA
[Clear, measurable indicators of project success]

## TIMELINE & PLANNING
[Suggested timeline broken into phases with time estimates for each component]

QUALITY STANDARDS:
==================

This project plan must be:
✅ Scientifically rigorous and methodologically sound
✅ Age-appropriate for Grade ${grade} students
✅ Comprehensive enough for independent execution
✅ Engaging and inspiring
✅ Competition/publication-ready quality
✅ Aligned with ${budget} budget constraints
✅ Optimized for ${goal} goal
✅ Professional and polished in presentation

Write with the depth, detail, and quality expected from a world-class science education resource. Every section should be thorough, actionable, and inspiring.`,
        },
      ],
      temperature: 0.8, // Slightly higher for more creativity while maintaining quality
      max_tokens: 4000, // Increased for comprehensive responses
      stream: true,
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
        } catch (error) {
          controller.error(error);
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
    const errorCode = (error as { code?: string })?.code;
    const errorType = (error as { type?: string })?.type;

    console.error('Error generating project:', error);
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

    if (errorCode === 'ENOTFOUND' || errorCode === 'ECONNREFUSED') {
      return NextResponse.json(
        { error: 'Network error. Please check your internet connection.' },
        { status: 500 }
      );
    }

    // Return more detailed error message in development
    const responseMessage = process.env.NODE_ENV === 'development'
      ? `Failed to generate project: ${errorMessage}`
      : 'Failed to generate project. Please try again.';

    return NextResponse.json(
      { error: responseMessage },
      { status: 500 }
    );
  }
}
