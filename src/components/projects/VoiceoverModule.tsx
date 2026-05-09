import React, { useState, useEffect } from "react";
import { useAuth } from "@/src/lib/auth-context";
import { Project, VoiceTake } from "@/src/types";
import { listVoiceTakes, createVoiceTake, updateVoiceTake, deleteVoiceTake } from "@/src/lib/db/voice";
import { getScriptVersion } from "@/src/lib/db/scripts";
import { Button } from "@/components/ui/button";
import { Mic, Headphones, Play, Trash2, CheckCircle2, Plus } from "lucide-react";

interface VoiceoverModuleProps {
  project: Project;
  onUpdate: () => void;
}

export const VoiceoverModule = ({ project, onUpdate }: VoiceoverModuleProps) => {
  const { activeWorkspace, activeChannel } = useAuth();
  const [takes, setTakes] = useState<VoiceTake[]>([]);
  const [loading, setLoading] = useState(true);
  const [scriptText, setScriptText] = useState("");

  useEffect(() => {
    async function load() {
      if (activeWorkspace && activeChannel) {
        setLoading(true);
        if (project.approvedScriptVersionId) {
            const script = await getScriptVersion(activeWorkspace.id, activeChannel.id, project.id, project.approvedScriptVersionId);
            if (script) setScriptText(script.fullText);
        }
        
        const data = await listVoiceTakes(activeWorkspace.id, activeChannel.id, project.id);
        setTakes(data);
        setLoading(false);
      }
    }
    load();
  }, [project.id, activeWorkspace, activeChannel, project.approvedScriptVersionId]);

  const handleGenerate = async () => {
      if (!activeWorkspace || !activeChannel) return;
      const take = await createVoiceTake(activeWorkspace.id, activeChannel.id, project.id, {
          provider: "elevenlabs",
          voiceName: activeChannel.tone === "Dramatic" ? "Marcus" : "Sarah",
          durationSec: 120,
          status: "READY",
          audioUrl: "https://example.com/audio.mp3"
      });
      setTakes([take, ...takes]);
  };

  const handleToggleApproval = async (takeId: string, current: boolean) => {
    if (!activeWorkspace || !activeChannel) return;
    
    // if approving this one, unapprove others
    if (!current) {
        for (const t of takes) {
            if (t.approved && t.id !== takeId) {
                await updateVoiceTake(activeWorkspace.id, activeChannel.id, project.id, t.id, { approved: false });
            }
        }
    }
    
    await updateVoiceTake(activeWorkspace.id, activeChannel.id, project.id, takeId, { approved: !current });
    
    setTakes(takes.map(t => {
        if (t.id === takeId) return { ...t, approved: !current };
        if (!current && t.approved) return { ...t, approved: false };
        return t;
    }));
  };

  const handleDelete = async (takeId: string) => {
      if (!activeWorkspace || !activeChannel) return;
      await deleteVoiceTake(activeWorkspace.id, activeChannel.id, project.id, takeId);
      setTakes(takes.filter(t => t.id !== takeId));
  };

  if (loading) return <div className="p-8 text-center text-zinc-500">Loading voice module...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-white flex items-center gap-2">
            <Mic className="w-5 h-5 text-purple-500" />
            Voiceover
          </h2>
          <p className="text-sm text-zinc-400">Generate or upload narration mapped to the approved script.</p>
        </div>
        <Button onClick={handleGenerate} className="bg-purple-500 text-white">
            <Plus className="w-4 h-4 mr-2" /> Generate Narration
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-charcoal border border-white/5 rounded-xl p-4 flex flex-col h-[500px]">
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3 pb-3 border-b border-white/5 flex justify-between">
                <span>Approved Script Reference</span>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin text-sm text-zinc-300 leading-relaxed font-serif whitespace-pre-wrap">
                {scriptText || "No approved script available."}
            </div>
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
            {takes.map(take => (
                <div key={take.id} className={`bg-obsidian border ${take.approved ? 'border-green-500/50' : 'border-white/5'} rounded-xl p-4 space-y-4`}>
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                                <Headphones className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-white">{take.voiceName} ({take.provider})</h4>
                                <p className="text-xs text-zinc-500">{new Date(take.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {take.approved && <span className="text-[10px] uppercase font-mono tracking-widest text-green-500 bg-green-500/10 px-2 py-1 rounded">Selected</span>}
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(take.id)} className="h-8 w-8 text-zinc-600 hover:text-red-400">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-charcoal p-2 rounded-lg border border-white/5">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-300 hover:text-white hover:bg-white/10 shrink-0 rounded-full">
                            <Play className="w-4 h-4" />
                        </Button>
                        <div className="h-1 flex-1 bg-smoke rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 w-0"></div>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500">{take.durationSec}s</span>
                    </div>

                    <div className="pt-2 flex justify-end">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleToggleApproval(take.id, take.approved)}
                            className={`text-xs ${take.approved ? 'border-green-500/30 text-green-400 hover:bg-green-500/10' : 'border-white/10 text-zinc-300 hover:border-white/30'}`}
                        >
                            {take.approved ? <><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approved</> : 'Approve Take'}
                        </Button>
                    </div>
                </div>
            ))}
            {takes.length === 0 && (
                <div className="py-12 border border-dashed border-white/10 rounded-xl text-center text-zinc-500 text-sm">
                    No voice takes generated yet.
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
