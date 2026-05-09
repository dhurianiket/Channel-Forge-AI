import { db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { collection, doc, getDoc, getDocs, setDoc, query, where, collectionGroup } from "firebase/firestore";
import { Workspace } from "@/src/types";

export async function listUserWorkspaces(userId: string): Promise<Workspace[]> {
  try {
    const q = query(collectionGroup(db, "members"), where("userId", "==", userId));
    const membersSnap = await getDocs(q);
    
    if (membersSnap.empty) {
      return [];
    }

    const workspacePromises = membersSnap.docs.map(async (memberDoc) => {
      const workspaceRef = memberDoc.ref.parent.parent;
      if (!workspaceRef) return null;
      const workspaceSnap = await getDoc(workspaceRef);
      if (workspaceSnap.exists()) {
         return { id: workspaceSnap.id, ...workspaceSnap.data() } as Workspace;
      }
      return null;
    });

    const workspaces = await Promise.all(workspacePromises);
    return workspaces.filter((w): w is Workspace => w !== null);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "workspaces");
    return [];
  }
}

export async function getWorkspace(workspaceId: string): Promise<Workspace | null> {
  try {
    const docRef = doc(db, "workspaces", workspaceId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Workspace;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `workspaces/${workspaceId}`);
    return null;
  }
}

export async function createWorkspace(data: Omit<Workspace, "id">): Promise<Workspace> {
  try {
    const newDocRef = doc(collection(db, "workspaces"));
    const workspace: Workspace = { ...data, id: newDocRef.id };
    
    await setDoc(newDocRef, workspace);
    
    // Self-join as member
    await setDoc(doc(db, "workspaces", newDocRef.id, "members", data.ownerId), {
      userId: data.ownerId,
      role: "owner",
      joinedAt: Date.now()
    });

    return workspace;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, "workspaces");
    throw error;
  }
}
