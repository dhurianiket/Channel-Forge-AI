import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Tv2, 
  Lightbulb, 
  Database, 
  FileText, 
  Image as ImageIcon, 
  Mic2, 
  Video, 
  Settings, 
  BarChart3,
  ChevronRight,
  Plus,
  Compass,
  Zap,
  ShieldCheck,
  Users,
  Activity,
  DollarSign,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/src/lib/auth-context";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
  key?: string | number;
  onClick?: () => void;
}

const NavItem = ({ icon: Icon, label, href, active, onClick }: NavItemProps) => (
  <Link to={href} onClick={onClick}>
    <div className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group cursor-pointer",
      active 
        ? "bg-smoke text-brand-teal" 
        : "text-zinc-400 hover:bg-smoke/50 hover:text-zinc-100"
    )}>
      <Icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", active && "text-brand-teal")} />
      <span className="text-sm font-medium">{label}</span>
      {active && <div className="ml-auto w-1 h-1 rounded-full bg-brand-teal" />}
    </div>
  </Link>
);

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { 
    user, profile, workspaces, activeWorkspace, channels, activeChannel, 
    setActiveWorkspaceId, setActiveChannelId, signOut 
  } = useAuth();

  const navigation = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Channels", icon: Tv2, href: "/channels" },
    { label: "Projects & Production", icon: Video, href: "/projects" },
    { label: "Pilot Board", icon: Compass, href: "/pilot" },
  ];

  const opsModules = [
    { label: "Channel Ops", icon: Activity, href: "/channel-ops" },
    { label: "Monetization", icon: DollarSign, href: "/monetization" },
    { label: "Team & Roles", icon: Users, href: "/team" },
    { label: "Workload", icon: BarChart3, href: "/workload" },
    { label: "SOP Templates", icon: FileText, href: "/templates" },
    { label: "Operator Center", icon: ShieldCheck, href: "/ops" },
    { label: "Validation Suite", icon: Zap, href: "/ops/validation" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ];

  return (
    <div className="flex h-[100dvh] bg-obsidian text-zinc-100 overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "bg-charcoal border-r border-white/5 transition-transform duration-300 flex flex-col z-30 fixed md:relative h-full w-72 md:w-64",
        isSidebarOpen 
          ? "translate-x-0" 
          : "-translate-x-full md:translate-x-0"
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center px-4 gap-3 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-teal to-brand-orange flex items-center justify-center font-bold text-obsidian shrink-0">
            CF
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold leading-none">ChannelForge</span>
            <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase mt-0.5">Operating System</span>
          </div>
        </div>
        
        {/* Workspace & Channel Context */}
        <div className="p-4 border-b border-white/5 space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Workspace</label>
            <select 
              className="w-full bg-smoke border border-white/10 rounded-md text-xs p-1.5 text-zinc-200 outline-none focus:border-brand-teal"
              value={activeWorkspace?.id || ""}
              onChange={(e) => setActiveWorkspaceId(e.target.value)}
            >
              {workspaces.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
              {workspaces.length === 0 && <option value="" disabled>No workspaces found</option>}
            </select>
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Channel Context</label>
            <select 
              className="w-full bg-smoke border border-white/10 rounded-md text-xs p-1.5 text-zinc-200 outline-none focus:border-brand-teal"
              value={activeChannel?.id || ""}
              onChange={(e) => setActiveChannelId(e.target.value)}
              disabled={channels.length === 0}
            >
              <option value="" disabled>{channels.length === 0 ? "No channels found" : "Select channel"}</option>
              {channels.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-6">
            <div className="space-y-1">
              {navigation.map((item) => (
                <NavItem 
                  key={item.href} 
                  label={item.label}
                  icon={item.icon}
                  href={item.href}
                  active={location.pathname.startsWith(item.href)}
                  onClick={() => setIsSidebarOpen(false)}
                />
              ))}
            </div>

            <div>
              <p className="px-3 mb-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Operations</p>
              <div className="space-y-1">
                {opsModules.map((item) => (
                  <NavItem 
                    key={item.href} 
                    label={item.label}
                    icon={item.icon}
                    href={item.href}
                    active={location.pathname.startsWith(item.href)}
                    onClick={() => setIsSidebarOpen(false)}
                  />
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer / User */}
        <div className="p-3 border-t border-white/5 bg-charcoal/50">
          <div 
            onClick={() => signOut()}
            className="flex items-center gap-3 px-2 py-2 rounded-xl bg-smoke/30 border border-white/5 cursor-pointer hover:bg-smoke/50 transition-colors"
            title="Click to sign out"
          >
            <div className="w-7 h-7 rounded-full bg-zinc-700 shrink-0 overflow-hidden">
               <img src={profile?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=creator"} alt="Avatar" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-medium truncate">{profile?.displayName || user?.email || "Creator"}</span>
              <span className="text-[10px] text-zinc-500 truncate">{activeWorkspace?.name || "No Workspace"}</span>
            </div>
            <LogOut className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-obsidian">
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-charcoal/20 backdrop-blur-sm z-10 shrink-0">
           <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-zinc-500 hover:text-zinc-100 md:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                 <ChevronRight className={cn("transition-transform", isSidebarOpen && "rotate-180")} />
              </Button>
              <div className="flex flex-col">
                 <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                    {navigation.find(n => location.pathname.startsWith(n.href))?.label || 
                     opsModules.find(n => location.pathname.startsWith(n.href))?.label ||
                     "Platform"}
                 </h2>
              </div>
           </div>

           <div className="flex items-center gap-2 sm:gap-3">
              <Button variant="outline" size="sm" className="bg-smoke/30 border-white/10 text-xs gap-2 hidden sm:flex">
                 <Plus className="w-3.5 h-3.5" />
                 New Project
              </Button>
              <Button size="sm" className="bg-brand-teal text-obsidian hover:bg-brand-teal/90 text-xs font-bold px-3 sm:px-4">
                 <Plus className="w-3.5 h-3.5 sm:hidden" />
                 <span className="hidden sm:inline">Forge Video</span>
                 <span className="sm:hidden">Forge</span>
              </Button>
           </div>
        </header>

        {/* Viewport */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
