import { createAutomationRun, updateAutomationRun } from "@/src/lib/db/automationRuns";
import { createEvent } from "@/src/lib/db/events";
import { createAnalyticsSnapshot } from "@/src/lib/db/analytics";
import { fetchVideoAnalytics } from "@/src/lib/integrations/analytics";
import { updateProject } from "@/src/lib/db/projects";
import { triggerN8nWebhook } from "@/src/lib/integrations/n8n";

export async function executeAnalyticsSync(
    workspaceId: string,
    channelId: string,
    projectId: string,
    youtubeVideoId: string,
    actorId: string
) {
    const idempotencyKey = `analytics_${youtubeVideoId}_${Date.now()}`;
    const run = await createAutomationRun(workspaceId, channelId, projectId, {
        triggerType: "MANUAL",
        workflowType: "SYNC_ANALYTICS",
        payload: { youtubeVideoId },
        idempotencyKey
    });

    await createEvent(workspaceId, channelId, projectId, {
        type: "ANALYTICS_SYNC_STARTED",
        actorType: "SYSTEM",
        actorId,
        message: `Analytics sync started for video ${youtubeVideoId}`,
        metadata: { runId: run.id }
    });

    try {
        await triggerN8nWebhook("analytics-sync-start", {
            workspaceId, channelId, projectId, action: "ANALYTICS_SYNC", payload: { youtubeVideoId }, idempotencyKey, timestamp: Date.now()
        });

        await updateAutomationRun(workspaceId, channelId, projectId, run.id, {
            status: "RUNNING"
        });
        
    } catch (e: any) {
        await updateAutomationRun(workspaceId, channelId, projectId, run.id, {
            status: "FAILED",
            finishedAt: Date.now(),
            errorMessage: e.message || "Unknown error"
        });
    }
}
