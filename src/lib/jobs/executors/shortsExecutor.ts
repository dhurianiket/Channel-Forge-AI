import { createAutomationRun, updateAutomationRun } from "@/src/lib/db/automationRuns";
import { createEvent } from "@/src/lib/db/events";
import { createShort } from "@/src/lib/db/shorts";
import { extractShortsFromTranscript } from "@/src/lib/integrations/transcription";
import { triggerN8nWebhook } from "@/src/lib/integrations/n8n";

export async function executeShortsExtraction(
    workspaceId: string,
    channelId: string,
    projectId: string,
    videoId: string | null,
    roughCutId: string | null,
    transcriptText: string | null,
    actorId: string
) {
    const idempotencyKey = `shorts_${projectId}_${Date.now()}`;
    const run = await createAutomationRun(workspaceId, channelId, projectId, {
        triggerType: "MANUAL",
        workflowType: "EXTRACT_SHORTS",
        payload: { videoId, roughCutId },
        idempotencyKey
    });

    await createEvent(workspaceId, channelId, projectId, {
        type: "SHORTS_EXTRACTION_STARTED",
        actorType: "SYSTEM",
        actorId,
        message: `Shorts extraction started for project ${projectId}`,
        metadata: { runId: run.id }
    });

    try {
        await triggerN8nWebhook("shorts-extract-start", {
            workspaceId, channelId, projectId, action: "SHORTS_EXTRACT", payload: { videoId, roughCutId, transcriptText }, idempotencyKey, timestamp: Date.now()
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
