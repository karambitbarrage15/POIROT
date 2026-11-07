"use client";

import React from "react";
import { Check, X, Sparkles } from "lucide-react";

export const ComparisonTable: React.FC = () => {
  const rows = [
    {
      feature: "Identifies Unattached / Orphaned Disks",
      poirot: true,
      costExplorer: false,
      manual: "Time-consuming",
    },
    {
      feature: "Flags Unassociated Elastic IPs Penalty",
      poirot: true,
      costExplorer: false,
      manual: "Often missed",
    },
    {
      feature: "Autonomous Multi-Resource AI Reasoning",
      poirot: true,
      costExplorer: false,
      manual: false,
    },
    {
      feature: "Generates Executable AWS CLI Fix Commands",
      poirot: true,
      costExplorer: false,
      manual: false,
    },
    {
      feature: "Real-Time Telemetry via Server-Sent Events",
      poirot: true,
      costExplorer: "24-48 hr delay",
      manual: false,
    },
    {
      feature: "100% Free AI Engine (Meta Llama 3.3 70B)",
      poirot: true,
      costExplorer: "Billed separately",
      manual: "Labor intensive",
    },
    {
      feature: "Zero Write IAM Policy Safety",
      poirot: true,
      costExplorer: true,
      manual: "Prone to mistakes",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Why traditional billing tools leave money on the table.
        </h2>
        <p className="text-sm text-[#9c91b0] leading-relaxed">
          AWS Cost Explorer reports what you spent yesterday. POIROT identifies the architectural
          leaks burning money right now.
        </p>
      </div>

      <div className="w-full overflow-x-auto border-t border-b border-white/10">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs font-mono text-[#8e84a5] uppercase">
              <th className="py-4 px-4 sm:px-6">FinOps Capability</th>
              <th className="py-4 px-4 sm:px-6 text-cyan-300 font-semibold bg-white/[0.02]">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>POIROT (AI Detective)</span>
                </span>
              </th>
              <th className="py-4 px-4 sm:px-6">AWS Cost Explorer</th>
              <th className="py-4 px-4 sm:px-6">Manual Spreadsheets</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-sans">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 px-4 sm:px-6 font-medium text-slate-200">{row.feature}</td>

                {/* POIROT Column */}
                <td className="py-4 px-4 sm:px-6 bg-white/[0.02] font-medium text-cyan-300">
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Included</span>
                  </div>
                </td>

                {/* AWS Cost Explorer */}
                <td className="py-4 px-4 sm:px-6 text-[#8b80a1]">
                  {typeof row.costExplorer === "boolean" ? (
                    row.costExplorer ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <X className="w-4 h-4 text-rose-400" />
                    )
                  ) : (
                    <span className="text-xs font-mono text-[#8b80a1]">{row.costExplorer}</span>
                  )}
                </td>

                {/* Manual */}
                <td className="py-4 px-4 sm:px-6 text-[#8b80a1]">
                  {typeof row.manual === "boolean" ? (
                    row.manual ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <X className="w-4 h-4 text-rose-400" />
                    )
                  ) : (
                    <span className="text-xs font-mono text-amber-400/80">{row.manual}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
