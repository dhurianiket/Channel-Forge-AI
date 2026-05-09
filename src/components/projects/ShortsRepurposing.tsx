import React, { useState, useEffect } from "react";
import { useAuth } from "@/src/lib/auth-context";
import { Project, ShortProject } from "@/src/types";
import { listShorts } from "@/src/lib/db/shorts";
import { Dispatcher } from "@/src/lib/jobs/dispatcher";
import { Button } from "@/components/ui/button";
import { Scissors, PlayCircle, Hash } from "lucide-react";

interface ShortsRepurposingProps {
  project: Project;
  onUpdate: () => void;
}

export const ShortsRepurposing = ({ project, onUpdate }: ShortsRepurposingProps) => {
  const { activeWorkspace, activeChannel, user } = useAuth();
  const [shorts, setShorts] = useState<ShortProject[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (activeWorkspace && activeChannel) {
      setLoading(true);
      const data = await listShorts(activeWorkspace.id, activeChannel.id, project.id);
      setShorts(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [project.id, activeWorkspace, activeChannel]);

  const handleExtract = async () => {
      if (!activeWorkspace || !activeChannel || !user) return;
      // Provide videoId or roughCutId whichever is available
      const videoId = project.youtubeVideoId || null;
      const roughCutId = project.approvedRoughCutId || project.activeRoughCutId || null;
      
      await Dispatcher.dispatchShortsExtraction(
          activeWorkspace.id,
          activeChannel.id,
          project.id,
          videoId,
          roughCutId,
          null, // Assuming we'd pass a real transcript here if available
          user.uid
      );
      
      await load();
      onUpdate();
  };

  if (loading) return <div className="p-8 text-center text-zinc-500">Loading shorts pipeline...</div>;

  const canExtract = project.youtubeVideoId || project.approvedRoughCutId || project.activeRoughCutId;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-white flex items-center gap-2">
            <Scissors className="w-5 h-5 text-indigo-500" />
            Shorts Repurposing
          </h2>
          <p className="text-sm text-zinc-400">Extract high-retention vertical clips from your long-form video.</p>
        </div>
        <Button 
            onClick={handleExtract} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white" 
            disabled={!canExtract}
        >
            <Scissors className="w-4 h-4 mr-2" /> Extract Clips
        </Button>
      </div>

      {!canExtract && (
          <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm">
             You need an active rough-cut, approved rough-cut, or a published video before you can extract Shorts.
          </div>
      )}

      {shorts.length === 0 && canExtract && (
          <div className="py-20 border border-dashed border-white/10 rounded-xl text-center flex flex-col items-center">
              <Hash className="w-8 h-8 text-zinc-600 mb-3" />
              <p className="text-zinc-300 font-medium mb-1">No Shorts Extracted yet</p>
              <p className="text-sm text-zinc-500 max-w-sm">Use the AI to analyze your transcript and find viral moments automatically.</p>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shorts.map(short => (
             <div key={short.id} className="bg-charcoal border border-white/5 rounded-xl p-5 flex flex-col h-full">
                 <div className="flex items-start justify-between mb-4">
                     <div className="bg-indigo-500/10 text-indigo-400 text-xs px-2 py-1 rounded inline-flex items-center gap-1 font-mono">
                         <PlayCircle className="w-3.5 h-3.5" /> 
                         {short.startSec}s - {short.endSec}s
                     </div>
                     <span className={`text-[10px] uppercase tracking-widest font-mono px-2 py-0.5 rounded-full ${short.status === 'READY' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-zinc-800 text-zinc-400'}`}>
                         {short.status}
                     </span>
                 </div>
                 
                 <div className="mb-4">
                     <p className="text-sm text-white font-medium mb-1 line-clamp-2">Hook: "{short.hookLine}"</p>
                     <p className="text-xs text-zinc-400 italic line-clamp-3">"{short.transcriptExcerpt}"</p>
                 </div>

                 <div className="mt-auto space-y-3">
                     <div>
                         <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono mb-1 block">Title Ideas</label>
                         <ul className="text-xs text-zinc-300 list-disc pl-4 space-y-1">
                             {short.titleOptions.map((title, idx) => (
                                 <li key={idx}>{title}</li>
                             ))}
                         </ul>
                     </div>
                     {short.status === "DRAFT" && (
                         <Button variant="outline" className="w-full h-8 text-xs bg-obsidian border-white/10 hover:border-indigo-500/50 hover:text-indigo-400">
                             Review & Prepare
                         </Button>
                     )}
                 </div>
             </div>
          ))}
      </div>
    </div>
  );
};
