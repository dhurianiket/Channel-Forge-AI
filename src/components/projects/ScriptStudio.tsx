import React, { useState, useEffect } from "react";
import { useAuth } from "@/src/lib/auth-context";
import { Project, ScriptVersion, ApprovalStatus, ProjectStage } from "@/src/types";
import { listScriptVersions, createScriptVersion, updateScriptVersion } from "@/src/lib/db/scripts";
import { setActiveScriptVersion, setApprovedScriptVersion } from "@/src/lib/db/projects";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Plus, CheckCircle2, History, Send } from "lucide-react";
import { ApprovalGate } from "./ApprovalGate";

interface ScriptStudioProps {
  project: Project;
  onUpdate: () => void;
}

export const ScriptStudio = ({ project, onUpdate }: ScriptStudioProps) => {
  const { activeWorkspace, activeChannel, user } = useAuth();
  const [versions, setVersions] = useState<ScriptVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  
  const [editingContent, setEditingContent] = useState("");

  const load = async () => {
    if (activeWorkspace && activeChannel) {
      setLoading(true);
      const data = await listScriptVersions(activeWorkspace.id, activeChannel.id, project.id);
      setVersions(data);
      if (!activeTab && data.length > 0) {
          setActiveTab(data[0].id);
          setEditingContent(data[0].fullText);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [project.id, activeWorkspace, activeChannel]);

  const handleDraftNew = async () => {
    if (!activeWorkspace || !activeChannel || !user) return;
    const v = await createScriptVersion(activeWorkspace.id, activeChannel.id, project.id, user.uid, {
        sourceIdeaId: project.selectedIdeaId,
        title: project.title,
        fullText: "New script draft..."
    });
    setVersions([v, ...versions]);
    setActiveTab(v.id);
    setEditingContent(v.fullText);
  };

  const currentVersion = versions.find(v => v.id === activeTab);

  const handleSave = async () => {
      if (!activeWorkspace || !activeChannel || !currentVersion) return;
      await updateScriptVersion(activeWorkspace.id, activeChannel.id, project.id, currentVersion.id, {
          fullText: editingContent
      });
      // also set as active if not already
      if (project.activeScriptVersionId !== currentVersion.id) {
          await setActiveScriptVersion(activeWorkspace.id, activeChannel.id, project.id, currentVersion.id);
          onUpdate();
      }
      await load();
  };

  if (loading) return <div className="p-8 text-center text-zinc-500">Loading script studio...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-teal" />
            Script Studio
          </h2>
          <p className="text-sm text-zinc-400">Draft, version, and refine the narrative based on research.</p>
        </div>
        <Button onClick={handleDraftNew} variant="outline" className="border-white/10 text-zinc-300">
            <Plus className="w-4 h-4 mr-2" /> New Version
        </Button>
      </div>

      <div className="flex gap-4 min-h-[500px]">
        {/* Version History Sidebar */}
        <div className="w-48 shrink-0 space-y-2 border-r border-white/5 pr-4">
            <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-1">
                <History className="w-3 h-3" /> History
            </h3>
            {versions.map(v => {
                const isActive = activeTab === v.id;
                const isProjectActive = project.activeScriptVersionId === v.id;
                const isProjectApproved = project.approvedScriptVersionId === v.id;

                return (
                    <button 
                        key={v.id} 
                        onClick={() => {
                            setActiveTab(v.id);
                            setEditingContent(v.fullText);
                        }}
                        className={`w-full text-left p-3 rounded-lg text-sm transition-colors border ${isActive ? 'bg-smoke border-white/10' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                    >
                        <div className="flex items-center justify-between font-medium">
                            <span className={isActive ? 'text-zinc-200' : 'text-zinc-400'}>v{v.versionNumber}.0</span>
                            {isProjectApproved ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                            ) : isProjectActive ? (
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-teal"></div>
                            ) : null}
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-1">
                            {new Date(v.updatedAt).toLocaleDateString()}
                        </div>
                    </button>
                )
            })}
            {versions.length === 0 && (
                <div className="text-xs text-zinc-500 text-center py-4">No drafts yet</div>
            )}
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col space-y-4">
            {currentVersion ? (
                <>
                    <ApprovalGate 
                      project={project} 
                      requiredStage={ProjectStage.SCRIPT} 
                      targetId={currentVersion.id}
                      targetType="script-version"
                      onStatusChange={onUpdate}
                    >
                        <div className="flex-1 flex flex-col bg-charcoal border border-white/5 rounded-xl overflow-hidden">
                            <div className="bg-smoke/30 border-b border-white/5 p-3 flex justify-between items-center">
                                <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Editor — v{currentVersion.versionNumber}.0</span>
                                <Button size="sm" onClick={handleSave} className="h-7 text-xs bg-brand-teal text-obsidian">Save Draft</Button>
                            </div>
                            <Textarea 
                                value={editingContent}
                                onChange={e => setEditingContent(e.target.value)}
                                className="flex-1 bg-transparent border-0 resize-none p-6 text-zinc-300 font-serif text-lg leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none shadow-none focus:outline-none"
                            />
                        </div>
                    </ApprovalGate>
                </>
            ) : (
                <div className="flex-1 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-zinc-500 flex-col">
                    <FileText className="w-8 h-8 mb-2 opacity-50" />
                    <p>Select or create a version to start writing</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
