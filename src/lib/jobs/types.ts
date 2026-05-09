export interface RenderJobPayload {
    roughCutId: string;
    scriptVersionId: string;
    voiceTakeId: string;
    sceneIds: string[];
    resolution: string;
    fps: number;
}

export interface PublishJobPayload {
    publishJobId: string;
    roughCutId: string;
    metadataId: string;
}

export interface AnalyticsSyncPayload {
    projectId: string;
    youtubeVideoId: string;
}
