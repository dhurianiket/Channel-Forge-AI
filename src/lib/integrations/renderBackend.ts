export async function dispatchRenderJob(payload: {
    roughCutId: string;
    scriptVersionId: string;
    voiceTakeId: string;
    scenes: any[];
    resolution: string;
    fps: number;
}): Promise<{ jobId: string; success: boolean }> {
    console.log("Simulating dispatching render job to backend", payload);
    return {
        jobId: "render_" + Math.random().toString(36).substring(7),
        success: true
    };
}
