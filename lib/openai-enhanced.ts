// Enhanced OpenAI client with advanced features
import OpenAI from 'openai';
import { z } from 'zod';
import { env } from './env';
import { getCache, setCache, generateCacheKey } from './cache';

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: env.openaiApiKey,
});

// Available models (latest versions)
export const MODELS = {
  // Latest GPT-4o models (best quality, fast)
  GPT4O: 'gpt-4o',
  GPT4O_MINI: 'gpt-4o-mini',
  
  // o1 models (best reasoning, slower)
  O1_PREVIEW: 'o1-preview',
  O1_MINI: 'o1-mini',
  
  // Legacy models (fallback)
  GPT4_TURBO: 'gpt-4-turbo',
  GPT3_5_TURBO: 'gpt-3.5-turbo',
} as const;

// Default model for different use cases
export const DEFAULT_MODELS = {
  // Fast responses, good quality
  standard: MODELS.GPT4O_MINI,
  
  // Best quality, slightly slower
  quality: MODELS.GPT4O,
  
  // Complex reasoning tasks
  reasoning: MODELS.O1_PREVIEW,
  
  // Cost-effective for simple tasks
  cheap: MODELS.GPT4O_MINI,
} as const;

// Advanced generation options
export interface AdvancedGenerationOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  responseFormat?: { type: 'json_object' } | { type: 'text' };
  tools?: OpenAI.Chat.Completions.ChatCompletionTool[];
  toolChoice?: 'none' | 'auto' | { type: 'function'; function: { name: string } };
  stream?: boolean;
  seed?: number;
  cache?: boolean;
  cacheTTL?: number;
}

// Enhanced chat completion with caching and advanced features
export async function createAdvancedCompletion(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  options: AdvancedGenerationOptions = {}
): Promise<OpenAI.Chat.Completions.ChatCompletion> {
  const {
    model = DEFAULT_MODELS.standard,
    temperature = 0.7,
    maxTokens = 2000,
    topP = 1,
    frequencyPenalty = 0,
    presencePenalty = 0,
    responseFormat,
    tools,
    toolChoice,
    stream = false,
    seed,
    cache = true,
    cacheTTL = 3600,
  } = options;

  // Don't allow streaming in this function - use createStreamingCompletion instead
  if (stream) {
    throw new Error('Use createStreamingCompletion for streaming responses');
  }

  // Generate cache key if caching is enabled
  const cacheKey = cache
    ? generateCacheKey('openai', {
        model,
        messages,
        temperature,
        maxTokens,
        topP,
        frequencyPenalty,
        presencePenalty,
        responseFormat,
      })
    : null;

  // Check cache
  if (cacheKey) {
    const cached = await getCache<OpenAI.Chat.Completions.ChatCompletion>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  // Create completion (non-streaming)
  const completion = await openai.chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
    top_p: topP,
    frequency_penalty: frequencyPenalty,
    presence_penalty: presencePenalty,
    response_format: responseFormat,
    tools,
    tool_choice: toolChoice,
    stream: false, // Always false here
    seed,
  }) as OpenAI.Chat.Completions.ChatCompletion;

  // Cache result if caching is enabled
  if (cacheKey) {
    await setCache(cacheKey, completion, { ttl: cacheTTL });
  }

  return completion;
}

// Vision capabilities (GPT-4o supports vision)
export async function createVisionCompletion(
  messages: (OpenAI.Chat.Completions.ChatCompletionUserMessageParam & {
    content: Array<
      | { type: 'text'; text: string }
      | { type: 'image_url'; image_url: { url: string; detail?: 'low' | 'high' | 'auto' } }
    >;
  })[],
  options: Omit<AdvancedGenerationOptions, 'model'> & { model?: string } = {}
): Promise<OpenAI.Chat.Completions.ChatCompletion> {
  return createAdvancedCompletion(messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[], {
    ...options,
    model: options.model || MODELS.GPT4O, // GPT-4o supports vision
  });
}

// Function calling helper
export async function createFunctionCallCompletion(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  functions: OpenAI.Chat.Completions.ChatCompletionTool[],
  options: Omit<AdvancedGenerationOptions, 'tools' | 'toolChoice'> = {}
): Promise<OpenAI.Chat.Completions.ChatCompletion> {
  return createAdvancedCompletion(messages, {
    ...options,
    tools: functions,
    toolChoice: 'auto',
  });
}

// Structured output helper (using JSON mode)
export async function createStructuredCompletion<T>(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
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

// Streaming helper
export async function* createStreamingCompletion(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  options: Omit<AdvancedGenerationOptions, 'stream'> = {}
): AsyncGenerator<OpenAI.Chat.Completions.ChatCompletionChunk, void, unknown> {
  const stream = await openai.chat.completions.create({
    model: options.model || DEFAULT_MODELS.standard,
    messages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.maxTokens ?? 2000,
    top_p: options.topP ?? 1,
    frequency_penalty: options.frequencyPenalty ?? 0,
    presence_penalty: options.presencePenalty ?? 0,
    response_format: options.responseFormat,
    tools: options.tools,
    tool_choice: options.toolChoice,
    stream: true,
    seed: options.seed,
  });

  for await (const chunk of stream) {
    yield chunk;
  }
}

