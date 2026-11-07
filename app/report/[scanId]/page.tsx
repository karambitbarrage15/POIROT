"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SummaryCards } from "@/components/SummaryCards";
import { FindingsList } from "@/components/FindingsList";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import {
  FileText,
  ArrowLeft,
  Calendar,
  Globe,
  Sparkles,
  Loader2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const scanId = params?.scanId as string;

  const [scanData, setScanData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!scanId) return;

    setIsLoading(true);
    fetch(`/api/history/${scanId}`)
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to load audit report");
        }
        return res.json();
      })
      .then((data) => {
        setScanData(data);
      })
      .catch((err) => {
        console.error("Error loading report:", err);
        setError(err.message || "Failed to load report");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [scanId]);

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-center space-y-4">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
        <h3 className="text-lg font-semibold text-slate-200">Loading audit report...</h3>
        <p className="text-xs text-slate-400">Fetching findings from Neon PostgreSQL</p>
      </div>
    );
  }

  if (error || !scanData) {
    return (
      <div className="py-16 text-center space-y-4 max-w-md mx-auto">
        <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-100">Unable to load report</h3>
        <p className="text-sm text-slate-400">{error || "Audit record not found"}</p>
        <Button variant="secondary" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span>Back to Dashboard</span>
        </Button>
      </div>
    );
  }

  const findings = scanData.findings || [];
  const wasteNum = parseFloat(scanData.totalMonthlyWasteUsd) || 0;
  const criticalCount = findings.filter(
    (f: any) => f.severity?.toUpperCase() === "CRITICAL"
  ).length;
  const highCount = findings.filter((f: any) => f.severity?.toUpperCase() === "HIGH").length;

  return (
    <div className="space-y-8 pb-20">
      {/* Top Navigation & Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard")}
              className="text-xs -ml-2 text-slate-400"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Back</span>
            </Button>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
              Audit #{scanData.id.substring(0, 8)}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100 flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-cyan-400" />
            <span>FinOps Audit & Cost Breakdown</span>
          </h1>

          <div className="flex items-center gap-4 text-xs text-slate-400 pt-1 font-mono">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{scanData.awsRegion}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{formatDate(scanData.createdAt)}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard")}
            className="text-xs gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Scan</span>
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <SummaryCards
        resourcesScanned={scanData.resourcesScanned || 0}
        findingsCount={findings.length}
        totalMonthlyWasteUSD={wasteNum}
        criticalCount={criticalCount}
        highCount={highCount}
      />

      {/* Executive Summary Card */}
      {scanData.executiveSummary && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-900/60 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>AI Executive Synthesis (Meta Llama 3.3 70B)</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            {scanData.executiveSummary}
          </p>
        </div>
      )}

      {/* Findings Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100">
            Identified Optimization Findings ({findings.length})
          </h2>
          <span className="text-xs text-slate-400">
            Sorted by potential financial impact
          </span>
        </div>

        <FindingsList findings={findings} />
      </div>
    </div>
  );
}
