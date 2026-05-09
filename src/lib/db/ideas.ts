import { db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { Idea } from "@/src/types";

export async function listIdeas(workspaceId: string, channelId: string, projectId: string): Promise<Idea[]> {
    try {
        const q = query(
            collection(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "ideas"),
            orderBy("updatedAt", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Idea));
    } catch (error) {
        handleFirestoreError(error, OperationType.LIST, `ideas for ${projectId}`);
        return [];
    }
}

export async function getIdea(workspaceId: string, channelId: string, projectId: string, ideaId: string): Promise<Idea | null> {
    try {
        const docRef = doc(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "ideas", ideaId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Idea;
        }
        return null;
    } catch (error) {
        handleFirestoreError(error, OperationType.GET, `ideas for ${projectId} ${ideaId}`);
        return null;
    }
}

export async function createIdea(workspaceId: string, channelId: string, projectId: string, data: Partial<Omit<Idea, "id" | "projectId" | "createdAt" | "updatedAt">>): Promise<Idea> {
    try {
        const newDocRef = doc(collection(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "ideas"));
        const model: Idea = {
            id: newDocRef.id,
            projectId,
            title: data.title || "Untitled Idea",
            angle: data.angle || "",
            hook: data.hook || "",
            scoreDemand: data.scoreDemand || 0,
            scoreOriginality: data.scoreOriginality || 0,
            scoreComplexity: data.scoreComplexity || 0,
            scoreSafety: data.scoreSafety || 0,
            scoreEvergreen: data.scoreEvergreen || 0,
            scoreEmotionalPull: data.scoreEmotionalPull || 0,
            notes: data.notes || "",
            status: data.status || "DRAFT",
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        await setDoc(newDocRef, model);
        return model;
    } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `ideas for ${projectId}`);
        throw error;
    }
}

export async function updateIdea(workspaceId: string, channelId: string, projectId: string, ideaId: string, data: Partial<Idea>): Promise<void> {
    try {
        const docRef = doc(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "ideas", ideaId);
        await updateDoc(docRef, {
            ...data,
            updatedAt: Date.now()
        });
    } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `ideas ${ideaId}`);
    }
}

export async function deleteIdea(workspaceId: string, channelId: string, projectId: string, ideaId: string): Promise<void> {
    try {
        const docRef = doc(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "ideas", ideaId);
        await deleteDoc(docRef);
    } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `ideas ${ideaId}`);
    }
}
