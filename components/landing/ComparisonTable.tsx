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
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
          Why traditional billing tools leave money on the table.
        </h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          AWS Cost Explorer reports what you spent yesterday. POIROT identifies the architectural
          leaks burning money right now.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-xs font-mono text-slate-400 uppercase">
                <th className="p-4 sm:p-5">FinOps Capability</th>
                <th className="p-4 sm:p-5 text-cyan-400 bg-cyan-950/20 font-bold border-x border-cyan-800/40">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>POIROT (AI Detective)</span>
                  </span>
                </th>
                <th className="p-4 sm:p-5">AWS Cost Explorer</th>
                <th className="p-4 sm:p-5">Manual Spreadsheets</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 sm:p-5 font-medium text-slate-200">{row.feature}</td>

                  {/* POIROT Column */}
                  <td className="p-4 sm:p-5 bg-cyan-950/20 font-medium text-cyan-300 border-x border-cyan-800/30">
                    <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Included</span>
                    </div>
                  </td>

                  {/* AWS Cost Explorer */}
                  <td className="p-4 sm:p-5 text-slate-400">
                    {typeof row.costExplorer === "boolean" ? (
                      row.costExplorer ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <X className="w-4 h-4 text-rose-500" />
                      )
                    ) : (
                      <span className="text-xs font-mono text-slate-400">{row.costExplorer}</span>
                    )}
                  </td>

                  {/* Manual */}
                  <td className="p-4 sm:p-5 text-slate-400">
                    {typeof row.manual === "boolean" ? (
                      row.manual ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <X className="w-4 h-4 text-rose-500" />
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
    </div>
  );
};
