import React, { useState } from "react";
import { 
  Lightbulb, 
  Search, 
  TrendingUp, 
  Plus, 
  Filter, 
  MoreVertical,
  Target,
  Flame,
  Globe,
  Lock,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Idea {
  id: string;
  topic: string;
  angle: string;
  scores: {
    clickPotential: number;
    originality: number;
    depth: number;
    demand: number;
  };
  pillar: string;
  status: "BACKLOG" | "RESEARCHING" | "APPROVED";
}

const DEMO_IDEAS: Idea[] = [
  {
    id: "1",
    topic: "The Future of Nuclear Fusion",
    angle: "Why 2026 is the real turning point for endless energy",
    scores: { clickPotential: 85, originality: 60, depth: 90, demand: 75 },
    pillar: "Future Tech",
    status: "APPROVED",
  },
  {
    id: "2",
    topic: "Ancient Civilizations Mystery",
    angle: "The LIDAR discovery that changes everything about the Amazon",
    scores: { clickPotential: 95, originality: 80, depth: 70, demand: 85 },
    pillar: "History",
    status: "RESEARCHING",
  },
  {
    id: "3",
    topic: "Minimalist Productivity Hacks",
    angle: "Why Notion is actually making you less productive",
    scores: { clickPotential: 70, originality: 40, depth: 50, demand: 90 },
    pillar: "Lifestyle",
    status: "BACKLOG",
  }
];

export const IdeaEngine = () => {
  const [ideas, setIdeas] = useState<Idea[]>(DEMO_IDEAS);
  const [searchTerm, setSearchTerm] = useState("");

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-brand-teal";
    if (score >= 60) return "text-brand-orange";
    return "text-zinc-500";
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-teal mb-1">
            <Lightbulb className="w-5 h-5" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] font-bold">Innovation Hub</span>
          </div>
          <h1 className="text-4xl font-display font-bold">Idea Engine</h1>
          <p className="text-zinc-500 max-w-xl">
             Mine angles, score potential, and forge the narrative spine of your next masterpiece.
          </p>
        </div>

        <div className="flex items-center gap-3">
           <div className="relative w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-brand-teal transition-colors" />
              <Input 
                className="pl-10 bg-charcoal/50 border-white/5 focus-visible:ring-brand-teal" 
                placeholder="Search angles..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <Button className="bg-brand-teal text-obsidian gap-2 font-bold px-6">
              <Plus className="w-4 h-4" />
              Ingest Topic
           </Button>
        </div>
      </div>

      {/* Tabs / Filters */}
      <div className="flex items-center gap-4 py-2 border-b border-white/5 overflow-x-auto no-scrollbar">
         {["All Ideas", "Mining", "Backlog", "Validated"].map((tab, i) => (
            <button key={i} className={cn(
              "px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
              i === 0 ? "text-brand-teal border-b-2 border-brand-teal" : "text-zinc-500 hover:text-zinc-300"
            )}>
               {tab}
            </button>
         ))}
         <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-zinc-500 text-xs gap-1.5">
               <Filter className="w-3.5 h-3.5" />
               Filter
            </Button>
            <Button variant="ghost" size="sm" className="text-zinc-500 text-xs gap-1.5">
               <TrendingUp className="w-3.5 h-3.5" />
               Sort by Score
            </Button>
         </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {ideas.map((idea) => (
            <Card key={idea.id} className="glass-panel border-white/5 overflow-hidden group hover:border-brand-teal/30 transition-all duration-500">
               <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                     <Badge variant="outline" className="bg-smoke/30 border-white/10 text-[10px] font-mono tracking-wider uppercase text-zinc-400">
                        {idea.pillar}
                     </Badge>
                     <DropdownMenu>
                        <DropdownMenuTrigger
                           render={
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white">
                                 <MoreVertical className="w-4 h-4" />
                              </Button>
                           }
                        />
                        <DropdownMenuContent align="end" className="bg-charcoal border-white/10">
                           <DropdownMenuItem className="hover:bg-smoke">Edit Angle</DropdownMenuItem>
                           <DropdownMenuItem className="hover:bg-smoke">Rescore AI</DropdownMenuItem>
                           <DropdownMenuItem className="text-destructive hover:bg-destructive/10">Archive</DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </div>
                  <div className="space-y-2">
                     <h3 className="font-display font-bold text-lg group-hover:text-brand-teal transition-colors leading-tight">
                        {idea.angle}
                     </h3>
                     <p className="text-zinc-500 text-xs line-clamp-2">Topic: {idea.topic}</p>
                  </div>
               </CardHeader>
               
               <CardContent className="space-y-5">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                     {[
                        { label: "Click Potential", value: idea.scores.clickPotential, icon: Target },
                        { label: "Originality", value: idea.scores.originality, icon: Flame },
                        { label: "Research Depth", value: idea.scores.depth, icon: Globe },
                        { label: "Content Demand", value: idea.scores.demand, icon: Lock },
                     ].map((score, i) => (
                        <div key={i} className="space-y-1.5">
                           <div className="flex items-center justify-between">
                              <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">{score.label}</span>
                              <span className={cn("text-xs font-bold", getScoreColor(score.value))}>{score.value}%</span>
                           </div>
                           <Progress value={score.value} className="h-1 bg-smoke" />
                        </div>
                     ))}
                  </div>
               </CardContent>

               <CardFooter className="p-0 border-t border-white/5">
                  <button className="w-full h-12 flex items-center justify-center gap-2 hover:bg-brand-teal group/btn transition-all duration-300">
                     <span className="text-xs font-bold uppercase tracking-widest text-zinc-300 group-hover/btn:text-obsidian">Start Production</span>
                     <ArrowRight className="w-3.5 h-3.5 text-brand-teal group-hover/btn:text-obsidian transition-transform group-hover/btn:translate-x-1" />
                  </button>
               </CardFooter>
            </Card>
         ))}

         {/* Empty / Add Card */}
         <div className="border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center p-8 gap-4 hover:border-brand-teal/30 hover:bg-white/5 transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-smoke flex items-center justify-center text-zinc-500 group-hover:text-brand-teal transition-colors">
               <Plus className="w-6 h-6" />
            </div>
            <div className="text-center">
               <p className="font-display font-medium">Add New Angle</p>
               <p className="text-[10px] text-zinc-600 font-mono mt-1">Manual entry or mining</p>
            </div>
         </div>
      </div>
    </div>
  );
};
