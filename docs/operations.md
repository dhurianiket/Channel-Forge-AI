# Operations & Alerting

## Job Run Lifecycle
- **Render / Publish / Analytics** triggers flow from the client (or n8n) indicating they are QUEUED.
- The external workers run the heavy jobs and return via signed HTTP webhooks to the server `/api/webhooks/*` routes.
- The server idempotently records the success or failure, updating both `automationRuns` and the target documents (`publishJobs`, `roughCuts`).

## Retries
- Temporary failures (e.g., 502/504 errors or rate limits 429) hit the exponential backoff pattern (`utils/retryPolicy.ts`).
- Standard config: Max 3 retries, base delay 2000ms.

## Alerting
- If a job critically fails (or exceeds retry limits), the backend logs an alert via the `logAlert` utility into the `systemAlerts` collection.
- Administrators can monitor the `systemAlerts` collection for required manual overrides.
- In future iterations, link the `logAlert` hook to Slack or PagerDuty.

## Idempotency
- Incoming webhooks use an `idempotencyKey`. The backend records processed keys into the `systemIdempotency` collection.
- Duplicate requests returning the same key will be safely acknowledged with a 200 OK without re-running any mutation logic.
