import React, { useState, useEffect } from "react";
import { useAuth } from "@/src/lib/auth-context";
import { Project, PublishJob } from "@/src/types";
import { listPublishJobs, createPublishJob } from "@/src/lib/db/publish";
import { getMetadataPackage } from "@/src/lib/db/metadata";
import { updateProject } from "@/src/lib/db/projects";
import { Dispatcher } from "@/src/lib/jobs/dispatcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadCloud, Calendar, Clock, AlertTriangle, PlayCircle } from "lucide-react";

interface PublishCenterProps {
  project: Project;
  onUpdate: () => void;
}

export const PublishCenter = ({ project, onUpdate }: PublishCenterProps) => {
  const { activeWorkspace, activeChannel, user } = useAuth();
  const [jobs, setJobs] = useState<PublishJob[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [scheduleDate, setScheduleDate] = useState("");
  const [visibility, setVisibility] = useState<"PRIVATE" | "UNLISTED" | "PUBLIC">("PRIVATE");
  const [disclosureConfirmed, setDisclosureConfirmed] = useState(false);

  const load = async () => {
      if (activeWorkspace && activeChannel) {
        setLoading(true);
        const data = await listPublishJobs(activeWorkspace.id, activeChannel.id, project.id);
        setJobs(data);
        // Default schedule date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setScheduleDate(tomorrow.toISOString().split('T')[0] + 'T09:00');
        setLoading(false);
      }
  };

  useEffect(() => {
    load();
  }, [project.id, activeWorkspace, activeChannel]);

  const handlePublish = async () => {
      if (!activeWorkspace || !activeChannel || !user || !project.approvedRoughCutId || !project.metadataStatus || project.metadataStatus !== "APPROVED") return;
      
      const metadata = await getMetadataPackage(activeWorkspace.id, activeChannel.id, project.id);
      if (!metadata) return;

      const job = await createPublishJob(activeWorkspace.id, activeChannel.id, project.id, {
          roughCutId: project.approvedRoughCutId,
          metadataId: metadata.id,
          title: metadata.chosenTitle,
          description: metadata.description,
          tags: metadata.tags,
          visibility,
          scheduledFor: new Date(scheduleDate).getTime(),
          status: "SCHEDULED",
          syntheticDisclosureRequired: true, // Assuming AI generated voice/content
          syntheticDisclosureConfirmed: disclosureConfirmed
      });

      await Dispatcher.dispatchPublish(
          activeWorkspace.id, 
          activeChannel.id, 
          project.id, 
          job.id, 
          metadata, 
          null, // videoUrl could come from rough cut if needed
          user.uid
      );
      
      await load();
      onUpdate();
  };

  if (loading) return <div className="p-8 text-center text-zinc-500">Loading publish center...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-white flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-red-500" />
            Publish Center
          </h2>
          <p className="text-sm text-zinc-400">Schedule execution and YouTube integration.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-charcoal border border-white/5 rounded-xl p-6 space-y-6">
             <h3 className="font-medium text-white border-b border-white/5 pb-2">Publish Settings</h3>
             
             <div className="space-y-4">
                 <div className="space-y-2">
                     <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Visibility</label>
                     <select 
                        className="w-full bg-obsidian border border-white/10 rounded-md p-2 text-sm text-zinc-200 outline-none focus:border-red-500"
                        value={visibility}
                        onChange={e => setVisibility(e.target.value as any)}
                     >
                         <option value="PRIVATE">Private</option>
                         <option value="UNLISTED">Unlisted</option>
                         <option value="PUBLIC">Public</option>
                     </select>
                 </div>
                 
                 <div className="space-y-2">
                     <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Schedule For</label>
                     <div className="relative">
                         <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                         <Input 
                            type="datetime-local" 
                            className="pl-9 bg-obsidian border-white/10"
                            value={scheduleDate}
                            onChange={e => setScheduleDate(e.target.value)}
                         />
                     </div>
                 </div>

                 <div className="space-y-2 bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                     <div className="flex items-start gap-3">
                         <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                         <div>
                             <h4 className="text-sm font-medium text-red-100">YouTube Synthetic Content Disclosure</h4>
                             <p className="text-xs text-red-200/80 mt-1 mb-3">
                                 Because this video contains AI-generated voice or visuals, YouTube requires disclosure that the content is altered or synthetic.
                             </p>
                             <label className="flex items-center gap-2 cursor-pointer">
                                 <input 
                                    type="checkbox" 
                                    className="rounded border-none outline-none accent-red-500 w-4 h-4"
                                    checked={disclosureConfirmed}
                                    onChange={e => setDisclosureConfirmed(e.target.checked)}
                                 />
                                 <span className="text-sm text-zinc-300">I confirm the required disclosure flag should be set</span>
                             </label>
                         </div>
                     </div>
                 </div>
             </div>

             <div className="pt-4 border-t border-white/5">
                 <Button 
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium"
                    disabled={!disclosureConfirmed || project.metadataStatus !== "APPROVED"}
                    onClick={handlePublish}
                 >
                     <UploadCloud className="w-4 h-4 mr-2" />
                     Schedule Publication
                 </Button>
                 {project.metadataStatus !== "APPROVED" && (
                     <p className="text-center text-xs text-zinc-500 mt-2">Metadata must be approved before publishing.</p>
                 )}
             </div>
          </div>

          <div className="space-y-4">
               <h3 className="text-sm font-medium text-zinc-300 mb-2">Publish Jobs</h3>
               {jobs.map(job => (
                   <div key={job.id} className="p-4 rounded-xl border bg-charcoal border-white/5">
                       <div className="flex justify-between items-start mb-2">
                           <h4 className="font-medium text-zinc-200 text-sm line-clamp-1">{job.title}</h4>
                           <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full ${job.status === 'SCHEDULED' ? 'bg-blue-500/20 text-blue-400' : job.status === 'PUBLISHED' ? 'bg-green-500/20 text-green-400' : 'bg-zinc-500/20 text-zinc-400'}`}>
                               {job.status}
                           </span>
                       </div>
                       <div className="flex items-center gap-4 text-xs text-zinc-500 font-mono mb-3">
                           <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(job.scheduledFor || job.createdAt).toLocaleString()}</div>
                           <div>{job.visibility}</div>
                       </div>
                       {job.youtubeVideoId && (
                           <a href={`https://youtube.com/watch?v=${job.youtubeVideoId}`} target="_blank" rel="noreferrer" className="text-xs text-red-500 flex items-center hover:underline">
                               <PlayCircle className="w-3.5 h-3.5 mr-1" /> View on YouTube
                           </a>
                       )}
                   </div>
               ))}
               {jobs.length === 0 && (
                   <div className="py-12 border border-dashed border-white/10 rounded-xl text-center text-zinc-500 text-sm">
                       No publish logs available.
                   </div>
               )}
          </div>
      </div>
    </div>
  );
};
