import { RenderJobPayload } from "./types";

export async function enqueueRenderJob(payload: RenderJobPayload): Promise<void> {
    // In a real application, this would enqueue to Cloud Tasks or Google Cloud Pub/Sub
    console.log("Enqueueing render job", payload);
}
