// Google Cloud Vision API Client
import { ImageAnnotatorClient } from '@google-cloud/vision';

// Initialize Vision client
let visionClient: ImageAnnotatorClient | null = null;

function getVisionClient(): ImageAnnotatorClient {
  if (!visionClient) {
    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;

    if (credentialsPath) {
      visionClient = new ImageAnnotatorClient({
        keyFilename: credentialsPath,
        projectId,
      });
    } else if (projectId) {
      visionClient = new ImageAnnotatorClient({
        projectId,
      });
    } else {
      throw new Error('Google Cloud Vision credentials not configured');
    }
  }
  return visionClient;
}

/**
 * Extract text from an image using OCR
 * @param imageBuffer - Image buffer or base64 string
 * @returns Extracted text
 */
export async function extractTextFromImage(
  imageBuffer: Buffer | string
): Promise<{ text: string; fullTextAnnotation?: any }> {
  try {
    const client = getVisionClient();
    const [result] = await client.textDetection({
      image: { content: imageBuffer },
    });

    const detections = result.textAnnotations;
    if (!detections || detections.length === 0) {
      return { text: '' };
    }

    // First detection is the entire text
    const fullText = detections[0].description || '';
    const fullTextAnnotation = detections[0];

    return {
      text: fullText,
      fullTextAnnotation: fullTextAnnotation,
    };
  } catch (error) {
    console.error('Error extracting text from image:', error);
    throw error;
  }
}

/**
 * Detect labels/objects in an image
 * @param imageBuffer - Image buffer or base64 string
 * @returns Array of detected labels with confidence scores
 */
export async function detectLabels(
  imageBuffer: Buffer | string
): Promise<Array<{ description: string; score: number }>> {
  try {
    const client = getVisionClient();
    const [result] = await client.labelDetection({
      image: { content: imageBuffer },
    });

    const labels = result.labelAnnotations || [];
    return labels.map(label => ({
      description: label.description || '',
      score: label.score || 0,
    }));
  } catch (error) {
    console.error('Error detecting labels:', error);
    throw error;
  }
}

/**
 * Detect faces in an image
 * @param imageBuffer - Image buffer or base64 string
 * @returns Array of face detection results
 */
export async function detectFaces(
  imageBuffer: Buffer | string
): Promise<Array<{
  joyLikelihood: string;
  sorrowLikelihood: string;
  angerLikelihood: string;
  surpriseLikelihood: string;
  boundingPoly?: any;
}>> {
  try {
    const client = getVisionClient();
    const [result] = await client.faceDetection({
      image: { content: imageBuffer },
    });

    const faces = result.faceAnnotations || [];
    return faces.map(face => ({
      joyLikelihood: face.joyLikelihood ? String(face.joyLikelihood) : 'UNKNOWN',
      sorrowLikelihood: face.sorrowLikelihood ? String(face.sorrowLikelihood) : 'UNKNOWN',
      angerLikelihood: face.angerLikelihood ? String(face.angerLikelihood) : 'UNKNOWN',
      surpriseLikelihood: face.surpriseLikelihood ? String(face.surpriseLikelihood) : 'UNKNOWN',
      boundingPoly: face.boundingPoly,
    }));
  } catch (error) {
    console.error('Error detecting faces:', error);
    throw error;
  }
}

/**
 * Detect landmarks in an image
 * @param imageBuffer - Image buffer or base64 string
 * @returns Array of detected landmarks
 */
export async function detectLandmarks(
  imageBuffer: Buffer | string
): Promise<Array<{ description: string; score: number; locations?: any[] }>> {
  try {
    const client = getVisionClient();
    const [result] = await client.landmarkDetection({
      image: { content: imageBuffer },
    });

    const landmarks = result.landmarkAnnotations || [];
    return landmarks.map(landmark => ({
      description: landmark.description || '',
      score: landmark.score || 0,
      locations: landmark.locations ? [...landmark.locations] : undefined,
    }));
  } catch (error) {
    console.error('Error detecting landmarks:', error);
    throw error;
  }
}

/**
 * Detect safe search content (moderation)
 * @param imageBuffer - Image buffer or base64 string
 * @returns Safe search detection results
 */
export async function detectSafeSearch(
  imageBuffer: Buffer | string
): Promise<{
  adult: string;
  violence: string;
  racy: string;
  spoof: string;
  medical: string;
}> {
  try {
    const client = getVisionClient();
    const [result] = await client.safeSearchDetection({
      image: { content: imageBuffer },
    });

    const safeSearch = result.safeSearchAnnotation;
    if (!safeSearch) {
      throw new Error('No safe search annotation found');
    }

    return {
      adult: safeSearch.adult ? String(safeSearch.adult) : 'UNKNOWN',
      violence: safeSearch.violence ? String(safeSearch.violence) : 'UNKNOWN',
      racy: safeSearch.racy ? String(safeSearch.racy) : 'UNKNOWN',
      spoof: safeSearch.spoof ? String(safeSearch.spoof) : 'UNKNOWN',
      medical: safeSearch.medical ? String(safeSearch.medical) : 'UNKNOWN',
    };
  } catch (error) {
    console.error('Error detecting safe search:', error);
    throw error;
  }
}

/**
 * Detect web entities (similar images, pages with this image, etc.)
 * @param imageBuffer - Image buffer or base64 string
 * @returns Web detection results
 */
export async function detectWebEntities(
  imageBuffer: Buffer | string
): Promise<{
  webEntities: Array<{ description: string; score: number }>;
  fullMatchingImages: Array<{ url: string }>;
  pagesWithMatchingImages: Array<{ url: string }>;
}> {
  try {
    const client = getVisionClient();
    const [result] = await client.webDetection({
      image: { content: imageBuffer },
    });

    const webDetection = result.webDetection;
    if (!webDetection) {
      return {
        webEntities: [],
        fullMatchingImages: [],
        pagesWithMatchingImages: [],
      };
    }

    return {
      webEntities: (webDetection.webEntities || []).map(entity => ({
        description: entity.description || '',
        score: entity.score || 0,
      })),
      fullMatchingImages: (webDetection.fullMatchingImages || []).map(img => ({
        url: img.url || '',
      })),
      pagesWithMatchingImages: (webDetection.pagesWithMatchingImages || []).map(page => ({
        url: page.url || '',
      })),
    };
  } catch (error) {
    console.error('Error detecting web entities:', error);
    throw error;
  }
}

/**
 * Comprehensive image analysis (combines multiple features)
 * @param imageBuffer - Image buffer or base64 string
 * @param features - Array of features to analyze
 * @returns Combined analysis results
 */
export async function analyzeImage(
  imageBuffer: Buffer | string,
  features: Array<'TEXT_DETECTION' | 'LABEL_DETECTION' | 'FACE_DETECTION' | 'LANDMARK_DETECTION' | 'SAFE_SEARCH_DETECTION' | 'WEB_DETECTION'> = ['TEXT_DETECTION', 'LABEL_DETECTION']
): Promise<{
  text?: { text: string };
  labels?: Array<{ description: string; score: number }>;
  faces?: Array<any>;
  landmarks?: Array<any>;
  safeSearch?: any;
  web?: any;
}> {
  try {
    const client = getVisionClient();

    const requests = [{
      image: { content: imageBuffer },
      features: features.map(feature => ({ type: feature })),
    }];

    const [result] = await client.batchAnnotateImages({ requests });

    const annotations = result.responses?.[0];
    if (!annotations) {
      throw new Error('No annotations found');
    }

    const analysis: any = {};

    if (annotations.textAnnotations) {
      analysis.text = {
        text: annotations.textAnnotations[0]?.description || '',
      };
    }

    if (annotations.labelAnnotations) {
      analysis.labels = annotations.labelAnnotations.map(label => ({
        description: label.description || '',
        score: label.score || 0,
      }));
    }

    if (annotations.faceAnnotations) {
      analysis.faces = annotations.faceAnnotations;
    }

    if (annotations.landmarkAnnotations) {
      analysis.landmarks = annotations.landmarkAnnotations;
    }

    if (annotations.safeSearchAnnotation) {
      analysis.safeSearch = annotations.safeSearchAnnotation;
    }

    if (annotations.webDetection) {
      analysis.web = annotations.webDetection;
    }

    return analysis;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}

// Export client for direct use if needed
export { getVisionClient };
