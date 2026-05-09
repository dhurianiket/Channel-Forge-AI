import { db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { collection, doc, getDoc, getDocs, setDoc, query, where, writeBatch } from "firebase/firestore";
import { ChecklistItem, ProjectStage } from "@/src/types";

export async function getStageChecklist(workspaceId: string, channelId: string, projectId: string, stage: ProjectStage): Promise<ChecklistItem[]> {
    try {
        const q = query(
            collection(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "checklists"),
            where("stage", "==", stage)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChecklistItem));
    } catch (error) {
        handleFirestoreError(error, OperationType.LIST, `checklist for ${projectId} ${stage}`);
        return [];
    }
}

export async function upsertStageChecklistItems(
    workspaceId: string, 
    channelId: string, 
    projectId: string, 
    stage: ProjectStage,
    items: ChecklistItem[]
): Promise<void> {
    try {
        const batch = writeBatch(db);
        for (const item of items) {
            const docRef = doc(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "checklists", item.id);
            batch.set(docRef, {
                ...item,
                stage,
            }, { merge: true });
        }
        await batch.commit();
    } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `checklist for ${projectId} ${stage}`);
        throw error;
    }
}

export async function evaluateStageChecklistCompletion(
    workspaceId: string, 
    channelId: string, 
    projectId: string, 
    stage: ProjectStage
): Promise<boolean> {
    const items = await getStageChecklist(workspaceId, channelId, projectId, stage);
    if (items.length === 0) return true; // Empty checklist is complete
    return items.every(item => item.completed);
}
