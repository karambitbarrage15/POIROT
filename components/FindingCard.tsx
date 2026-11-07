"use client";

import React from "react";
import { Badge } from "./ui/Badge";
import { CodeBlock } from "./CodeBlock";
import { formatCurrency } from "@/lib/utils";
import { AlertCircle, ShieldAlert, Database, HardDrive, Server, Globe2, FolderArchive, Network } from "lucide-react";

export interface FindingItem {
  id?: string;
  resourceId: string;
  resourceName?: string | null;
  resourceType: string;
  region: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | string;
  category: "ORPHANED" | "OVERPROVISIONED" | "MISCONFIGURED" | "LIFECYCLE" | "IDLE" | string;
  issueTitle: string;
  explanation: string;
  estimatedMonthlyWasteUSD?: number | string;
  estimatedMonthlyWasteUsd?: number | string;
  remediationCommand?: string | null;
  riskAssessment?: string | null;
}

interface FindingCardProps {
  finding: FindingItem;
}

export const FindingCard: React.FC<FindingCardProps> = ({ finding }) => {
  const rawWaste = finding.estimatedMonthlyWasteUSD ?? finding.estimatedMonthlyWasteUsd ?? 0;
  const wasteAmount =
    typeof rawWaste === "number"
      ? rawWaste
      : parseFloat(String(rawWaste)) || 0;

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "ec2instance":
        return <Server className="w-4 h-4 text-cyan-400" />;
      case "ebsvolume":
        return <HardDrive className="w-4 h-4 text-indigo-400" />;
      case "rdsinstance":
        return <Database className="w-4 h-4 text-blue-400" />;
      case "elasticip":
        return <Globe2 className="w-4 h-4 text-purple-400" />;
      case "s3bucket":
        return <FolderArchive className="w-4 h-4 text-emerald-400" />;
      case "loadbalancer":
        return <Network className="w-4 h-4 text-pink-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getSeverityVariant = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "critical";
      case "high":
        return "high";
      case "medium":
        return "medium";
      case "low":
        return "low";
      default:
        return "default";
    }
  };

  const getCategoryVariant = (category: string) => {
    switch (category.toLowerCase()) {
      case "orphaned":
        return "orphaned";
      case "overprovisioned":
        return "overprovisioned";
      case "misconfigured":
        return "misconfigured";
      case "lifecycle":
        return "lifecycle";
      case "idle":
        return "idle";
      default:
        return "default";
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-xl p-5 shadow-xl transition-all duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            {getTypeIcon(finding.resourceType)}
          </div>
          <div>
            <h4 className="text-base font-semibold text-slate-100 flex items-center gap-2 flex-wrap">
              <span>{finding.issueTitle}</span>
            </h4>
            <div className="flex items-center gap-2 mt-1 font-mono text-xs text-slate-400">
              <span className="text-slate-200 font-semibold">{finding.resourceName || finding.resourceId}</span>
              <span>•</span>
              <span className="text-slate-500">{finding.resourceId}</span>
              <span>•</span>
              <span className="text-slate-500">{finding.region}</span>
            </div>
          </div>
        </div>

        {/* Waste Callout & Badges */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
          <div className="text-right">
            <span className="text-xs text-slate-400 block sm:inline mr-1">Waste:</span>
            <span className="text-base font-bold text-rose-400 font-mono">
              {formatCurrency(wasteAmount)}/mo
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant={getSeverityVariant(finding.severity)}>{finding.severity}</Badge>
            <Badge variant={getCategoryVariant(finding.category)}>{finding.category}</Badge>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="py-4 text-sm text-slate-300 leading-relaxed">
        {finding.explanation}
      </div>

      {/* Risk Assessment Warning */}
      {finding.riskAssessment && (
        <div className="mb-4 p-3 rounded-lg bg-amber-950/20 border border-amber-800/30 flex items-start gap-2.5 text-xs text-amber-200/90">
          <ShieldAlert className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <span className="font-semibold text-amber-300 mr-1.5 uppercase tracking-wider text-[10px]">
              Safety Verification:
            </span>
            <span>{finding.riskAssessment}</span>
          </div>
        </div>
      )}

      {/* Fix Command */}
      {finding.remediationCommand && (
        <div>
          <div className="text-xs font-medium text-slate-400 mb-1.5 flex items-center justify-between">
            <span>Remediation CLI Command</span>
            <span className="text-[11px] text-cyan-400/80 font-mono">One-click copy & execute in terminal</span>
          </div>
          <CodeBlock code={finding.remediationCommand} language="aws-cli" />
        </div>
      )}
    </div>
  );
};
