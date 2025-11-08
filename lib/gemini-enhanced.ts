// Enhanced Gemini client with OpenAI-compatible interface
import { createGeminiChatCompletion, createGeminiStreamingCompletion, DEFAULT_GEMINI_MODELS, GEMINI_MODELS, type GeminiGenerationOptions } from './google-gemini';
import { getCache, setCache, generateCacheKey } from './cache';
import { z } from 'zod';

// Export models for compatibility
export const MODELS = GEMINI_MODELS;
export const DEFAULT_MODELS = DEFAULT_GEMINI_MODELS;

// Advanced generation options (similar to OpenAI interface)
export interface AdvancedGenerationOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  responseFormat?: { type: 'json_object' } | { type: 'text' };
  stream?: boolean;
  cache?: boolean;
  cacheTTL?: number;
}

// Message type compatible with OpenAI
export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

// Enhanced chat completion with caching and advanced features
export async function createAdvancedCompletion(
  messages: ChatMessage[],
  options: AdvancedGenerationOptions = {}
): Promise<{
  choices: Array<{
    message: {
      content: string | null;
      role: string;
    };
  }>;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    total_tokens?: number;
  };
}> {
  const {
    model = DEFAULT_MODELS.standard,
    temperature = 0.7,
    maxTokens = 2000,
    topP = 1,
    cache = true,
    cacheTTL = 3600,
    stream = false,
  } = options;

  // Don't allow streaming in this function
  if (stream) {
    throw new Error('Use createStreamingCompletion for streaming responses');
  }

  // Generate cache key if caching is enabled
  const cacheKey = cache
    ? generateCacheKey('gemini', {
        model,
        messages,
        temperature,
        maxTokens,
        topP,
      })
    : null;

  // Check cache
  if (cacheKey) {
    const cached = await getCache<{ content: string; usage?: any }>(cacheKey);
    if (cached) {
      return {
        choices: [
          {
            message: {
              content: cached.content,
              role: 'assistant',
            },
          },
        ],
        usage: cached.usage,
      };
    }
  }

  // Check if JSON format is requested
  const systemMessage = messages.find(m => m.role === 'system')?.content || '';
  const userMessage = messages.filter(m => m.role === 'user').map(m => m.content).join('\n');
  
  // Add JSON format instruction if needed
  const enhancedSystemMessage = options.responseFormat?.type === 'json_object'
    ? `${systemMessage}\n\nIMPORTANT: You must respond with valid JSON only. Do not include any text before or after the JSON.`
    : systemMessage;

  const geminiOptions: GeminiGenerationOptions = {
    model,
    temperature,
    maxTokens,
    topP,
    cache: false, // We handle caching here
  };

  // Create completion
  const result = await createGeminiChatCompletion(
    enhancedSystemMessage
      ? [
          { role: 'system', content: enhancedSystemMessage },
          ...messages.filter(m => m.role !== 'system'),
        ]
      : messages,
    geminiOptions
  );

  // Parse JSON if needed
  let content = result.content;
  if (options.responseFormat?.type === 'json_object') {
    try {
      // Try to extract JSON from response if there's extra text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        content = jsonMatch[0];
      }
      // Validate it's valid JSON
      JSON.parse(content);
    } catch (error) {
      console.warn('Failed to parse JSON response from Gemini, returning as-is');
    }
  }

  const response = {
    choices: [
      {
        message: {
          content,
          role: 'assistant',
        },
      },
    ],
    usage: result.usage
      ? {
          promptTokens: result.usage.promptTokens,
          completionTokens: result.usage.completionTokens,
          total_tokens: (result.usage.promptTokens || 0) + (result.usage.completionTokens || 0),
        }
      : undefined,
  };

  // Cache result if caching is enabled
  if (cacheKey) {
    await setCache(
      cacheKey,
      {
        content: response.choices[0].message.content || '',
        usage: response.usage,
      },
      { ttl: cacheTTL }
    );
  }

  return response;
}

// Streaming helper compatible with OpenAI format
export async function* createStreamingCompletion(
  messages: ChatMessage[],
  options: Omit<AdvancedGenerationOptions, 'stream'> = {}
): AsyncGenerator<{
  choices: Array<{
    delta: {
      content?: string;
    };
  }>;
}, void, unknown> {
  const geminiOptions: GeminiGenerationOptions = {
    model: options.model || DEFAULT_MODELS.standard,
    temperature: options.temperature ?? 0.7,
    maxTokens: options.maxTokens ?? 2000,
    topP: options.topP ?? 1,
  };

  // Check if JSON format is requested
  const systemMessage = messages.find(m => m.role === 'system')?.content || '';
  const enhancedSystemMessage = options.responseFormat?.type === 'json_object'
    ? `${systemMessage}\n\nIMPORTANT: You must respond with valid JSON only. Do not include any text before or after the JSON.`
    : systemMessage;

  const enhancedMessages = enhancedSystemMessage
    ? [
        { role: 'system' as const, content: enhancedSystemMessage },
        ...messages.filter(m => m.role !== 'system'),
      ]
    : messages;

  // Stream from Gemini
  for await (const chunk of createGeminiStreamingCompletion(enhancedMessages, geminiOptions)) {
    yield {
      choices: [
        {
          delta: {
            content: chunk,
          },
        },
      ],
    };
  }
}

// Structured output helper (using JSON mode)
export async function createStructuredCompletion<T>(
  messages: ChatMessage[],
  schema: z.ZodSchema<T>,
  options: Omit<AdvancedGenerationOptions, 'responseFormat'> = {}
): Promise<T> {
  const completion = await createAdvancedCompletion(messages, {
    ...options,
    responseFormat: { type: 'json_object' },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No content in completion');
  }

  try {
    const json = JSON.parse(content);
    return schema.parse(json);
  } catch (error) {
    throw new Error(`Failed to parse structured output: ${error}`);
  }
}

// Vision capabilities (Gemini supports vision)
export async function createVisionCompletion(
  messages: ChatMessage[],
  options: Omit<AdvancedGenerationOptions, 'model'> & { model?: string } = {}
): Promise<{
  choices: Array<{
    message: {
      content: string | null;
      role: string;
    };
  }>;
}> {
  // Note: Gemini vision requires special handling with image data
  // This is a simplified version - for full vision support, use createGeminiVisionCompletion
  return createAdvancedCompletion(messages, {
    ...options,
    model: options.model || DEFAULT_MODELS.vision,
  });
}

