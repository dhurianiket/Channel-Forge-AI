import React, { useState, useEffect } from "react";
import { User, Calendar, MessageSquare, AlertTriangle, Send } from "lucide-react";
import { useAuth } from "@/src/lib/auth-context";
import { StageAssignment, ProjectStage, TeamMember } from "@/src/types";
import { getAssignmentsByProject, submitAssignment } from "@/src/lib/db/assignments";
import { getTeamMembers } from "@/src/lib/auth/roles";

interface Props {
  projectId: string;
  currentStage: ProjectStage;
}

export const AssignmentPanel = ({ projectId, currentStage }: Props) => {
  const { activeWorkspace, activeChannel } = useAuth();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [assignment, setAssignment] = useState<StageAssignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDateStr, setDueDateStr] = useState("");
  const [handoffNotes, setHandoffNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!activeWorkspace || !activeChannel) return;
    const load = async () => {
      try {
        const [members, assignData] = await Promise.all([
          getTeamMembers(activeWorkspace.id),
          getAssignmentsByProject(activeWorkspace.id, activeChannel.id, projectId)
        ]);
        setTeam(members);
        const currentAssign = assignData.find(a => a.stage === currentStage);
        if (currentAssign) {
          setAssignment(currentAssign);
          setAssigneeId(currentAssign.assigneeId || "");
          if (currentAssign.dueDate) {
             setDueDateStr(new Date(currentAssign.dueDate).toISOString().split('T')[0]);
          }
          setHandoffNotes(currentAssign.handoffNotes || "");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [activeWorkspace, activeChannel, projectId, currentStage]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWorkspace || !activeChannel) return;
    setIsSaving(true);
    try {
       const req = {
           stage: currentStage,
           assigneeId: assigneeId || null,
           assignedAt: Date.now(),
           dueDate: dueDateStr ? new Date(dueDateStr).getTime() : null,
           blockedReason: assignment?.blockedReason || null,
           reviewRequestedFrom: assignment?.reviewRequestedFrom || null,
           reviewCompletedAt: assignment?.reviewCompletedAt || null,
           handoffNotes: handoffNotes || null
       };
       const updated = await submitAssignment(activeWorkspace.id, activeChannel.id, projectId, req);
       setAssignment(updated);
    } catch (e) {
       console.error(e);
    } finally {
       setIsSaving(false);
    }
  };

  if (!activeWorkspace || !activeChannel) return null;
  if (isLoading) return <div className="text-sm text-zinc-500 animate-pulse p-4">Loading assignments...</div>;

  return (
    <div className="bg-smoke/30 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
        <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-brand-teal" />
            Stage Ownership: {currentStage.replace('_', ' ')}
        </h3>

        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Assigned To</label>
                <select value={assigneeId} onChange={e => setAssigneeId(e.target.value)} className="w-full bg-charcoal border border-white/10 rounded-lg p-2.5 text-zinc-200 outline-none focus:border-brand-teal text-sm">
                    <option value="">Unassigned</option>
                    {team.map(m => (
                        <option key={m.id} value={m.id}>{m.displayName || m.email} ({m.role})</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Due Date</label>
                <input type="date" value={dueDateStr} onChange={e => setDueDateStr(e.target.value)} className="w-full bg-charcoal border border-white/10 rounded-lg p-2.5 text-zinc-200 outline-none focus:border-brand-teal text-sm [color-scheme:dark]" />
            </div>
            <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-zinc-400 mb-1 flex items-center gap-2">
                   <MessageSquare className="w-3.5 h-3.5" /> 
                   Handoff Notes
                </label>
                <textarea 
                   rows={3}
                   value={handoffNotes} 
                   onChange={e => setHandoffNotes(e.target.value)} 
                   placeholder="Context for whoever takes this stage next..." 
                   className="w-full bg-charcoal border border-white/10 rounded-lg p-3 text-zinc-200 outline-none focus:border-brand-teal text-sm resize-none"
                />
            </div>
            <div className="md:col-span-2 flex justify-end">
                <button type="submit" disabled={isSaving} className="px-5 py-2 bg-white/5 hover:bg-white/10 text-zinc-200 text-sm font-semibold rounded-lg transition-colors border border-white/10 disabled:opacity-50 flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    {isSaving ? "Saving..." : "Update Assignment"}
                </button>
            </div>
        </form>

        {assignment?.blockedReason && (
             <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                 <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                 <div>
                     <p className="text-sm font-semibold text-red-400">Blocked</p>
                     <p className="text-xs text-red-300/80 mt-1">{assignment.blockedReason}</p>
                 </div>
             </div>
        )}
    </div>
  );
};
