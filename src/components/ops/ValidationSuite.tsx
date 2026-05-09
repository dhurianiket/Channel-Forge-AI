import React from "react";
import { Zap, CheckCircle2, AlertCircle } from "lucide-react";

export const ValidationSuite = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-display text-zinc-100 flex items-center gap-3">
          <Zap className="w-6 h-6 text-brand-teal" />
          Staging Validation Suite
        </h1>
        <p className="text-sm text-zinc-400 mt-1">Checklist for end-to-end testing of real pilot data, without writing mock data.</p>
      </div>

      <div className="space-y-6">
        <section className="bg-smoke rounded-xl p-6 border border-white/5 space-y-4">
            <h2 className="text-lg font-semibold text-zinc-200">1. Pre-Production Flow</h2>
            <ul className="space-y-3">
                <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-zinc-500 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-sm text-zinc-200">Create Project from Idea, generate Script, and complete Fact Check.</p>
                        <p className="text-xs text-zinc-500">Wait for approval states to sync correctly across layers.</p>
                    </div>
                </li>
            </ul>
        </section>

        <section className="bg-smoke rounded-xl p-6 border border-white/5 space-y-4">
            <h2 className="text-lg font-semibold text-zinc-200">2. Automation Dispatch & Webhooks</h2>
            <ul className="space-y-3">
                <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-zinc-500 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-sm text-zinc-200">Render Dispatch triggers N8n successfully.</p>
                        <p className="text-xs text-zinc-500">Check for valid n8n Webhook Signature processing on return.</p>
                    </div>
                </li>
                <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-zinc-500 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-sm text-zinc-200">Test Replay / Duplicate Callback Identifiers.</p>
                        <p className="text-xs text-zinc-500">Idempotency logic should catch repeated n8n webhooks and ignore them.</p>
                    </div>
                </li>
            </ul>
        </section>
        
        <section className="bg-smoke rounded-xl p-6 border border-white/5 space-y-4">
            <h2 className="text-lg font-semibold text-zinc-200">3. Analytics Checkpoints</h2>
            <ul className="space-y-3">
                <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-zinc-500 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-sm text-zinc-200">Publish to YouTube successfully (simulated/private) and test analytic reviews flow.</p>
                        <p className="text-xs text-zinc-500">Can operators view empty states and manually fill retention notes?</p>
                    </div>
                </li>
            </ul>
        </section>
      </div>
    </div>
  );
};
