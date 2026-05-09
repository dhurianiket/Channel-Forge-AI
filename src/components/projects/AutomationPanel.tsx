import React, { useState, useEffect } from "react";
import { useAuth } from "@/src/lib/auth-context";
import { Project, AutomationRun } from "@/src/types";
import { listAutomationRuns } from "@/src/lib/db/automationRuns";
import { Activity, Clock, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

interface AutomationPanelProps {
  project: Project;
}

export const AutomationPanel = ({ project }: AutomationPanelProps) => {
  const { activeWorkspace, activeChannel } = useAuth();
  const [runs, setRuns] = useState<AutomationRun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (activeWorkspace && activeChannel) {
        setLoading(true);
        const data = await listAutomationRuns(activeWorkspace.id, activeChannel.id, project.id);
        setRuns(data);
        setLoading(false);
      }
    }
    load();
  }, [project.id, activeWorkspace, activeChannel]);

  if (loading) return <div className="p-4 text-center text-xs text-zinc-500">Loading automation runs...</div>;
  
  if (runs.length === 0) return (
      <div className="p-8 text-center text-zinc-500 border border-dashed border-white/10 rounded-xl">
          No automated jobs have run for this project.
      </div>
  );

  return (
    <div className="space-y-4">
        {runs.map(run => (
            <div key={run.id} className="p-4 bg-charcoal border border-white/5 rounded-xl">
                 <div className="flex justify-between items-start mb-2">
                     <div className="flex items-center gap-2">
                         {run.status === "SUCCEEDED" && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                         {run.status === "FAILED" && <AlertTriangle className="w-4 h-4 text-red-500" />}
                         {run.status === "RUNNING" && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
                         {run.status === "QUEUED" && <Clock className="w-4 h-4 text-yellow-500" />}
                         <span className="font-medium text-sm text-zinc-200">{run.workflowType.replace(/_/g, ' ')}</span>
                     </div>
                     <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-widest ${
                         run.status === 'SUCCEEDED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                         run.status === 'FAILED' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                         'bg-zinc-800 text-zinc-400 border border-white/10'
                     }`}>
                         {run.status}
                     </span>
                 </div>
                 <div className="text-xs text-zinc-500 mb-2 font-mono flex items-center gap-2">
                     <Clock className="w-3 h-3" />
                     {new Date(run.startedAt).toLocaleString()}
                     {run.finishedAt && ` • duration: ${((run.finishedAt - run.startedAt) / 1000).toFixed(1)}s`}
                 </div>
                 {run.errorMessage && (
                      <div className="text-xs text-red-400 bg-red-400/10 p-2 rounded-lg mt-2 border border-red-500/10">
                          {run.errorMessage}
                      </div>
                 )}
                 {run.result && (
                      <div className="text-[10px] text-zinc-400 bg-obsidian p-2 rounded-lg mt-2 border border-white/5 overflow-x-auto">
                          <pre>{JSON.stringify(run.result, null, 2)}</pre>
                      </div>
                 )}
            </div>
        ))}
    </div>
  );
};
