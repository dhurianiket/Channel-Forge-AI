import { db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { SceneRow } from "@/src/types";

export async function listScenes(workspaceId: string, channelId: string, projectId: string): Promise<SceneRow[]> {
    try {
        const q = query(
            collection(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "scenes"),
            orderBy("order", "asc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SceneRow));
    } catch (error) {
        handleFirestoreError(error, OperationType.LIST, `scenes for ${projectId}`);
        return [];
    }
}

export async function createScene(workspaceId: string, channelId: string, projectId: string, data: Partial<Omit<SceneRow, "id" | "projectId" | "createdAt" | "updatedAt">>): Promise<SceneRow> {
    try {
        const newDocRef = doc(collection(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "scenes"));
        const model: SceneRow = {
            id: newDocRef.id,
            projectId,
            order: data.order || 0,
            narrationText: data.narrationText || "",
            durationSec: data.durationSec || 0,
            visualType: data.visualType || "A-Roll",
            imagePrompt: data.imagePrompt || "",
            videoPrompt: data.videoPrompt || "",
            stockFootageNotes: data.stockFootageNotes || "",
            onScreenText: data.onScreenText || "",
            soundDesignCue: data.soundDesignCue || "",
            status: data.status || "DRAFT",
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        await setDoc(newDocRef, model);
        return model;
    } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `scenes for ${projectId}`);
        throw error;
    }
}

export async function updateScene(workspaceId: string, channelId: string, projectId: string, sceneId: string, data: Partial<SceneRow>): Promise<void> {
    try {
        const docRef = doc(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "scenes", sceneId);
        await updateDoc(docRef, {
            ...data,
            updatedAt: Date.now()
        });
    } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `scenes ${sceneId}`);
    }
}

export async function deleteScene(workspaceId: string, channelId: string, projectId: string, sceneId: string): Promise<void> {
    try {
        const docRef = doc(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "scenes", sceneId);
        await deleteDoc(docRef);
    } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `scenes ${sceneId}`);
    }
}
