import { Project, ProjectStage } from "@/src/types";

export const STAGE_ORDER = [
  ProjectStage.IDEA,
  ProjectStage.RESEARCH,
  ProjectStage.SCRIPT,
  ProjectStage.FACT_CHECK,
  ProjectStage.VISUAL_PLAN,
  ProjectStage.VOICE,
  ProjectStage.EDIT_QA,
  ProjectStage.METADATA,
  ProjectStage.READY_TO_PUBLISH,
  ProjectStage.PUBLISHED,
  ProjectStage.ANALYZED
];

export const STAGE_LABELS: Record<ProjectStage, string> = {
  [ProjectStage.IDEA]: "Ideation",
  [ProjectStage.RESEARCH]: "Research",
  [ProjectStage.SCRIPT]: "Script",
  [ProjectStage.FACT_CHECK]: "Fact Check",
  [ProjectStage.VISUAL_PLAN]: "Visual Plan",
  [ProjectStage.VOICE]: "Voiceover",
  [ProjectStage.EDIT_QA]: "Edit QA",
  [ProjectStage.METADATA]: "Metadata",
  [ProjectStage.READY_TO_PUBLISH]: "Ready to Publish",
  [ProjectStage.PUBLISHED]: "Published",
  [ProjectStage.ANALYZED]: "Analyzed",
};

export const STAGE_REQUIRES_APPROVAL: Partial<Record<ProjectStage, boolean>> = {
  [ProjectStage.SCRIPT]: true,
  [ProjectStage.FACT_CHECK]: true,
  [ProjectStage.EDIT_QA]: true,
  [ProjectStage.METADATA]: true,
};

export function canAccessStage(project: Project | null, targetStage: ProjectStage): boolean {
  if (!project) return false;
  
  // Use transition rules for strict access control
  const targetIndex = STAGE_ORDER.indexOf(targetStage);
  if (targetIndex === 0) return true; // IDEA is always accessible
  
  if (targetStage === ProjectStage.RESEARCH) return !!project.selectedIdeaId;
  if (targetStage === ProjectStage.SCRIPT) return !!project.selectedIdeaId;
  if (targetStage === ProjectStage.FACT_CHECK) return !!project.activeScriptVersionId;
  if (targetStage === ProjectStage.VISUAL_PLAN) return !!project.approvedScriptVersionId && project.factCheckStatus === "APPROVED";
  if (targetStage === ProjectStage.VOICE) return !!project.approvedScriptVersionId;
  if (targetStage === ProjectStage.EDIT_QA) return !!project.approvedScriptVersionId;
  if (targetStage === ProjectStage.METADATA) return project.editQaStatus === "APPROVED";
  if (targetStage === ProjectStage.READY_TO_PUBLISH) return project.metadataStatus === "APPROVED";
  if (targetStage === ProjectStage.PUBLISHED) return project.publishStatus === "PUBLISHED";
  if (targetStage === ProjectStage.ANALYZED) return project.publishStatus === "PUBLISHED";
  
  const currentIndex = STAGE_ORDER.indexOf(project.currentStage);
  return targetIndex <= currentIndex;
}

export function getBlockingReason(project: Project | null, targetStage: ProjectStage): string | null {
  if (!project) return "Project context is missing.";
  if (canAccessStage(project, targetStage)) return null;

  switch (targetStage) {
      case ProjectStage.RESEARCH:
      case ProjectStage.SCRIPT:
          return "Must select an Idea first.";
      case ProjectStage.FACT_CHECK:
          return "An drafted Script Version is required.";
      case ProjectStage.VISUAL_PLAN:
          if (!project.approvedScriptVersionId) return "Script must be approved.";
          if (project.factCheckStatus !== "APPROVED") return "Fact Check must be approved.";
          return "Script and Fact Check must be approved.";
      case ProjectStage.VOICE:
      case ProjectStage.EDIT_QA:
          return "An approved Script Version is required.";
      case ProjectStage.METADATA:
          return "Edit QA must be approved before generating Metadata.";
      case ProjectStage.READY_TO_PUBLISH:
          return "Metadata package must be approved.";
  }
  
  return `Currently locked. Must complete requirements for ${STAGE_LABELS[targetStage]}.`;
}

export function canTransitionStage(project: Project, targetStage: ProjectStage): { allowed: boolean; reason?: string } {
    if (project.currentStage === targetStage) return { allowed: true };
    
    switch (targetStage) {
        case ProjectStage.RESEARCH:
            if (!project.selectedIdeaId) return { allowed: false, reason: "Must select an idea before transitioning to Research." };
            break;
        case ProjectStage.SCRIPT:
            if (STAGE_ORDER.indexOf(project.currentStage) < STAGE_ORDER.indexOf(ProjectStage.RESEARCH)) {
                return { allowed: false, reason: "Must complete Research before Scripting." };
            }
            break;
        case ProjectStage.FACT_CHECK:
             if (!project.activeScriptVersionId) return { allowed: false, reason: "Active script version required to transition to Fact Check." };
             break;
        case ProjectStage.VISUAL_PLAN:
             if (!project.approvedScriptVersionId) {
                 return { allowed: false, reason: "Script must be approved to start Visual Planning." };
             }
             if (project.factCheckStatus !== 'APPROVED') {
                return { allowed: false, reason: "Fact Check must be approved to start Visual Planning." };
             }
             break;
        case ProjectStage.VOICE:
             if (!project.approvedScriptVersionId) return { allowed: false, reason: "Approved script version required for Voice generation." };
             break;
        case ProjectStage.METADATA:
             if (project.editQaStatus !== 'APPROVED') return { allowed: false, reason: "Edit QA must be approved before Metadata." };
             break;
        case ProjectStage.READY_TO_PUBLISH:
             if (project.metadataStatus !== 'APPROVED') return { allowed: false, reason: "Metadata package must be approved to be Ready to Publish." };
             break;
    }
    
    return { allowed: true };
}

export function getNextStage(project: Project): ProjectStage | null {
  const currentIndex = STAGE_ORDER.indexOf(project.currentStage);
  if (currentIndex < STAGE_ORDER.length - 1) {
    return STAGE_ORDER[currentIndex + 1];
  }
  return null;
}
