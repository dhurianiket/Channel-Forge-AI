import { PublishJobPayload } from "./types";

export async function enqueuePublishJob(payload: PublishJobPayload): Promise<void> {
    // In a real application, this would enqueue to Cloud Tasks or Google Cloud Pub/Sub
    console.log("Enqueueing publish job", payload);
}
