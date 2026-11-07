import Link from "next/link";
import { GlowingCloudVisual } from "@/components/landing/GlowingCloudVisual";
import { SavingsCalculator } from "@/components/landing/SavingsCalculator";
import { BentoFeatures } from "@/components/landing/BentoFeatures";
import { ComparisonTable } from "@/components/landing/ComparisonTable";
import { FaqAccordion } from "@/components/landing/FaqAccordion";

export default function Home() {
  return (
    <div className="space-y-28 py-2 relative">
      {/* Hero Section Matching the Dribbble Shot */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-6 lg:pt-12 pb-6">
        {/* Left Headline & Content (7 Cols) */}
        <div className="lg:col-span-7 space-y-7 text-left">
          <h1 className="text-5xl sm:text-6xl lg:text-[76px] font-bold tracking-tight text-white leading-[1.06]">
            Developer-First <br />
            AI &amp; Agent <span className="text-[#888099]">Cloud</span> <br />
            <span className="text-[#655b7a]">Detective</span>
          </h1>

          <p className="text-base sm:text-lg text-[#988ea8] max-w-xl leading-relaxed font-normal">
            Audit cloud waste in minutes, inspect 100+ AWS configurations with one AI API,
            and eliminate zombie infrastructure—developer-first, read-only, and startup-friendly.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3.5 pt-1">
            <Link
              href="/dashboard"
              className="px-7 py-3 rounded-full bg-[#170e28] border border-[#2e2148] hover:border-purple-400/60 text-white font-medium text-sm transition-all shadow-lg shadow-purple-950/40 active:scale-95"
            >
              Sign Up
            </Link>
            <Link
              href="/dashboard"
              className="px-7 py-3 rounded-full bg-transparent border border-[#2e2148] hover:bg-[#170e28] text-[#a499bb] hover:text-white font-medium text-sm transition-all active:scale-95"
            >
              Book a Demo
            </Link>
          </div>

          {/* Trusted By Row */}
          <div className="pt-10 space-y-3">
            <p className="text-xs uppercase tracking-wider text-[#695f7e] font-medium">
              Trusted by organizations worldwide
            </p>
            <div className="flex items-center gap-7 sm:gap-10 text-sm font-semibold text-[#8b819f] tracking-wide">
              <span className="hover:text-white transition-colors cursor-default">OpenRouter</span>
              <span className="hover:text-white transition-colors cursor-default">beBee</span>
              <span className="hover:text-white transition-colors cursor-default">TiDB</span>
              <span className="hover:text-white transition-colors cursor-default">Hugging Face</span>
              <span className="hover:text-white transition-colors cursor-default hidden sm:inline">Neon</span>
            </div>
          </div>
        </div>

        {/* Right Glowing Cloud Artwork with Raining Bioluminescent Particles (5 Cols) */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <GlowingCloudVisual />
        </div>
      </section>

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
      <section className="relative rounded-3xl p-10 sm:p-14 bg-gradient-to-b from-[#190e2e]/60 to-[#0c0617] border border-purple-500/20 text-center space-y-6 overflow-hidden max-w-5xl mx-auto shadow-2xl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-mono text-pink-400 uppercase tracking-widest bg-pink-950/40 border border-pink-800/40 px-3 py-1 rounded-full">
            Zero-Cost Setup
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to stop burning cloud spend?
          </h2>
          <p className="text-sm text-[#9f94b3] leading-relaxed">
            Connect your read-only AWS credentials, launch real-time FinOps audits, and receive instant remediation CLI scripts.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 text-white font-semibold text-sm shadow-xl shadow-pink-500/25 hover:brightness-110 transition-all active:scale-95"
            >
              Start Free Audit Now
            </Link>
            <Link
              href="/register"
              className="px-7 py-3.5 rounded-full bg-[#181026] border border-[#2e2148] text-[#c0b5d5] hover:text-white text-sm font-medium transition-all"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
