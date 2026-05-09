import React, { useState } from "react";
import { 
  FileText, 
  Sparkles, 
  History, 
  MessageSquare, 
  CheckCircle2, 
  ChevronDown,
  Layout,
  Type,
  Eye,
  Settings,
  MoreHorizontal,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ScriptBlock {
  id: string;
  type: "HOOK" | "NARRATIVE" | "EXPLANATION" | "TRANSITION" | "CTA";
  content: string;
  visualNote: string;
  approved: boolean;
}

const DEMO_BLOCKS: ScriptBlock[] = [
  {
    id: "1",
    type: "HOOK",
    content: "They told us the energy crisis was unsolvable. They were wrong. But the solution isn't where you think it is.",
    visualNote: "Cinematic wide shot of a futuristic city dimming and then glowing blue.",
    approved: true
  },
  {
    id: "2",
    type: "NARRATIVE",
    content: "For sixty years, scientists have chased the sun. Now, we've finally brought it down to earth. This is the story of the first real fusion breakthrough.",
    visualNote: "Archive footage of early fusion experiments, transitioning to sleek modern lab.",
    approved: true
  },
  {
    id: "3",
    type: "EXPLANATION",
    content: "Fusion isn't just about heat. It's about containment. To hold a star, you need more than just a strong box; you need a magnet stronger than the Earth itself.",
    visualNote: "3D animation of a Tokamak reactor plasma flow.",
    approved: false
  }
];

export const ScriptStudio = () => {
  const [blocks, setBlocks] = useState<ScriptBlock[]>(DEMO_BLOCKS);
  const [activeTab, setActiveTab] = useState<"WRITE" | "VISUALS" | "QA">("WRITE");

  const updateBlock = (id: string, field: keyof ScriptBlock, value: any) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Editor Main */}
      <div className="flex-1 flex flex-col bg-obsidian">
        {/* Editor Toolbar */}
        <div className="h-14 border-b border-white/5 bg-charcoal/30 flex items-center justify-between px-6 shrink-0">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <FileText className="w-4 h-4 text-brand-teal" />
                 <h2 className="text-sm font-bold truncate">Project: Silicon Mythology V1</h2>
              </div>
              <div className="h-4 w-[1px] bg-white/10" />
              <div className="flex items-center gap-1 bg-smoke/50 p-1 rounded-lg">
                 {["WRITE", "VISUALS", "QA"].map((tab) => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={cn(
                        "px-3 py-1 text-[10px] font-mono tracking-widest uppercase font-bold rounded-md transition-all",
                        activeTab === tab ? "bg-brand-teal text-obsidian shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                      )}
                    >
                       {tab}
                    </button>
                 ))}
              </div>
           </div>

           <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="text-zinc-500 gap-1.5 text-xs">
                 <History className="w-3.5 h-3.5" />
                 v1.4.2
              </Button>
              <Button className="bg-brand-orange text-white text-xs font-bold gap-2 hover:bg-brand-orange/90 molten-glow">
                 <Sparkles className="w-3.5 h-3.5" />
                 AI Refine
              </Button>
           </div>
        </div>

        {/* Content Area */}
        <ScrollArea className="flex-1 bg-charcoal/5">
           <div className="max-w-4xl mx-auto py-12 px-8 space-y-12">
              {blocks.map((block, i) => (
                 <div key={block.id} className="relative group/block animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                    {/* Block Info */}
                    <div className="absolute -left-32 top-0 w-24 text-right hidden xl:block">
                       <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">{block.type}</span>
                       <div className="mt-2 flex flex-col items-end gap-2">
                          <Badge className={cn(
                            "text-[8px] uppercase",
                            block.approved ? "bg-brand-teal/10 text-brand-teal" : "bg-brand-orange/10 text-brand-orange"
                          )}>
                             {block.approved ? "Verified" : "Draft"}
                          </Badge>
                       </div>
                    </div>

                    {/* Main Block Card */}
                    <div className="space-y-4">
                       <div className="flex items-center justify-between xl:hidden">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{block.type}</span>
                       </div>
                       <Textarea 
                          value={block.content}
                          onChange={(e) => updateBlock(block.id, "content", e.target.value)}
                          className="bg-transparent border-none focus-visible:ring-0 text-xl font-medium leading-relaxed resize-none min-h-[100px] p-0 text-zinc-200 placeholder:text-zinc-800"
                          placeholder="Empty narrative block..."
                       />
                       
                       {/* Visual Note Section */}
                       <div className="p-4 rounded-2xl bg-charcoal/40 border border-white/5 space-y-3 group/note border-dashed hover:border-brand-teal/30 transition-all">
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-mono uppercase tracking-widest">
                                <Layout className="w-3 h-3" />
                                Visual Direction
                             </div>
                             <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-700 hover:text-brand-teal">
                                <Sparkles className="w-3 h-3" />
                             </Button>
                          </div>
                          <Input 
                            value={block.visualNote}
                            onChange={(e) => updateBlock(block.id, "visualNote", e.target.value)}
                            className="bg-transparent border-none h-auto p-0 text-xs text-zinc-400 italic placeholder:text-zinc-700 focus-visible:ring-0"
                          />
                       </div>
                    </div>

                    {/* Block Actions (Floating over Divider) */}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-0 group-hover/block:opacity-100 transition-opacity z-10">
                       <Button size="icon" variant="outline" className="w-8 h-8 rounded-full bg-charcoal border-white/10 text-zinc-500 hover:text-brand-teal">
                          <Plus className="w-4 h-4" />
                       </Button>
                    </div>
                    
                    <div className="h-px bg-white/5 my-12" />
                 </div>
              ))}
              
              <div className="pb-32 flex flex-col items-center gap-4">
                 <Button variant="ghost" className="text-zinc-600 hover:text-zinc-300 gap-2">
                    <Plus className="w-4 h-4" />
                    New Narrative Block
                 </Button>
              </div>
           </div>
        </ScrollArea>
      </div>

      {/* Right Sidebar: Context / AI Tools */}
      <aside className="w-80 border-l border-white/5 bg-charcoal/30 flex flex-col shrink-0">
         <div className="p-6 border-b border-white/5 space-y-4">
            <h3 className="font-display font-bold">Editorial Assistant</h3>
            <div className="p-4 rounded-xl bg-brand-teal/5 border border-brand-teal/20 space-y-3">
               <div className="flex items-center gap-2 text-brand-teal">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-bold font-mono uppercase">Vibe Check</span>
               </div>
               <p className="text-[11px] text-zinc-400 leading-normal">
                  The pacing is slightly too fast in the explanation block. Consider adding a 10s narrative bridge.
               </p>
            </div>
         </div>

         <ScrollArea className="flex-1 p-6">
            <div className="space-y-8">
               {/* Metrics */}
               <div className="space-y-4">
                  <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Metadata Insights</h4>
                  <div className="grid grid-cols-2 gap-3">
                     {[
                        { label: "Est. Duration", value: "8:42" },
                        { label: "Hooks Count", value: "3" },
                        { label: "Retention Risk", value: "Low" },
                        { label: "Complexity", value: "Medium" },
                     ].map((m, i) => (
                        <div key={i} className="p-3 rounded-lg bg-smoke/30 border border-white/5">
                           <p className="text-[9px] text-zinc-600 mb-1">{m.label}</p>
                           <p className="text-xs font-bold text-zinc-200">{m.value}</p>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Research Context */}
               <div className="space-y-4">
                  <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Live Research Context</h4>
                  <div className="space-y-3">
                     {[
                        "Paris Agreement goal: 45% drop by 2030",
                        "Fusion reactor expected 2032 (UK)",
                        "LIDAR tech discovered Maya structures",
                     ].map((context, i) => (
                        <div key={i} className="p-3 rounded-lg border border-dashed border-white/5 text-[10px] text-zinc-500 leading-relaxed hover:border-brand-teal/20 transition-colors cursor-pointer">
                           {context}
                        </div>
                     ))}
                  </div>
               </div>

               {/* Chat / Comments */}
               <div className="space-y-4">
                  <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Team Feedback</h4>
                  <div className="flex items-start gap-3">
                     <div className="w-6 h-6 rounded-full bg-brand-orange/20 border border-brand-orange/40 shrink-0" />
                     <div className="p-3 rounded-xl bg-smoke/50 text-[10px] text-zinc-300 leading-normal">
                        Needs a stronger open loop at the end of the explanation section.
                     </div>
                  </div>
               </div>
            </div>
         </ScrollArea>

         {/* Bottom Action */}
         <div className="p-4 bg-obsidian/40 border-t border-white/5">
            <Button className="w-full bg-white text-obsidian font-bold uppercase tracking-widest text-[10px] h-12">
               Approve Script
            </Button>
         </div>
      </aside>
    </div>
  );
};
