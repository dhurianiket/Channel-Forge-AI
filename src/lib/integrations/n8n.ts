export interface N8nPayload {
    workspaceId: string;
    channelId: string;
    projectId: string;
    action: string;
    payload: any;
    idempotencyKey: string;
    timestamp: number;
}

export async function triggerN8nWebhook(webhookId: string, payload: N8nPayload): Promise<boolean> {
    const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
    if (!webhookUrl) {
        console.warn("N8n webhook URL not configured");
        return false;
    }
    try {
        const response = await fetch(`${webhookUrl}/${webhookId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        return response.ok;
    } catch (e) {
        console.error("Failed to trigger n8n webhook", e);
        return false;
    }
}
