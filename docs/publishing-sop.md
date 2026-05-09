# Publishing SOP

## Step-by-Step Approval

1.  **Metadata Definition:**
    *   Set chosen title based on CTR expectation.
    *   Add 5-10 core tags.
    *   Draft descriptions and set up Chapter timestamps if video length > 5min.
2.  **Disclosure Checks:**
    *   If using synthetic voices, check the "Synthetic Disclosure Required" box when saving metadata.
    *   The app will halt the publish trigger if disclosure is required but "Synthetic Disclosure Confirmed" is not actively set.
3.  **Publish Trigger:**
    *   Operator presses "Publish to YouTube."
    *   This transitions the app state to queued, deploying standard webhooks.
4.  **Completion Logs:**
    *   Once YouTube completes processing, a callback hits the server `/api/webhooks/publish-complete`.
    *   The UI updates state to "Published" + records the external YouTube ID.

## Restrictions
- Never use direct YouTube API credentials in the frontend. Publish workflows are backend-delegated.
- No auto-publishing or cron-publishing without explicit approval in the system.
