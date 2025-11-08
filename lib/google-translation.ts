// Google Cloud Translation API Client
import { Translate } from '@google-cloud/translate/build/src/v2';
import { env } from './env';

// Initialize Translation client
let translationClient: Translate | null = null;

function getTranslationClient(): Translate {
  if (!translationClient) {
    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;

    if (credentialsPath) {
      translationClient = new Translate({
        keyFilename: credentialsPath,
        projectId,
      });
    } else if (projectId) {
      translationClient = new Translate({
        projectId,
      });
    } else {
      // Fallback to API key if available
      const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
      if (apiKey) {
        translationClient = new Translate({
          key: apiKey,
        });
      } else {
        throw new Error('Google Cloud Translation credentials not configured');
      }
    }
  }
  return translationClient;
}

/**
 * Translate text to a target language
 * @param text - Text to translate
 * @param targetLanguage - Target language code (e.g., 'es', 'fr', 'de')
 * @param sourceLanguage - Optional source language code (auto-detect if not provided)
 * @returns Translated text
 */
export async function translateText(
  text: string,
  targetLanguage: string,
  sourceLanguage?: string
): Promise<{ translatedText: string; detectedLanguage?: string }> {
  try {
    const translate = getTranslationClient();

    const options: any = {
      to: targetLanguage,
    };

    if (sourceLanguage) {
      options.from = sourceLanguage;
    }

    const [translation] = await translate.translate(text, options);
    const [detections] = await translate.detect(text);

    return {
      translatedText: translation,
      detectedLanguage: detections.language,
    };
  } catch (error) {
    console.error('Error translating text:', error);
    throw error;
  }
}

/**
 * Translate multiple texts at once
 * @param texts - Array of texts to translate
 * @param targetLanguage - Target language code
 * @param sourceLanguage - Optional source language code
 * @returns Array of translated texts
 */
export async function translateMultiple(
  texts: string[],
  targetLanguage: string,
  sourceLanguage?: string
): Promise<Array<{ originalText: string; translatedText: string; detectedLanguage?: string }>> {
  try {
    const translate = getTranslationClient();

    const options: any = {
      to: targetLanguage,
    };

    if (sourceLanguage) {
      options.from = sourceLanguage;
    }

    const [translations] = await translate.translate(texts, options);
    const [detections] = await translate.detect(texts);

    return texts.map((text, index) => {
      const translationEntry = Array.isArray(translations) ? translations[index] : translations;
      const detectionEntry = Array.isArray(detections) ? detections[index] : detections;

      const detectedLanguage =
        (detectionEntry as { language?: string } | undefined)?.language;

      return {
        originalText: text,
        translatedText: translationEntry,
        detectedLanguage,
      };
    });
  } catch (error) {
    console.error('Error translating multiple texts:', error);
    throw error;
  }
}

/**
 * Detect the language of text
 * @param text - Text to analyze
 * @returns Detected language information
 */
export async function detectLanguage(text: string): Promise<{ language: string; confidence: number }> {
  try {
    const translate = getTranslationClient();
    const [detections] = await translate.detect(text);

    // Handle both single and array responses
    const detection = Array.isArray(detections) ? detections[0] : detections;

    return {
      language: detection.language,
      confidence: detection.confidence || 1.0,
    };
  } catch (error) {
    console.error('Error detecting language:', error);
    throw error;
  }
}

/**
 * Get list of supported languages
 * @returns Array of supported language codes and names
 */
export async function getSupportedLanguages(targetLanguage?: string): Promise<Array<{ code: string; name: string }>> {
  try {
    const translate = getTranslationClient();
    const [languages] = await translate.getLanguages(targetLanguage);

    return languages.map(lang => ({
      code: lang.code,
      name: lang.name || lang.code,
    }));
  } catch (error) {
    console.error('Error getting supported languages:', error);
    throw error;
  }
}

// Common language codes for reference
export const LANGUAGE_CODES = {
  ENGLISH: 'en',
  SPANISH: 'es',
  FRENCH: 'fr',
  GERMAN: 'de',
  ITALIAN: 'it',
  PORTUGUESE: 'pt',
  CHINESE_SIMPLIFIED: 'zh-CN',
  CHINESE_TRADITIONAL: 'zh-TW',
  JAPANESE: 'ja',
  KOREAN: 'ko',
  ARABIC: 'ar',
  HINDI: 'hi',
  RUSSIAN: 'ru',
  DUTCH: 'nl',
  POLISH: 'pl',
  TURKISH: 'tr',
  SWEDISH: 'sv',
  DANISH: 'da',
  NORWEGIAN: 'no',
  FINNISH: 'fi',
  GREEK: 'el',
  HEBREW: 'he',
  THAI: 'th',
  VIETNAMESE: 'vi',
  INDONESIAN: 'id',
  MALAY: 'ms',
  CZECH: 'cs',
  HUNGARIAN: 'hu',
  ROMANIAN: 'ro',
  UKRAINIAN: 'uk',
} as const;

// Export client for direct use if needed
export { getTranslationClient };

