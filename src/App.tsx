import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/src/lib/firebase";
import { AppShell } from "@/src/components/layout/AppShell";
import { Toaster } from "@/components/ui/sonner";
import { Dashboard } from "@/src/components/dashboard/Dashboard";
import { IdeaEngine } from "@/src/components/projects/IdeaEngine";
import { ChannelStrategy } from "@/src/components/channels/ChannelStrategy";
import { ResearchHub } from "@/src/components/projects/ResearchHub";
import { ScriptStudio } from "@/src/components/projects/ScriptStudio";
import { VisualPlanner } from "@/src/components/projects/VisualPlanner";
import { VoiceoverModule } from "@/src/components/projects/VoiceoverModule";
import { ProjectsList } from "@/src/components/projects/ProjectsList";
import { Login } from "@/src/components/auth/Login";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-obsidian flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-teal to-brand-orange animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-600">Initializing OS...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Router>
      <AppShell>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/channels" element={<ChannelStrategy />} />
          <Route path="/ideas" element={<IdeaEngine />} />
          <Route path="/research" element={<ResearchHub />} />
          <Route path="/scripting" element={<ScriptStudio />} />
          <Route path="/visuals" element={<VisualPlanner />} />
          <Route path="/audio" element={<VoiceoverModule />} />
          <Route path="/projects" element={<ProjectsList />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AppShell>
      <Toaster position="top-right" richColors theme="dark" />
    </Router>
  );
}
