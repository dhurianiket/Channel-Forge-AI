import { createAutomationRun, updateAutomationRun } from "@/src/lib/db/automationRuns";
import { createEvent } from "@/src/lib/db/events";
import { updateRoughCut } from "@/src/lib/db/roughCuts";
import { dispatchRenderJob } from "@/src/lib/integrations/renderBackend";
import { triggerN8nWebhook } from "@/src/lib/integrations/n8n";

export async function executeRenderJob(
    workspaceId: string,
    channelId: string,
    projectId: string,
    roughCutId: string,
    scriptVersionId: string,
    voiceTakeId: string,
    scenes: any[],
    actorId: string
) {
    const idempotencyKey = `render_${roughCutId}_${Date.now()}`;
    const run = await createAutomationRun(workspaceId, channelId, projectId, {
        triggerType: "MANUAL",
        workflowType: "RENDER_ROUGH_CUT",
        payload: { roughCutId, scriptVersionId, voiceTakeId, sceneCount: scenes.length },
        idempotencyKey
    });

    await createEvent(workspaceId, channelId, projectId, {
        type: "RENDER_STARTED",
        actorType: "SYSTEM",
        actorId,
        message: `Render job started for rough cut ${roughCutId}`,
        metadata: { runId: run.id }
    });

    try {
        const { jobId, success } = await dispatchRenderJob({ roughCutId, scriptVersionId, voiceTakeId, scenes, resolution: "1080p", fps: 30 });
        
        await triggerN8nWebhook("render-start", {
            workspaceId, channelId, projectId, action: "RENDER", payload: { roughCutId, jobId }, idempotencyKey, timestamp: Date.now()
        });

        if (success) {
            await updateAutomationRun(workspaceId, channelId, projectId, run.id, {
                status: "RUNNING", // Changed to running, wait for server webhook
                result: { jobId }
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
