import React, { useState, useEffect } from "react";
import { Users, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/src/lib/auth-context";
import { TeamMember, StageAssignment, Project } from "@/src/types";
import { getTeamMembers } from "@/src/lib/auth/roles";
import { collection, query, getDocs, collectionGroup, where } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "@/src/lib/firebase";

export const WorkloadBoard = () => {
    const { activeWorkspace, activeChannel } = useAuth();
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [assignments, setAssignments] = useState<StageAssignment[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!activeWorkspace || !activeChannel) return;
        const load = async () => {
            try {
                setError(null);
                const members = await getTeamMembers(activeWorkspace.id);
                setTeam(members);

                // Fetch projects 
                const projSnapshot = await getDocs(query(collection(db, `workspaces/${activeWorkspace.id}/channels/${activeChannel.id}/projects`)));
                const projList = projSnapshot.docs.map(d => d.data() as Project);
                setProjects(projList);

                // Fetch assignments using collectionGroup
                const asgnQuery = query(
                    collectionGroup(db, "assignments"), 
                    where("workspaceId", "==", activeWorkspace.id),
                    where("channelId", "==", activeChannel.id)
                );
                const asgnSnap = await getDocs(asgnQuery);
                const allAssignments = asgnSnap.docs.map(d => d.data() as StageAssignment);
                
                // Filter only active/draft assignments if necessary, based on project status
                const activeProjectIds = new Set(projList.filter(p => p.status === "ACTIVE" || p.status === "DRAFT").map(p => p.id));
                const filteredAssignments = allAssignments.filter(a => activeProjectIds.has(a.projectId));
                
                setAssignments(filteredAssignments);
            } catch (e) {
                console.error(e);
                setError("Failed to load workload. Check permissions or network.");
                if (e instanceof Error && !e.message.includes("Firestore Error")) {
                   handleFirestoreError(e, OperationType.LIST, "assignments collectionGroup");
                }
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [activeWorkspace, activeChannel]);

    if (!activeWorkspace || !activeChannel) return null;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-display text-zinc-100 flex items-center gap-3">
                        <Users className="w-6 h-6 text-brand-teal" />
                        Workload & Capacity
                    </h1>
                    <p className="text-sm text-zinc-400 mt-1">Review team assignments, bandwidth, and bottlenecks.</p>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {loading ? (
                 <div className="animate-pulse bg-smoke border border-white/5 rounded-2xl h-[400px]" />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {team.map(member => {
                        const memberAssignments = assignments.filter(a => a.assigneeId === member.id);
                        const overdueCount = memberAssignments.filter(a => a.dueDate && a.dueDate < Date.now()).length;
                        const blockedCount = memberAssignments.filter(a => a.blockedReason).length;

                        return (
                            <div key={member.id} className="bg-smoke/30 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-zinc-100">{member.displayName || member.email}</h3>
                                        <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest mt-1">{member.role.replace('_', ' ')}</div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-brand-teal/20 text-brand-teal flex items-center justify-center font-bold text-xs font-mono">
                                        {memberAssignments.length}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-xs p-2 rounded bg-charcoal/50 border border-white/5 text-zinc-300">
                                        <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-zinc-500" /> Active Tasks</div>
                                        <div className="font-mono">{memberAssignments.length}</div>
                                    </div>
                                    <div className={`flex items-center justify-between text-xs p-2 rounded bg-charcoal/50 border border-white/5 ${overdueCount > 0 ? "text-red-400" : "text-zinc-300"}`}>
                                        <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Overdue</div>
                                        <div className="font-mono">{overdueCount}</div>
                                    </div>
                                    <div className={`flex items-center justify-between text-xs p-2 rounded bg-charcoal/50 border border-white/5 ${blockedCount > 0 ? "text-amber-400" : "text-zinc-300"}`}>
                                        <div className="flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5" /> Blocked</div>
                                        <div className="font-mono">{blockedCount}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
