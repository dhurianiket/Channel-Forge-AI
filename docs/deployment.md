# Deployment Guidelines

## Frontend Deployment
1. Ensure `.env.production` is populated with `VITE_*` variables.
2. Run `npm run build` to verify frontend builds cleanly.
3. If using Firebase Hosting for a standalone SPA, deploy with `firebase deploy --only hosting`.

## Backend Deployment (Full-Stack server)
1. Ensure your server environment (e.g. Cloud Run) has the server-only variables populated:
   - `FIREBASE_ADMIN_PROJECT_ID`
   - `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `FIREBASE_ADMIN_PRIVATE_KEY`
   - `WEBHOOK_SIGNATURE_SECRET`
   - `INTERNAL_API_KEY`
2. Build the server using `npm run build` so Vite compiles the client assets to `dist/`.
3. Start the server using `npm run start` or `tsx server.ts`. The Express backend handles `/api` traffic and serves the Vite client application for all other routes.

## Indexing
This application requires compound queries in Firestore to optimize sorting and filtering.
Deploy indexes using:
`firebase deploy --only firestore:indexes`

## Securing Firestore
The `firestore.rules` file enforces workspace/channel isolation. 
It ensures subcollections (`projects`, `ideas`, `scripts`, `roughCuts`, etc.) are only accessible by users who have explicitly joined the top-level Workspace.
