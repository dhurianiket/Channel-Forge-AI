# Security Architecture

## Principles
1. **Never trust the frontend**: The frontend can prompt automations or edits, but all state mutations regarding workflow completeness, webhook firing, and status completions occur securely on the backend.
2. **Secrets stay on the server**: `VITE_*` environment variables are compiled into the client bundle and must only contain public, non-sensitive configuration. Service private keys, signing secrets (`WEBHOOK_SIGNATURE_SECRET`), internal API keys, and OAuth credentials must reside entirely on the backend server environment.

## Webhooks
- Webhooks fired from n8n or external workers must include a signature in the `x-webhook-signature` header, generated via HMAC SHA-256 using `WEBHOOK_SIGNATURE_SECRET`.
- A timestamp must also be provided to prevent replay attacks (`x-webhook-timestamp`).
- The backend verifies both before performing any state changes.

## Database Access
- Frontend accesses Firestore via Security Rules which guarantee users can only access projects in workspaces they explicitly belong to.
- Backend (`firebase-admin`) bypasses Security Rules but still enforces business logic (verifying a project actually exists before mutating its completion state).

## Internal Auth
- Internal utility routes are protected by `INTERNAL_API_KEY` validated by the `requireInternalAuth` middleware.
