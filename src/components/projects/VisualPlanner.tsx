import React, { useState } from "react";
import { 
  Image as ImageIcon, 
  Sparkles, 
  ChevronDown, 
  MoreVertical, 
  Play, 
  Layers, 
  Type, 
  Video, 
  Settings2,
  Trash2,
  Grid,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SceneCard {
  id: string;
  number: number;
  narration: string;
  duration: string;
  visualType: "AI_IMAGE" | "AI_VIDEO" | "STOCK" | "TYPOGRAPHY";
  prompt: string;
  status: "PENDING" | "GENERATING" | "READY" | "REJECTED";
}

const DEMO_SCENES: SceneCard[] = [
  {
    id: "1",
    number: 1,
    narration: "They told us the energy crisis was unsolvable.",
    duration: "4.5s",
    visualType: "AI_IMAGE",
    prompt: "Cinematic wide shot of a dark cyberpunk city, street lights flickering out, high contrast, obsidian and neon teal color palette.",
    status: "READY"
  },
  {
    id: "2",
    number: 2,
    narration: "They were wrong. But the solution isn't where you think it is.",
    duration: "6.2s",
    visualType: "AI_VIDEO",
    prompt: "Micro-macro transition: zooming from a street lamp into a single photon of light, becoming a glowing nebula core.",
    status: "GENERATING"
  },
  {
    id: "3",
    number: 3,
    narration: "For sixty years, scientists have chased the sun.",
    duration: "5.0s",
    visualType: "STOCK",
    prompt: "Archive footage: 1950s scientists in lab coats working on primitive vacuum tubes.",
    status: "PENDING"
  }
];

export const VisualPlanner = () => {
  const [scenes, setScenes] = useState<SceneCard[]>(DEMO_SCENES);

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-teal mb-1">
            <Layers className="w-5 h-5" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] font-bold">Cinematography Layer</span>
          </div>
          <h1 className="text-4xl font-display font-bold">Visual Planner</h1>
          <p className="text-zinc-500 max-w-xl">
             Deconstruct your script into a cinematic sequence of assets, prompts, and motion intent.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
           <Button variant="outline" className="bg-smoke/30 border-white/10 gap-2 w-full sm:w-auto">
              <Grid className="w-4 h-4" />
              Batch Regenerate
           </Button>
           <Button className="bg-brand-teal text-obsidian gap-2 font-bold px-6 border-b-2 border-brand-teal/50 shadow-lg shadow-brand-teal/10 w-full sm:w-auto whitespace-nowrap">
              <Sparkles className="w-4 h-4" />
              Generate All Prompts
           </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
         {scenes.map((scene) => (
            <Card key={scene.id} className="glass-panel border-white/5 overflow-hidden group flex flex-col md:flex-row">
               {/* Scene Asset Preview */}
               <div className="w-full md:w-64 aspect-video md:aspect-auto bg-charcoal/50 relative overflow-hidden group/thumb shrink-0 border-r border-white/5">
                  {scene.status === "READY" ? (
                      <img 
                        src={`https://picsum.photos/seed/scene${scene.id}/800/600`} 
                        alt="Scene Preview" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                  ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                         <div className={cn(
                           "w-12 h-12 rounded-full border-2 border-dashed border-white/5 flex items-center justify-center text-zinc-700",
                           scene.status === "GENERATING" && "animate-spin border-brand-teal border-solid"
                         )}>
                            {scene.status === "GENERATING" ? <Sparkles className="w-6 h-6 text-brand-teal" /> : <Video className="w-6 h-6" />}
                         </div>
                         <span className="text-[10px] font-mono tracking-widest text-zinc-600 uppercase">
                            {scene.status === "GENERATING" ? "AI Rendering..." : "No Asset Yet"}
                         </span>
                      </div>
                  )}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                     <span className="w-6 h-6 rounded bg-obsidian/80 backdrop-blur-sm border border-white/10 flex items-center justify-center font-mono text-[10px] font-bold">
                        {scene.number}
                     </span>
                     <Badge className="bg-obsidian/80 backdrop-blur-sm text-[9px] border-white/10">{scene.duration}</Badge>
                  </div>
                  <button className="absolute inset-0 bg-obsidian/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                     <Play className="w-10 h-10 text-white fill-white" />
                  </button>
               </div>

               {/* Scene Content */}
               <div className="flex-1 p-6 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           {scene.visualType === "AI_IMAGE" && <ImageIcon className="w-3.5 h-3.5 text-brand-teal" />}
                           {scene.visualType === "AI_VIDEO" && <Video className="w-3.5 h-3.5 text-brand-teal" />}
                           {scene.visualType === "STOCK" && <Layers className="w-3.5 h-3.5 text-zinc-500" />}
                           <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">{scene.visualType.replace("_", " ")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                           <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-600 hover:text-white"><Settings2 className="w-3.5 h-3.5" /></Button>
                           <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-600 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
                     </div>

                     <div className="space-y-1">
                        <p className="text-[10px] font-mono text-zinc-600 tracking-wider uppercase leading-none">Narration</p>
                        <p className="text-sm font-medium text-zinc-300 leading-relaxed italic border-l-2 border-brand-teal/30 pl-3">
                           "{scene.narration}"
                        </p>
                     </div>

                     <div className="space-y-2">
                        <p className="text-[10px] font-mono text-zinc-600 tracking-wider uppercase leading-none">Visual Prompt</p>
                        <textarea 
                          className="w-full bg-smoke/30 border border-white/5 rounded-xl p-3 text-xs leading-relaxed text-zinc-400 resize-none h-20 focus:ring-1 focus:ring-brand-teal/50 transition-all font-sans"
                          value={scene.prompt}
                          readOnly
                        />
                     </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                     <Button size="sm" className="flex-1 bg-smoke/80 border border-white/10 text-[10px] font-bold uppercase tracking-widest h-9">
                        Edit Prompt
                     </Button>
                     <Button size="sm" className="flex-1 bg-brand-teal text-obsidian text-[10px] font-bold uppercase tracking-widest h-9 border-b-2 border-obsidian/20">
                        {scene.status === "READY" ? "Regenerate" : "Generate"}
                     </Button>
                  </div>
               </div>
            </Card>
         ))}

         {/* Add Scene */}
         <div className="border-2 border-dashed border-white/5 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 hover:border-brand-teal/30 hover:bg-white/5 transition-all group cursor-pointer h-full">
            <div className="w-16 h-16 rounded-full bg-smoke flex items-center justify-center text-zinc-600 group-hover:text-brand-teal transition-all group-hover:scale-110">
               <Plus className="w-8 h-8" />
            </div>
            <div className="text-center">
               <p className="font-display font-bold text-lg">Append Scene</p>
               <p className="text-xs text-zinc-600 font-mono mt-1">Insert manual or AI-suggested visual beat</p>
            </div>
         </div>
      </div>
    </div>
  );
};
