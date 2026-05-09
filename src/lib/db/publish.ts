import { db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { collection, doc, getDocs, setDoc, updateDoc, query, orderBy } from "firebase/firestore";
import { PublishJob } from "@/src/types";

export async function listPublishJobs(workspaceId: string, channelId: string, projectId: string): Promise<PublishJob[]> {
    try {
        const q = query(
            collection(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "publishJobs"),
            orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PublishJob));
    } catch (error) {
        handleFirestoreError(error, OperationType.LIST, `publishJobs for ${projectId}`);
        return [];
    }
}

export async function createPublishJob(workspaceId: string, channelId: string, projectId: string, data: Partial<Omit<PublishJob, "id" | "projectId" | "createdAt" | "updatedAt">>): Promise<PublishJob> {
    try {
        const newDocRef = doc(collection(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "publishJobs"));
        const model: PublishJob = {
            id: newDocRef.id,
            projectId,
            roughCutId: data.roughCutId || "",
            metadataId: data.metadataId || "",
            title: data.title || "",
            description: data.description || "",
            tags: data.tags || [],
            visibility: data.visibility || "PRIVATE",
            scheduledFor: data.scheduledFor || null,
            status: data.status || "DRAFT",
            syntheticDisclosureRequired: data.syntheticDisclosureRequired || false,
            syntheticDisclosureConfirmed: data.syntheticDisclosureConfirmed || false,
            youtubeVideoId: data.youtubeVideoId || null,
            errorMessage: data.errorMessage || null,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        await setDoc(newDocRef, model);
        return model;
    } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `publishJobs for ${projectId}`);
        throw error;
    }
}

export async function updatePublishJob(workspaceId: string, channelId: string, projectId: string, jobId: string, data: Partial<PublishJob>): Promise<void> {
    try {
        const docRef = doc(db, "workspaces", workspaceId, "channels", channelId, "projects", projectId, "publishJobs", jobId);
        await updateDoc(docRef, {
            ...data,
            updatedAt: Date.now()
        });
    } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `publishJobs ${jobId}`);
    }
}
