import { db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { collection, doc, getDocs, setDoc, query, orderBy } from "firebase/firestore";
import { AnalyticsSnapshot } from "@/src/types";

export async function listAnalyticsSnapshots(workspaceId: string, channelId: string, projectId: string): Promise<AnalyticsSnapshot[]> {
    try {
        const q = query(
            collection(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "analytics"),
            orderBy("capturedAt", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AnalyticsSnapshot));
    } catch (error) {
        handleFirestoreError(error, OperationType.LIST, `analytics for ${projectId}`);
        return [];
    }
}

export async function createAnalyticsSnapshot(workspaceId: string, channelId: string, projectId: string, data: Partial<Omit<AnalyticsSnapshot, "id" | "projectId" | "capturedAt">>): Promise<AnalyticsSnapshot> {
    try {
        const newDocRef = doc(collection(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "analytics"));
        const model: AnalyticsSnapshot = {
            id: newDocRef.id,
            projectId,
            youtubeVideoId: data.youtubeVideoId || "",
            capturedAt: Date.now(),
            impressions: data.impressions || 0,
            ctr: data.ctr || 0,
            averageViewDurationSec: data.averageViewDurationSec || 0,
            averagePercentageViewed: data.averagePercentageViewed || 0,
            watchTimeHours: data.watchTimeHours || 0,
            views: data.views || 0,
            likes: data.likes || 0,
            comments: data.comments || 0,
            subscribersGained: data.subscribersGained || 0,
            topTrafficSources: data.topTrafficSources || [],
            retentionNotes: data.retentionNotes || "",
            packagingNotes: data.packagingNotes || "",
            improvementSummary: data.improvementSummary || "",
        };
        await setDoc(newDocRef, model);
        return model;
    } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `analytics for ${projectId}`);
        throw error;
    }
}
