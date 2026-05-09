# Pilot Runbook

## Overview
This runbook covers the operating procedure for the first 50-100 videos (the "Pilot Batch"), ensuring standard governance checkpoints and quality control.

## Batch Constraints
- Do not exceed 3-5 active long-form projects at one time.
- Generate 1-3 shorts per long-form concept.
- **NEVER bypass governance states.**

## Operations Summary
1.  **Idea Scoring:** Demand > 70, Originality > 60 for pilot projects.
2.  **Script Approval:** Editor-in-Chief / Channel Manager must approve.
3.  **Fact Check:** Every script with > 2 claims must be fact-checked.
4.  **Edit QA:** Final visual inspection of timing, synthetic boundaries, and disclosure markers.
5.  **Publish:** Manual button press mapping to the "Ready to Publish" state.

## Failures
If an automation job fails, do NOT blindly retry.
1.  Check the Operations Center (`/ops`).
2.  Assess the error message (e.g. rate limit, webhook signature mismatch).
3.  If rate limit, wait 10 min and use the "Retry" button.
4.  If logic/corrupted state, do a Postmortem (`/projects/:id` -> Postmortem tab) before manually adjusting.
