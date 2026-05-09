import React, { useState } from "react";
import { 
  Video, 
  Search, 
  Filter, 
  Plus, 
  Clock, 
  User, 
  MoreVertical, 
  ArrowRight,
  Play,
  CheckCircle2,
  AlertCircle,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ProjectStage } from "@/src/types";

export const ProjectsList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const projects = [
    { id: "1", title: "The Rise of Silicon Mythology", stage: ProjectStage.SCRIPT, status: "ACTIVE", lastEdited: "2h ago", owner: "Alex", progress: 65 },
    { id: "2", title: "Why Architecture is Failing", stage: ProjectStage.RESEARCH, status: "ACTIVE", lastEdited: "5h ago", owner: "Sam", progress: 30 },
    { id: "3", title: "The Future of Space Habitats", stage: ProjectStage.ROUGH_CUT, status: "PAUSED", lastEdited: "1d ago", owner: "Alex", progress: 90 },
    { id: "4", title: "Mystery of the 9th Planet", stage: ProjectStage.IDEA, status: "ACTIVE", lastEdited: "3d ago", owner: "Dev", progress: 10 },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-zinc-500 mb-1">
            <Video className="w-5 h-5 text-brand-teal" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-brand-teal">Production Line</span>
          </div>
          <h1 className="text-4xl font-display font-bold">Projects</h1>
          <p className="text-zinc-500 max-w-xl">
             Manage your active production slate across your creative crew.
          </p>
        </div>

        <div className="flex items-center gap-3">
           <div className="relative w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-brand-teal transition-colors" />
              <Input 
                className="pl-10 bg-charcoal/50 border-white/5 focus-visible:ring-brand-teal" 
                placeholder="Search projects..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <Button className="bg-brand-teal text-obsidian gap-2 font-bold px-6">
              <Plus className="w-4 h-4" />
              New Venture
           </Button>
        </div>
      </div>

      {/* Table Style List */}
      <div className="rounded-3xl border border-white/5 bg-charcoal/20 overflow-hidden overflow-x-auto">
         <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-charcoal/50 border-b border-white/5">
               <tr>
                  <th className="px-6 py-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Project Name</th>
                  <th className="px-6 py-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Current Stage</th>
                  <th className="px-6 py-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Progress</th>
                  <th className="px-6 py-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Owner</th>
                  <th className="px-6 py-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold text-right">Action</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
               {projects.map((proj) => (
                  <tr key={proj.id} className="group hover:bg-white/5 transition-colors cursor-pointer">
                     <td className="px-6 py-6">
                        <div className="flex flex-col gap-1">
                           <span className="font-display font-medium text-sm group-hover:text-brand-teal transition-colors">{proj.title}</span>
                           <div className="flex items-center gap-2 text-[10px] text-zinc-600">
                              <Clock className="w-3 h-3" />
                              Edited {proj.lastEdited}
                           </div>
                        </div>
                     </td>
                     <td className="px-6 py-6">
                        <Badge variant="outline" className="bg-smoke/30 border-white/10 text-[10px] py-0.5 px-2.5 font-mono">
                           {proj.stage}
                        </Badge>
                     </td>
                     <td className="px-6 py-6 max-w-[200px]">
                        <div className="space-y-1.5">
                           <span className="text-[10px] font-mono text-zinc-500">{proj.progress}%</span>
                           <Progress value={proj.progress} className="h-1 bg-smoke" />
                        </div>
                     </td>
                     <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                           <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-brand-teal">
                              {proj.owner[0]}
                           </div>
                           {proj.owner}
                        </div>
                     </td>
                     <td className="px-6 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-600 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></Button>
                           <Button variant="outline" size="sm" className="bg-smoke/30 border-white/10 text-xs gap-2 group-hover:border-brand-teal group-hover:text-brand-teal">
                              Open Hub
                              <ArrowRight className="w-3 h-3" />
                           </Button>
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>

      {/* Featured / Drafts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="glass-panel rounded-3xl p-6 flex flex-col gap-4 border-l-4 border-l-brand-orange">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2 text-brand-orange">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs font-bold font-mono tracking-widest uppercase">Blocked Project</span>
               </div>
               <span className="text-[10px] text-zinc-600">Needs Review</span>
            </div>
            <h3 className="font-display font-medium text-lg">The Physics of Interstellar Sail Ships</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
               Script validation failed on factual confidence (64%). The AI detects potential hallucinations in the orbital mechanics section.
            </p>
            <Button className="w-fit bg-brand-orange text-white text-xs font-bold px-6">
               Resolve Blocker
            </Button>
         </div>

         <div className="glass-panel rounded-3xl p-6 flex flex-col gap-4 border-l-4 border-l-green-500">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-bold font-mono tracking-widest uppercase">Ready to Publish</span>
               </div>
               <span className="text-[10px] text-zinc-600">All Gates Passed</span>
            </div>
            <h3 className="font-display font-medium text-lg">Hidden History: The Venice of the West</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
               Package V2 approved. Rough cut synced with Master Audio. Thumbnails tested at 9.2% predicted CTR.
            </p>
            <Button className="w-fit bg-green-500 text-obsidian text-xs font-bold px-6">
               Publish Now
            </Button>
         </div>
      </div>
    </div>
  );
};
