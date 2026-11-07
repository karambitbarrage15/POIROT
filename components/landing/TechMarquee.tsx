"use client";

import React from "react";
import { Server, HardDrive, Database, FolderArchive, Globe, Shield, Terminal, Cpu } from "lucide-react";

export const TechMarquee: React.FC = () => {
  const techs = [
    { name: "AWS EC2", icon: Server },
    { name: "EBS Volumes", icon: HardDrive },
    { name: "RDS Clusters", icon: Database },
    { name: "S3 Buckets", icon: FolderArchive },
    { name: "Elastic IPs", icon: Globe },
    { name: "Meta Llama 3.3 70B", icon: Cpu },
    { name: "Neon PostgreSQL", icon: Database },
    { name: "Next.js 15 App Router", icon: Terminal },
    { name: "FinOps Foundation", icon: Shield },
  ];

  return (
    <div className="w-full py-8 border-y border-slate-800/80 bg-slate-950/40 overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

      <div className="flex w-max animate-marquee space-x-8 items-center">
        {[...techs, ...techs, ...techs].map((tech, idx) => {
          const Icon = tech.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs font-mono text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors shrink-0 shadow-sm"
            >
              <Icon className="w-4 h-4 text-cyan-400" />
              <span>{tech.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
