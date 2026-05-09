import React, { useState, useEffect } from "react";
import { DollarSign, TrendingUp, BarChart3, AlertCircle } from "lucide-react";
import { useAuth } from "@/src/lib/auth-context";

export const MonetizationDashboard = () => {
    const { activeWorkspace, activeChannel } = useAuth();
    
    const mockMetrics = {
        monthlyEstimated: 12450.00,
        adsense: 4200.00,
        sponsorships: 7000.00,
        affiliates: 1250.00,
        yoyGrowth: "+18%",
        activeDeals: 3,
        prospects: 12
    };

    if (!activeWorkspace || !activeChannel) return null;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold font-display text-zinc-100">Revenue Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-charcoal border border-brand-teal/30 rounded-2xl p-5 shadow-[0_0_15px_-3px_rgba(20,184,166,0.1)]">
                    <div className="text-xs font-mono text-zinc-400 uppercase mb-2">30-Day Estimated</div>
                    <div className="text-3xl font-light text-brand-teal">${mockMetrics.monthlyEstimated.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                    <div className="text-xs text-brand-teal flex items-center gap-1 mt-2">
                        <TrendingUp className="w-3 h-3" /> {mockMetrics.yoyGrowth} vs last month
                    </div>
                </div>
                <div className="bg-smoke/30 border border-white/5 rounded-2xl p-5">
                    <div className="text-xs font-mono text-zinc-500 uppercase mb-2">AdSense Base</div>
                    <div className="text-2xl font-light text-zinc-100">${mockMetrics.adsense.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                    <div className="text-xs text-zinc-500 mt-2">Provides the baseline floor</div>
                </div>
                <div className="bg-smoke/30 border border-white/5 rounded-2xl p-5">
                    <div className="text-xs font-mono text-zinc-500 uppercase mb-2">Sponsorships</div>
                    <div className="text-2xl font-light text-zinc-100">${mockMetrics.sponsorships.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                    <div className="text-xs text-zinc-500 flex justify-between mt-2">
                        <span>Active: {mockMetrics.activeDeals}</span>
                        <span>Prospects: {mockMetrics.prospects}</span>
                    </div>
                </div>
                <div className="bg-smoke/30 border border-white/5 rounded-2xl p-5">
                    <div className="text-xs font-mono text-zinc-500 uppercase mb-2">Affiliates & Members</div>
                    <div className="text-2xl font-light text-zinc-100">${mockMetrics.affiliates.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                    <div className="text-xs text-zinc-500 mt-2">High-margin recurring revenue</div>
                </div>
            </div>

            {/* Additional charts / attribution logic could live here */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div className="bg-smoke/20 border border-white/5 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-brand-teal" /> Revenue Attribution
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs text-zinc-400 mb-1">
                                <span>AdSense</span>
                                <span>33.7%</span>
                            </div>
                            <div className="h-2 w-full bg-charcoal rounded-full overflow-hidden">
                                <div className="h-full bg-blue-400/50 w-[33.7%] rounded-full"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs text-zinc-400 mb-1">
                                <span>Sponsorships</span>
                                <span>56.2%</span>
                            </div>
                            <div className="h-2 w-full bg-charcoal rounded-full overflow-hidden">
                                <div className="h-full bg-brand-teal w-[56.2%] rounded-full"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs text-zinc-400 mb-1">
                                <span>Affiliate & Links</span>
                                <span>10.1%</span>
                            </div>
                            <div className="h-2 w-full bg-charcoal rounded-full overflow-hidden">
                                <div className="h-full bg-purple-400/50 w-[10.1%] rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-charcoal/50 border border-amber-500/20 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-amber-500 mb-4 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> Monetization Action Items
                    </h3>
                    <ul className="space-y-3 text-sm text-zinc-300">
                        <li className="flex items-start gap-2">
                            <span className="w-2 h-2 mt-1.5 rounded-full bg-amber-500/50" />
                            <span><strong>BrandFit Check:</strong> Notion's contract expires next month. Needs renewal pitch.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-2 h-2 mt-1.5 rounded-full bg-amber-500/50" />
                            <span><strong>Affiliate Link Break:</strong> Amazon links in "Desk Setup 2023" are broken.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
