import { collection, doc, setDoc, getDocs, updateDoc, query, where, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { StageAssignment, ProjectStage } from "../../types";

export async function submitAssignment(workspaceId: string, channelId: string, projectId: string, assignment: Omit<StageAssignment, "id" | "workspaceId" | "channelId" | "projectId" | "createdAt" | "updatedAt">): Promise<StageAssignment> {
    const assignmentsRef = collection(db, `workspaces/${workspaceId}/channels/${channelId}/projects/${projectId}/assignments`);
    
    // Check if assignment exists for this stage
    const q = query(assignmentsRef, where("stage", "==", assignment.stage));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
        // Update existing
        const existingRef = snapshot.docs[0].ref;
        await updateDoc(existingRef, {
            ...assignment,
            updatedAt: Date.now()
        });
        const docSnap = await getDoc(existingRef);
        return docSnap.data() as StageAssignment;
    }

    // Create new
    const newRef = doc(assignmentsRef);
    const data: StageAssignment = {
        id: newRef.id,
        workspaceId,
        channelId,
        projectId,
        ...assignment,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };
    await setDoc(newRef, data);
    return data;
}

export async function getAssignmentsByProject(workspaceId: string, channelId: string, projectId: string): Promise<StageAssignment[]> {
    const assignmentsRef = collection(db, `workspaces/${workspaceId}/channels/${channelId}/projects/${projectId}/assignments`);
    const snapshot = await getDocs(query(assignmentsRef));
    return snapshot.docs.map(doc => doc.data() as StageAssignment);
}
