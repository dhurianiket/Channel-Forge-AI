import React from "react";
import { Project, ProjectStage } from "@/src/types";
import { STAGE_LABELS } from "@/src/lib/workflow/stages";
import { cn } from "@/lib/utils";

interface StageBadgeProps {
  stage: ProjectStage;
  className?: string;
}

export const StageBadge = ({ stage, className }: StageBadgeProps) => {
  const getStageColor = (s: ProjectStage) => {
    switch (s) {
      case ProjectStage.IDEA:
      case ProjectStage.RESEARCH:
        return "bg-zinc-500/20 text-zinc-300 border-zinc-500/30";
      case ProjectStage.SCRIPT:
      case ProjectStage.FACT_CHECK:
        return "bg-brand-teal/20 text-brand-teal border-brand-teal/30";
      case ProjectStage.VISUAL_PLAN:
      case ProjectStage.VOICE:
        return "bg-brand-orange/20 text-brand-orange border-brand-orange/30";
      case ProjectStage.EDIT_QA:
      case ProjectStage.METADATA:
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      case ProjectStage.READY_TO_PUBLISH:
      case ProjectStage.PUBLISHED:
      case ProjectStage.ANALYZED:
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-zinc-500/20 text-zinc-300 border-zinc-500/30";
    }
  };

  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-widest uppercase border backdrop-blur-sm whitespace-nowrap",
        getStageColor(stage),
        className
      )}
    >
      {STAGE_LABELS[stage] || stage}
    </span>
  );
};
