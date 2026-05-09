import { collection, doc, setDoc, getDocs, getDoc, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { Postmortem } from "../../types";

export async function createPostmortem(
    workspaceId: string,
    channelId: string,
    projectId: string,
    postmortem: Omit<Postmortem, "id" | "workspaceId" | "channelId" | "projectId" | "createdAt" | "updatedAt">
): Promise<Postmortem> {
    const postmortemsRef = collection(db, `workspaces/${workspaceId}/channels/${channelId}/projects/${projectId}/postmortems`);
    const newDoc = doc(postmortemsRef);
    const newPostmortem: Postmortem = {
        id: newDoc.id,
        workspaceId,
        channelId,
        projectId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ...postmortem
    };

    await setDoc(newDoc, newPostmortem);
    return newPostmortem;
}

export async function getPostmortemsByProject(
    workspaceId: string,
    channelId: string,
    projectId: string
): Promise<Postmortem[]> {
    const postmortemsRef = collection(db, `workspaces/${workspaceId}/channels/${channelId}/projects/${projectId}/postmortems`);
    const q = query(postmortemsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => doc.data() as Postmortem);
}

export async function updatePostmortem(
    workspaceId: string,
    channelId: string,
    projectId: string,
    postmortemId: string,
    updates: Partial<Omit<Postmortem, "id" | "workspaceId" | "channelId" | "projectId" | "createdAt">>
): Promise<void> {
    const postmortemRef = doc(db, `workspaces/${workspaceId}/channels/${channelId}/projects/${projectId}/postmortems`, postmortemId);
    await updateDoc(postmortemRef, {
        ...updates,
        updatedAt: Date.now()
    } as any);
}
