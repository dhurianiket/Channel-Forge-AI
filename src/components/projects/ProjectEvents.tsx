import React, { useState, useEffect } from "react";
import { useAuth } from "@/src/lib/auth-context";
import { Project, ProjectEvent } from "@/src/types";
import { listEvents } from "@/src/lib/db/events";
import { Activity, Clock } from "lucide-react";

interface ProjectEventsProps {
  project: Project;
}

export const ProjectEvents = ({ project }: ProjectEventsProps) => {
  const { activeWorkspace, activeChannel } = useAuth();
  const [events, setEvents] = useState<ProjectEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (activeWorkspace && activeChannel) {
        setLoading(true);
        const data = await listEvents(activeWorkspace.id, activeChannel.id, project.id);
        setEvents(data);
        setLoading(false);
      }
    }
    load();
  }, [project.id, activeWorkspace, activeChannel]);

  if (loading) return <div className="p-4 text-center text-xs text-zinc-500">Loading events...</div>;
  
  if (events.length === 0) return (
      <div className="p-8 text-center text-zinc-500 border border-dashed border-white/10 rounded-xl">
          No events logged yet.
      </div>
  );

  return (
    <div className="space-y-4">
        {events.map((evt, idx) => (
            <div key={evt.id} className="relative pl-6 pb-4 border-l border-white/10 last:border-0 last:pb-0">
                <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-zinc-800 border border-zinc-500"></div>
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-zinc-200">{evt.message}</span>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(evt.createdAt).toLocaleString()}</span>
                        <span className="px-1.5 py-0.5 rounded bg-zinc-800 border border-white/5">{evt.actorType}</span>
                    </div>
                </div>
            </div>
        ))}
    </div>
  );
};
