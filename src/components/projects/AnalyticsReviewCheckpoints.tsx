import React, { useState, useEffect } from "react";
import { BarChart3, CheckCircle2, Clock } from "lucide-react";
import { AnalyticsReview } from "@/src/types";

// In a real implementation this would fetch & display the actual views/reviews from Firestore
export const AnalyticsReviewCheckpoints = ({ projectId }: { projectId: string }) => {
  const [reviews, setReviews] = useState<AnalyticsReview[]>([]);

  useEffect(() => {
    // mock fetching reviews
    setReviews([
      { id: "rev_1", projectId, workspaceId: "", channelId: "", youtubeVideoId: "vid_1", checkpoint: "48h", status: "PENDING", createdAt: Date.now() },
      { id: "rev_2", projectId, workspaceId: "", channelId: "", youtubeVideoId: "vid_1", checkpoint: "7d", status: "PENDING", createdAt: Date.now() },
      { id: "rev_3", projectId, workspaceId: "", channelId: "", youtubeVideoId: "vid_1", checkpoint: "28d", status: "PENDING", createdAt: Date.now() },
    ]);
  }, [projectId]);

  return (
    <div className="bg-charcoal/50 rounded-2xl border border-white/5 p-6 hover:border-white/10 transition-colors">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-brand-teal/20 text-brand-teal flex items-center justify-center">
          <BarChart3 className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">Analytics Checkpoints</h2>
          <p className="text-xs text-zinc-400">Post-publish manual review schedule</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {reviews.map(rev => (
          <div key={rev.id} className="p-4 bg-smoke border border-white/5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-brand-teal" />
              <div>
                <div className="text-sm font-medium text-zinc-200 uppercase tracking-widest font-mono">
                  {rev.checkpoint} Review
                </div>
                <div className="text-xs text-zinc-500">
                  Status: {rev.status}
                </div>
              </div>
            </div>

            <button disabled={rev.status === "COMPLETED"} className="px-4 py-2 bg-brand-teal/10 hover:bg-brand-teal/20 text-brand-teal text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 max-w-fit disabled:opacity-50">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {rev.status === "COMPLETED" ? "Completed" : "Start Review"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
