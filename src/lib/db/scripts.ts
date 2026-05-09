import { db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { ScriptVersion } from "@/src/types";

export async function listScriptVersions(workspaceId: string, channelId: string, projectId: string): Promise<ScriptVersion[]> {
    try {
        const q = query(
            collection(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "scripts"),
            orderBy("versionNumber", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ScriptVersion));
    } catch (error) {
        handleFirestoreError(error, OperationType.LIST, `scripts for ${projectId}`);
        return [];
    }
}

export async function getScriptVersion(workspaceId: string, channelId: string, projectId: string, scriptId: string): Promise<ScriptVersion | null> {
    try {
        const docRef = doc(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "scripts", scriptId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as ScriptVersion;
        }
        return null;
    } catch (error) {
        handleFirestoreError(error, OperationType.GET, `scripts ${scriptId}`);
        return null;
    }
}

export async function createScriptVersion(workspaceId: string, channelId: string, projectId: string, createdBy: string, data: Partial<Omit<ScriptVersion, "id" | "projectId" | "createdBy" | "createdAt" | "updatedAt">>): Promise<ScriptVersion> {
    try {
        const scripts = await listScriptVersions(workspaceId, channelId, projectId);
        const nextVersion = scripts.length > 0 ? scripts[0].versionNumber + 1 : 1;

        const newDocRef = doc(collection(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "scripts"));
        const model: ScriptVersion = {
            id: newDocRef.id,
            projectId,
            versionNumber: nextVersion,
            sourceIdeaId: data.sourceIdeaId || null,
            title: data.title || "Untitled Script",
            hook: data.hook || "",
            outline: data.outline || "",
            fullText: data.fullText || "",
            language: data.language || "English",
            tone: data.tone || "Neutral",
            status: data.status || "DRAFT",
            createdBy,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        await setDoc(newDocRef, model);
        return model;
    } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `scripts for ${projectId}`);
        throw error;
    }
}

export async function updateScriptVersion(workspaceId: string, channelId: string, projectId: string, scriptId: string, data: Partial<ScriptVersion>): Promise<void> {
    try {
        const docRef = doc(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "scripts", scriptId);
        await updateDoc(docRef, {
            ...data,
            updatedAt: Date.now()
        });
    } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `scripts ${scriptId}`);
    }
}
