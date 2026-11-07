import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { HeroConsoleMockup } from "@/components/landing/HeroConsoleMockup";
import { TechMarquee } from "@/components/landing/TechMarquee";
import { SavingsCalculator } from "@/components/landing/SavingsCalculator";
import { BentoFeatures } from "@/components/landing/BentoFeatures";
import { ComparisonTable } from "@/components/landing/ComparisonTable";
import { FaqAccordion } from "@/components/landing/FaqAccordion";
import {
  ShieldAlert,
  ArrowRight,
  Zap,
  DollarSign,
  Terminal,
  Activity,
  Layers,
  Sparkles,
  Compass,
  Cpu,
} from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-28 py-6 relative">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-xs font-mono text-cyan-400 shadow-sm shadow-cyan-500/10">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Autonomous AI FinOps Agent for AWS</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">Meta Llama 3.3 70B</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-100 leading-[1.08]">
          Eliminate Cloud Waste. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">
            Automate FinOps Remediation.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          POIROT scans your AWS infrastructure in real-time, identifies orphaned disks, idle Elastic IPs,
          and oversized databases, generating executable CLI fix scripts in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link href="/dashboard">
            <Button size="lg" className="gap-2 text-base px-8 py-3.5 shadow-xl shadow-cyan-500/25">
              <span>Launch Cloud Detective</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/dashboard/history">
            <Button variant="secondary" size="lg" className="text-base px-7">
              View Audit History
            </Button>
          </Link>
        </div>

        {/* Hero Interactive Console Mockup (Dribbble Showcase) */}
        <HeroConsoleMockup />
      </section>

      {/* Cloud & Tech Ecosystem Marquee */}
      <TechMarquee />

      {/* Interactive Savings Calculator */}
      <section>
        <SavingsCalculator />
      </section>

      {/* Bento Grid Feature Showcase */}
      <section>
        <BentoFeatures />
      </section>

      {/* Comparison Matrix */}
      <section>
        <ComparisonTable />
      </section>

      {/* FAQ Section */}
      <section>
        <FaqAccordion />
      </section>

      {/* High-Converting Bottom CTA Banner */}
      <section className="relative rounded-3xl p-10 sm:p-14 bg-gradient-to-b from-cyan-950/30 to-slate-950 border border-cyan-800/40 text-center space-y-6 overflow-hidden max-w-5xl mx-auto shadow-2xl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded-full">
            Zero-Cost Setup
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
            Ready to find your hidden cloud leaks?
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Connect with read-only AWS credentials, run your first real-time SSE audit, and receive instant FinOps remediation code.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 px-8 shadow-xl shadow-cyan-500/30">
                <span>Start Free Audit Now</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="secondary" size="lg" className="px-6">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
