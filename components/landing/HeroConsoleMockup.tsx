"use client";

import React, { useState } from "react";
import {
  Terminal,
  Server,
  HardDrive,
  Globe2,
  Database,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Layers,
  Copy,
  Check,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export const HeroConsoleMockup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "telemetry" | "fixes">("overview");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyCommand = (cmd: string, idx: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto mt-12 mb-8 perspective-1000">
      {/* Background ambient multi-color glowing blurs */}
      <div className="absolute -top-16 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse-slow" />
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[110px] pointer-events-none -z-10 animate-pulse-slow" />

      {/* Main Glassmorphism Window */}
      <div className="relative rounded-2xl border border-slate-800/90 bg-slate-950/80 backdrop-blur-2xl shadow-[0_0_60px_-15px_rgba(6,182,212,0.25)] overflow-hidden transition-all duration-300 hover:border-slate-700/80">
        {/* Top Window Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-xs font-mono text-slate-400 ml-2 hidden sm:inline">
              poirot.finops.ai/ap-southeast-1/live-session
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-lg p-1 text-[11px] font-mono">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeTab === "overview"
                  ? "bg-cyan-500/20 text-cyan-300 font-medium"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("telemetry")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeTab === "telemetry"
                  ? "bg-cyan-500/20 text-cyan-300 font-medium"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Live Telemetry
            </button>
            <button
              onClick={() => setActiveTab("fixes")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeTab === "fixes"
                  ? "bg-cyan-500/20 text-cyan-300 font-medium"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Instant Fixes
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-mono text-emerald-400 hidden sm:inline">
              Agent Active
            </span>
          </div>
        </div>

        {/* Console Body */}
        <div className="p-6 space-y-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Header Metrics Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    Monthly Waste Detected
                  </div>
                  <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
                    $202.30 / mo
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">5 active cost leaks found</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    Projected Annual ROI
                  </div>
                  <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                    $2,427.60 / yr
                  </div>
                  <div className="text-[11px] text-emerald-400/80 mt-0.5">
                    100% recoverable spend
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    AI Engine Response
                  </div>
                  <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">0.82s</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Meta Llama 3.3 70B (Free)
                  </div>
                </div>
              </div>

              {/* Visual Simulated Audit Waveform */}
              <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-medium flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Cloud Spend Optimization Curve</span>
                  </span>
                  <span className="text-emerald-400 bg-emerald-950/50 border border-emerald-800 px-2 py-0.5 rounded text-[10px]">
                    -74% Waste Reduction
                  </span>
                </div>

                {/* SVG Visual Graph */}
                <div className="h-28 w-full relative flex items-end">
                  <svg
                    className="w-full h-full overflow-visible"
                    viewBox="0 0 500 100"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="gradientSavings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Fill */}
                    <path
                      d="M0,25 Q120,30 200,60 T350,85 T500,90 L500,100 L0,100 Z"
                      fill="url(#gradientSavings)"
                    />
                    {/* Line */}
                    <path
                      d="M0,25 Q120,30 200,60 T350,85 T500,90"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="2.5"
                    />
                  </svg>
                  <div className="absolute top-2 left-4 text-[10px] font-mono text-rose-400 bg-rose-950/60 border border-rose-800/60 px-2 py-0.5 rounded">
                    Before Audit: $1,420/mo
                  </div>
                  <div className="absolute bottom-2 right-4 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                    Optimized: $360/mo
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "telemetry" && (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-indigo-400" />
                  <span>vol-0a9182bc34de (EBS 500GB gp2)</span>
                </div>
                <span className="text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded border border-rose-800/60">
                  Orphaned ($50.00/mo)
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-purple-400" />
                  <span>eipalloc-071a99f1 (54.254.120.45)</span>
                </div>
                <span className="text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/60">
                  Unassociated ($3.65/mo)
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-cyan-400" />
                  <span>i-09f87e6d5c4b (m5.4xlarge dev instance)</span>
                </div>
                <span className="text-orange-400 bg-orange-950/50 px-2 py-0.5 rounded border border-orange-800/60">
                  Stopped + EIP penalty
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-400" />
                  <span>rds-staging-postgres (Multi-AZ in QA)</span>
                </div>
                <span className="text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded border border-rose-800/60">
                  Overprovisioned ($120.00/mo)
                </span>
              </div>
            </div>
          )}

          {activeTab === "fixes" && (
            <div className="space-y-3 font-mono text-xs">
              {[
                {
                  title: "Release Unassociated Elastic IP",
                  cmd: "aws ec2 release-address --allocation-id eipalloc-071a99f123456789a",
                  savings: "$3.65/mo",
                },
                {
                  title: "Terminate Detached 500GB EBS Volume",
                  cmd: "aws ec2 delete-volume --volume-id vol-0a9182bc34de5678f",
                  savings: "$50.00/mo",
                },
                {
                  title: "Downscale Staging Multi-AZ DB to Single-AZ",
                  cmd: "aws rds modify-db-instance --db-instance-identifier rds-staging --no-multi-az --apply-immediately",
                  savings: "$120.00/mo",
                },
              ].map((fix, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-slate-300 font-medium">
                    <span>{fix.title}</span>
                    <span className="text-emerald-400 font-bold">{fix.savings}</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-950 px-3 py-2 rounded-lg text-cyan-300 border border-slate-800/80">
                    <code className="text-[11px] truncate">{fix.cmd}</code>
                    <button
                      onClick={() => copyCommand(fix.cmd, idx)}
                      className="ml-2 text-slate-400 hover:text-cyan-400 transition-colors"
                      title="Copy"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
