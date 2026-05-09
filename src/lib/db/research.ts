import { db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { FactCard } from "@/src/types";

export async function listFactCards(workspaceId: string, channelId: string, projectId: string): Promise<FactCard[]> {
    try {
        const q = query(
            collection(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "research"),
            orderBy("updatedAt", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FactCard));
    } catch (error) {
        handleFirestoreError(error, OperationType.LIST, `research for ${projectId}`);
        return [];
    }
}

export async function createFactCard(workspaceId: string, channelId: string, projectId: string, data: Partial<Omit<FactCard, "id" | "projectId" | "createdAt" | "updatedAt">>): Promise<FactCard> {
    try {
        const newDocRef = doc(collection(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "research"));
        const model: FactCard = {
            id: newDocRef.id,
            projectId,
            claim: data.claim || "",
            summary: data.summary || "",
            sourceUrl: data.sourceUrl || "",
            sourceLabel: data.sourceLabel || "",
            confidence: data.confidence || 0,
            isSpeculative: data.isSpeculative || false,
            tags: data.tags || [],
            notes: data.notes || "",
            approvedForScript: data.approvedForScript || false,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        await setDoc(newDocRef, model);
        return model;
    } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `research for ${projectId}`);
        throw error;
    }
}

export async function updateFactCard(workspaceId: string, channelId: string, projectId: string, factId: string, data: Partial<FactCard>): Promise<void> {
    try {
        const docRef = doc(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "research", factId);
        await updateDoc(docRef, {
            ...data,
            updatedAt: Date.now()
        });
    } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `research ${factId}`);
    }
}

export async function deleteFactCard(workspaceId: string, channelId: string, projectId: string, factId: string): Promise<void> {
    try {
        const docRef = doc(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "research", factId);
        await deleteDoc(docRef);
    } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `research ${factId}`);
    }
}
