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
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
  key?: string | number;
}

const NavItem = ({ icon: Icon, label, href, active }: NavItemProps) => (
  <Link to={href}>
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigation = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Channels", icon: Tv2, href: "/channels" },
    { label: "Idea Engine", icon: Lightbulb, href: "/ideas" },
    { label: "Discovery", icon: Compass, href: "/discovery" },
  ];

  const projectModules = [
    { label: "Projects", icon: Video, href: "/projects" },
    { label: "Research", icon: Database, href: "/research" },
    { label: "Script Studio", icon: FileText, href: "/scripting" },
    { label: "Visual Planner", icon: ImageIcon, href: "/visuals" },
    { label: "Voiceover", icon: Mic2, href: "/audio" },
  ];

  const opsModules = [
    { label: "Analytics", icon: BarChart3, href: "/analytics" },
    { label: "Automations", icon: Zap, href: "/automations" },
    { label: "Compliance", icon: ShieldCheck, href: "/compliance" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ];

  return (
    <div className="flex h-screen bg-obsidian text-zinc-100 overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "bg-charcoal border-r border-white/5 transition-all duration-300 flex flex-col z-20",
        isSidebarOpen ? "w-64" : "w-16"
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center px-4 gap-3 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-teal to-brand-orange flex items-center justify-center font-bold text-obsidian shrink-0">
            CF
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col">
              <span className="font-display font-bold leading-none">ChannelForge</span>
              <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase mt-0.5">Operating System</span>
            </div>
          )}
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
                />
              ))}
            </div>

            <div>
              {isSidebarOpen && <p className="px-3 mb-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Production</p>}
              <div className="space-y-1">
                {projectModules.map((item) => (
                  <NavItem 
                    key={item.href} 
                    label={item.label}
                    icon={item.icon}
                    href={item.href}
                    active={location.pathname.startsWith(item.href)} 
                  />
                ))}
              </div>
            </div>

            <div>
              {isSidebarOpen && <p className="px-3 mb-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Operations</p>}
              <div className="space-y-1">
                {opsModules.map((item) => (
                  <NavItem 
                    key={item.href} 
                    label={item.label}
                    icon={item.icon}
                    href={item.href}
                    active={location.pathname.startsWith(item.href)} 
                  />
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer / User */}
        <div className="p-3 border-t border-white/5 bg-charcoal/50">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-smoke/30 border border-white/5">
            <div className="w-7 h-7 rounded-full bg-zinc-700 shrink-0 overflow-hidden">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=creator" alt="Avatar" />
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium truncate">Premium Creator</span>
                <span className="text-[10px] text-zinc-500 truncate">Pro Workspace</span>
              </div>
            )}
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
                     projectModules.find(n => location.pathname.startsWith(n.href))?.label ||
                     "Platform"}
                 </h2>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="bg-smoke/30 border-white/10 text-xs gap-2">
                 <Plus className="w-3.5 h-3.5" />
                 New Project
              </Button>
              <Button size="sm" className="bg-brand-teal text-obsidian hover:bg-brand-teal/90 text-xs font-bold px-4">
                 Forge Video
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
