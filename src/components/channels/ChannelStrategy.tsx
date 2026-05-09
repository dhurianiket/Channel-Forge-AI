import React from "react";
import { cn } from "@/lib/utils";
import { 
  Tv2, 
  Target, 
  Palette, 
  Zap, 
  ShieldAlert,
  ArrowUpRight,
  Plus,
  Edit2,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const ChannelStrategy = () => {
  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-teal mb-1">
            <Tv2 className="w-5 h-5" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] font-bold">Foundation</span>
          </div>
          <h1 className="text-4xl font-display font-bold">Channel Strategy</h1>
          <p className="text-zinc-500 max-w-xl">
             Define the DNA of your media empire. Pillars, audience, and the rules of engagement.
          </p>
        </div>

        <div className="flex items-center gap-3">
           <Button variant="outline" className="bg-smoke/30 border-white/10 gap-2">
              <Edit2 className="w-4 h-4" />
              Edit Guide
           </Button>
           <Button className="bg-brand-teal text-obsidian gap-2 font-bold px-6">
              View Analytics
              <ArrowUpRight className="w-4 h-4" />
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left Column: Core Identity */}
         <div className="lg:col-span-2 space-y-8">
            <Card className="glass-panel border-white/5 p-8 rounded-3xl space-y-6">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <Target className="w-5 h-5 text-brand-teal" />
                     <h3 className="text-xl font-display font-bold">Niche & Audience</h3>
                  </div>
                  <Badge className="bg-brand-teal/10 text-brand-teal border-brand-teal/20">Verified</Badge>
               </div>
               
               <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-smoke/30 border border-white/5">
                     <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Mission Statement</p>
                     <p className="text-zinc-200">Exploring the intersection of deep history and near-future technology through cinematic faceless storytelling.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="p-4 rounded-xl bg-smoke/30 border border-white/5">
                        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Target Persona</p>
                        <p className="text-sm font-medium"> The "Curious Architect"</p>
                        <p className="text-xs text-zinc-400 mt-1">25-45, tech-literate, loves long-form deep dives, values high production quality.</p>
                     </div>
                     <div className="p-4 rounded-xl bg-smoke/30 border border-white/5">
                        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Tone & Language</p>
                        <p className="text-sm font-medium">Authoritative, Cinematic, Mysterious</p>
                        <p className="text-xs text-zinc-400 mt-1">Language: English (Global). No hype-man energy.</p>
                     </div>
                  </div>
               </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Card className="glass-panel border-white/5 p-6 rounded-3xl space-y-6">
                  <div className="flex items-center justify-between">
                     <h4 className="font-display font-bold">Content Pillars</h4>
                     <Button variant="ghost" size="icon" className="h-8 w-8"><Plus className="w-4 h-4" /></Button>
                  </div>
                  <div className="space-y-3">
                     {[
                        { title: "Silicon Mythology", count: 12, color: "bg-brand-teal" },
                        { title: "The Ruin Economy", count: 8, color: "bg-brand-orange" },
                        { title: "Speculative Biology", count: 5, color: "bg-purple-500" },
                     ].map((p, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-white/5 hover:bg-white/5 transition-colors group cursor-pointer">
                           <div className="flex items-center gap-3">
                              <div className={cn("w-1.5 h-1.5 rounded-full", p.color)} />
                              <span className="text-sm font-medium">{p.title}</span>
                           </div>
                           <span className="text-[10px] font-mono text-zinc-500">{p.count} Videos</span>
                        </div>
                     ))}
                  </div>
               </Card>

               <Card className="glass-panel border-white/5 p-6 rounded-3xl space-y-6">
                  <div className="flex items-center justify-between">
                     <h4 className="font-display font-bold">Series Hooks</h4>
                     <Button variant="ghost" size="icon" className="h-8 w-8"><Plus className="w-4 h-4" /></Button>
                  </div>
                  <div className="space-y-3">
                     {[
                        "Why [Subject] is Vanishing",
                        "The Hidden Cost of [System]",
                        "Evidence for [Theory] in 2026",
                     ].map((hook, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-white/5 hover:bg-white/5 transition-colors group cursor-pointer text-xs text-zinc-300">
                           {hook}
                           <ArrowUpRight className="w-3 h-3 text-zinc-600 group-hover:text-brand-teal" />
                        </div>
                     ))}
                  </div>
               </Card>
            </div>
         </div>

         {/* Right Column: Style & Safety */}
         <div className="space-y-8">
            <Card className="glass-panel border-white/5 p-6 rounded-3xl space-y-6">
               <div className="flex items-center gap-3">
                  <Palette className="w-5 h-5 text-brand-orange" />
                  <h3 className="font-display font-bold">Visual Identity</h3>
               </div>
               <div className="space-y-4">
                  <div className="flex gap-2">
                     {["#09090b", "#14b8a6", "#f97316", "#ffffff"].map((c, i) => (
                        <div key={i} className="flex-1 h-10 rounded-lg border border-white/10" style={{ backgroundColor: c }} />
                     ))}
                  </div>
                  <div className="space-y-2">
                     <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Typography Path</p>
                     <div className="p-3 rounded-lg bg-smoke/30 border border-white/5 flex items-center justify-between">
                        <span className="text-sm font-display">Space Grotesk</span>
                        <Badge variant="outline" className="text-[9px]">Headings</Badge>
                     </div>
                     <div className="p-3 rounded-lg bg-smoke/30 border border-white/5 flex items-center justify-between">
                        <span className="text-sm">Inter</span>
                        <Badge variant="outline" className="text-[9px]">UI / Body</Badge>
                     </div>
                  </div>
               </div>
            </Card>

            <Card className="glass-panel border-white/5 p-6 rounded-3xl space-y-6">
               <div className="flex items-center gap-3">
                  <ShieldAlert className="w-5 h-5 text-red-500" />
                  <h3 className="font-display font-bold">Banned Patterns</h3>
               </div>
               <div className="space-y-2">
                  {[
                     "No AI-generated generic b-roll",
                     "No neon purple 'cyber' gradients",
                     "No clickbait 'shocked' faces",
                     "No passive voice in hooks",
                  ].map((rule, i) => (
                     <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                        <div className="w-1 h-1 rounded-full bg-red-500/50 shrink-0" />
                        <span className="text-xs text-zinc-400">{rule}</span>
                     </div>
                  ))}
               </div>
            </Card>

            <Card className="bg-brand-teal/5 border-brand-teal/20 p-6 rounded-3xl space-y-4">
               <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-brand-teal" />
                  <h3 className="font-display font-bold">Quality Intelligence</h3>
               </div>
               <p className="text-xs text-zinc-400 leading-relaxed">
                  Your current content strategy scores an <b>84/100</b> for monetization safety. 
                  Focus on original research to improve relevance.
               </p>
               <Button className="w-full bg-brand-teal text-obsidian text-xs font-bold">
                  Run Strategy Audit
               </Button>
            </Card>
         </div>
      </div>
    </div>
  );
};
