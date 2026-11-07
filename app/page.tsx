import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  ShieldAlert,
  ArrowRight,
  Zap,
  DollarSign,
  Terminal,
  Activity,
  Layers,
  Sparkles,
} from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-20 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto pt-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-xs font-mono text-cyan-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Autonomous AI FinOps Agent for AWS</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-100 leading-[1.1]">
          Stop burning cloud budget. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
            Meet your AI Cloud Cost Detective.
          </span>
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          POIROT scans your AWS infrastructure, identifies orphaned disks, unattached Elastic IPs,
          oversized databases, and generates copyable CLI fix commands in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/dashboard">
            <Button size="lg" className="gap-2 text-base px-7">
              <span>Launch Cloud Audit</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/dashboard/history">
            <Button variant="secondary" size="lg" className="text-base px-6">
              View Past Scans
            </Button>
          </Link>
        </div>

        {/* Live Metrics Teaser */}
        <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-2xl font-bold font-mono text-cyan-400">30–40%</div>
            <div className="text-xs text-slate-400 mt-1">Typical Cloud Waste Found</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-2xl font-bold font-mono text-emerald-400">&lt; 15s</div>
            <div className="text-xs text-slate-400 mt-1">Real-time SSE Audit</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-2xl font-bold font-mono text-purple-400">100% Free</div>
            <div className="text-xs text-slate-400 mt-1">OpenRouter Llama 3.3 70B</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-2xl font-bold font-mono text-amber-400">1-Click</div>
            <div className="text-xs text-slate-400 mt-1">Copyable AWS CLI Fixes</div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">
            Engineered for Modern DevOps & FinOps
          </h2>
          <p className="text-sm text-slate-400">
            Everything you need to audit, optimize, and slash unnecessary monthly AWS billing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100">Deep Resource Extraction</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Direct AWS SDK v3 inspection across EC2 instances, EBS volumes, Elastic IPs, RDS databases, and S3 lifecycle configurations.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100">Real-Time Streaming SSE</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              No hanging spinners or timeouts. Server-Sent Events push live progress updates through authentication, inventory query, and AI inference.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100">Actionable Remediation Code</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every flagged waste item comes with pre-generated AWS CLI commands and safety risk warnings to verify before terminating.
            </p>
          </div>
        </div>
      </section>

      {/* Workflow Step Showcase */}
      <section className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 space-y-6">
        <div className="flex items-center gap-3">
          <Layers className="w-6 h-6 text-cyan-400" />
          <h3 className="text-xl font-bold text-slate-100">End-to-End Request Pipeline</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 space-y-2">
            <span className="text-cyan-400 font-bold">01. INITIATION</span>
            <p className="text-slate-300 font-sans">
              Select regional scope (e.g. ap-southeast-1, us-east-1). The browser initiates a real-time SSE stream.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 space-y-2">
            <span className="text-cyan-400 font-bold">02. COMPRESSION</span>
            <p className="text-slate-300 font-sans">
              AWS SDK parallel queries extract state, size, SKUs, and tags into a lean, token-optimized inventory.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 space-y-2">
            <span className="text-cyan-400 font-bold">03. AI REASONING</span>
            <p className="text-slate-300 font-sans">
              Meta Llama 3.3 70B analyzes the infrastructure against 2026 FinOps pricing baselines and returns structured JSON.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 space-y-2">
            <span className="text-cyan-400 font-bold">04. REMEDIATION</span>
            <p className="text-slate-300 font-sans">
              Full audit saved in Neon PostgreSQL. Interactive report displays copyable CLI commands & risk warnings.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
