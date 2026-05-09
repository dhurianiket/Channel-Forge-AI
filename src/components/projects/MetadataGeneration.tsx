import React, { useState, useEffect } from "react";
import { useAuth } from "@/src/lib/auth-context";
import { Project, MetadataPackage, ProjectStage } from "@/src/types";
import { getMetadataPackage, createMetadataPackage, updateMetadataPackage } from "@/src/lib/db/metadata";
import { getScriptVersion } from "@/src/lib/db/scripts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tags, CheckCircle2, Sparkles } from "lucide-react";
import { ApprovalGate } from "./ApprovalGate";

interface MetadataGenerationProps {
  project: Project;
  onUpdate: () => void;
}

export const MetadataGeneration = ({ project, onUpdate }: MetadataGenerationProps) => {
  const { activeWorkspace, activeChannel } = useAuth();
  const [pkg, setPkg] = useState<MetadataPackage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (activeWorkspace && activeChannel) {
        setLoading(true);
        const data = await getMetadataPackage(activeWorkspace.id, activeChannel.id, project.id);
        setPkg(data);
        setLoading(false);
      }
    }
    load();
  }, [project.id, activeWorkspace, activeChannel]);

  const handleGenerate = async () => {
      if (!activeWorkspace || !activeChannel) return;
      
      let titleBase = project.title;
      if (project.approvedScriptVersionId) {
          const script = await getScriptVersion(activeWorkspace.id, activeChannel.id, project.id, project.approvedScriptVersionId);
          if (script) titleBase = script.title;
      }
      
      const newPkg = await createMetadataPackage(activeWorkspace.id, activeChannel.id, project.id, {
          titleOptions: [
              `The Truth About ${titleBase}`,
              `${titleBase} Explained`,
              `Why ${titleBase} Changes Everything`
          ],
          chosenTitle: `The Truth About ${titleBase}`,
          description: "This video dives deep into the topic.\n\nSubscribe for more!",
          tags: ["documentary", "analysis"],
          hashtags: ["#video", "#analysis"],
          status: "DRAFT"
      });
      setPkg(newPkg);
  };

  const handleChange = async (field: keyof MetadataPackage, value: any) => {
      if (!pkg || !activeWorkspace || !activeChannel) return;
      const updated = { ...pkg, [field]: value };
      setPkg(updated);
      await updateMetadataPackage(activeWorkspace.id, activeChannel.id, project.id, pkg.id, { [field]: value });
  };

  if (loading) return <div className="p-8 text-center text-zinc-500">Loading metadata...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-white flex items-center gap-2">
            <Tags className="w-5 h-5 text-blue-500" />
            Metadata & Packaging
          </h2>
          <p className="text-sm text-zinc-400">Generate titles, descriptions, and tags for final upload.</p>
        </div>
        {!pkg && (
            <Button onClick={handleGenerate} className="bg-blue-600 text-white">
                <Sparkles className="w-4 h-4 mr-2" /> Generate Package
            </Button>
        )}
      </div>

      {pkg ? (
        <ApprovalGate 
           project={project} 
           requiredStage={ProjectStage.METADATA} 
           targetId={pkg.id} 
           targetType="metadata-package"
           onStatusChange={onUpdate}
        >
            <div className="bg-charcoal border border-white/5 rounded-xl p-6 space-y-6">
                
                <div className="space-y-3">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Selected Title</label>
                    <Input 
                        value={pkg.chosenTitle}
                        onChange={(e) => handleChange("chosenTitle", e.target.value)}
                        className="bg-obsidian border-white/10 text-lg font-medium"
                    />
                    
                    <div className="flex gap-2 flex-wrap mt-2">
                        {pkg.titleOptions.map((opt, i) => (
                            <button 
                                key={i}
                                onClick={() => handleChange("chosenTitle", opt)}
                                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${pkg.chosenTitle === opt ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' : 'bg-obsidian border-white/10 text-zinc-400 hover:text-zinc-200'}`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Description Boilerplate</label>
                        <Textarea 
                            value={pkg.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            className="bg-obsidian border-white/10 h-48 resize-none"
                        />
                    </div>
                    
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Tags (Comma separated)</label>
                            <Input 
                                value={pkg.tags.join(", ")}
                                onChange={(e) => handleChange("tags", e.target.value.split(",").map(t => t.trim()))}
                                className="bg-obsidian border-white/10"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Hashtags</label>
                            <Input 
                                value={pkg.hashtags.join(" ")}
                                onChange={(e) => handleChange("hashtags", e.target.value.split(" ").filter(t => t.startsWith("#")))}
                                className="bg-obsidian border-white/10"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </ApprovalGate>
      ) : (
          <div className="py-12 border border-dashed border-white/10 rounded-xl text-center text-zinc-500 text-sm">
             No metadata package exists yet.
          </div>
      )}
    </div>
  );
};
