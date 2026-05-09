import React, { useState, useEffect } from "react";
import { useAuth } from "@/src/lib/auth-context";
import { Project, SceneRow, ProjectStage } from "@/src/types";
import { listScenes, createScene, updateScene, deleteScene } from "@/src/lib/db/scenes";
import { getScriptVersion } from "@/src/lib/db/scripts";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LayoutTemplate, Plus, GripVertical, Trash2 } from "lucide-react";
import { ApprovalGate } from "./ApprovalGate";

interface ScenePlannerProps {
  project: Project;
  onUpdate: () => void;
}

export const ScenePlanner = ({ project, onUpdate }: ScenePlannerProps) => {
  const { activeWorkspace, activeChannel } = useAuth();
  const [scenes, setScenes] = useState<SceneRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [scriptText, setScriptText] = useState("");

  useEffect(() => {
    async function load() {
      if (activeWorkspace && activeChannel) {
        setLoading(true);
        
        // Only load if we have an approved script
        if (project.approvedScriptVersionId) {
            const script = await getScriptVersion(activeWorkspace.id, activeChannel.id, project.id, project.approvedScriptVersionId);
            if (script) setScriptText(script.fullText);
            
            const data = await listScenes(activeWorkspace.id, activeChannel.id, project.id);
            setScenes(data);
        }
        
        setLoading(false);
      }
    }
    load();
  }, [project.id, activeWorkspace, activeChannel, project.approvedScriptVersionId]);

  const handleAdd = async () => {
    if (!activeWorkspace || !activeChannel) return;
    const order = scenes.length > 0 ? Math.max(...scenes.map(s => s.order)) + 1 : 0;
    const scene = await createScene(activeWorkspace.id, activeChannel.id, project.id, {
        order,
        narrationText: "",
        visualType: "B-Roll"
    });
    setScenes([...scenes, scene]);
  };

  const handleChange = async (sceneId: string, field: keyof SceneRow, value: any) => {
      setScenes(scenes.map(s => s.id === sceneId ? { ...s, [field]: value } : s));
      if (!activeWorkspace || !activeChannel) return;
      await updateScene(activeWorkspace.id, activeChannel.id, project.id, sceneId, { [field]: value });
  };
  
  const handleDelete = async (sceneId: string) => {
      if (!activeWorkspace || !activeChannel) return;
      await deleteScene(activeWorkspace.id, activeChannel.id, project.id, sceneId);
      setScenes(scenes.filter(s => s.id !== sceneId));
  };

  if (loading) return <div className="p-8 text-center text-zinc-500">Loading scene planner...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-white flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-brand-orange" />
            Scene Planner
          </h2>
          <p className="text-sm text-zinc-400">Map approved script to visual assets and B-roll.</p>
        </div>
        <Button onClick={handleAdd} className="bg-brand-orange text-white">
            <Plus className="w-4 h-4 mr-2" /> Add Scene
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Read-only Script Reference */}
        <div className="lg:col-span-1 bg-charcoal border border-white/5 rounded-xl p-4 flex flex-col h-[600px]">
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3 pb-3 border-b border-white/5">
                Approved Script Reference
            </div>
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin">
                <p className="text-sm text-zinc-300 leading-relaxed font-serif whitespace-pre-wrap">
                    {scriptText || "No approved script available."}
                </p>
            </div>
        </div>

        {/* Scene rows */}
        <div className="lg:col-span-2 space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
            {scenes.map((scene, i) => (
                <div key={scene.id} className="bg-obsidian border border-white/5 rounded-xl p-4 flex gap-4">
                    <div className="flex flex-col items-center gap-2 pt-2">
                        <GripVertical className="w-4 h-4 text-zinc-600 cursor-grab" />
                        <span className="text-[10px] font-mono text-zinc-500">{i + 1}</span>
                    </div>
                    
                    <div className="flex-1 space-y-3">
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className="text-[10px] uppercase font-mono text-zinc-500 tracking-widest mb-1 block">Narration Slice</label>
                                <Textarea 
                                    className="h-20 bg-charcoal border-white/10 text-sm resize-none" 
                                    value={scene.narrationText}
                                    placeholder="Paste narration chunk here..."
                                    onChange={(e) => handleChange(scene.id, 'narrationText', e.target.value)}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-[10px] uppercase font-mono text-zinc-500 tracking-widest mb-1 block">Visual / B-Roll Prompt</label>
                                <Textarea 
                                    className="h-20 bg-charcoal border-white/10 text-sm resize-none text-brand-orange" 
                                    value={scene.videoPrompt}
                                    placeholder="Visual description or prompt..."
                                    onChange={(e) => handleChange(scene.id, 'videoPrompt', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(scene.id)} className="h-8 w-8 text-zinc-600 hover:text-red-400">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            ))}
            {scenes.length === 0 && (
                <div className="py-12 border border-dashed border-white/10 rounded-xl text-center text-zinc-500 text-sm">
                    No scenes added. Start breaking down the script.
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
