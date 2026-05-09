import React from "react";
import { 
  ShieldCheck, 
  LayoutDashboard, 
  TrendingUp, 
  Clock, 
  Zap, 
  ArrowRight,
  Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { seedDemoData } from "@/src/services/seedData";
import { auth } from "@/src/lib/firebase";

export const Dashboard = () => {
  const handleSeed = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Please sign in first (Demo mode assume pro session)");
        // In a real app we'd redirect to login
        return;
      }
      await seedDemoData(user.uid);
      toast.success("Workspace seeded with demo channel and projects!");
    } catch (err) {
      toast.error("Seed failed. Check console.");
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
           <div className="flex items-center gap-2 text-brand-teal mb-1">
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] font-bold">Director's Overview</span>
           </div>
           <h1 className="text-4xl font-display font-bold">Welcome back, Director.</h1>
           <p className="text-zinc-500 text-sm">Your crew has 3 research briefs awaiting approval.</p>
        </div>
        
        <Button onClick={handleSeed} variant="outline" className="border-brand-teal/20 text-brand-teal gap-2 bg-brand-teal/5 w-full md:w-auto">
           <Database className="w-4 h-4" />
           Seed Demo Environment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
           { label: "Active Projects", value: "12", trend: "+2 this week" },
           { label: "Hours Generated", value: "4.2", trend: "+12% from last month" },
           { label: "Publish Success", value: "98%", trend: "Monetization: Safe" },
           { label: "Workspace Credits", value: "840", trend: "Renews in 12 days" },
        ].map((stat, i) => (
           <div key={i} className="glass-panel p-5 rounded-2xl space-y-2 group hover:border-brand-teal/30 transition-all cursor-default">
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-display font-bold text-zinc-100 group-hover:text-brand-teal transition-colors">{stat.value}</p>
              <p className="text-[10px] text-brand-teal/70 font-medium">{stat.trend}</p>
           </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Summary */}
        <div className="lg:col-span-2 glass-panel rounded-3xl overflow-hidden flex flex-col">
           <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-display font-medium text-lg flex items-center gap-2">
                 <Zap className="w-4 h-4 text-brand-teal" />
                 Production Pipeline
              </h3>
              <Button variant="ghost" size="sm" className="text-[10px] uppercase font-mono tracking-widest text-zinc-500">View Timeline</Button>
           </div>
           <div className="p-6 space-y-4">
              {[
                 { title: "The Rise of Silicon Mythology", stage: "Scripting", progress: 65, color: "bg-brand-teal" },
                 { title: "Why Architecture is Failing", stage: "Research", progress: 30, color: "bg-brand-orange" },
                 { title: "The Future of Space Habitats", stage: "Rough Cut", progress: 90, color: "bg-emerald-500" },
              ].map((proj, i) => (
                 <div key={i} className="space-y-3 p-5 rounded-2xl border border-white/5 hover:bg-white/5 transition-all cursor-pointer group">
                    <div className="flex items-center justify-between">
                       <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">{proj.title}</span>
                          <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                             <Clock className="w-3 h-3" />
                             Estimated Publish: 4 days
                          </div>
                       </div>
                       <Badge variant="outline" className="text-[8px] font-mono tracking-widest uppercase bg-smoke/50 text-zinc-400 border-white/10 group-hover:border-brand-teal/30 group-hover:text-brand-teal transition-all">
                          {proj.stage}
                       </Badge>
                    </div>
                    <div className="h-1.5 w-full bg-smoke/50 rounded-full overflow-hidden">
                       <div className={cn("h-full rounded-full transition-all duration-1000", proj.color)} style={{ width: `${proj.progress}%` }} />
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Tasks / Approvals */}
        <div className="glass-panel rounded-3xl p-6 space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="font-display font-medium text-lg">Urgent Approvals</h3>
              <Badge className="bg-brand-orange/10 text-brand-orange border-brand-orange/20 text-[10px]">3 New</Badge>
           </div>
           <div className="space-y-4">
              {[
                 { type: "Fact Pack", project: "Mars Colony VLog", time: "2h ago", status: "Priority" },
                 { type: "Script Draft", project: "Medieval Tech", time: "5h ago", status: "New" },
                 { type: "Thumbnail V2", project: "Coffee Secrets", time: "1d ago", status: "Follow-up" },
              ].map((task, i) => (
                 <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all group cursor-pointer border border-transparent hover:border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-smoke flex items-center justify-center text-brand-teal group-hover: molten-glow transition-all">
                       <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                       <span className="text-xs font-bold text-zinc-200">{task.type}</span>
                       <span className="text-[10px] text-zinc-500 truncate">{task.project}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                       <span className="text-[9px] font-mono text-zinc-600">{task.time}</span>
                       <span className={cn(
                          "text-[8px] uppercase tracking-widest font-bold",
                          task.status === "Priority" ? "text-brand-orange" : "text-zinc-500"
                       )}>{task.status}</span>
                    </div>
                 </div>
              ))}
           </div>
           <Button variant="outline" className="w-full border-white/10 text-[10px] font-bold uppercase tracking-widest py-6 hover:bg-white/5 transition-all">
              Manage Review Queue
              <ArrowRight className="w-4 h-4 ml-2" />
           </Button>
        </div>
      </div>
    </div>
  );
};
