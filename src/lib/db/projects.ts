import { db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, orderBy } from "firebase/firestore";
import { Project, ProjectStage, ApprovalStatus } from "@/src/types";

export async function listProjects(workspaceId: string, channelId: string): Promise<Project[]> {
    try {
        const q = query(
            collection(db, "workspaces", workspaceId, "channels", channelId, "projects"),
            orderBy("updatedAt", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
    } catch (error) {
        handleFirestoreError(error, OperationType.LIST, `workspaces/${workspaceId}/channels/${channelId}/projects`);
        return [];
    }
}

export async function getProject(workspaceId: string, channelId: string, projectId: string): Promise<Project | null> {
    try {
        const docRef = doc(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Project;
        }
        return null;
    } catch (error) {
        handleFirestoreError(error, OperationType.GET, `workspaces/${workspaceId}/channels/${channelId}/projects/${projectId}`);
        return null;
    }
}

export async function createProject(workspaceId: string, channelId: string, data: Partial<Pick<Project, "title" | "status" | "createdBy">>): Promise<Project> {
    try {
        const newDocRef = doc(collection(db, "workspaces", workspaceId, "channels", channelId, "projects"));
        const project: Project = { 
            id: newDocRef.id,
            workspaceId, 
            channelId, 
            title: data.title || "Untitled Project",
            status: data.status || "DRAFT",
            currentStage: ProjectStage.IDEA,
            createdBy: data.createdBy || "unknown",
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        await setDoc(newDocRef, project);
        return project;
    } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `workspaces/${workspaceId}/channels/${channelId}/projects`);
        throw error;
    }
}

export async function updateProject(workspaceId: string, channelId: string, projectId: string, data: Partial<Project>): Promise<void> {
    try {
        const docRef = doc(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId);
        await updateDoc(docRef, {
            ...data,
            updatedAt: Date.now()
        });
    } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `workspaces/${workspaceId}/channels/${channelId}/projects/${projectId}`);
    }
}

export async function transitionProjectStage(workspaceId: string, channelId: string, projectId: string, newStage: ProjectStage): Promise<void> {
    await updateProject(workspaceId, channelId, projectId, { currentStage: newStage });
}

export async function setSelectedIdea(workspaceId: string, channelId: string, projectId: string, selectedIdeaId: string): Promise<void> {
    await updateProject(workspaceId, channelId, projectId, { selectedIdeaId });
}

export async function setActiveScriptVersion(workspaceId: string, channelId: string, projectId: string, activeScriptVersionId: string): Promise<void> {
    await updateProject(workspaceId, channelId, projectId, { activeScriptVersionId });
}

export async function setApprovedScriptVersion(workspaceId: string, channelId: string, projectId: string, approvedScriptVersionId: string): Promise<void> {
    await updateProject(workspaceId, channelId, projectId, { approvedScriptVersionId });
}
