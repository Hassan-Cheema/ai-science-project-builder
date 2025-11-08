// Google Cloud Speech-to-Text API Client
import speech from '@google-cloud/speech';

// Initialize Speech-to-Text client
let speechClient: speech.SpeechClient | null = null;

function getSpeechClient(): speech.SpeechClient {
  if (!speechClient) {
    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;

    if (credentialsPath) {
      speechClient = new speech.SpeechClient({
        keyFilename: credentialsPath,
        projectId,
      });
    } else if (projectId) {
      speechClient = new speech.SpeechClient({
        projectId,
      });
    } else {
      throw new Error('Google Cloud Speech-to-Text credentials not configured');
    }
  }
  return speechClient;
}

// Audio encoding formats
export const AUDIO_ENCODINGS = {
  LINEAR16: 'LINEAR16',
  FLAC: 'FLAC',
  MULAW: 'MULAW',
  ALAW: 'ALAW',
  OGG_OPUS: 'OGG_OPUS',
  WEBM_OPUS: 'WEBM_OPUS',
  MP3: 'MP3',
  WEBM_OPUS_ORIGINAL: 'WEBM_OPUS_ORIGINAL',
} as const;

// Model options
export const MODEL_OPTIONS = {
  DEFAULT: 'default',
  COMMAND_AND_SEARCH: 'command_and_search',
  PHONE_CALL: 'phone_call',
  VIDEO: 'video',
} as const;

export interface SpeechToTextOptions {
  languageCode?: string;
  encoding?: string;
  sampleRateHertz?: number;
  audioChannelCount?: number;
  enableAutomaticPunctuation?: boolean;
  enableWordTimeOffsets?: boolean;
  model?: string;
  useEnhanced?: boolean;
  alternativeLanguageCodes?: string[];
}

/**
 * Convert speech to text
 * @param audioBuffer - Audio buffer or base64 string
 * @param options - Recognition options
 * @returns Transcription results
 */
export async function speechToText(
  audioBuffer: Buffer | string,
  options: SpeechToTextOptions = {}
): Promise<{
  transcript: string;
  confidence: number;
  alternatives?: Array<{ transcript: string; confidence: number }>;
  words?: Array<{ word: string; startTime: string; endTime: string }>;
}> {
  try {
    const client = getSpeechClient();

    const {
      languageCode = 'en-US',
      encoding = 'LINEAR16',
      sampleRateHertz = 16000,
      audioChannelCount = 1,
      enableAutomaticPunctuation = true,
      enableWordTimeOffsets = false,
      model = 'default',
      useEnhanced = false,
      alternativeLanguageCodes = [],
    } = options;

    // Convert buffer to base64 if needed
    const audioContent = Buffer.isBuffer(audioBuffer)
      ? audioBuffer.toString('base64')
      : audioBuffer;

    const config: any = {
      encoding,
      sampleRateHertz,
      languageCode,
      audioChannelCount,
      enableAutomaticPunctuation,
      enableWordTimeOffsets,
      model,
      useEnhanced,
    };

    if (alternativeLanguageCodes.length > 0) {
      config.alternativeLanguageCodes = alternativeLanguageCodes;
    }

    const request: any = {
      config,
      audio: {
        content: audioContent,
      },
    };

    const [response] = await client.recognize(request);

    if (!response.results || response.results.length === 0) {
      return {
        transcript: '',
        confidence: 0,
      };
    }

    const result = response.results[0];
    const alternative = result.alternatives?.[0];

    if (!alternative) {
      return {
        transcript: '',
        confidence: 0,
      };
    }

    return {
      transcript: alternative.transcript || '',
      confidence: alternative.confidence || 0,
      alternatives: result.alternatives?.map(alt => ({
        transcript: alt.transcript || '',
        confidence: alt.confidence || 0,
      })),
      words: alternative.words?.map(word => ({
        word: word.word || '',
        startTime: word.startTime?.seconds?.toString() || '0',
        endTime: word.endTime?.seconds?.toString() || '0',
      })),
    };
  } catch (error) {
    console.error('Error converting speech to text:', error);
    throw error;
  }
}

/**
 * Long-running recognition for audio files longer than 1 minute
 * @param audioUri - GCS URI (gs://bucket/audio.mp3) or audio buffer
 * @param options - Recognition options
 * @returns Operation name (use getOperationStatus to check progress)
 */
export async function longRunningRecognize(
  audioUri: string | Buffer,
  options: SpeechToTextOptions = {}
): Promise<string> {
  try {
    const client = getSpeechClient();

    const {
      languageCode = 'en-US',
      encoding = 'LINEAR16',
      sampleRateHertz = 16000,
      audioChannelCount = 1,
      enableAutomaticPunctuation = true,
      enableWordTimeOffsets = false,
      model = 'default',
      useEnhanced = false,
      alternativeLanguageCodes = [],
    } = options;

    const config: any = {
      encoding,
      sampleRateHertz,
      languageCode,
      audioChannelCount,
      enableAutomaticPunctuation,
      enableWordTimeOffsets,
      model,
      useEnhanced,
    };

    if (alternativeLanguageCodes.length > 0) {
      config.alternativeLanguageCodes = alternativeLanguageCodes;
    }

    const audio: any = Buffer.isBuffer(audioUri)
      ? { content: audioUri.toString('base64') }
      : { uri: audioUri };

    const request: any = {
      config,
      audio,
    };

    const [operation] = await client.longRunningRecognize(request);

    return operation.name || '';
  } catch (error) {
    console.error('Error starting long-running recognition:', error);
    throw error;
  }
}

/**
 * Check the status of a long-running recognition operation
 * @param operationName - Operation name from longRunningRecognize
 * @returns Transcription results if complete, or status if still processing
 */
export async function getOperationStatus(operationName: string): Promise<{
  done: boolean;
  transcript?: string;
  confidence?: number;
  error?: string;
}> {
  try {
    const client = getSpeechClient();
    const [operation] = await client.checkLongRunningRecognizeProgress(operationName);

    if (!operation.done) {
      return { done: false };
    }

    if (operation.error) {
      return {
        done: true,
        error: operation.error.message || 'Unknown error',
      };
    }

    const response = operation.response as any;
    if (!response.results || response.results.length === 0) {
      return {
        done: true,
        transcript: '',
        confidence: 0,
      };
    }

    const result = response.results[0];
    const alternative = result.alternatives?.[0];

    return {
      done: true,
      transcript: alternative?.transcript || '',
      confidence: alternative?.confidence || 0,
    };
  } catch (error) {
    console.error('Error checking operation status:', error);
    throw error;
  }
}

/**
 * Streaming recognition for real-time audio
 * @param audioStream - Audio stream
 * @param options - Recognition options
 * @returns Async generator of transcription results
 */
export async function* streamingRecognize(
  audioStream: AsyncIterable<Buffer>,
  options: SpeechToTextOptions = {}
): AsyncGenerator<{
  transcript: string;
  isFinal: boolean;
  confidence: number;
}, void, unknown> {
  try {
    const client = getSpeechClient();

    const {
      languageCode = 'en-US',
      encoding = 'LINEAR16',
      sampleRateHertz = 16000,
      audioChannelCount = 1,
      enableAutomaticPunctuation = true,
      model = 'default',
      useEnhanced = false,
    } = options;

    const config: any = {
      encoding,
      sampleRateHertz,
      languageCode,
      audioChannelCount,
      enableAutomaticPunctuation,
      model,
      useEnhanced,
    };

    const stream = client.streamingRecognize({
      config,
    });

    // Handle responses
    stream.on('data', (response: any) => {
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        const alternative = result.alternatives?.[0];

        if (alternative) {
          // This would need to be handled differently in a real async generator
          // For now, this is a simplified version
        }
      }
    });

    // Send audio chunks
    for await (const chunk of audioStream) {
      stream.write({ audioContent: chunk });
    }

    stream.end();
  } catch (error) {
    console.error('Error in streaming recognition:', error);
    throw error;
  }
}

// Export client for direct use if needed
export { getSpeechClient };
