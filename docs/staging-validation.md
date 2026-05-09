# Staging Validation

Before migrating from the Staging environment to Production, execute this validation pass carefully. Use the `/ops/validation` UI to observe the checklist.

## 1. Governance Control Test
- [ ] Create test project.
- [ ] Attempt to click "Publish" or "Render" while it is stuck in the IDEA stage.
- [ ] *Pass Criteria*: The UI marks the stage as "Locked" and refuses to update `project.currentStage`.

## 2. Webhook Signature Tolerance Test
- [ ] Trigger an n8n webhook manually but inject a wrong signature.
- [ ] *Pass Criteria*: Backend drops with 401 Unauthorized `Invalid signature`.
- [ ] Trigger manual but use a timestamp > 5 mins old.
- [ ] *Pass Criteria*: Backend drops with 401 Unauthorized `Stale webhook timestamp`.

## 3. Idempotency Replay Test
- [ ] Trigger an n8n render-complete callback manually with a valid signature and ID. (Returns 200 OK)
- [ ] Re-send the exact identical POST request.
- [ ] *Pass Criteria*: Backend returns 200 OK with `status: 'ignored_duplicate'` and does NOT re-update the timestamp of the rough cut.

## 4. End-to-End Pilot Loop Test
- [ ] Approve an idea -> draft metadata.
- [ ] Publish video -> receive youtubeVideoId.
- [ ] Look at "Analytics Checkpoints".
- [ ] *Pass Criteria*: The Operator must now see 48h/7d/28d checkpoints present.
- [ ] Add a Postmortem for a simulated bad rendering issue.
- [ ] *Pass Criteria*: Database retains `rootCause` and updates project timeline without breaking the UI.
