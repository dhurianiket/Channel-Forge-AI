import React, { useState, useEffect } from "react";
import { Users, UserPlus, Shield, Settings } from "lucide-react";
import { useAuth } from "@/src/lib/auth-context";
import { TeamMember, RoleType } from "@/src/types";
import { getTeamMembers, updateTeamMember } from "@/src/lib/auth/roles";
import { InviteMemberModal } from "./InviteMemberModal";

export const TeamMembersPage = () => {
    const { activeWorkspace } = useAuth();
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    useEffect(() => {
        if (!activeWorkspace) return;
        const fetchMembers = async () => {
            try {
                const fetched = await getTeamMembers(activeWorkspace.id);
                setMembers(fetched);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchMembers();
    }, [activeWorkspace]);

    if (!activeWorkspace) return null;

    const handleInviteSuccess = (newMember: TeamMember) => {
        setMembers(prev => [...prev, newMember]);
        setIsInviteOpen(false);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-display text-zinc-100 flex items-center gap-3">
                        <Users className="w-6 h-6 text-brand-teal" />
                        Team & Roles
                    </h1>
                    <p className="text-sm text-zinc-400 mt-1">Manage assignments, permissions, and capacity for your channel.</p>
                </div>
                <button 
                  onClick={() => setIsInviteOpen(true)}
                  className="px-4 py-2 bg-brand-teal text-charcoal text-sm font-semibold rounded-lg hover:bg-brand-teal/90 transition-colors flex items-center gap-2"
                >
                    <UserPlus className="w-4 h-4" />
                    Invite Member
                </button>
            </div>

            {loading ? (
                <div className="animate-pulse bg-smoke border border-white/5 rounded-2xl h-[400px]" />
            ) : (
                <div className="bg-charcoal/50 rounded-2xl border border-white/5 overflow-hidden">
                    <table className="w-full text-left text-sm text-zinc-400">
                        <thead className="bg-smoke/50 text-xs uppercase font-mono text-zinc-500 border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4">Name / Email</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Channels</th>
                                <th className="px-6 py-4 text-right">Settings</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {members.map(member => (
                                <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-zinc-200">{member.displayName || "Unknown User"}</div>
                                        <div className="text-xs text-zinc-500 mt-0.5">{member.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-brand-teal/10 text-brand-teal rounded font-mono text-[10px] uppercase tracking-wider">
                                            {member.role.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {member.channelAccess?.length ? `${member.channelAccess.length} Channels` : 'All Channels'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors">
                                            <Settings className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isInviteOpen && (
                <InviteMemberModal onClose={() => setIsInviteOpen(false)} onSuccess={handleInviteSuccess} />
            )}
        </div>
    );
};
