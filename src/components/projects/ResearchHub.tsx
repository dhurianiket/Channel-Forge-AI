import React, { useState, useEffect } from "react";
import { useAuth } from "@/src/lib/auth-context";
import { Project, FactCard } from "@/src/types";
import { listFactCards, createFactCard, updateFactCard, deleteFactCard } from "@/src/lib/db/research";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Database, Plus, Link as LinkIcon, Trash2, CheckCircle2, ShieldAlert } from "lucide-react";

interface ResearchHubProps {
  project: Project;
  onUpdate: () => void;
}

export const ResearchHub = ({ project, onUpdate }: ResearchHubProps) => {
  const { activeWorkspace, activeChannel } = useAuth();
  const [facts, setFacts] = useState<FactCard[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newClaim, setNewClaim] = useState("");
  const [newSourceUrl, setNewSourceUrl] = useState("");
  const [isSpeculative, setIsSpeculative] = useState(false);

  useEffect(() => {
    async function load() {
      if (activeWorkspace && activeChannel) {
        setLoading(true);
        const data = await listFactCards(activeWorkspace.id, activeChannel.id, project.id);
        setFacts(data);
        setLoading(false);
      }
    }
    load();
  }, [project.id, activeWorkspace, activeChannel]);

  const handleAdd = async () => {
    if (!activeWorkspace || !activeChannel || !newClaim.trim()) return;
    const fact = await createFactCard(activeWorkspace.id, activeChannel.id, project.id, {
      claim: newClaim,
      summary: "Generated summary",
      sourceUrl: newSourceUrl,
      sourceLabel: newSourceUrl ? "External Source" : "Unknown",
      confidence: isSpeculative ? 40 : 90,
      isSpeculative,
      approvedForScript: false,
    });
    setFacts([fact, ...facts]);
    setNewClaim("");
    setNewSourceUrl("");
    setIsSpeculative(false);
  };

  const handleToggleApproval = async (factId: string, current: boolean) => {
    if (!activeWorkspace || !activeChannel) return;
    await updateFactCard(activeWorkspace.id, activeChannel.id, project.id, factId, {
      approvedForScript: !current
    });
    setFacts(facts.map(f => f.id === factId ? { ...f, approvedForScript: !current } : f));
  };

  const handleDelete = async (factId: string) => {
    if (!activeWorkspace || !activeChannel) return;
    await deleteFactCard(activeWorkspace.id, activeChannel.id, project.id, factId);
    setFacts(facts.filter(f => f.id !== factId));
  };

  if (loading) return <div className="p-8 text-center text-zinc-500">Loading research...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-brand-teal" />
            Research Hub
          </h2>
          <p className="text-sm text-zinc-400">Collect and verify facts for your script.</p>
        </div>
      </div>

      <div className="p-4 bg-charcoal border border-white/5 rounded-xl space-y-3">
        <Textarea 
          value={newClaim}
          onChange={e => setNewClaim(e.target.value)}
          placeholder="New fact or claim..."
          className="bg-obsidian border-white/10 resize-none"
        />
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
             <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input 
              value={newSourceUrl}
              onChange={e => setNewSourceUrl(e.target.value)}
              placeholder="Source URL (optional)..."
              className="pl-9 bg-obsidian border-white/10"
            />
          </div>
          <div className="flex items-center gap-2 px-3 py-2 border border-white/5 rounded-md bg-obsidian cursor-pointer hover:bg-smoke/30" onClick={() => setIsSpeculative(!isSpeculative)}>
            <input type="checkbox" checked={isSpeculative} readOnly className="rounded border-none outline-none accent-yellow-500 w-4 h-4" />
            <span className="text-sm text-zinc-300">Speculative Theory</span>
          </div>
          <Button onClick={handleAdd} className="bg-brand-teal text-obsidian shrink-0">
            <Plus className="w-4 h-4 mr-2" /> Add Fact
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {facts.map((fact) => (
          <div key={fact.id} className="p-5 rounded-xl border bg-charcoal border-white/5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <div className="flex gap-2 mb-2">
                   {fact.isSpeculative ? (
                     <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-500 text-[10px] font-mono tracking-widest uppercase flex items-center gap-1">
                       <ShieldAlert className="w-3 h-3" /> Speculative
                     </span>
                   ) : (
                     <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-500 text-[10px] font-mono tracking-widest uppercase flex items-center gap-1">
                       <CheckCircle2 className="w-3 h-3" /> Verified ({fact.confidence}%)
                     </span>
                   )}
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(fact.id)} className="h-6 w-6 text-zinc-500 hover:text-red-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <p className="text-sm text-zinc-200 mb-3">{fact.claim}</p>
              {fact.sourceUrl && (
                <a href={fact.sourceUrl} target="_blank" rel="noreferrer" className="text-xs text-brand-teal hover:underline flex items-center gap-1 mb-4 truncate">
                  <LinkIcon className="w-3 h-3" /> {fact.sourceLabel || fact.sourceUrl}
                </a>
              )}
            </div>

            <div className="pt-3 border-t border-white/5 flex justify-between items-center mt-2">
               <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">For Script</span>
               <Button 
                variant="outline" 
                size="sm" 
                className={`h-7 text-xs px-3 ${fact.approvedForScript ? 'border-green-500 text-green-400 bg-green-500/10' : 'border-white/10 text-zinc-400 hover:text-white'}`}
                onClick={() => handleToggleApproval(fact.id, fact.approvedForScript)}
               >
                 {fact.approvedForScript ? "Approved" : "Mark Approved"}
               </Button>
            </div>
          </div>
        ))}
        {facts.length === 0 && (
          <div className="col-span-full py-12 text-center border border-dashed border-white/10 rounded-xl text-zinc-500 text-sm">
            No research facts added yet.
          </div>
        )}
      </div>
    </div>
  );
};
