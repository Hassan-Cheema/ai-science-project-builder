// Google Cloud Firestore Client
import admin from 'firebase-admin';

// Initialize Firestore client
let firestore: admin.firestore.Firestore | null = null;

function getFirestore(): admin.firestore.Firestore {
  if (!firestore) {
    // Initialize Firebase Admin if not already initialized
    if (!admin.apps.length) {
      const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
      const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;

      if (credentialsPath) {
        admin.initializeApp({
          credential: admin.credential.cert(credentialsPath),
          projectId,
        });
      } else if (projectId) {
        // Use Application Default Credentials
        admin.initializeApp({
          projectId,
        });
      } else {
        throw new Error('Firebase Admin credentials not configured');
      }
    }

    firestore = admin.firestore();
  }
  return firestore;
}

// Export db for direct use
export const db = getFirestore();

/**
 * Save a document to Firestore
 * @param collectionPath - Collection path (e.g., 'essays')
 * @param documentId - Document ID (optional, auto-generated if not provided)
 * @param data - Document data
 * @returns Document reference
 */
export async function saveDocument<T extends Record<string, any>>(
  collectionPath: string,
  data: T,
  documentId?: string
): Promise<admin.firestore.DocumentReference<T>> {
  try {
    const db = getFirestore();
    const collection = db.collection(collectionPath);

    if (documentId) {
      await collection.doc(documentId).set({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return collection.doc(documentId) as admin.firestore.DocumentReference<T>;
    } else {
      const docRef = await collection.add({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return docRef as admin.firestore.DocumentReference<T>;
    }
  } catch (error) {
    console.error('Error saving document:', error);
    throw error;
  }
}

/**
 * Get a document from Firestore
 * @param collectionPath - Collection path
 * @param documentId - Document ID
 * @returns Document data or null if not found
 */
export async function getDocument<T extends Record<string, any>>(
  collectionPath: string,
  documentId: string
): Promise<T | null> {
  try {
    const db = getFirestore();
    const doc = await db.collection(collectionPath).doc(documentId).get();

    if (!doc.exists) {
      return null;
    }

    return { id: doc.id, ...doc.data() } as T;
  } catch (error) {
    console.error('Error getting document:', error);
    throw error;
  }
}

/**
 * Update a document in Firestore
 * @param collectionPath - Collection path
 * @param documentId - Document ID
 * @param data - Partial data to update
 */
export async function updateDocument(
  collectionPath: string,
  documentId: string,
  data: Record<string, any>
): Promise<void> {
  try {
    const db = getFirestore();
    await db.collection(collectionPath).doc(documentId).update({
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
}

/**
 * Delete a document from Firestore
 * @param collectionPath - Collection path
 * @param documentId - Document ID
 */
export async function deleteDocument(
  collectionPath: string,
  documentId: string
): Promise<void> {
  try {
    const db = getFirestore();
    await db.collection(collectionPath).doc(documentId).delete();
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
}

/**
 * Query documents from Firestore
 * @param collectionPath - Collection path
 * @param queryOptions - Query options (where, orderBy, limit, etc.)
 * @returns Array of documents
 */
export async function queryDocuments<T extends Record<string, any>>(
  collectionPath: string,
  queryOptions: {
    where?: Array<[string, FirebaseFirestore.WhereFilterOp, any]>;
    orderBy?: Array<[string, 'asc' | 'desc']>;
    limit?: number;
    startAfter?: admin.firestore.DocumentSnapshot;
  } = {}
): Promise<Array<T & { id: string }>> {
  try {
    const db = getFirestore();
    let query: admin.firestore.Query = db.collection(collectionPath);

    // Apply where clauses
    if (queryOptions.where) {
      queryOptions.where.forEach(([field, operator, value]) => {
        query = query.where(field, operator, value);
      });
    }

    // Apply orderBy
    if (queryOptions.orderBy) {
      queryOptions.orderBy.forEach(([field, direction]) => {
        query = query.orderBy(field, direction);
      });
    }

    // Apply limit
    if (queryOptions.limit) {
      query = query.limit(queryOptions.limit);
    }

    // Apply pagination
    if (queryOptions.startAfter) {
      query = query.startAfter(queryOptions.startAfter);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Array<T & { id: string }>;
  } catch (error) {
    console.error('Error querying documents:', error);
    throw error;
  }
}

/**
 * Batch write operations
 * @param operations - Array of operations (set, update, delete)
 */
export async function batchWrite(
  operations: Array<{
    type: 'set' | 'update' | 'delete';
    collectionPath: string;
    documentId: string;
    data?: Record<string, any>;
  }>
): Promise<void> {
  try {
    const db = getFirestore();
    const batch = db.batch();

    operations.forEach(op => {
      const ref = db.collection(op.collectionPath).doc(op.documentId);

      if (op.type === 'set' && op.data) {
        batch.set(ref, {
          ...op.data,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } else if (op.type === 'update' && op.data) {
        batch.update(ref, {
          ...op.data,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } else if (op.type === 'delete') {
        batch.delete(ref);
      }
    });

    await batch.commit();
  } catch (error) {
    console.error('Error in batch write:', error);
    throw error;
  }
}

/**
 * Get a collection reference
 * @param collectionPath - Collection path
 * @returns Collection reference
 */
export function getCollection(collectionPath: string): admin.firestore.CollectionReference {
  const db = getFirestore();
  return db.collection(collectionPath);
}

/**
 * Get a document reference
 * @param collectionPath - Collection path
 * @param documentId - Document ID
 * @returns Document reference
 */
export function getDocumentRef(
  collectionPath: string,
  documentId: string
): admin.firestore.DocumentReference {
  const db = getFirestore();
  return db.collection(collectionPath).doc(documentId);
}

// Export Firestore for direct use if needed
export { getFirestore };

