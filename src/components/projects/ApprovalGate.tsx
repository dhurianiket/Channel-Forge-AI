import React, { useState, useEffect } from "react";
import { Project, ProjectStage, ApprovalStatus, Approval } from "@/src/types";
import { canAccessStage, getBlockingReason, STAGE_REQUIRES_APPROVAL } from "@/src/lib/workflow/stages";
import { getLatestApprovalForStage, requestApproval, decideApproval } from "@/src/lib/db/approvals";
import { transitionProjectStage, getProject } from "@/src/lib/db/projects";
import { useAuth } from "@/src/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Lock, CheckCircle, XCircle, AlertCircle, Clock, ArrowRight } from "lucide-react";
import { updateProject } from "@/src/lib/db/projects";

interface ApprovalGateProps {
  project: Project;
  requiredStage: ProjectStage;
  targetId?: string; // id of script version, metadata package, etc
  targetType?: string;
  onStatusChange?: () => void;
  children: React.ReactNode;
}

export const ApprovalGate = ({ 
  project, 
  requiredStage, 
  targetId = "default", 
  targetType = "stage", 
  onStatusChange, 
  children 
}: ApprovalGateProps) => {
  const { user, activeWorkspace, activeChannel } = useAuth();
  const [approval, setApproval] = useState<Approval | null>(null);
  const [loading, setLoading] = useState(true);
  const [decideNotes, setDecideNotes] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const blockedReason = getBlockingReason(project, requiredStage);
  const isBlocked = blockedReason !== null;

  useEffect(() => {
    async function loadApproval() {
      if (!isBlocked && STAGE_REQUIRES_APPROVAL[requiredStage]) {
        if (activeWorkspace && activeChannel && project) {
          setLoading(true);
          const latest = await getLatestApprovalForStage(
            activeWorkspace.id, 
            activeChannel.id, 
            project.id, 
            requiredStage
          );
          setApproval(latest);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    loadApproval();
  }, [project, requiredStage, activeWorkspace, activeChannel, isBlocked, refreshKey]);

  const handleRequestApproval = async () => {
    if (!activeWorkspace || !activeChannel || !user) return;
    await requestApproval(activeWorkspace.id, activeChannel.id, project.id, {
      projectId: project.id,
      workspaceId: activeWorkspace.id,
      channelId: activeChannel.id,
      stage: requiredStage,
      targetType,
      targetId,
      requestedBy: user.uid,
      snapshotStageBefore: project.currentStage
    });
    setRefreshKey(k => k + 1);
    if (onStatusChange) onStatusChange();
  };

  const handleDecide = async (status: ApprovalStatus) => {
    if (!activeWorkspace || !activeChannel || !user || !approval) return;
    
    let nextStage = project.currentStage;
    if (status === ApprovalStatus.APPROVED) {
        // Simple logic: If we approve SCRIPT, and current is SCRIPT, maybe we update project.factCheckStatus or something?
        // Actually, we should update the project doc properly via an update
        const updates: Partial<Project> = {};
        if (requiredStage === ProjectStage.SCRIPT) updates.approvedScriptVersionId = targetId;
        if (requiredStage === ProjectStage.FACT_CHECK) updates.factCheckStatus = ApprovalStatus.APPROVED;
        if (requiredStage === ProjectStage.EDIT_QA) updates.editQaStatus = ApprovalStatus.APPROVED;
        if (requiredStage === ProjectStage.METADATA) updates.metadataStatus = ApprovalStatus.APPROVED;
        
        await updateProject(activeWorkspace.id, activeChannel.id, project.id, updates);
    } else if (status === ApprovalStatus.CHANGES_REQUESTED || status === ApprovalStatus.REJECTED) {
        const updates: Partial<Project> = {};
        if (requiredStage === ProjectStage.FACT_CHECK) updates.factCheckStatus = status;
        if (requiredStage === ProjectStage.EDIT_QA) updates.editQaStatus = status;
        if (requiredStage === ProjectStage.METADATA) updates.metadataStatus = status;
        await updateProject(activeWorkspace.id, activeChannel.id, project.id, updates);
    }

    await decideApproval(
      activeWorkspace.id, 
      activeChannel.id, 
      project.id, 
      approval.id, 
      user.uid, 
      status, 
      decideNotes,
      nextStage
    );
    setDecideNotes("");
    setRefreshKey(k => k + 1);
    if (onStatusChange) onStatusChange();
  };

  if (isBlocked) {
    return (
      <div className="border border-red-500/20 bg-red-500/5 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-4">
        <Lock className="w-8 h-8 text-red-500/50" />
        <div>
          <h3 className="text-zinc-200 font-medium font-mono text-sm uppercase tracking-wider mb-1">Stage Locked</h3>
          <p className="text-zinc-400 text-sm">{blockedReason}</p>
        </div>
      </div>
    );
  }

  if (!STAGE_REQUIRES_APPROVAL[requiredStage]) {
    return <>{children}</>;
  }

  // Wrap the UI in the approval banner
  const isPending = approval?.status === ApprovalStatus.PENDING;
  const isApproved = approval?.status === ApprovalStatus.APPROVED;
  const isRejected = approval?.status === ApprovalStatus.REJECTED;
  const isChangesRequested = approval?.status === ApprovalStatus.CHANGES_REQUESTED;

  return (
    <div className="space-y-6">
      {!isApproved && (
        <div className="bg-charcoal border border-white/10 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-200 flex items-center gap-2">
                Approval Required
                {isPending && <span className="bg-yellow-500/20 text-yellow-500 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">Pending</span>}
                {isRejected && <span className="bg-red-500/20 text-red-500 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">Rejected</span>}
                {isChangesRequested && <span className="bg-orange-500/20 text-orange-500 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">Changes Requested</span>}
              </h3>
              <p className="text-sm text-zinc-400">
                This stage must be approved before downstream modules can proceed.
              </p>
              
              {approval?.notes && (
                <div className="mt-4 p-3 bg-obsidian rounded-lg border border-white/5 text-sm text-zinc-300">
                  <span className="text-xs text-zinc-500 uppercase tracking-widest font-mono mb-1 block">Reviewer Notes</span>
                  {approval.notes}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 min-w-[200px]">
              {(!approval || isRejected || isChangesRequested) && (
                <Button onClick={handleRequestApproval} className="bg-brand-teal text-obsidian w-full hover:bg-brand-teal/90">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Submit for Review
                </Button>
              )}
              
              {isPending && (
                <div className="space-y-3">
                  <Textarea 
                    placeholder="Add review notes..." 
                    value={decideNotes}
                    onChange={(e) => setDecideNotes(e.target.value)}
                    className="bg-obsidian border-white/10 resize-none h-20 text-sm"
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => handleDecide(ApprovalStatus.APPROVED)} className="flex-1 bg-green-500/20 text-green-400 hover:bg-green-500/30">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button onClick={() => handleDecide(ApprovalStatus.CHANGES_REQUESTED)} className="flex-1 bg-orange-500/20 text-orange-400 hover:bg-orange-500/30">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Changes
                    </Button>
                  </div>
                  <Button onClick={() => handleDecide(ApprovalStatus.REJECTED)} variant="ghost" className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs">
                    Reject Completely
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Render the actual module content */}
      <div className={isPending ? "opacity-50 pointer-events-none transition-opacity" : ""}>
         {children}
      </div>
    </div>
  );
};
