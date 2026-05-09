import { collection, doc, setDoc, getDocs, updateDoc, query, where, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { SOPTemplate } from "../../types";

export async function createTemplate(workspaceId: string, channelId: string | undefined, templateData: Partial<SOPTemplate>): Promise<SOPTemplate> {
    const templatesRef = collection(db, `workspaces/${workspaceId}/templates`);
    const newRef = doc(templatesRef);
    const data: SOPTemplate = {
        id: newRef.id,
        workspaceId,
        channelId,
        type: templateData.type || "SCRIPT_STRUCTURE",
        name: templateData.name || "Untitled Template",
        content: templateData.content || "",
        isActive: true,
        version: 1,
        createdBy: templateData.createdBy || "SYSTEM",
        createdAt: Date.now(),
        updatedAt: Date.now()
    };
    await setDoc(newRef, data);
    return data;
}

export async function getTemplates(workspaceId: string, channelId?: string): Promise<SOPTemplate[]> {
    const templatesRef = collection(db, `workspaces/${workspaceId}/templates`);
    let q = query(templatesRef);
    if (channelId) {
        // You'd want to query either matching channelId or undefined for global templates.
        // For simplicity, retrieving all in workspace and filtering here.
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => d.data() as SOPTemplate).filter(t => !t.channelId || t.channelId === channelId);
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as SOPTemplate);
}

export async function updateTemplate(workspaceId: string, templateId: string, updates: Partial<SOPTemplate>): Promise<void> {
    const ref = doc(db, `workspaces/${workspaceId}/templates`, templateId);
    await updateDoc(ref, {
        ...updates,
        updatedAt: Date.now()
    });
}
