import React, { useState } from "react";
import { AlertTriangle, Plus } from "lucide-react";
import { Postmortem } from "@/src/types";

export const PostmortemPanel = ({ projectId }: { projectId: string }) => {
  const [postmortems, setPostmortems] = useState<Postmortem[]>([]);
  
  return (
    <div className="bg-charcoal/50 rounded-2xl border border-white/5 p-6 hover:border-white/10 transition-colors">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">Project Postmortems</h2>
            <p className="text-xs text-zinc-400">Log failures, underperformance, and prevention strategies.</p>
          </div>
        </div>
        
        <button className="px-3 py-1.5 bg-smoke border border-white/10 hover:bg-smoke/80 text-zinc-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2">
            <Plus className="w-3.5 h-3.5" />
            Add Postmortem
        </button>
      </div>

      {postmortems.length === 0 ? (
        <div className="text-center p-8 bg-smoke/30 rounded-xl border border-white/5 border-dashed">
            <p className="text-sm text-zinc-500">No postmortems recorded for this project.</p>
        </div>
      ) : (
        <div className="space-y-4">
            {postmortems.map(pm => (
                <div key={pm.id} className="p-4 bg-smoke border border-white/5 rounded-xl">
                    <div className="text-sm font-medium text-zinc-200">{pm.incidentType}</div>
                    <div className="text-xs text-zinc-400 mt-1">{pm.rootCause}</div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};
