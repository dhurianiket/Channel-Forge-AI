import { getAdminDb } from '../services/firestoreAdmin.js';

export async function checkIdempotency(key: string, context: string): Promise<boolean> {
  if (!key) return false;
  
  const db = getAdminDb();
  const idRef = db.collection('systemIdempotency').doc(`${context}_${key}`);
  
  try {
    const doc = await idRef.get();
    if (doc.exists) {
      return false; // Already processed
    }
    
    // Mark as processed
    await idRef.set({
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
      context,
      key
    });
    
    return true;
  } catch (error) {
    console.error(`Idempotency check failed for key ${key}:`, error);
    // Fail safe: assume not processed if error, but this might lead to duplicate processing
    // In strict systems, we might want to throw here
    return true; 
  }
}

import * as admin from 'firebase-admin';
