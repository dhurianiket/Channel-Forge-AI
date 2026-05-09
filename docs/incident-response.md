# Incident Response

## Severity Matrix
- **CRITICAL**: The N8n webhooks are failing signature verification, or YouTube OAuth is completely disconnected.
- **HIGH**: The render worker is timing out persistently and backing up the internal queue.
- **MEDIUM**: An analytics sync fails repeatedly, requiring a manual pull.
- **LOW**: A project is stuck in formatting or a specific rough cut failed due to a malformed voice take.

## Remediation Path
1. **Identify**: Check the Ops Center (`/ops`) for systemic alerts or the individual Project Dashboard "Events" tab.
2. **Triaging**: If a single job fails (e.g. timeout), use the Retry button. `utils/retryPolicy.ts` already handles passive failures up to 3 times before requiring this step.
3. **Escalation**: If signature verification is consistently failing, rotate `WEBHOOK_SIGNATURE_SECRET`.
4. **Postmortem Log**: Open the affected project, navigate to the **Postmortem** tab, and file an incident report explicitly listing the root cause and the fix applied. Do not resume automated publishing for that channel until the postmortem is finalized.
