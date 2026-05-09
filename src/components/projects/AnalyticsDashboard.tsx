import React, { useState, useEffect } from "react";
import { useAuth } from "@/src/lib/auth-context";
import { Project, AnalyticsSnapshot } from "@/src/types";
import { listAnalyticsSnapshots } from "@/src/lib/db/analytics";
import { Dispatcher } from "@/src/lib/jobs/dispatcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BarChart3, TrendingUp, RefreshCw, Eye, ThumbsUp, MessageSquare, Users } from "lucide-react";
import { AnalyticsReviewCheckpoints } from "./AnalyticsReviewCheckpoints";

interface AnalyticsDashboardProps {
  project: Project;
  onUpdate: () => void;
}

export const AnalyticsDashboard = ({ project, onUpdate }: AnalyticsDashboardProps) => {
  const { activeWorkspace, activeChannel, user } = useAuth();
  const [snapshots, setSnapshots] = useState<AnalyticsSnapshot[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
      if (activeWorkspace && activeChannel) {
        setLoading(true);
        const data = await listAnalyticsSnapshots(activeWorkspace.id, activeChannel.id, project.id);
        setSnapshots(data);
        setLoading(false);
      }
  };

  useEffect(() => {
    load();
  }, [project.id, activeWorkspace, activeChannel]);

  const handleManualSync = async () => {
      if (!activeWorkspace || !activeChannel || !user) return;
      
      await Dispatcher.dispatchAnalyticsSync(
          activeWorkspace.id,
          activeChannel.id,
          project.id,
          project.youtubeVideoId || "xyz123",
          user.uid
      );

      await load();
      onUpdate();
  };

  if (loading) return <div className="p-8 text-center text-zinc-500">Loading analytics...</div>;

  const latest = snapshots[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-500" />
            Performance Analytics
          </h2>
          <p className="text-sm text-zinc-400">Track video performance and capture insights for future content.</p>
        </div>
        <Button onClick={handleManualSync} className="bg-charcoal border border-white/10 hover:bg-white/5 text-zinc-200">
            <RefreshCw className="w-4 h-4 mr-2" /> Sync YouTube API
        </Button>
      </div>

      {!latest ? (
          <div className="py-20 border border-dashed border-white/10 rounded-xl text-center flex flex-col items-center">
              <BarChart3 className="w-8 h-8 text-zinc-600 mb-3" />
              <p className="text-zinc-300 font-medium mb-1">No Data Available</p>
              <p className="text-sm text-zinc-500 max-w-sm">Video must be published and have received traffic to generate an analytics snapshot.</p>
          </div>
      ) : (
          <div className="space-y-6">
              {/* Topline Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-charcoal border border-white/5 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-zinc-500 text-xs uppercase font-mono mb-2"><Eye className="w-3.5 h-3.5" /> Views</div>
                      <div className="text-2xl font-semibold text-white">{latest.views.toLocaleString()}</div>
                  </div>
                  <div className="bg-charcoal border border-white/5 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-zinc-500 text-xs uppercase font-mono mb-2"><ThumbsUp className="w-3.5 h-3.5" /> Likes</div>
                      <div className="text-2xl font-semibold text-white">{latest.likes.toLocaleString()}</div>
                  </div>
                  <div className="bg-charcoal border border-white/5 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-zinc-500 text-xs uppercase font-mono mb-2"><TrendingUp className="w-3.5 h-3.5" /> CTR (%)</div>
                      <div className="text-2xl font-semibold text-white">{latest.ctr.toFixed(1)}%</div>
                  </div>
                  <div className="bg-charcoal border border-white/5 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-zinc-500 text-xs uppercase font-mono mb-2"><Users className="w-3.5 h-3.5" /> Subs Gained</div>
                      <div className="text-2xl font-semibold text-white">+{latest.subscribersGained.toLocaleString()}</div>
                  </div>
              </div>

              {/* Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-charcoal border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-6">
                      <h3 className="text-emerald-400 font-medium flex items-center gap-2 mb-3">
                          <TrendingUp className="w-4 h-4" /> AI Performance Summary
                      </h3>
                      <p className="text-sm text-emerald-100/70 leading-relaxed font-serif">
                          {latest.improvementSummary}
                      </p>
                  </div>
                  
                  <div className="bg-charcoal border border-white/5 rounded-xl p-6">
                       <h3 className="text-zinc-300 font-medium mb-4 text-sm">Key Retention Metrics</h3>
                       <div className="space-y-4">
                           <div>
                               <div className="flex justify-between text-xs text-zinc-500 mb-1">
                                   <span>Average Percentage Viewed</span>
                                   <span className="font-mono text-zinc-300">{latest.averagePercentageViewed.toFixed(1)}%</span>
                               </div>
                               <div className="h-1.5 bg-smoke rounded-full overflow-hidden">
                                   <div className="h-full bg-emerald-500" style={{ width: `${Math.min(latest.averagePercentageViewed, 100)}%` }}></div>
                               </div>
                           </div>
                           <div className="text-xs text-zinc-500 font-mono bg-obsidian p-2 rounded-lg border border-white/5">
                               Snapshot specific to ID: {latest.id.substring(0,8)} captured on {new Date(latest.capturedAt).toLocaleDateString()}
                           </div>
                       </div>
                  </div>
              </div>
              <div className="mt-8">
                  <AnalyticsReviewCheckpoints projectId={project.id} />
              </div>
          </div>
      )}
    </div>
  );
};
