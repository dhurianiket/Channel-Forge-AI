import React, { useState } from "react";
import { DollarSign, Briefcase, Link as LinkIcon, Users } from "lucide-react";
import { useAuth } from "@/src/lib/auth-context";
import { MonetizationDashboard } from "./MonetizationDashboard";
import { SponsorsCRM } from "./SponsorsCRM";
import { AffiliateHub } from "./AffiliateHub";

type Tab = "DASHBOARD" | "SPONSORS" | "AFFILIATES" | "MEMBERSHIP";

export const MonetizationHub = () => {
    const { activeWorkspace, activeChannel } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>("DASHBOARD");

    if (!activeWorkspace || !activeChannel) return null;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="border-b border-white/10 flex gap-6">
                <button
                    onClick={() => setActiveTab("DASHBOARD")}
                    className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                        activeTab === "DASHBOARD" ? "border-brand-teal text-zinc-100" : "border-transparent text-zinc-500 hover:text-zinc-300"
                    }`}
                >
                    <DollarSign className="w-4 h-4" />
                    Dashboard
                </button>
                <button
                    onClick={() => setActiveTab("SPONSORS")}
                    className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                        activeTab === "SPONSORS" ? "border-brand-teal text-zinc-100" : "border-transparent text-zinc-500 hover:text-zinc-300"
                    }`}
                >
                    <Briefcase className="w-4 h-4" />
                    Sponsors CRM
                </button>
                <button
                    onClick={() => setActiveTab("AFFILIATES")}
                    className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                        activeTab === "AFFILIATES" ? "border-brand-teal text-zinc-100" : "border-transparent text-zinc-500 hover:text-zinc-300"
                    }`}
                >
                    <LinkIcon className="w-4 h-4" />
                    Affiliate Hub
                </button>
            </div>

            <div>
                {activeTab === "DASHBOARD" && <MonetizationDashboard />}
                {activeTab === "SPONSORS" && <SponsorsCRM />}
                {activeTab === "AFFILIATES" && <AffiliateHub />}
            </div>
        </div>
    );
};
