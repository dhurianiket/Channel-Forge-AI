import { collection, doc, setDoc, getDocs, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { TeamMember, RoleType } from "../../types";

export async function getTeamMembers(workspaceId: string): Promise<TeamMember[]> {
  const membersRef = collection(db, `workspaces/${workspaceId}/members`);
  const q = query(membersRef);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => d.data() as TeamMember);
}

export async function addTeamMember(workspaceId: string, member: Partial<TeamMember> & { userId?: string }): Promise<TeamMember> {
  const membersRef = collection(db, `workspaces/${workspaceId}/members`);
  const newRef = member.userId ? doc(membersRef, member.userId) : doc(membersRef);
  const data: TeamMember = {
    id: newRef.id,
    userId: member.userId || newRef.id,
    workspaceId,
    email: member.email || "",
    displayName: member.displayName || "",
    role: member.role || "reviewer",
    channelAccess: member.channelAccess || [],
    joinedAt: Date.now(),
    capacityHoursPerWeek: member.capacityHoursPerWeek || 40,
  } as any;
  await setDoc(newRef, data);
  return data;
}

export async function updateTeamMember(workspaceId: string, memberId: string, updates: Partial<TeamMember>): Promise<void> {
  const ref = doc(db, `workspaces/${workspaceId}/members`, memberId);
  await updateDoc(ref, updates as any);
}

export async function removeTeamMember(workspaceId: string, memberId: string): Promise<void> {
  const ref = doc(db, `workspaces/${workspaceId}/members`, memberId);
  await deleteDoc(ref);
}
