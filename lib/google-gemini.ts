// Google Gemini AI Client - Alternative to OpenAI (with Vertex AI support)
import { GoogleGenAI } from '@google/genai';
import { generateCacheKey, getCache, setCache } from './cache';

// Initialize Gemini client
let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
    if (!apiKey) {
      throw new Error('GOOGLE_GEMINI_API_KEY or GEMINI_API_KEY is not configured');
    }

    const useVertexAi = (process.env.GOOGLE_GENAI_USE_VERTEXAI || '').toLowerCase() === 'true';
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const location = process.env.GOOGLE_CLOUD_REGION || 'us-central1';

    if (useVertexAi) {
      if (!projectId) {
        throw new Error('GOOGLE_CLOUD_PROJECT_ID is required when GOOGLE_GENAI_USE_VERTEXAI is true');
      }

      geminiClient = new GoogleGenAI({
        apiKey,
        vertexai: true,
        project: projectId,
        location,
      });
    } else {
      geminiClient = new GoogleGenAI({ apiKey });
    }
  }
  return geminiClient;
}

// Available Gemini models
export const GEMINI_MODELS = {
  GEMINI_1_5_PRO: 'gemini-2.5-pro',
  GEMINI_1_5_FLASH: 'gemini-2.5-flash',

} as const;

// Default models for different use cases
export const DEFAULT_GEMINI_MODELS = {
  // Fast responses, good quality
  standard: GEMINI_MODELS.GEMINI_1_5_FLASH,

  // Best quality (requires Vertex AI access to pro models)
  quality: GEMINI_MODELS.GEMINI_1_5_PRO,

  // Vision capabilities (flash supports image input)
  vision: GEMINI_MODELS.GEMINI_1_5_FLASH,

  // Cost-effective for simple tasks
  cheap: GEMINI_MODELS.GEMINI_1_5_FLASH,
} as const;

// Advanced generation options (similar to OpenAI interface)
export interface GeminiGenerationOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  cache?: boolean;
  cacheTTL?: number;
}

type GeminiMessagePart = { text: string } | { inlineData: { mimeType: string; data: string } };
type GeminiMessage = {
  role: 'user' | 'model' | 'system';
  parts: string | Array<GeminiMessagePart>;
};

function normalizeParts(parts: string | Array<GeminiMessagePart>): Array<GeminiMessagePart> {
  if (typeof parts === 'string') {
    return [{ text: parts }];
  }
  return parts.map(part => {
    if ('text' in part) {
      return { text: part.text };
    }
    return part;
  });
}

function convertMessagesToContents(messages: GeminiMessage[]) {
  return messages.map(message => {
    const normalizedParts = normalizeParts(message.parts);

    if (message.role === 'system') {
      return {
        role: 'user' as const,
        parts: normalizedParts.map(part =>
          'text' in part ? { text: `System: ${part.text}` } : part
        ),
      };
    }

    if (message.role === 'model') {
      return {
        role: 'model' as const,
        parts: normalizedParts,
      };
    }

    return {
      role: 'user' as const,
      parts: normalizedParts,
    };
  });
}

function buildGenerationConfig(options: GeminiGenerationOptions) {
  const config: Record<string, number> = {};
  if (typeof options.temperature === 'number') config.temperature = options.temperature;
  if (typeof options.maxTokens === 'number') config.maxOutputTokens = options.maxTokens;
  if (typeof options.topP === 'number') config.topP = options.topP;
  if (typeof options.topK === 'number') config.topK = options.topK;
  return Object.keys(config).length > 0 ? config : undefined;
}

export async function createGeminiCompletion(
  messages: GeminiMessage[],
  options: GeminiGenerationOptions = {}
): Promise<{ content: string; usage?: { promptTokens?: number; completionTokens?: number } }> {
  const {
    model = DEFAULT_GEMINI_MODELS.standard,
    cache = true,
    cacheTTL = 3600,
  } = options;

  // Generate cache key if caching is enabled
  const cacheKey = cache
    ? generateCacheKey('gemini', {
        model,
        messages,
        temperature: options.temperature,
        maxTokens: options.maxTokens,
        topP: options.topP,
        topK: options.topK,
      })
    : null;

  // Check cache
  if (cacheKey) {
    const cached = await getCache<{ content: string }>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  try {
    const client = getGeminiClient();
    const contents = convertMessagesToContents(messages);

    const result = await client.models.generateContent({
      model,
      contents,
      config: buildGenerationConfig(options),
    });

    const content = result.text || '';

    // Get usage information if available
    const usage = result.usageMetadata
      ? {
          promptTokens: result.usageMetadata.promptTokenCount,
          completionTokens: result.usageMetadata.candidatesTokenCount,
        }
      : undefined;

    const resultData = { content, usage };

    // Cache result if caching is enabled
    if (cacheKey) {
      await setCache(cacheKey, resultData, { ttl: cacheTTL });
    }

    return resultData;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

// Simplified interface similar to OpenAI
export async function createGeminiChatCompletion(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options: GeminiGenerationOptions = {}
): Promise<{ content: string; usage?: { promptTokens?: number; completionTokens?: number } }> {
  // Convert OpenAI-style messages to Gemini format
  const geminiMessages = messages.map(msg => {
    // Combine system messages with first user message
    if (msg.role === 'system') {
      return { role: 'user' as const, parts: `System: ${msg.content}` };
    }
    if (msg.role === 'assistant') {
      return { role: 'model' as const, parts: msg.content };
    }
    return { role: 'user' as const, parts: msg.content };
  });

  return createGeminiCompletion(geminiMessages, options);
}

// Vision capabilities (for image analysis)
export async function createGeminiVisionCompletion(
  text: string,
  images: Array<{ mimeType: string; data: string }>,
  options: GeminiGenerationOptions = {}
): Promise<{ content: string }> {
  const { model = DEFAULT_GEMINI_MODELS.vision, ...restOptions } = options;
  const client = getGeminiClient();

  const parts = [
    { text },
    ...images.map(img => ({
      inlineData: {
        mimeType: img.mimeType,
        data: img.data,
      },
    })),
  ];

  const result = await client.models.generateContent({
    model,
    contents: [
      {
        role: 'user',
        parts,
      },
    ],
    config: buildGenerationConfig(restOptions),
  });

  const content = result.text || '';

  return { content };
}

// Streaming helper
// Note: API keys don't support SSE streaming. We use generateContentStream which works with API keys.
export async function* createGeminiStreamingCompletion(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options: GeminiGenerationOptions = {}
): AsyncGenerator<string, void, unknown> {
  const model = options.model || DEFAULT_GEMINI_MODELS.standard;
  const client = getGeminiClient();
  const geminiMessages = messages.map(message => {
    if (message.role === 'system') {
      return { role: 'system' as const, parts: message.content };
    }
    if (message.role === 'assistant') {
      return { role: 'model' as const, parts: message.content };
    }
    return { role: 'user' as const, parts: message.content };
  });
  const contents = convertMessagesToContents(geminiMessages);

  try {
    const stream = await client.models.generateContentStream({
      model,
      contents,
      config: buildGenerationConfig(options),
    });

    for await (const chunk of stream) {
      const text = chunk.text || '';
      if (text) {
        yield text;
      }
    }
  } catch (error) {
    console.warn('Gemini streaming failed, falling back to non-streaming response.', error);
    const fallback = await client.models.generateContent({
      model,
      contents,
      config: buildGenerationConfig(options),
    });

    const text = fallback.text || '';
    if (!text) {
      return;
    }

    const words = text.split(/(\s+)/);
    for (const word of words) {
      if (word) {
        yield word;
      }
    }
  }
}

// Export client for direct use if needed
export { getGeminiClient };
