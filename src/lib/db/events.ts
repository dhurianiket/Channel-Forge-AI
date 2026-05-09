import { db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { collection, doc, getDocs, setDoc, query, orderBy } from "firebase/firestore";
import { ProjectEvent } from "@/src/types";

export async function listEvents(workspaceId: string, channelId: string, projectId: string): Promise<ProjectEvent[]> {
    try {
        const q = query(
            collection(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "events"),
            orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProjectEvent));
    } catch (error) {
        handleFirestoreError(error, OperationType.LIST, `events for ${projectId}`);
        return [];
    }
}

export async function createEvent(workspaceId: string, channelId: string, projectId: string, data: Omit<ProjectEvent, "id" | "projectId" | "workspaceId" | "channelId" | "createdAt">): Promise<ProjectEvent> {
    try {
        const newDocRef = doc(collection(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "events"));
        const model: ProjectEvent = {
            id: newDocRef.id,
            projectId,
            workspaceId,
            channelId,
            ...data,
            createdAt: Date.now(),
        };
        await setDoc(newDocRef, model);
        return model;
    } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `events for ${projectId}`);
        throw error;
    }
}
