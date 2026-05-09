import React, { useState, useEffect } from "react";
import { Copy, Plus, Star, Link as LinkIcon, DollarSign } from "lucide-react";
import { Project, Sponsor, SponsorshipDeal, AffiliateLink, RevenueRecord } from "@/src/types";
import { useAuth } from "@/src/lib/auth-context";
import { getSponsors, getSponsorshipDeals, getAffiliateLinks, getRevenueRecordsForProject } from "@/src/lib/db/monetization";
import { updateProject } from "@/src/lib/db/projects";

interface Props {
  project: Project;
}

export const ProjectMonetizationPanel = ({ project }: Props) => {
    const { activeWorkspace, activeChannel } = useAuth();
    
    const [deals, setDeals] = useState<SponsorshipDeal[]>([]);
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [links, setLinks] = useState<AffiliateLink[]>([]);
    const [revenue, setRevenue] = useState<RevenueRecord[]>([]);

    const [membership, setMembership] = useState(project.membershipTier || "PUBLIC");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!activeWorkspace || !activeChannel) return;
        
        const load = async () => {
            const [dl, sp, lk, rev] = await Promise.all([
                getSponsorshipDeals(activeWorkspace.id, activeChannel.id),
                getSponsors(activeWorkspace.id, activeChannel.id),
                getAffiliateLinks(activeWorkspace.id, activeChannel.id),
                getRevenueRecordsForProject(activeWorkspace.id, activeChannel.id, project.id)
            ]);

            setDeals(dl.filter(d => d.projectId === project.id || (project.sponsorDealIds && project.sponsorDealIds.includes(d.id))));
            setSponsors(sp);
            setLinks(lk);
            setRevenue(rev);
        };
        load();
    }, [activeWorkspace, activeChannel, project]);

    const handleSaveMembership = async () => {
        if (!activeWorkspace || !activeChannel) return;
        setIsSaving(true);
        try {
            await updateProject(activeWorkspace.id, activeChannel.id, project.id, {
                membershipTier: membership as "PUBLIC" | "EARLY_ACCESS" | "MEMBERS_ONLY"
            });
        } catch (e) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    const totalRevenue = revenue.reduce((sum, r) => sum + r.amount, 0);

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold font-display text-zinc-100 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-brand-teal" /> Video Monetization & Strategy
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-charcoal/50 border border-white/5 rounded-2xl p-5">
                    <h3 className="font-semibold text-zinc-100 mb-4 flex items-center gap-2">
                        <Star className="w-4 h-4 text-emerald-400" /> Member Content Access
                    </h3>
                    <select
                        value={membership}
                        onChange={(e) => setMembership(e.target.value)}
                        className="w-full bg-smoke border border-white/10 rounded-lg p-2.5 text-zinc-200 outline-none text-sm mb-4"
                    >
                        <option value="PUBLIC">Public (Default)</option>
                        <option value="EARLY_ACCESS">Early Access for Members</option>
                        <option value="MEMBERS_ONLY">Members Only Exclusive</option>
                    </select>

                    <button 
                        onClick={handleSaveMembership}
                        disabled={isSaving || membership === project.membershipTier}
                        className="w-full py-2 bg-brand-teal text-charcoal text-sm font-semibold rounded-lg hover:bg-brand-teal/90 disabled:opacity-50"
                    >
                        {isSaving ? "Saving..." : "Update Tier"}
                    </button>
                    <p className="text-xs text-zinc-500 mt-3 text-center">Controls early release or paywalled state.</p>
                </div>

                <div className="bg-charcoal/50 border border-white/5 rounded-2xl p-5">
                    <h3 className="font-semibold text-zinc-100 mb-4 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-brand-teal" /> Revenue Attribution
                    </h3>
                    <div className="text-3xl font-light text-brand-teal mb-4">
                        ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    
                    <div className="space-y-2">
                        {revenue.map(r => (
                            <div key={r.id} className="flex justify-between items-center text-sm p-2 bg-smoke/50 rounded-lg border border-white/5">
                                <span className="text-zinc-300 capitalize">{r.revenueType.toLowerCase()}</span>
                                <span className="font-mono text-zinc-400">${r.amount.toFixed(2)}</span>
                            </div>
                        ))}
                        {revenue.length === 0 && <p className="text-xs text-zinc-500">No revenue logged yet.</p>}
                    </div>
                    <button className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-zinc-300 mt-4 transition-colors">
                        + Add Record
                    </button>
                </div>
            </div>

            <div className="bg-smoke/30 border border-white/5 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-semibold text-zinc-100">Brand Deals for Video</h3>
                    <button className="px-3 py-1.5 bg-brand-teal/10 text-brand-teal text-xs font-semibold rounded hover:bg-brand-teal/20 transition-colors">
                        Link Deal
                    </button>
                </div>
                
                {deals.length === 0 ? (
                    <p className="text-sm text-zinc-500 text-center py-4">No active brand deals for this video.</p>
                ) : (
                    <div className="space-y-3">
                        {deals.map(deal => {
                            const sp = sponsors.find(s => s.id === deal.sponsorId);
                            return (
                                <div key={deal.id} className="p-4 bg-charcoal border border-white/5 rounded-xl flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-zinc-200">{sp?.name || "Unknown Sponsor"}</div>
                                        <div className="text-xs text-zinc-500 mt-1">{deal.deliverables}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-brand-teal font-mono">${deal.amount.toLocaleString()}</div>
                                        <div className="text-[10px] uppercase font-mono text-zinc-500 mt-1">{deal.status}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="bg-smoke/30 border border-white/5 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-semibold text-zinc-100">Affiliate Placements</h3>
                    <button className="px-3 py-1.5 bg-brand-teal/10 text-brand-teal text-xs font-semibold rounded hover:bg-brand-teal/20 transition-colors">
                        Add Placement
                    </button>
                </div>
                
                {(!project.affiliateLinkIds || project.affiliateLinkIds.length === 0) ? (
                    <p className="text-sm text-zinc-500 text-center py-4">No specific affiliate links tagged.</p>
                ) : (
                    <div className="space-y-3">
                        {project.affiliateLinkIds.map(id => {
                            const link = links.find(l => l.id === id);
                            if (!link) return null;
                            return (
                                <div key={link.id} className="p-3 bg-charcoal border border-white/5 rounded-xl flex items-center justify-between">
                                    <div className="flex gap-3 items-center">
                                        <LinkIcon className="w-4 h-4 text-zinc-500" />
                                        <span className="text-sm text-zinc-200">{link.productName}</span>
                                    </div>
                                    <button className="text-zinc-400 hover:text-zinc-200"><Copy className="w-4 h-4" /></button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
