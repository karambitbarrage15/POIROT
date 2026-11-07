import Link from "next/link";
import { GlowingCloudVisual } from "@/components/landing/GlowingCloudVisual";
import { InteractiveCursorLines } from "@/components/landing/InteractiveCursorLines";
import { SavingsCalculator } from "@/components/landing/SavingsCalculator";
import { BentoFeatures } from "@/components/landing/BentoFeatures";
import { ComparisonTable } from "@/components/landing/ComparisonTable";
import { FaqAccordion } from "@/components/landing/FaqAccordion";

export default function Home() {
  return (
    <div className="space-y-28 py-2 relative">
      {/* Interactive Cursor Reactive Lines (high-density topographic flow) */}
      <InteractiveCursorLines className="opacity-85" lineCount={38} interactiveRadius={180} />

      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-6 lg:pt-12 pb-6 relative z-10">
        {/* Left Headline & Content (7 Cols) */}
        <div className="lg:col-span-7 space-y-7 text-left">
          <h1 className="text-5xl sm:text-6xl lg:text-[76px] font-bold tracking-tight text-white leading-[1.08]">
            Developer-First <br />
            AI &amp; Agent <br />
            <span className="font-cursive font-normal text-[1.18em] tracking-wide bg-gradient-to-r from-pink-300 via-purple-200 to-indigo-300 bg-clip-text text-transparent inline-block -mt-2 pb-1">
              Cloud Detective
            </span>
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
              Start Free Scan
            </Link>
            <Link
              href="/dashboard"
              className="px-7 py-3 rounded-full bg-transparent border border-[#2e2148] hover:bg-[#170e28] text-[#a499bb] hover:text-white font-medium text-sm transition-all active:scale-95"
            >
              View Live Demo
            </Link>
          </div>
        </div>

        {/* Right Glowing Cloud Artwork with Raining Bioluminescent Particles (5 Cols) */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <GlowingCloudVisual />
        </div>
      </section>

      {/* Interactive Savings Calculator */}
      <section className="relative z-10">
        <SavingsCalculator />
      </section>

      {/* Bento Grid Feature Showcase */}
      <section className="relative z-10">
        <BentoFeatures />
      </section>

      {/* Comparison Matrix */}
      <section className="relative z-10">
        <ComparisonTable />
      </section>

      {/* FAQ Section */}
      <section className="relative z-10">
        <FaqAccordion />
      </section>

      {/* Bottom CTA Section */}
      <section className="relative z-10 text-center py-16 space-y-6 max-w-3xl mx-auto">
        <span className="text-xs font-mono text-pink-400 uppercase tracking-widest px-3 py-1 rounded-full bg-pink-950/40 border border-pink-800/40">
          Zero-Cost Setup
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Ready to stop burning cloud spend?
        </h2>
        <p className="text-sm text-[#9f94b3] leading-relaxed max-w-xl mx-auto">
          Connect your read-only AWS credentials, launch real-time FinOps audits, and receive instant remediation CLI scripts.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
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
      </section>
    </div>
  );
}
