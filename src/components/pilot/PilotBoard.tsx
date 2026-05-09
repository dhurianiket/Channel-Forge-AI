import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Compass, Clock, Video, ListChecks, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "@/src/lib/auth-context";
import { Project, ProjectStage } from "@/src/types";
import { listProjects } from "@/src/lib/db/projects";

export const PilotBoard = () => {
  const { activeWorkspace, activeChannel } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeWorkspace || !activeChannel) return;
    const fetchProjects = async () => {
      try {
        const data = await listProjects(activeWorkspace.id, activeChannel.id);
        const activePilotProjects = data.filter(p => p.status === "ACTIVE" || p.status === "DRAFT");
        setProjects(activePilotProjects);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [activeWorkspace, activeChannel]);

  if (!activeWorkspace || !activeChannel) return null;

  const groupedByStage = {
    planning: projects.filter(p => [ProjectStage.IDEA, ProjectStage.RESEARCH, ProjectStage.SCRIPT, ProjectStage.FACT_CHECK, ProjectStage.VISUAL_PLAN].includes(p.currentStage)),
    production: projects.filter(p => [ProjectStage.VOICE, ProjectStage.EDIT_QA].includes(p.currentStage)),
    publishing: projects.filter(p => [ProjectStage.METADATA, ProjectStage.READY_TO_PUBLISH].includes(p.currentStage)),
    published: projects.filter(p => [ProjectStage.PUBLISHED, ProjectStage.ANALYZED].includes(p.currentStage)),
  };

  const Column = ({ title, items, icon: Icon }: { title: string, items: Project[], icon: any }) => (
    <div className="bg-smoke/30 rounded-2xl border border-white/5 flex flex-col h-[700px] overflow-hidden">
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-charcoal/50">
        <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
          <Icon className="w-4 h-4 text-brand-teal" />
          {title}
        </h3>
        <div className="bg-white/10 text-zinc-300 text-xs px-2 py-0.5 rounded-full font-mono">{items.length}</div>
      </div>
      <div className="p-3 flex-1 overflow-y-auto space-y-3">
        {items.map(p => (
          <Link key={p.id} to={`/projects/${p.id}`} className="block bg-charcoal border border-white/10 rounded-xl p-4 hover:border-brand-teal/50 transition-colors group">
            <h4 className="text-sm font-medium text-zinc-100 group-hover:text-brand-teal transition-colors line-clamp-1">{p.title || 'Untitled Project'}</h4>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 bg-brand-teal/10 text-brand-teal rounded">
                {p.currentStage.replace('_', ' ')}
              </div>
              <div className="text-xs text-zinc-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(p.updatedAt).toLocaleDateString()}
              </div>
            </div>
            
            {p.publishStatus === "PUBLISHED" && (
                <div className="mt-3 text-xs text-brand-orange flex items-center gap-1 bg-brand-orange/10 px-2 py-1 rounded">
                    <CheckCircle2 className="w-3 h-3" />
                    Needs Analytics Review
                </div>
            )}
          </Link>
        ))}
        {items.length === 0 && (
          <div className="p-4 text-center text-zinc-500 text-sm italic">Empty</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-zinc-100 flex items-center gap-3">
            <Compass className="w-6 h-6 text-brand-teal" />
            Live Pilot Board
          </h1>
          <p className="text-sm text-zinc-400 mt-1">Track the 3-5 active long-form pilot projects through the governed flow.</p>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse bg-smoke border border-white/5 rounded-2xl h-[400px]" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Column title="Planning & Scripts" items={groupedByStage.planning} icon={ListChecks} />
          <Column title="Production & Edit QA" items={groupedByStage.production} icon={Video} />
          <Column title="Pre-Publish & Meta" items={groupedByStage.publishing} icon={ListChecks} />
          <Column title="Live & Analytics (48h/7d)" items={groupedByStage.published} icon={CheckCircle2} />
        </div>
      )}
    </div>
  );
};
