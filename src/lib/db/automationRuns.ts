import { db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { collection, doc, getDocs, setDoc, updateDoc, query, orderBy } from "firebase/firestore";
import { AutomationRun } from "@/src/types";

export async function listAutomationRuns(workspaceId: string, channelId: string, projectId: string): Promise<AutomationRun[]> {
    try {
        const q = query(
            collection(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "automationRuns"),
            orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AutomationRun));
    } catch (error) {
        handleFirestoreError(error, OperationType.LIST, `automationRuns for ${projectId}`);
        return [];
    }
}

export async function createAutomationRun(workspaceId: string, channelId: string, projectId: string, data: Omit<AutomationRun, "id" | "projectId" | "createdAt" | "status" | "startedAt" | "finishedAt" | "errorMessage" | "result">): Promise<AutomationRun> {
    try {
        const newDocRef = doc(collection(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "automationRuns"));
        const model: AutomationRun = {
            id: newDocRef.id,
            projectId,
            ...data,
            status: "QUEUED",
            startedAt: Date.now(),
            finishedAt: null,
            errorMessage: null,
            result: null,
            createdAt: Date.now(),
        };
        await setDoc(newDocRef, model);
        return model;
    } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `automationRuns for ${projectId}`);
        throw error;
    }
}

export async function updateAutomationRun(workspaceId: string, channelId: string, projectId: string, runId: string, data: Partial<AutomationRun>): Promise<void> {
    try {
        const docRef = doc(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "automationRuns", runId);
        await updateDoc(docRef, { ...data });
    } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `automationRuns ${runId}`);
        throw error;
    }
}
