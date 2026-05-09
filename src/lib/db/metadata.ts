import { db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy, limit } from "firebase/firestore";
import { MetadataPackage } from "@/src/types";

export async function getMetadataPackage(workspaceId: string, channelId: string, projectId: string): Promise<MetadataPackage | null> {
    try {
        const q = query(
            collection(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "metadata"),
            orderBy("createdAt", "desc"),
            limit(1)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
             return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as MetadataPackage;
        }
        return null;
    } catch (error) {
        handleFirestoreError(error, OperationType.LIST, `metadata for ${projectId}`);
        return null;
    }
}

export async function createMetadataPackage(workspaceId: string, channelId: string, projectId: string, data: Partial<Omit<MetadataPackage, "id" | "projectId" | "createdAt" | "updatedAt">>): Promise<MetadataPackage> {
    try {
        const newDocRef = doc(collection(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "metadata"));
        const model: MetadataPackage = {
            id: newDocRef.id,
            projectId,
            titleOptions: data.titleOptions || [],
            chosenTitle: data.chosenTitle || "",
            description: data.description || "",
            tags: data.tags || [],
            chapters: data.chapters || [],
            pinnedComment: data.pinnedComment || "",
            hashtags: data.hashtags || [],
            status: data.status || "DRAFT",
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        await setDoc(newDocRef, model);
        return model;
    } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `metadata for ${projectId}`);
        throw error;
    }
}

export async function updateMetadataPackage(workspaceId: string, channelId: string, projectId: string, metadataId: string, data: Partial<MetadataPackage>): Promise<void> {
    try {
        const docRef = doc(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "metadata", metadataId);
        await updateDoc(docRef, {
            ...data,
            updatedAt: Date.now()
        });
    } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `metadata ${metadataId}`);
    }
}
