import React, { useState, useEffect } from "react";
import { FileText, Plus, Search, Edit3 } from "lucide-react";
import { useAuth } from "@/src/lib/auth-context";
import { SOPTemplate } from "@/src/types";
import { getTemplates } from "@/src/lib/db/templates";

export const TemplateLibrary = () => {
    const { activeWorkspace, activeChannel } = useAuth();
    const [templates, setTemplates] = useState<SOPTemplate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!activeWorkspace || !activeChannel) return;
        const fetchTemplates = async () => {
            try {
                const data = await getTemplates(activeWorkspace.id, activeChannel.id);
                setTemplates(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchTemplates();
    }, [activeWorkspace, activeChannel]);

    if (!activeWorkspace) return null;

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-display text-zinc-100 flex items-center gap-3">
                        <FileText className="w-6 h-6 text-brand-teal" />
                        SOP Template Library
                    </h1>
                    <p className="text-sm text-zinc-400 mt-1">Manage internal execution quality standards. (Do not use for repetitive public output).</p>
                </div>
                <button className="px-4 py-2 bg-brand-teal text-charcoal text-sm font-semibold rounded-lg hover:bg-brand-teal/90 transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    New Template
                </button>
            </div>

            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" placeholder="Search templates..." className="w-full pl-9 pr-4 py-2 bg-charcoal border border-white/10 rounded-lg text-sm text-zinc-200 outline-none focus:border-brand-teal" />
                </div>
            </div>

            {loading ? (
                <div className="animate-pulse bg-smoke border border-white/5 rounded-2xl h-[400px]" />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map(template => (
                        <div key={template.id} className="bg-charcoal/50 border border-white/5 rounded-2xl p-5 hover:border-brand-teal/30 transition-colors group">
                            <div className="flex items-start justify-between mb-3">
                                <div className="px-2 py-1 bg-white/5 rounded text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                                    {template.type.replace('_', ' ')}
                                </div>
                                {!template.channelId && (
                                    <div className="px-2 py-1 bg-brand-teal/10 rounded text-[10px] font-mono text-brand-teal uppercase tracking-widest">
                                        Global
                                    </div>
                                )}
                            </div>
                            <h3 className="text-sm font-semibold text-zinc-100 mb-1">{template.name}</h3>
                            <div className="text-xs text-zinc-500 flex items-center justify-between mt-4">
                                <span>Version {template.version}</span>
                                <button className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-zinc-200">
                                    <Edit3 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {templates.length === 0 && (
                        <div className="col-span-full py-12 text-center border border-white/5 border-dashed rounded-2xl bg-smoke/30">
                            <p className="text-sm text-zinc-500">No templates found. Create one to standardize your workflow.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
