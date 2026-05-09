import { getAdminDb } from './firestoreAdmin.js';
import * as admin from 'firebase-admin';

export async function logAlert(type: string, message: string, context: any) {
  const db = getAdminDb();
  console.error(`[ALERT] ${type}: ${message}`, context);
  
  try {
    await db.collection('systemAlerts').add({
      type,
      message,
      context,
      resolved: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Failed to write alert to Firestore', error);
  }
}
