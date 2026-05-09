import { createAutomationRun, updateAutomationRun } from "@/src/lib/db/automationRuns";
import { createEvent } from "@/src/lib/db/events";
import { updatePublishJob } from "@/src/lib/db/publish";
import { updateProject } from "@/src/lib/db/projects";
import { scheduleYouTubePublish } from "@/src/lib/integrations/youtube";
import { triggerN8nWebhook } from "@/src/lib/integrations/n8n";

export async function executePublishJob(
    workspaceId: string,
    channelId: string,
    projectId: string,
    publishJobId: string,
    metadata: any,
    videoUrl: string | null,
    actorId: string
) {
    const idempotencyKey = `publish_${publishJobId}_${Date.now()}`;
    const run = await createAutomationRun(workspaceId, channelId, projectId, {
        triggerType: "MANUAL",
        workflowType: "PUBLISH_VIDEO",
        payload: { publishJobId, metadataId: metadata.id },
        idempotencyKey
    });

    await createEvent(workspaceId, channelId, projectId, {
        type: "PUBLISH_STARTED",
        actorType: "SYSTEM",
        actorId,
        message: `Publish loop started for job ${publishJobId}`,
        metadata: { runId: run.id }
    });

    try {
        const result = await scheduleYouTubePublish(null, publishJobId, metadata, videoUrl);
        
        await triggerN8nWebhook("publish-start", {
            workspaceId, channelId, projectId, action: "PUBLISHED", payload: { publishJobId, metadata }, idempotencyKey, timestamp: Date.now()
        });

        if (result.success) {
            await updateAutomationRun(workspaceId, channelId, projectId, run.id, {
                status: "RUNNING", // Waiting for backend callback
                result: { publishJobId }
            });
        }
        
    } catch (e: any) {
        await updateAutomationRun(workspaceId, channelId, projectId, run.id, {
            status: "FAILED",
            finishedAt: Date.now(),
            errorMessage: e.message || "Unknown error"
        });
    }
}
