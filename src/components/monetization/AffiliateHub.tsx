import React, { useState, useEffect } from "react";
import { Plus, Search, Copy, ExternalLink } from "lucide-react";
import { useAuth } from "@/src/lib/auth-context";
import { AffiliateLink } from "@/src/types";
import { getAffiliateLinks } from "@/src/lib/db/monetization";

export const AffiliateHub = () => {
    const { activeWorkspace, activeChannel } = useAuth();
    const [links, setLinks] = useState<AffiliateLink[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!activeWorkspace || !activeChannel) return;
        const load = async () => {
            try {
                const data = await getAffiliateLinks(activeWorkspace.id, activeChannel.id);
                setLinks(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [activeWorkspace, activeChannel]);

    if (!activeWorkspace || !activeChannel) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-xl font-bold font-display text-zinc-100">Affiliate Hub</h2>
                    <p className="text-sm text-zinc-400">Library of tracking links and recurring revenue products.</p>
                </div>
                <button className="px-4 py-2 bg-brand-teal text-charcoal text-sm font-semibold rounded-lg hover:bg-brand-teal/90 transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Link
                </button>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" placeholder="Search products..." className="w-full pl-9 pr-4 py-2 bg-charcoal border border-white/10 rounded-lg text-sm text-zinc-200 outline-none focus:border-brand-teal" />
                </div>
            </div>

            {loading ? (
                <div className="animate-pulse bg-smoke border border-white/5 rounded-2xl h-[400px]" />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {links.map(link => (
                        <div key={link.id} className="bg-charcoal/50 border border-white/5 rounded-2xl p-5 hover:border-brand-teal/30 transition-colors group">
                            <div className="flex items-start justify-between mb-3">
                                <div className="px-2 py-1 bg-white/5 rounded text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                                    {link.category}
                                </div>
                                <div className="px-2 py-1 bg-brand-teal/10 rounded text-[10px] font-mono text-brand-teal font-semibold">
                                    {link.commissionRate}
                                </div>
                            </div>
                            <h3 className="text-sm font-semibold text-zinc-100 mb-1">{link.productName}</h3>
                            <div className="flex items-center gap-3 mt-4">
                                <button className="flex-1 py-1.5 bg-smoke text-zinc-300 text-xs font-semibold rounded-lg hover:bg-white/10 transition-colors border border-white/5 flex items-center justify-center gap-2">
                                    <Copy className="w-3 h-3" /> Copy Link
                                </button>
                                <a href={link.url} target="_blank" rel="noreferrer" className="p-1.5 text-zinc-500 hover:text-zinc-300 rounded border border-transparent hover:border-white/10 transition-colors">
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    ))}
                    {links.length === 0 && (
                        <div className="col-span-full py-12 text-center border border-white/5 border-dashed rounded-2xl bg-smoke/30">
                            <p className="text-sm text-zinc-500">No affiliate links found. Add your first link.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
