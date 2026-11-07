"use client";

import React from "react";
import {
  BrainCircuit,
  HardDrive,
  ShieldCheck,
  Terminal,
  Zap,
  Layers,
  ArrowUpRight,
  TrendingDown,
  Sparkles,
} from "lucide-react";

export const BentoFeatures: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded-full">
          Intelligent Architecture
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
          Everything your cloud team needs to eliminate waste.
        </h2>
        <p className="text-sm text-slate-400">
          Built from the ground up for modern AWS infrastructure teams.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
        {/* Bento Box 1: Wide AI Engine */}
        <div className="md:col-span-2 p-7 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-cyan-500/20 transition-all" />

          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <span>Autonomous FinOps Reasoning Engine</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-400 uppercase">
                  Meta Llama 3.3 70B
                </span>
              </h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Rather than relying on brittle if/else rules, POIROT utilizes a multi-step reasoning
                agent to cross-reference stopped EC2 instances with allocated Elastic IPs, unmanaged
                snapshots, and oversized development databases against official 2026 AWS pricing
                baselines.
              </p>
            </div>

            {/* Code / Context Compression Preview */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center justify-between text-slate-500 text-[11px] border-b border-slate-800/80 pb-1.5">
                <span>INPUT: Compressed AWS State</span>
                <span className="text-emerald-400">Tokens: 1,420 (Compressed -88%)</span>
              </div>
              <div className="text-cyan-400/90 truncate">
                {"{ id: 'i-09f87e', type: 'EC2', state: 'stopped', flags: { hasEIP: true } }"}
              </div>
              <div className="text-emerald-400/90 truncate">
                {"=> AI Analysis: Flagged idle EIP penalty ($3.65/mo) + Recommends termination"}
              </div>
            </div>
          </div>
        </div>

        {/* Bento Box 2: Zombie Resource Hunter */}
        <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[50px] pointer-events-none group-hover:bg-purple-500/20 transition-all" />

          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <HardDrive className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-100">Zombie Resource Hunter</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Automatically identifies detached EBS storage volumes, unassociated Elastic IPs,
                and dangling network interfaces that continue generating daily fees unnoticed.
              </p>
            </div>

            <div className="pt-2 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400">Detached EBS</span>
                <span className="text-rose-400 font-bold">$0.10 / GB-mo</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400">Unassociated EIP</span>
                <span className="text-rose-400 font-bold">$0.005 / hr</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Box 3: Read-Only IAM Safety */}
        <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 relative overflow-hidden group">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-100">100% Read-Only Safety</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Zero write credentials. POIROT requires only describe permissions and cannot modify,
                stop, or delete any resource in your cloud environment.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400/90">
              <code>ec2:Describe* • rds:Describe*</code>
            </div>
          </div>
        </div>

        {/* Bento Box 4: Tier Migration & Drift */}
        <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all duration-300 relative overflow-hidden group">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-100">Tier Drift & Upgrade Alerts</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Highlights outdated storage tiers like legacy gp2 volumes that can be upgraded to
                gp3 for 20% immediate savings and 3x higher baseline IOPS.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-amber-300">
              <span>gp2 -&gt; gp3: Instant 20% discount</span>
            </div>
          </div>
        </div>

        {/* Bento Box 5: Executable CLI Remediation */}
        <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 relative overflow-hidden group">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-100">Actionable Remediation Scripts</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                No vague recommendations. Every finding is accompanied by copyable AWS CLI commands
                and safety verification checklists.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 truncate">
              <code>aws ec2 delete-volume --volume-id ...</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
