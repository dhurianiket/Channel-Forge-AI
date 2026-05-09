import admin from "firebase-admin";
import { config } from "../config/env.js"; // use .js for tsx/esm compat if needed, but tsx handles .ts without extension

let db: admin.firestore.Firestore;

export function getAdminDb() {
  if (db) return db;

  if (!admin.apps.length) {
    if (config.FIREBASE_ADMIN_PRIVATE_KEY && config.FIREBASE_ADMIN_CLIENT_EMAIL && config.FIREBASE_ADMIN_PROJECT_ID) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: config.FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: config.FIREBASE_ADMIN_CLIENT_EMAIL,
          // Handle newline characters in the private key from env variables
          privateKey: config.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      console.warn("Missing Firebase Admin credentials. Falling back to default app.");
      admin.initializeApp();
    }
  }
  
  db = admin.firestore();
  return db;
}
