"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, ExternalLink, Github, Terminal, CheckCircle2 } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/5 bg-[#07030e]/90 text-slate-400 mt-28 relative z-20">
      {/* Top Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info (2 Cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400 via-rose-500 to-amber-400 p-[1.5px] flex items-center justify-center">
                <div className="w-full h-full bg-[#0d0718] rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-cyan-400 via-pink-500 to-orange-400 opacity-90" />
                </div>
              </div>
              <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>POIROT</span>
              </span>
            </Link>

            <p className="text-xs text-[#8e84a3] leading-relaxed max-w-sm">
              Developer-first AI cloud cost detective. Audits orphaned EBS disks, idle Elastic IPs,
              stopped instances, and Multi-AZ databases with executable CLI remediation scripts.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/30 border border-emerald-500/20 text-[11px] text-emerald-400 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Read-Only • No Write Permissions</span>
              </div>
            </div>
          </div>

          {/* Col 1: Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  AWS Live Scanner
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  FinOps AI Audit
                </Link>
              </li>
              <li>
                <Link href="/dashboard/history" className="hover:text-white transition-colors">
                  Audit History
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  CLI Remediations
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Scanners */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
              Scanners
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-white transition-colors">EC2 Stopped &amp; Oversized</li>
              <li className="hover:text-white transition-colors">EBS Orphaned Volumes</li>
              <li className="hover:text-white transition-colors">Unassociated Elastic IPs</li>
              <li className="hover:text-white transition-colors">RDS Non-Prod Multi-AZ</li>
              <li className="hover:text-white transition-colors">ELB Unhealthy Backends</li>
              <li className="hover:text-white transition-colors">S3 Lifecycle Policies</li>
            </ul>
          </div>

          {/* Col 3: Architecture & OSS */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
              Architecture
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1">
                <span>Meta Llama 3.3 70B</span>
              </li>
              <li>Neon Serverless Postgres</li>
              <li>Drizzle ORM</li>
              <li>AWS SDK v3</li>
              <li className="pt-2">
                <a
                  href="https://github.com/karambitbarrage15/POIROT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal / Status Bar */}
      <div className="border-t border-white/5 py-6 bg-[#040108]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6e6484]">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} POIROT. Open-source FinOps detective.</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Scanners Operational</span>
            </div>
            <a
              href="https://github.com/karambitbarrage15/POIROT"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              MIT License
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
