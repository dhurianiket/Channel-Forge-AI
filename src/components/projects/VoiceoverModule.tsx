import React, { useState } from "react";
import { 
  Mic2, 
  Play, 
  RotateCcw, 
  Trash2, 
  CheckCircle2, 
  Globe, 
  Volume2, 
  FastForward,
  Plus,
  Waves,
  Music,
  Settings,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface VoiceTake {
  id: string;
  voiceName: string;
  timestamp: string;
  duration: string;
  status: "READY" | "GENERATING" | "FAILED";
  previewUrl: string;
}

const DEMO_TAKES: VoiceTake[] = [
  {
    id: "1",
    voiceName: "Aria (Cinematic)",
    timestamp: "2h ago",
    duration: "8:42",
    status: "READY",
    previewUrl: "#"
  },
  {
    id: "2",
    voiceName: "Marcus (Authoritative)",
    timestamp: "5h ago",
    duration: "8:45",
    status: "READY",
    previewUrl: "#"
  }
];

export const VoiceoverModule = () => {
  const [takes, setTakes] = useState<VoiceTake[]>(DEMO_TAKES);

  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-teal mb-1">
            <Mic2 className="w-5 h-5" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] font-bold">Acoustic Layer</span>
          </div>
          <h1 className="text-4xl font-display font-bold">Voiceover Studio</h1>
          <p className="text-zinc-500 max-w-xl">
             Generate, refine, and master narrative takes with granular control over tone, pace, and emphasis.
          </p>
        </div>

        <div className="flex items-center gap-3">
           <Button variant="outline" className="bg-smoke/30 border-white/10 gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset Dictionary
           </Button>
           <Button className="bg-brand-teal text-obsidian gap-2 font-bold px-6 border-b-2 border-brand-teal/50 shadow-lg shadow-brand-teal/10">
              <Waves className="w-4 h-4" />
              Generate Full Master
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left: Configuration */}
         <div className="space-y-6">
            <Card className="glass-panel border-white/5 p-6 rounded-3xl space-y-6">
               <h3 className="font-display font-bold flex items-center gap-2">
                  <Settings className="w-4 h-4 text-zinc-500" />
                  Primary Settings
               </h3>
               
               <div className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Select Voice</label>
                     <Select defaultValue="aria">
                        <SelectTrigger className="bg-smoke/30 border-white/5 h-12">
                           <SelectValue placeholder="Choose a voice..." />
                        </SelectTrigger>
                        <SelectContent className="bg-charcoal border-white/10">
                           <SelectItem value="aria">Aria (Cinematic / Female)</SelectItem>
                           <SelectItem value="marcus">Marcus (Technical / Male)</SelectItem>
                           <SelectItem value="zephyr">Zephyr (Mysterious / Male)</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Language / Accent</label>
                     <div className="flex items-center gap-2 p-3 rounded-xl bg-smoke/30 border border-white/5">
                        <Globe className="w-4 h-4 text-brand-teal" />
                        <span className="text-sm font-medium">English (US) Cinematic</span>
                     </div>
                  </div>

                  <div className="space-y-6 pt-4">
                     {[
                        { label: "Pacing", icon: FastForward, value: 50 },
                        { label: "Emphasis", icon: Volume2, value: 75 },
                        { label: "Emotional Depth", icon: Waves, value: 90 },
                     ].map((attr, i) => (
                        <div key={i} className="space-y-1.5">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                 <attr.icon className="w-3.5 h-3.5 text-zinc-600" />
                                 <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{attr.label}</span>
                              </div>
                              <span className="text-[10px] font-bold text-zinc-400">{attr.value}%</span>
                           </div>
                           <Progress value={attr.value} className="h-1 bg-smoke" />
                        </div>
                     ))}
                  </div>
               </div>
            </Card>

            <Card className="bg-brand-teal/5 border border-brand-teal/20 p-6 rounded-3xl space-y-4">
               <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-brand-teal" />
                  <span className="text-xs font-bold font-mono uppercase tracking-widest text-brand-teal">Phonetic Dictionary</span>
               </div>
               <p className="text-xs text-zinc-400 leading-relaxed">
                  Teach the AI how to pronounce niche terminology, brand names, or historical names correctly.
               </p>
               <Button variant="ghost" className="w-full text-brand-teal text-[10px] font-bold uppercase tracking-widest h-10 border border-brand-teal/20">
                  Manage Dictionary
               </Button>
            </Card>
         </div>

         {/* Right: Master Takes & Preview */}
         <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
               <h3 className="font-display font-bold text-xl">Generated Takes</h3>
               <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Compare & Select Final</span>
            </div>

            <div className="space-y-4">
               {takes.map((take, i) => (
                  <Card key={take.id} className="glass-panel border-white/5 p-6 rounded-3xl group hover:border-brand-teal/30 transition-all flex items-center gap-6">
                     <button className="w-14 h-14 rounded-full bg-brand-teal flex items-center justify-center text-obsidian shrink-0 hover:scale-105 transition-transform shadow-lg shadow-brand-teal/20">
                        <Play className="w-6 h-6 fill-obsidian ml-1" />
                     </button>
                     
                     <div className="flex-1 space-y-2 min-w-0">
                        <div className="flex items-center gap-3">
                           <h4 className="font-display font-bold text-lg">{take.voiceName}</h4>
                           <Badge className="bg-smoke text-zinc-400 border-white/5 text-[9px] font-mono">{take.duration}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-[11px] text-zinc-500">
                           <span className="flex items-center gap-1.5"><RotateCcw className="w-3 h-3" /> Take {takes.length - i}</span>
                           <span>•</span>
                           <span>{take.timestamp}</span>
                        </div>
                        <div className="h-2 w-full bg-smoke rounded-full relative overflow-hidden">
                           <div className="absolute inset-0 bg-brand-teal/20 w-3/4 blur-sm" />
                        </div>
                     </div>

                     <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="text-zinc-600 hover:text-red-500 h-10 w-10">
                           <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button className="bg-smoke/50 hover:bg-brand-teal hover:text-obsidian text-[10px] font-bold uppercase tracking-widest px-6 h-10 border border-white/5 transition-all">
                           Select Master
                        </Button>
                     </div>
                  </Card>
               ))}

               {/* Manual Upload */}
               <div className="border-2 border-dashed border-white/5 rounded-3xl p-10 flex flex-col items-center justify-center gap-4 bg-charcoal/10 hover:bg-white/5 transition-all cursor-pointer group">
                  <div className="w-12 h-12 rounded-2xl bg-smoke flex items-center justify-center text-zinc-600 group-hover:text-brand-teal transition-all">
                     <Plus className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                     <p className="font-display font-medium text-zinc-300">Upload Human Alternative</p>
                     <p className="text-[10px] text-zinc-600 font-mono mt-1">Accepts high-quality WAV/MP3 formats</p>
                  </div>
               </div>
            </div>

            {/* Background Music Stub */}
            <div className="p-8 rounded-3xl bg-smoke/10 border border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-500">
                     <Music className="w-6 h-6" />
                  </div>
                  <div>
                     <p className="text-sm font-bold">Atmospheric Bed v1</p>
                     <p className="text-[10px] text-zinc-500 italic">Cinematic Orchestral • 95 BPM</p>
                  </div>
               </div>
               <Button variant="ghost" className="text-zinc-500 gap-2 text-xs">
                  Change Music
                  <ChevronDown className="w-4 h-4" />
               </Button>
            </div>
         </div>
      </div>
    </div>
  );
};
