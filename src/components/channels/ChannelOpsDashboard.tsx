import React, { useState, useEffect } from "react";
import { Activity, PlaySquare, TrendingUp, AlertTriangle } from "lucide-react";
import { useAuth } from "@/src/lib/auth-context";

export const ChannelOpsDashboard = () => {
    const { activeWorkspace, activeChannel } = useAuth();
    
    // In production, these would be aggregated from your DB / external analytics snapshots
    const mockMetrics = {
        weeklyPlannedLongForm: "N/A",
        weeklyPlannedShorts: "N/A",
        backlogDepth: "N/A", // Ideas & Scripts
        publishConsistency: "N/A",
        topicWinRate: "N/A",
        shortsToLongConversion: "N/A",
        avgCtr: "N/A",
        avgViewDuration: "N/A",
        retention30s: "N/A",
        retention50pct: "N/A",
        unresolvedPostmortems: "N/A"
    };

    if (!activeWorkspace || !activeChannel) return null;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-display text-zinc-100 flex items-center gap-3">
                        <Activity className="w-6 h-6 text-brand-teal" />
                        Channel Operations
                    </h1>
                    <p className="text-sm text-zinc-400 mt-1">Holistic performance & publishing throughput.</p>
                </div>
            </div>

            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">Data unavailable. Pending analytics backend integration.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 opacity-50 pointer-events-none">
                <div className="bg-smoke/30 border border-white/5 rounded-2xl p-5">
                    <div className="text-xs font-mono text-zinc-500 uppercase mb-2">Backlog Depth</div>
                    <div className="text-3xl font-light text-zinc-100">{mockMetrics.backlogDepth}</div>
                    <div className="text-xs text-zinc-400 mt-2">Active scripts/ideas</div>
                </div>
                <div className="bg-smoke/30 border border-white/5 rounded-2xl p-5">
                    <div className="text-xs font-mono text-zinc-500 uppercase mb-2">Publish Consist.</div>
                    <div className="text-3xl font-light text-brand-teal">{mockMetrics.publishConsistency}</div>
                    <div className="text-xs text-zinc-400 mt-2">Last 30 days</div>
                </div>
                <div className="bg-smoke/30 border border-white/5 rounded-2xl p-5">
                    <div className="text-xs font-mono text-zinc-500 uppercase mb-2">Topic Win Rate</div>
                    <div className="text-3xl font-light text-zinc-100">{mockMetrics.topicWinRate}</div>
                    <div className="text-xs text-zinc-400 mt-2">Hit target benchmarks</div>
                </div>
                <div className="bg-smoke/30 border border-white/5 rounded-2xl p-5">
                    <div className="text-xs font-mono text-zinc-500 uppercase mb-2">Unresolved POSTM.</div>
                    <div className={`text-3xl font-light text-zinc-100`}>{mockMetrics.unresolvedPostmortems}</div>
                    <div className="text-xs text-zinc-400 mt-2">Requires attention</div>
                </div>
            </div>

            <h2 className="text-lg font-semibold text-zinc-100 pt-4">Global Benchmarks</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 opacity-50 pointer-events-none">
                 <div className="bg-charcoal border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors">
                     <div className="flex items-center gap-3 mb-4 text-zinc-300">
                         <PlaySquare className="w-5 h-5 text-brand-teal" />
                         <span className="font-semibold text-sm">Packaging Health</span>
                     </div>
                     <div className="space-y-4">
                         <div>
                             <div className="flex justify-between text-xs text-zinc-400 mb-1">
                                 <span>Average CTR</span>
                                 <span>{mockMetrics.avgCtr}</span>
                             </div>
                             <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                 <div className="h-full bg-brand-teal w-0 rounded-full"></div>
                             </div>
                         </div>
                     </div>
                 </div>

                 <div className="bg-charcoal border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors">
                     <div className="flex items-center gap-3 mb-4 text-zinc-300">
                         <TrendingUp className="w-5 h-5 text-brand-teal" />
                         <span className="font-semibold text-sm">Retention Health</span>
                     </div>
                     <div className="space-y-4">
                         <div>
                             <div className="flex justify-between text-xs text-zinc-400 mb-1">
                                 <span>30s Retention</span>
                                 <span>{mockMetrics.retention30s}</span>
                             </div>
                             <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                 <div className="h-full bg-brand-teal w-0 rounded-full"></div>
                             </div>
                         </div>
                         <div>
                             <div className="flex justify-between text-xs text-zinc-400 mb-1">
                                 <span>50% Mark Retention</span>
                                 <span>{mockMetrics.retention50pct}</span>
                             </div>
                             <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                 <div className="h-full bg-brand-teal w-0 rounded-full"></div>
                             </div>
                         </div>
                     </div>
                 </div>
            </div>
        </div>
    );
};
