import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, MoreHorizontal, Video, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StageBadge } from "./StageBadge";
import { useAuth } from "@/src/lib/auth-context";
import { listProjects, createProject } from "@/src/lib/db/projects";
import { Project, ProjectStage } from "@/src/types";

export const ProjectsList = () => {
  const { user, activeWorkspace, activeChannel } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadProjects = async () => {
    if (activeWorkspace && activeChannel) {
      setIsLoading(true);
      const data = await listProjects(activeWorkspace.id, activeChannel.id);
      setProjects(data);
      setIsLoading(false);
    } else {
      setProjects([]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [activeWorkspace, activeChannel]);

  const handleCreateProject = async () => {
    if (!activeWorkspace || !activeChannel || !user) return;
    await createProject(activeWorkspace.id, activeChannel.id, {
      title: "New Project",
      status: "DRAFT",
      createdBy: user.uid
    });
    await loadProjects();
  };

  if (!activeWorkspace || !activeChannel) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[50vh] text-center">
        <AlertCircle className="w-12 h-12 text-zinc-500 mb-4" />
        <h2 className="text-xl font-medium text-zinc-200 mb-2">No Workspace or Channel Selected</h2>
        <p className="text-zinc-500 max-w-md">You must select a workspace and a channel from the sidebar to view projects.</p>
      </div>
    );
  }

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-zinc-100 flex items-center gap-3">
            Projects <span className="text-zinc-600 font-light hidden sm:inline">| {activeChannel.name}</span>
          </h1>
          <p className="text-sm text-zinc-500 font-mono tracking-wide uppercase">
            {projects.length} Active Video Pipelines
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
           <div className="relative w-full sm:w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-brand-teal transition-colors" />
              <Input 
                className="pl-10 bg-charcoal/50 border-white/5 focus-visible:ring-brand-teal w-full" 
                placeholder="Search projects..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <Button variant="outline" className="bg-smoke/30 border-white/10 w-full sm:w-auto hidden sm:flex">
              <Filter className="w-4 h-4 mr-2" />
              Sort & Filter
           </Button>
           <Button onClick={handleCreateProject} className="bg-brand-teal text-obsidian gap-2 font-bold px-6 whitespace-nowrap w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              New Project
           </Button>
        </div>
      </div>

      {isLoading ? (
         <div className="flex justify-center items-center py-20">
           <div className="w-8 h-8 rounded-full border-2 border-brand-teal border-t-transparent animate-spin" />
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <div 
              key={project.id}
              onClick={() => { window.location.href = `/projects/${project.id}` }}
              className="bg-charcoal border border-white/5 rounded-xl p-5 hover:border-brand-teal/30 transition-all group cursor-pointer flex flex-col justify-between min-h-[160px]"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-zinc-200 font-medium line-clamp-2 leading-tight group-hover:text-brand-teal transition-colors">
                    {project.title}
                  </h3>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2 text-zinc-500 hover:text-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
                
                <StageBadge stage={project.currentStage} />
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(project.updatedAt).toLocaleDateString()}
                </div>
                
                <div className="flex -space-x-2">
                   {/* Placeholder for assignees or approvals */}
                   <div className="w-6 h-6 rounded-full bg-zinc-800 border-2 border-charcoal flex items-center justify-center text-[10px] text-zinc-400 font-medium">
                     AI
                   </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredProjects.length === 0 && (
            <div className="col-span-full py-12 text-center border border-dashed border-white/10 rounded-xl">
              <p className="text-zinc-500">No projects found. Create one to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
