import { db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { collection, doc, getDocs, setDoc, updateDoc, query, orderBy } from "firebase/firestore";
import { ShortProject } from "@/src/types";

export async function listShorts(workspaceId: string, channelId: string, projectId: string): Promise<ShortProject[]> {
    try {
        const q = query(
            collection(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "shorts"),
            orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ShortProject));
    } catch (error) {
        handleFirestoreError(error, OperationType.LIST, `shorts for ${projectId}`);
        return [];
    }
}

export async function createShort(workspaceId: string, channelId: string, projectId: string, data: Partial<Omit<ShortProject, "id" | "projectId" | "createdAt" | "updatedAt">>): Promise<ShortProject> {
    try {
        const newDocRef = doc(collection(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "shorts"));
        const model: ShortProject = {
            id: newDocRef.id,
            projectId,
            sourceVideoId: data.sourceVideoId || null,
            sourceRoughCutId: data.sourceRoughCutId || null,
            startSec: data.startSec || 0,
            endSec: data.endSec || 0,
            transcriptExcerpt: data.transcriptExcerpt || "",
            hookLine: data.hookLine || "",
            titleOptions: data.titleOptions || [],
            caption: data.caption || "",
            verticalVideoUrl: data.verticalVideoUrl || null,
            subtitleStyle: data.subtitleStyle || "default",
            status: data.status || "DRAFT",
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        await setDoc(newDocRef, model);
        return model;
    } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `shorts for ${projectId}`);
        throw error;
    }
}

export async function updateShort(workspaceId: string, channelId: string, projectId: string, shortId: string, data: Partial<ShortProject>): Promise<void> {
    try {
        const docRef = doc(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "shorts", shortId);
        await updateDoc(docRef, { ...data, updatedAt: Date.now() });
    } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `shorts ${shortId}`);
        throw error;
    }
}
