import { db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { VoiceTake } from "@/src/types";

export async function listVoiceTakes(workspaceId: string, channelId: string, projectId: string): Promise<VoiceTake[]> {
    try {
        const q = query(
            collection(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "voice"),
            orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VoiceTake));
    } catch (error) {
        handleFirestoreError(error, OperationType.LIST, `voice for ${projectId}`);
        return [];
    }
}

export async function createVoiceTake(workspaceId: string, channelId: string, projectId: string, data: Partial<Omit<VoiceTake, "id" | "projectId" | "createdAt" | "updatedAt">>): Promise<VoiceTake> {
    try {
        const newDocRef = doc(collection(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "voice"));
        const model: VoiceTake = {
            id: newDocRef.id,
            projectId,
            provider: data.provider || "manual",
            voiceName: data.voiceName || "default",
            audioUrl: data.audioUrl || "",
            durationSec: data.durationSec || 0,
            status: data.status || "READY",
            notes: data.notes || "",
            approved: data.approved || false,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        await setDoc(newDocRef, model);
        return model;
    } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `voice for ${projectId}`);
        throw error;
    }
}

export async function updateVoiceTake(workspaceId: string, channelId: string, projectId: string, takeId: string, data: Partial<VoiceTake>): Promise<void> {
    try {
        const docRef = doc(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "voice", takeId);
        await updateDoc(docRef, {
            ...data,
            updatedAt: Date.now()
        });
    } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `voice ${takeId}`);
    }
}

export async function deleteVoiceTake(workspaceId: string, channelId: string, projectId: string, takeId: string): Promise<void> {
    try {
        const docRef = doc(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "voice", takeId);
        await deleteDoc(docRef);
    } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `voice ${takeId}`);
    }
}
