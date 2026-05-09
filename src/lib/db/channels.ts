import { db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { collection, doc, getDoc, getDocs, setDoc, query, where } from "firebase/firestore";
import { Channel } from "@/src/types";

export async function listWorkspaceChannels(workspaceId: string): Promise<Channel[]> {
  try {
    const q = query(collection(db, "workspaces", workspaceId, "channels"));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Channel[];
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, `workspaces/${workspaceId}/channels`);
    return [];
  }
}

export async function getChannel(workspaceId: string, channelId: string): Promise<Channel | null> {
  try {
    const docRef = doc(db, "workspaces", workspaceId, "channels", channelId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Channel;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `workspaces/${workspaceId}/channels/${channelId}`);
    return null;
  }
}

export async function createChannel(workspaceId: string, data: Omit<Channel, "id" | "workspaceId">): Promise<Channel> {
  try {
    const newDocRef = doc(collection(db, "workspaces", workspaceId, "channels"));
    const channel: Channel = { ...data, workspaceId, id: newDocRef.id };
    
    await setDoc(newDocRef, channel);
    
    return channel;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `workspaces/${workspaceId}/channels`);
    throw error;
  }
}
