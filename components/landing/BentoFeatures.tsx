"use client";

import React from "react";

export const BentoFeatures: React.FC = () => {
  const capabilities = [
    {
      index: "01",
      title: "Autonomous FinOps Reasoning",
      subtitle: "Meta Llama 3.3 70B Engine",
      description:
        "Rather than relying on brittle if/else rules, POIROT cross-references stopped EC2 instances with allocated Elastic IPs, unmanaged snapshots, and oversized databases against official AWS pricing baselines.",
      badge: "LLM REASONING",
      telemetry: "Scans active configuration states & generates structured FinOps audits.",
    },
    {
      index: "02",
      title: "Zombie Resource Detection",
      subtitle: "EC2 • EBS • EIP • RDS • ELB • S3",
      description:
        "Identifies detached EBS volumes ($0.10/GB-mo), unassociated Elastic IPs ($0.005/hr idle fee), non-production Multi-AZ databases, and targetless load balancers that generate unnoticed daily fees.",
      badge: "ZOMBIE AUDIT",
      telemetry: "Calculates monthly and annualized bottom-line waste in USD.",
    },
    {
      index: "03",
      title: "100% Read-Only IAM Posture",
      subtitle: "Zero Write Permissions",
      description:
        "Strictly limited to Describe* and List* commands. POIROT cannot delete, modify, or stop resources. Your AWS credentials live only in your local environment and never touch third-party servers.",
      badge: "SECURITY FIRST",
      telemetry: "ec2:Describe* • rds:Describe* • s3:ListAllMyBuckets",
    },
    {
      index: "04",
      title: "Actionable Remediation CLI",
      subtitle: "Executable in Terminal",
      description:
        "No vague charts. Every finding comes with a verified one-click copyable AWS CLI remediation command accompanied by pre-flight risk checks and rollback guidelines.",
      badge: "ONE-CLICK FIX",
      telemetry: "aws ec2 delete-volume --volume-id vol-0a9182... --region ap-southeast-1",
    },
  ];

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-10">
      {/* Clean Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-mono text-purple-400 uppercase tracking-widest px-3 py-1 rounded-full bg-purple-950/40 border border-purple-800/40">
          Core FinOps Architecture
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Engineered for teams who hate cloud waste.
        </h2>
        <p className="text-sm text-[#9c91b0] leading-relaxed">
          Deep AWS infrastructure audits powered by local LLM reasoning and real-time SSE telemetry.
        </p>
      </div>

      {/* Clean 4-Column Feature Grid (Zero nested boxes, zero emoji badge boxes) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-6 border-t border-white/10">
        {capabilities.map((item) => (
          <div key={item.index} className="space-y-4 text-left group">
            {/* Number & Badge */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#6e6386] font-semibold">
                /{item.index}
              </span>
              <span className="text-[10px] font-mono tracking-wider text-cyan-400/90 uppercase">
                {item.badge}
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs font-mono text-[#8b80a1]">{item.subtitle}</p>
            </div>

            {/* Description */}
            <p className="text-xs text-[#a298b8] leading-relaxed font-normal">
              {item.description}
            </p>

            {/* Direct Monospace Telemetry / Code (No heavy nested box) */}
            <div className="pt-2 text-[11px] font-mono text-emerald-400/80 border-l border-emerald-500/30 pl-3">
              {item.telemetry}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
