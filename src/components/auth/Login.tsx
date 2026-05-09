import React from "react";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/src/lib/auth-context";

export const Login = () => {
  const { signIn } = useAuth();
  
  return (
    <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center p-6 relative overflow-hidden">
       {/* Background artifacts */}
       <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-teal/10 rounded-full blur-[120px]" />
       <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-orange/10 rounded-full blur-[120px]" />
       
       <div className="max-w-md w-full glass-panel p-10 rounded-[40px] space-y-8 z-10 border border-white/10 shadow-2xl">
          <div className="flex flex-col items-center gap-6">
             <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-teal to-brand-orange flex items-center justify-center font-bold text-2xl text-obsidian shadow-lg shadow-brand-teal/20">
                CF
             </div>
             <div className="text-center space-y-2">
                <h1 className="text-3xl font-display font-bold text-white uppercase tracking-tighter">ChannelForge AI</h1>
                <p className="text-zinc-500 text-sm font-medium">Forge content. Keep control.</p>
             </div>
          </div>

          <div className="space-y-4">
             <Button 
               onClick={signIn}
               className="w-full bg-white text-obsidian hover:bg-zinc-200 h-14 rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-white/5"
             >
                <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                Connect with Director Account
             </Button>
             <p className="text-[10px] text-center text-zinc-600 font-mono tracking-widest uppercase py-4">
                Creator Operating System v1.4.2
             </p>
          </div>

          <div className="pt-6 border-t border-white/5 space-y-4">
             <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-smoke flex items-center justify-center text-brand-teal">
                   <LogIn className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                   <span className="text-xs font-bold text-zinc-300 uppercase tracking-wide">Secure Access</span>
                   <span className="text-[10px] text-zinc-500 leading-none">Enterprise grade media encryption</span>
                </div>
             </div>
          </div>
       </div>
       
       <footer className="absolute bottom-10 text-[10px] font-mono text-zinc-700 uppercase tracking-[0.4em]">
          Designed for the 1% of creators
       </footer>
    </div>
  );
};
