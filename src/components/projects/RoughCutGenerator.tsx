import React, { useState, useEffect } from "react";
import { useAuth } from "@/src/lib/auth-context";
import { Project, RoughCut, ProjectStage } from "@/src/types";
import { listRoughCuts, createRoughCut, updateRoughCut } from "@/src/lib/db/roughCuts";
import { listScenes } from "@/src/lib/db/scenes";
import { updateProject } from "@/src/lib/db/projects";
import { Dispatcher } from "@/src/lib/jobs/dispatcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clapperboard, Plus, Play, CheckCircle2, History } from "lucide-react";
import { ApprovalGate } from "./ApprovalGate";

interface RoughCutGeneratorProps {
  project: Project;
  onUpdate: () => void;
}

export const RoughCutGenerator = ({ project, onUpdate }: RoughCutGeneratorProps) => {
  const { activeWorkspace, activeChannel, user } = useAuth();
  const [cuts, setCuts] = useState<RoughCut[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (activeWorkspace && activeChannel) {
      setLoading(true);
      const data = await listRoughCuts(activeWorkspace.id, activeChannel.id, project.id);
      setCuts(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [project.id, activeWorkspace, activeChannel]);

  const handleGenerate = async () => {
    if (!activeWorkspace || !activeChannel || !user || !project.approvedScriptVersionId) return;
    
    // Simulate generation parameters based on facts
    const scenes = await listScenes(activeWorkspace.id, activeChannel.id, project.id);
    
    // Create record first
    const cut = await createRoughCut(activeWorkspace.id, activeChannel.id, project.id, {
        scriptVersionId: project.approvedScriptVersionId,
        voiceTakeId: project.approvedVoiceTakeId || "",
        sceneCount: scenes.length,
        durationSec: 120, // Example
        status: "DRAFT",
    });

    // Dispatch job
    await Dispatcher.dispatchRender(
        activeWorkspace.id, 
        activeChannel.id, 
        project.id, 
        cut.id, 
        project.approvedScriptVersionId, 
        project.approvedVoiceTakeId || "", 
        scenes, 
        user.uid
    );
    
    await load();
  };
  
  const handleSetActive = async (cutId: string) => {
      if (!activeWorkspace || !activeChannel) return;
      await updateProject(activeWorkspace.id, activeChannel.id, project.id, {
          activeRoughCutId: cutId
      });
      onUpdate();
  };

  if (loading) return <div className="p-8 text-center text-zinc-500">Loading rough cuts...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-white flex items-center gap-2">
            <Clapperboard className="w-5 h-5 text-pink-500" />
            Rough-Cut Generator
          </h2>
          <p className="text-sm text-zinc-400">Assemble script, voice, and scenes into a reviewable timeline.</p>
        </div>
        <Button onClick={handleGenerate} className="bg-pink-600 text-white">
            <Plus className="w-4 h-4 mr-2" /> Generate Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
              <h3 className="text-sm font-medium text-zinc-300 mb-2">Generation History</h3>
              {cuts.map(cut => {
                  const isActive = project.activeRoughCutId === cut.id;
                  const isApproved = project.approvedRoughCutId === cut.id;
                  
                  return (
                      <div key={cut.id} className={`p-4 rounded-xl border transition-colors ${isActive || isApproved ? 'bg-pink-500/5 border-pink-500/30' : 'bg-charcoal border-white/5'}`}>
                          <div className="flex justify-between items-start mb-3">
                              <div>
                                  <div className="text-sm font-medium text-zinc-200">Assembly #{cut.id.slice(-4)}</div>
                                  <div className="text-xs text-zinc-500">{new Date(cut.createdAt).toLocaleString()}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                  {isApproved && <span className="bg-green-500/20 text-green-500 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest font-mono">Approved</span>}
                                  {!isApproved && isActive && <span className="bg-pink-500/20 text-pink-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest font-mono">Active</span>}
                              </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-4 bg-obsidian p-2 rounded-lg border border-white/5">
                              <span>{cut.sceneCount} Scenes</span>
                              <span>•</span>
                              <span>{cut.durationSec}s</span>
                              <span>•</span>
                              <span>{cut.status}</span>
                          </div>
                          
                          {!isApproved && (
                              <div className="flex justify-end gap-2">
                                  {!isActive && (
                                     <Button variant="outline" size="sm" onClick={() => handleSetActive(cut.id)} className="h-8 text-xs border-white/10 hover:border-pink-500/50 hover:text-pink-400">
                                         Set as Active
                                     </Button>
                                  )}
                              </div>
                          )}
                      </div>
                  );
              })}
              {cuts.length === 0 && (
                  <div className="py-12 border border-dashed border-white/10 rounded-xl text-center text-zinc-500 text-sm">
                      No rough cuts generated yet.
                  </div>
              )}
          </div>
          
          <div>
             {project.activeRoughCutId ? (
                 <ApprovalGate 
                    project={project} 
                    requiredStage={ProjectStage.EDIT_QA} 
                    targetId={project.activeRoughCutId} 
                    targetType="rough-cut"
                    onStatusChange={onUpdate}
                 >
                     <div className="bg-charcoal border border-white/5 rounded-xl p-4 h-[400px] flex flex-col justify-center items-center text-center space-y-4">
                         <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center border border-white/10 text-white cursor-pointer hover:scale-105 transition-transform hover:bg-pink-500 hover:border-pink-500 group">
                             <Play className="w-8 h-8 ml-1 group-hover:text-white" />
                         </div>
                         <div>
                             <h3 className="font-medium text-white">Preview Rough Cut</h3>
                             <p className="text-sm text-zinc-400">Watch the assembled timeline before requesting approval.</p>
                         </div>
                         <div className="text-xs font-mono text-zinc-500 bg-obsidian px-3 py-1.5 rounded-full border border-white/5">
                             ID: {project.activeRoughCutId.substring(0,8)}
                         </div>
                     </div>
                 </ApprovalGate>
             ) : (
                 <div className="bg-charcoal border border-dashed border-white/10 rounded-xl p-4 h-[400px] flex flex-col justify-center items-center text-center space-y-4 text-zinc-500">
                     <Clapperboard className="w-8 h-8 opacity-50" />
                     <p>Select a rough cut to preview and submit for Edit QA.</p>
                 </div>
             )}
          </div>
      </div>
    </div>
  );
};
