import { collection, doc, setDoc, getDocs, getDoc, updateDoc, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { AnalyticsReview } from "../../types";

export async function createAnalyticsReview(
    workspaceId: string,
    channelId: string,
    projectId: string,
    review: Omit<AnalyticsReview, "id" | "workspaceId" | "channelId" | "projectId" | "createdAt">
): Promise<AnalyticsReview> {
    const reviewsRef = collection(db, `workspaces/${workspaceId}/channels/${channelId}/projects/${projectId}/reviews`);
    const newDoc = doc(reviewsRef);
    const newReview: AnalyticsReview = {
        id: newDoc.id,
        workspaceId,
        channelId,
        projectId,
        createdAt: Date.now(),
        ...review
    };

    await setDoc(newDoc, newReview);
    return newReview;
}

export async function getReviewsByProject(
    workspaceId: string,
    channelId: string,
    projectId: string
): Promise<AnalyticsReview[]> {
    const reviewsRef = collection(db, `workspaces/${workspaceId}/channels/${channelId}/projects/${projectId}/reviews`);
    const q = query(reviewsRef, orderBy("createdAt", "asc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => doc.data() as AnalyticsReview);
}

export async function updateAnalyticsReview(
    workspaceId: string,
    channelId: string,
    projectId: string,
    reviewId: string,
    updates: Partial<Omit<AnalyticsReview, "id" | "workspaceId" | "channelId" | "projectId" | "createdAt">>
): Promise<void> {
    const reviewRef = doc(db, `workspaces/${workspaceId}/channels/${channelId}/projects/${projectId}/reviews`, reviewId);
    await updateDoc(reviewRef, updates as any);
}
