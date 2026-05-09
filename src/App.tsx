import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "@/src/components/layout/AppShell";
import { Toaster } from "@/components/ui/sonner";
import { Dashboard } from "@/src/components/dashboard/Dashboard";
import { ChannelStrategy } from "@/src/components/channels/ChannelStrategy";
import { ProjectsList } from "@/src/components/projects/ProjectsList";
import { ProjectDashboard } from "@/src/components/projects/ProjectDashboard";
import { PilotBoard } from "@/src/components/pilot/PilotBoard";
import { OperatorDashboard } from "@/src/components/ops/OperatorDashboard";
import { ValidationSuite } from "@/src/components/ops/ValidationSuite";
import { TeamMembersPage } from "@/src/components/team/TeamMembersPage";
import { WorkloadBoard } from "@/src/components/ops/WorkloadBoard";
import { TemplateLibrary } from "@/src/components/templates/TemplateLibrary";
import { ChannelOpsDashboard } from "@/src/components/channels/ChannelOpsDashboard";
import { MonetizationHub } from "@/src/components/monetization/MonetizationHub";
import { Login } from "@/src/components/auth/Login";
import { AuthProvider, useAuth } from "@/src/lib/auth-context";

function AppRoutes() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="h-[100dvh] w-screen bg-obsidian flex items-center justify-center">
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
          <Route path="/projects" element={<ProjectsList />} />
          <Route path="/projects/:projectId" element={<ProjectDashboard />} />
          <Route path="/pilot" element={<PilotBoard />} />
          <Route path="/ops" element={<OperatorDashboard />} />
          <Route path="/ops/validation" element={<ValidationSuite />} />
          <Route path="/team" element={<TeamMembersPage />} />
          <Route path="/workload" element={<WorkloadBoard />} />
          <Route path="/templates" element={<TemplateLibrary />} />
          <Route path="/channel-ops" element={<ChannelOpsDashboard />} />
          <Route path="/monetization" element={<MonetizationHub />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AppShell>
      <Toaster position="top-right" richColors theme="dark" />
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

