import React, { useState, useEffect } from "react";
import { useAuth } from "@/src/lib/auth-context";
import { Project, Idea } from "@/src/types";
import { listIdeas, createIdea } from "@/src/lib/db/ideas";
import { setSelectedIdea as setProjectIdeaId } from "@/src/lib/db/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lightbulb, Plus, CheckCircle2, ChevronRight } from "lucide-react";
import { STAGE_LABELS } from "@/src/lib/workflow/stages";

interface IdeaEngineProps {
  project: Project;
  onUpdate: () => void;
}

export const IdeaEngine = ({ project, onUpdate }: IdeaEngineProps) => {
  const { activeWorkspace, activeChannel } = useAuth();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    async function load() {
      if (activeWorkspace && activeChannel) {
        setLoading(true);
        const data = await listIdeas(activeWorkspace.id, activeChannel.id, project.id);
        setIdeas(data);
        setLoading(false);
      }
    }
    load();
  }, [project.id, activeWorkspace, activeChannel]);

  const handleAdd = async () => {
    if (!activeWorkspace || !activeChannel || !newTitle.trim()) return;
    const idea = await createIdea(activeWorkspace.id, activeChannel.id, project.id, {
      title: newTitle,
      angle: "Generated angle based on title",
      hook: "Generated hook",
      scoreDemand: Math.floor(Math.random() * 50) + 50,
      scoreOriginality: Math.floor(Math.random() * 50) + 50,
      status: "DRAFT"
    });
    setIdeas([idea, ...ideas]);
    setNewTitle("");
  };

  const handleSelect = async (ideaId: string) => {
    if (!activeWorkspace || !activeChannel) return;
    await setProjectIdeaId(activeWorkspace.id, activeChannel.id, project.id, ideaId);
    onUpdate();
  };

  if (loading) return <div className="p-8 text-center text-zinc-500">Loading ideas...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Idea Engine
          </h2>
          <p className="text-sm text-zinc-400">Generate and evaluate concepts. Select one to proceed to Research.</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Input 
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          placeholder="New idea topic..."
          className="bg-charcoal border-white/10"
        />
        <Button onClick={handleAdd} className="bg-brand-teal text-obsidian whitespace-nowrap">
          <Plus className="w-4 h-4 mr-2" /> Add Idea
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ideas.map((idea) => {
          const isSelected = project.selectedIdeaId === idea.id;
          return (
            <div key={idea.id} className={`p-5 rounded-xl border ${isSelected ? 'bg-brand-teal/5 border-brand-teal' : 'bg-charcoal border-white/5'}`}>
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-zinc-200 line-clamp-2">{idea.title}</h3>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-brand-teal shrink-0" />}
              </div>
              <p className="text-xs text-zinc-400 mb-4 line-clamp-3">{idea.angle}</p>
              
              <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 mb-4">
                <div className="flex flex-col">
                  <span>Demand</span>
                  <span className={idea.scoreDemand > 70 ? "text-green-400" : "text-yellow-400"}>{idea.scoreDemand}/100</span>
                </div>
                <div className="flex flex-col">
                  <span>Originality</span>
                  <span className={idea.scoreOriginality > 70 ? "text-green-400" : "text-yellow-400"}>{idea.scoreOriginality}/100</span>
                </div>
              </div>

              {!isSelected ? (
                <Button 
                  onClick={() => handleSelect(idea.id)} 
                  variant="outline" 
                  className="w-full text-xs h-8 border-white/10 hover:border-brand-teal hover:text-brand-teal"
                >
                  Select Concept <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              ) : (
                <div className="text-center text-xs font-medium text-brand-teal py-1">
                 Active Concept
                </div>
              )}
            </div>
          );
        })}
        {ideas.length === 0 && (
          <div className="col-span-full py-12 text-center border border-dashed border-white/10 rounded-xl text-zinc-500 text-sm">
            No ideas generated yet. Start brainstorming.
          </div>
        )}
      </div>
    </div>
  );
}
