// Google Cloud Text-to-Speech API Client
import textToSpeechLib from '@google-cloud/text-to-speech';

// Initialize Text-to-Speech client
let ttsClient: textToSpeechLib.TextToSpeechClient | null = null;

function getTTSClient(): textToSpeechLib.TextToSpeechClient {
  if (!ttsClient) {
    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;

    if (credentialsPath) {
      ttsClient = new textToSpeechLib.TextToSpeechClient({
        keyFilename: credentialsPath,
        projectId,
      });
    } else if (projectId) {
      ttsClient = new textToSpeechLib.TextToSpeechClient({
        projectId,
      });
    } else {
      throw new Error('Google Cloud Text-to-Speech credentials not configured');
    }
  }
  return ttsClient;
}

// Available voice options
export const VOICE_OPTIONS = {
  // English voices
  EN_US_STANDARD_A: 'en-US-Standard-A',
  EN_US_STANDARD_B: 'en-US-Standard-B',
  EN_US_STANDARD_C: 'en-US-Standard-C',
  EN_US_STANDARD_D: 'en-US-Standard-D',
  EN_US_STANDARD_E: 'en-US-Standard-E',
  EN_US_STANDARD_F: 'en-US-Standard-F',
  EN_US_WAVENET_A: 'en-US-Wavenet-A',
  EN_US_WAVENET_B: 'en-US-Wavenet-B',
  EN_US_WAVENET_C: 'en-US-Wavenet-C',
  EN_US_WAVENET_D: 'en-US-Wavenet-D',
  EN_US_WAVENET_E: 'en-US-Wavenet-E',
  EN_US_WAVENET_F: 'en-US-Wavenet-F',

  // Spanish voices
  ES_ES_STANDARD_A: 'es-ES-Standard-A',
  ES_US_STANDARD_A: 'es-US-Standard-A',

  // French voices
  FR_FR_STANDARD_A: 'fr-FR-Standard-A',

  // German voices
  DE_DE_STANDARD_A: 'de-DE-Standard-A',
} as const;

// Audio encoding options
export const AUDIO_ENCODINGS = {
  MP3: 'MP3',
  LINEAR16: 'LINEAR16',
  OGG_OPUS: 'OGG_OPUS',
  MULAW: 'MULAW',
  ALAW: 'ALAW',
} as const;

export interface TextToSpeechOptions {
  languageCode?: string;
  voiceName?: string;
  ssmlGender?: 'SSML_VOICE_GENDER_UNSPECIFIED' | 'MALE' | 'FEMALE' | 'NEUTRAL';
  audioEncoding?: 'MP3' | 'LINEAR16' | 'OGG_OPUS' | 'MULAW' | 'ALAW';
  speakingRate?: number; // 0.25 to 4.0
  pitch?: number; // -20.0 to 20.0
  volumeGainDb?: number; // -96.0 to 16.0
}

/**
 * Convert text to speech
 * @param text - Text to convert to speech
 * @param options - Voice and audio options
 * @returns Audio buffer (MP3 by default)
 */
export async function textToSpeech(
  text: string,
  options: TextToSpeechOptions = {}
): Promise<Buffer> {
  try {
    const client = getTTSClient();

    const {
      languageCode = 'en-US',
      voiceName,
      ssmlGender = 'NEUTRAL',
      audioEncoding = 'MP3',
      speakingRate = 1.0,
      pitch = 0.0,
      volumeGainDb = 0.0,
    } = options;

    const request: any = {
      input: { text },
      voice: {
        languageCode,
        name: voiceName,
        ssmlGender,
      },
      audioConfig: {
        audioEncoding,
        speakingRate,
        pitch,
        volumeGainDb,
      },
    };

    const [response] = await client.synthesizeSpeech(request);

    if (!response.audioContent) {
      throw new Error('No audio content returned');
    }

    return Buffer.from(response.audioContent);
  } catch (error) {
    console.error('Error converting text to speech:', error);
    throw error;
  }
}

/**
 * Convert SSML to speech
 * @param ssml - SSML formatted text
 * @param options - Voice and audio options
 * @returns Audio buffer
 */
export async function ssmlToSpeech(
  ssml: string,
  options: Omit<TextToSpeechOptions, 'languageCode'> & { languageCode?: string } = {}
): Promise<Buffer> {
  try {
    const client = getTTSClient();

    const {
      languageCode = 'en-US',
      voiceName,
      ssmlGender = 'NEUTRAL',
      audioEncoding = 'MP3',
      speakingRate = 1.0,
      pitch = 0.0,
      volumeGainDb = 0.0,
    } = options;

    const request: any = {
      input: { ssml },
      voice: {
        languageCode,
        name: voiceName,
        ssmlGender,
      },
      audioConfig: {
        audioEncoding,
        speakingRate,
        pitch,
        volumeGainDb,
      },
    };

    const [response] = await client.synthesizeSpeech(request);

    if (!response.audioContent) {
      throw new Error('No audio content returned');
    }

    return Buffer.from(response.audioContent);
  } catch (error) {
    console.error('Error converting SSML to speech:', error);
    throw error;
  }
}

/**
 * List available voices
 * @param languageCode - Optional language code to filter voices
 * @returns Array of available voices
 */
export async function listVoices(languageCode?: string): Promise<Array<{
  name: string;
  ssmlGender: string;
  naturalSampleRateHertz: number;
  languageCodes: string[];
}>> {
  try {
    const client = getTTSClient();
    const [result] = await client.listVoices({
      languageCode,
    });

    return (result.voices || []).map(voice => ({
      name: voice.name || '',
      ssmlGender: voice.ssmlGender || 'SSML_VOICE_GENDER_UNSPECIFIED',
      naturalSampleRateHertz: voice.naturalSampleRateHertz || 0,
      languageCodes: voice.languageCodes || [],
    }));
  } catch (error) {
    console.error('Error listing voices:', error);
    throw error;
  }
}

// Export client for direct use if needed
export { getTTSClient };
