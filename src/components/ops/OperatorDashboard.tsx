import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, AlertCircle, RefreshCw, CheckCircle2, ShieldCheck, Activity } from "lucide-react";
import { useAuth } from "@/src/lib/auth-context";
import { getAdminDb } from "../../../server/src/services/firestoreAdmin";
import { collection, query, where, orderBy, getDocs, limit } from "firebase/firestore";
import { db } from "@/src/lib/firebase";

export const OperatorDashboard = () => {
  const { activeWorkspace, activeChannel } = useAuth();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [failedRuns, setFailedRuns] = useState<any[]>([]);

  useEffect(() => {
    if (!activeWorkspace || !activeChannel) return;
    
    // In a real app we'd fetch these from the ops/alerts collections via snapshot listeners
    // Mocking for now to show structure
    setFailedRuns([
      { id: "run_1", status: "FAILED", workflowType: "RENDER_ROUGH_CUT", errorMessage: "Rate limit exceeded on provider", createdAt: Date.now() - 3600000, projectId: "proj_1" }
    ]);

    setAlerts([
      { id: "alrt_1", type: "ANALYTICS_SYNC_TIMEOUT", message: "Job analytics-sync failed 3 times", resolved: false, createdAt: Date.now() - 7200000 }
    ]);
  }, [activeWorkspace, activeChannel]);

  if (!activeWorkspace || !activeChannel) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-display text-zinc-100">Operator Control Center</h1>
        <p className="text-sm text-zinc-400 mt-1">Monitor live pilot execution, failures, and system health.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-smoke rounded-xl border border-white/5 p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-brand-teal/20 text-brand-teal flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-zinc-100">3</div>
            <div className="text-xs text-zinc-400 font-mono uppercase tracking-wider">Active Pilot Projects</div>
          </div>
        </div>
        <div className="bg-smoke rounded-xl border border-white/5 p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-zinc-100">{failedRuns.length}</div>
            <div className="text-xs text-zinc-400 font-mono uppercase tracking-wider">Failed Automations</div>
          </div>
        </div>
        <div className="bg-smoke rounded-xl border border-white/5 p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-zinc-100">{alerts.length}</div>
            <div className="text-xs text-zinc-400 font-mono uppercase tracking-wider">System Alerts</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-zinc-300 font-mono uppercase tracking-widest flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            Failed Runs & Retry Queue
          </h2>
          <div className="bg-smoke border border-white/5 rounded-xl overflow-hidden divide-y divide-white/5">
            {failedRuns.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-sm">No failed runs. System is healthy.</div>
            ) : (
              failedRuns.map(run => (
                <div key={run.id} className="p-4 hover:bg-white/[0.02] transition-colors flex justify-between items-start">
                  <div>
                    <Link to={`/projects/${run.projectId}`} className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors">
                      {run.workflowType} FAILED
                    </Link>
                    <p className="text-xs text-zinc-500 mt-1">{run.errorMessage}</p>
                    <div className="text-[10px] text-zinc-600 font-mono mt-2">{new Date(run.createdAt).toLocaleString()}</div>
                  </div>
                  <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-xs text-zinc-300 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    Retry
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-zinc-300 font-mono uppercase tracking-widest flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            System Alerts
          </h2>
          <div className="bg-smoke border border-white/5 rounded-xl overflow-hidden divide-y divide-white/5">
            {alerts.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-sm">No active alerts.</div>
            ) : (
              alerts.map(alert => (
                <div key={alert.id} className="p-4 hover:bg-white/[0.02] transition-colors flex justify-between items-start">
                  <div>
                    <div className="text-sm font-medium text-amber-400">
                      {alert.type}
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">{alert.message}</p>
                    <div className="text-[10px] text-zinc-600 font-mono mt-2">{new Date(alert.createdAt).toLocaleString()}</div>
                  </div>
                  <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-xs text-zinc-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Resolve
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
