import { db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { collection, doc, getDoc, getDocs, setDoc, query, where, orderBy, limit } from "firebase/firestore";
import { Approval, ApprovalStatus, ProjectStage } from "@/src/types";

export async function listApprovals(workspaceId: string, channelId: string, projectId: string): Promise<Approval[]> {
    try {
        const q = query(
            collection(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "approvals"),
            orderBy("requestedAt", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Approval));
    } catch (error) {
        handleFirestoreError(error, OperationType.LIST, `approvals for ${projectId}`);
        return [];
    }
}

export async function getLatestApprovalForStage(workspaceId: string, channelId: string, projectId: string, stage: ProjectStage): Promise<Approval | null> {
    try {
        const q = query(
            collection(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "approvals"),
            where("stage", "==", stage),
            orderBy("requestedAt", "desc"),
            limit(1)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Approval;
        }
        return null;
    } catch (error) {
        handleFirestoreError(error, OperationType.LIST, `latest approval for ${projectId}`);
        return null;
    }
}

export async function requestApproval(
    workspaceId: string, 
    channelId: string, 
    projectId: string, 
    req: Omit<Approval, "id" | "status" | "requestedAt" | "decidedBy" | "decidedAt" | "notes" | "snapshotStageAfter">
): Promise<Approval> {
    try {
        const newDocRef = doc(collection(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "approvals"));
        const approval: Approval = {
            ...req,
            id: newDocRef.id,
            status: ApprovalStatus.PENDING,
            requestedAt: Date.now(),
            workspaceId,
            channelId,
            projectId,
        };
        await setDoc(newDocRef, approval);
        return approval;
    } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `approval for ${projectId}`);
        throw error;
    }
}

export async function decideApproval(
    workspaceId: string, 
    channelId: string, 
    projectId: string, 
    approvalId: string,
    decidedBy: string,
    status: ApprovalStatus,
    notes: string,
    snapshotStageAfter?: ProjectStage
): Promise<void> {
    try {
        const docRef = doc(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "approvals", approvalId);
        await setDoc(docRef, {
            status,
            decidedBy,
            decidedAt: Date.now(),
            notes,
            ...(snapshotStageAfter ? { snapshotStageAfter } : {})
        }, { merge: true });
    } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `approval ${approvalId}`);
        throw error;
    }
}
