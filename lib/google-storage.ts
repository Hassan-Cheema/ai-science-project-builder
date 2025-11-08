// Google Cloud Storage Client
import { Storage } from '@google-cloud/storage';
import { env } from './env';

// Initialize Storage client
let storageClient: Storage | null = null;

function getStorageClient(): Storage {
  if (!storageClient) {
    // Try to use service account key file first
    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;

    if (credentialsPath) {
      storageClient = new Storage({
        keyFilename: credentialsPath,
        projectId,
      });
    } else if (projectId) {
      // Use Application Default Credentials
      storageClient = new Storage({
        projectId,
      });
    } else {
      throw new Error('Google Cloud Storage credentials not configured. Set GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_CLOUD_PROJECT_ID');
    }
  }
  return storageClient;
}

// Get bucket name from environment
function getBucketName(): string {
  const bucket = process.env.GOOGLE_CLOUD_STORAGE_BUCKET;
  if (!bucket) {
    throw new Error('GOOGLE_CLOUD_STORAGE_BUCKET environment variable is not set');
  }
  return bucket;
}

/**
 * Upload a file to Google Cloud Storage
 * @param filePath - Path in the bucket (e.g., 'essays/user-123.pdf')
 * @param fileBuffer - File buffer or content
 * @param options - Upload options (contentType, metadata, etc.)
 * @returns Public URL of the uploaded file
 */
export async function uploadFile(
  filePath: string,
  fileBuffer: Buffer | string,
  options: {
    contentType?: string;
    metadata?: Record<string, string>;
    makePublic?: boolean;
  } = {}
): Promise<string> {
  try {
    const storage = getStorageClient();
    const bucket = storage.bucket(getBucketName());
    const file = bucket.file(filePath);

    const uploadOptions: any = {
      metadata: {
        contentType: options.contentType || 'application/octet-stream',
        metadata: options.metadata || {},
      },
    };

    await file.save(fileBuffer, uploadOptions);

    // Make file public if requested
    if (options.makePublic) {
      await file.makePublic();
    }

    // Return public URL or signed URL
    if (options.makePublic) {
      return file.publicUrl();
    } else {
      // Generate signed URL (valid for 1 hour by default)
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 3600000, // 1 hour
      });
      return url;
    }
  } catch (error) {
    console.error('Error uploading file to GCS:', error);
    throw error;
  }
}

/**
 * Download a file from Google Cloud Storage
 * @param filePath - Path in the bucket
 * @returns File buffer
 */
export async function downloadFile(filePath: string): Promise<Buffer> {
  try {
    const storage = getStorageClient();
    const bucket = storage.bucket(getBucketName());
    const file = bucket.file(filePath);

    const [buffer] = await file.download();
    return buffer;
  } catch (error) {
    console.error('Error downloading file from GCS:', error);
    throw error;
  }
}

/**
 * Delete a file from Google Cloud Storage
 * @param filePath - Path in the bucket
 */
export async function deleteFile(filePath: string): Promise<void> {
  try {
    const storage = getStorageClient();
    const bucket = storage.bucket(getBucketName());
    const file = bucket.file(filePath);

    await file.delete();
  } catch (error) {
    console.error('Error deleting file from GCS:', error);
    throw error;
  }
}

/**
 * Get a signed URL for a file (temporary access)
 * @param filePath - Path in the bucket
 * @param expiresIn - Expiration time in milliseconds (default: 1 hour)
 * @returns Signed URL
 */
export async function getSignedUrl(
  filePath: string,
  expiresIn: number = 3600000
): Promise<string> {
  try {
    const storage = getStorageClient();
    const bucket = storage.bucket(getBucketName());
    const file = bucket.file(filePath);

    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + expiresIn,
    });

    return url;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw error;
  }
}

/**
 * Check if a file exists
 * @param filePath - Path in the bucket
 * @returns True if file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    const storage = getStorageClient();
    const bucket = storage.bucket(getBucketName());
    const file = bucket.file(filePath);

    const [exists] = await file.exists();
    return exists;
  } catch (error) {
    console.error('Error checking file existence:', error);
    return false;
  }
}

/**
 * List files in a directory/prefix
 * @param prefix - Path prefix (e.g., 'essays/user-123/')
 * @param maxResults - Maximum number of results
 * @returns Array of file paths
 */
export async function listFiles(
  prefix: string,
  maxResults: number = 100
): Promise<string[]> {
  try {
    const storage = getStorageClient();
    const bucket = storage.bucket(getBucketName());

    const [files] = await bucket.getFiles({
      prefix,
      maxResults,
    });

    return files.map(file => file.name);
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}

/**
 * Get file metadata
 * @param filePath - Path in the bucket
 * @returns File metadata
 */
export async function getFileMetadata(filePath: string): Promise<any> {
  try {
    const storage = getStorageClient();
    const bucket = storage.bucket(getBucketName());
    const file = bucket.file(filePath);

    const [metadata] = await file.getMetadata();
    return metadata;
  } catch (error) {
    console.error('Error getting file metadata:', error);
    throw error;
  }
}

// Export client for direct use if needed
export { getStorageClient };

