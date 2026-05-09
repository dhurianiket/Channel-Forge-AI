import React, { useState } from "react";
import { 
  Database, 
  Search, 
  FileCheck, 
  AlertCircle, 
  ExternalLink, 
  Plus, 
  CheckCircle2, 
  ShieldCheck,
  ChevronRight,
  Brain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface FactCardProps {
  claim: string;
  source: string;
  confidence: number;
  isVerified: boolean;
  key?: string | number;
}

const FactCard = ({ claim, source, confidence, isVerified }: FactCardProps) => (
  <div className="p-4 rounded-2xl bg-smoke/20 border border-white/5 hover:border-brand-teal/30 transition-all group flex flex-col gap-3">
    <div className="flex items-start justify-between gap-4">
      <p className="text-sm font-medium text-zinc-100">{claim}</p>
      {isVerified ? (
        <CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0" />
      ) : (
        <AlertCircle className="w-4 h-4 text-brand-orange shrink-0" />
      )}
    </div>
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest leading-none">Confidence Level</span>
        <div className="flex items-center gap-2">
           <Progress value={confidence} className="h-1 w-16 bg-smoke" />
           <span className={cn("text-[10px] font-bold", confidence > 80 ? "text-brand-teal" : "text-brand-orange")}>{confidence}%</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 hover:text-brand-teal transition-colors cursor-pointer">
        <ExternalLink className="w-3 h-3" />
        <span className="truncate max-w-[100px]">{source}</span>
      </div>
    </div>
  </div>
);

export const ResearchHub = () => {
  const [researchMode, setResearchMode] = useState<"ACTIVE" | "REVIEW">("ACTIVE");

  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-teal mb-1">
            <Database className="w-5 h-5" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] font-bold">Project Architecture</span>
          </div>
          <h1 className="text-4xl font-display font-bold">Research Hub</h1>
          <p className="text-zinc-500 max-w-xl">
             Ingest, verify, and systematize raw intelligence into a script-safe fact package.
          </p>
        </div>

        <div className="flex items-center gap-3">
           <Button variant="outline" className="bg-smoke/30 border-white/10 gap-2">
              <FileCheck className="w-4 h-4" />
              Fact Check All
           </Button>
           <Button className="bg-brand-teal text-obsidian gap-2 font-bold px-6">
              <Plus className="w-4 h-4" />
              Add Source
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Left: Sources & Context */}
         <div className="lg:col-span-4 space-y-6">
            <Card className="glass-panel border-white/5 p-6 rounded-3xl space-y-6">
               <h3 className="font-display font-bold flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-brand-teal" />
                  Trusted Sources
               </h3>
               <div className="space-y-3">
                  {[
                     { name: "Nature Portfolio", type: "Scientific Journal", url: "nature.com/articles/..." },
                     { name: "MIT Technology Review", type: "Tech Publication", url: "technologyreview.com/..." },
                     { name: "Raw Interview Transcript", type: "Original Source", url: "Local Upload" },
                  ].map((source, i) => (
                     <div key={i} className="p-3 rounded-xl border border-white/5 hover:bg-white/5 transition-colors cursor-pointer group flex items-center justify-between">
                        <div className="flex flex-col">
                           <span className="text-xs font-semibold">{source.name}</span>
                           <span className="text-[9px] text-zinc-500">{source.type}</span>
                        </div>
                        <ChevronRight className="w-3 h-3 text-zinc-700 group-hover:text-brand-teal" />
                     </div>
                  ))}
               </div>
               <Button variant="outline" className="w-full border-white/10 text-xs py-5 border-dashed">
                  Ingest New Intelligence
               </Button>
            </Card>

            <Card className="bg-smoke/20 border border-brand-teal/20 p-6 rounded-3xl space-y-4">
               <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-teal" />
                  <span className="text-xs font-bold font-mono uppercase tracking-wider text-brand-teal">Research Brief</span>
               </div>
               <p className="text-xs text-zinc-400 leading-relaxed">
                  Generate a structured research brief for your scriptwriter. AI will summarize all verified facts into a cohesive narrative foundation.
               </p>
               <Button className="w-full bg-brand-teal/10 text-brand-teal border border-brand-teal/30 hover:bg-brand-teal/20 text-xs font-bold">
                  Synthesize Brief
               </Button>
            </Card>
         </div>

         {/* Right: Fact Pack Table / Grid */}
         <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex items-center justify-between bg-charcoal/30 p-2 rounded-2xl border border-white/5">
                <div className="flex gap-1">
                   <button 
                     onClick={() => setResearchMode("ACTIVE")}
                     className={cn(
                       "px-4 py-2 rounded-xl text-xs font-medium transition-all",
                       researchMode === "ACTIVE" ? "bg-brand-teal text-obsidian shadow-lg shadow-brand-teal/10" : "text-zinc-500 hover:text-zinc-300"
                     )}
                   >
                      Fact Cards
                   </button>
                   <button 
                     onClick={() => setResearchMode("REVIEW")}
                     className={cn(
                       "px-4 py-2 rounded-xl text-xs font-medium transition-all",
                       researchMode === "REVIEW" ? "bg-brand-teal text-obsidian shadow-lg shadow-brand-teal/10" : "text-zinc-500 hover:text-zinc-300"
                     )}
                   >
                      Verification Queue
                   </button>
                </div>
                <div className="flex items-center gap-3 px-3">
                   <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Confidence Threshold</span>
                   <Badge className="bg-smoke text-zinc-400 font-mono text-[9px]">80%</Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {[
                  { claim: "Global carbon emissions must drop by 45% by 2030 to meet Paris Agreement goals.", source: "nature.com", confidence: 98, verified: true },
                  { claim: "First commercial fusion reactor will likely be online by early 2032 in the UK.", source: "technologyreview.com", confidence: 72, verified: false },
                  { claim: "The total investment in green hydrogen surpassed $12B in the last quarter of 2025.", source: "bloomberg.com", confidence: 91, verified: true },
                  { claim: "New LIDAR scans reveal over 10,000 previously unknown structures in the Maya Lowlands.", source: "science.org", confidence: 95, verified: true },
               ].map((fact, i) => (
                  <FactCard 
                    key={i} 
                    claim={fact.claim}
                    source={fact.source}
                    confidence={fact.confidence}
                    isVerified={fact.verified} 
                  />
               ))}
               
               {/* Extraction Tool */}
               <div className="md:col-span-2 border-2 border-dashed border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 bg-charcoal/10 hover:bg-white/5 transition-all cursor-pointer group">
                  <div className="w-12 h-12 rounded-2xl bg-smoke flex items-center justify-center text-zinc-600 group-hover:text-brand-teal group-hover: molten-glow transition-all">
                     <Brain className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                     <p className="font-display font-medium text-zinc-300">Run AI Fact Extraction</p>
                     <p className="text-[10px] text-zinc-600 font-mono mt-1 px-4">Automatically scan sources for claims, dates, and evidence.</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
