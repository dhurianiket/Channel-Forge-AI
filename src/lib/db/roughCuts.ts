import { db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, orderBy } from "firebase/firestore";
import { RoughCut } from "@/src/types";

export async function listRoughCuts(workspaceId: string, channelId: string, projectId: string): Promise<RoughCut[]> {
    try {
        const q = query(
            collection(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "roughCuts"),
            orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RoughCut));
    } catch (error) {
        handleFirestoreError(error, OperationType.LIST, `roughCuts for ${projectId}`);
        return [];
    }
}

export async function createRoughCut(workspaceId: string, channelId: string, projectId: string, data: Partial<Omit<RoughCut, "id" | "projectId" | "createdAt" | "updatedAt">>): Promise<RoughCut> {
    try {
        const newDocRef = doc(collection(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "roughCuts"));
        const model: RoughCut = {
            id: newDocRef.id,
            projectId,
            scriptVersionId: data.scriptVersionId || "",
            voiceTakeId: data.voiceTakeId || "",
            sceneCount: data.sceneCount || 0,
            durationSec: data.durationSec || 0,
            renderMode: data.renderMode || "draft",
            previewUrl: data.previewUrl || "",
            timelineJson: data.timelineJson || "{}",
            subtitleMode: data.subtitleMode || "auto",
            musicMode: data.musicMode || "auto",
            status: data.status || "DRAFT",
            notes: data.notes || "",
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        await setDoc(newDocRef, model);
        return model;
    } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `roughCuts for ${projectId}`);
        throw error;
    }
}

export async function updateRoughCut(workspaceId: string, channelId: string, projectId: string, roughCutId: string, data: Partial<RoughCut>): Promise<void> {
    try {
        const docRef = doc(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "roughCuts", roughCutId);
        await updateDoc(docRef, {
            ...data,
            updatedAt: Date.now()
        });
    } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `roughCuts ${roughCutId}`);
    }
}
