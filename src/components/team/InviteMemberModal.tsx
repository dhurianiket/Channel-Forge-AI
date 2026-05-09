import React, { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "@/src/lib/auth-context";
import { addTeamMember } from "@/src/lib/auth/roles";
import { RoleType, TeamMember } from "@/src/types";

interface Props {
    onClose: () => void;
    onSuccess: (member: TeamMember) => void;
}

export const InviteMemberModal = ({ onClose, onSuccess }: Props) => {
    const { activeWorkspace } = useAuth();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState<RoleType>("reviewer");
    const [isSaving, setIsSaving] = useState(false);

    const ROLES: { value: RoleType, label: string, desc: string }[] = [
        { value: "producer", label: "Producer / Editor in Chief", desc: "Full planning, QA, analytics, and publish rights." },
        { value: "scriptwriter", label: "Scriptwriter", desc: "Ideation, research, and script drafts." },
        { value: "researcher", label: "Researcher", desc: "Supporting research and fact checking." },
        { value: "visual_designer", label: "Visual Designer", desc: "Thumbnails and visual assets." },
        { value: "editor", label: "Video Editor", desc: "Rough cut QA, asset handling." },
        { value: "ops_manager", label: "Ops Manager", desc: "Upload prep, scheduling, analytics reviews." },
        { value: "reviewer", label: "Reviewer", desc: "Can view and approve assigned stages." },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeWorkspace || !email) return;
        setIsSaving(true);
        try {
            const added = await addTeamMember(activeWorkspace.id, {
                email,
                displayName: name,
                role
            });
            onSuccess(added);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-charcoal border border-white/10 rounded-2xl w-full max-w-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-zinc-100">Invite Team Member</h2>
                    <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-zinc-400 mb-1">Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="teammate@example.com" className="w-full bg-smoke border border-white/10 rounded-lg p-3 text-zinc-200 outline-none focus:border-brand-teal" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-400 mb-1">Display Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="John Doe" className="w-full bg-smoke border border-white/10 rounded-lg p-3 text-zinc-200 outline-none focus:border-brand-teal" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-400 mb-1">System Role</label>
                        <select value={role} onChange={e => setRole(e.target.value as RoleType)} className="w-full bg-smoke border border-white/10 rounded-lg p-3 text-zinc-200 outline-none focus:border-brand-teal">
                            {ROLES.map(r => (
                                <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                        </select>
                        <p className="text-xs text-zinc-500 mt-2">
                            {ROLES.find(r => r.value === role)?.desc}
                        </p>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-300">Cancel</button>
                        <button type="submit" disabled={isSaving} className="px-5 py-2 bg-brand-teal text-charcoal text-sm font-semibold rounded-lg hover:bg-brand-teal/90 disabled:opacity-50">
                            {isSaving ? "Inviting..." : "Send Invite"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
