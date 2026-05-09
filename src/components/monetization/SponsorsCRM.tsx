import React, { useState, useEffect } from "react";
import { Plus, Search, Shield } from "lucide-react";
import { useAuth } from "@/src/lib/auth-context";
import { Sponsor, SponsorshipDeal } from "@/src/types";
import { getSponsors, getSponsorshipDeals } from "@/src/lib/db/monetization";

export const SponsorsCRM = () => {
    const { activeWorkspace, activeChannel } = useAuth();
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [deals, setDeals] = useState<SponsorshipDeal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!activeWorkspace || !activeChannel) return;
        const load = async () => {
            try {
                const [sp, dl] = await Promise.all([
                    getSponsors(activeWorkspace.id, activeChannel.id),
                    getSponsorshipDeals(activeWorkspace.id, activeChannel.id)
                ]);
                setSponsors(sp);
                setDeals(dl);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [activeWorkspace, activeChannel]);

    if (!activeWorkspace) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-xl font-bold font-display text-zinc-100">Sponsor CRM</h2>
                    <p className="text-sm text-zinc-400">Manage brand deals, align fit scores, and track pipeline.</p>
                </div>
                <button className="px-4 py-2 bg-brand-teal text-charcoal text-sm font-semibold rounded-lg hover:bg-brand-teal/90 transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    New Prospect
                </button>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" placeholder="Search brands..." className="w-full pl-9 pr-4 py-2 bg-charcoal border border-white/10 rounded-lg text-sm text-zinc-200 outline-none focus:border-brand-teal" />
                </div>
            </div>

            <div className="bg-charcoal/50 rounded-2xl border border-white/5 overflow-hidden">
                <table className="w-full text-left text-sm text-zinc-400">
                    <thead className="bg-smoke/50 text-xs uppercase font-mono text-zinc-500 border-b border-white/5">
                        <tr>
                            <th className="px-6 py-4">Brand</th>
                            <th className="px-6 py-4">Industry</th>
                            <th className="px-6 py-4">Brand-Fit Score</th>
                            <th className="px-6 py-4">Active Deals</th>
                            <th className="px-6 py-4 text-right">Settings</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                             <tr><td colSpan={5} className="px-6 py-4 text-center">Loading...</td></tr>
                        ) : sponsors.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-8 text-center text-zinc-500">No sponsors found. Add a prospect.</td></tr>
                        ) : sponsors.map(s => {
                            const sponsorDeals = deals.filter(d => d.sponsorId === s.id);
                            return (
                                <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-zinc-200">{s.name}</div>
                                        <div className="text-xs text-zinc-500">{s.contactEmail}</div>
                                    </td>
                                    <td className="px-6 py-4">{s.industry}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div className={`h-full ${s.brandFitScore > 75 ? 'bg-brand-teal' : s.brandFitScore > 40 ? 'bg-amber-400' : 'bg-red-400'}`} style={{width: `${s.brandFitScore}%`}} />
                                            </div>
                                            <span className="text-xs font-mono">{s.brandFitScore}/100</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {sponsorDeals.length > 0 ? (
                                             <span className="px-2 py-1 bg-brand-teal/10 text-brand-teal rounded font-mono text-[10px] uppercase tracking-wider">
                                                 {sponsorDeals.length} Deals
                                             </span>
                                        ) : (
                                            <span className="text-zinc-500 text-xs">None</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-zinc-500 hover:text-zinc-300">Edit</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
