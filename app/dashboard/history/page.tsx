"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  History,
  Calendar,
  Globe,
  ArrowRight,
  Layers,
  AlertTriangle,
  RotateCcw,
  Loader2,
  FileText,
} from "lucide-react";

export default function HistoryPage() {
  const router = useRouter();
  const [scans, setScans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/history")
      .then((res) => res.json())
      .then((data) => {
        if (data.scans) {
          setScans(data.scans);
        }
      })
      .catch((err) => console.error("Error loading scan history:", err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100 flex items-center gap-2.5">
            <History className="w-7 h-7 text-cyan-400" />
            <span>Audit History & Savings Timeline</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review past cloud audits, historical findings, and tracked optimization records
          </p>
        </div>

        <div>
          <Button
            size="sm"
            onClick={() => router.push("/dashboard")}
            className="text-xs gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Run New Audit</span>
          </Button>
        </div>
      </div>

      {/* History Table */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-sm text-slate-400">Loading audit history...</p>
        </div>
      ) : scans.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-slate-200">No cloud audits on record</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You haven't run any cloud cost scans yet. Select a region and launch your first audit!
          </p>
          <Button onClick={() => router.push("/dashboard")} className="mt-2 text-xs">
            <span>Launch Detective Audit</span>
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/70 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Audit ID & Scope</th>
                  <th className="px-5 py-3.5">Date & Time</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Scanned</th>
                  <th className="px-5 py-3.5">Findings</th>
                  <th className="px-5 py-3.5 text-right">Estimated Waste</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {scans.map((scan) => {
                  const wasteNum = parseFloat(scan.totalMonthlyWasteUsd) || 0;
                  return (
                    <tr
                      key={scan.id}
                      className="hover:bg-slate-800/40 transition-colors duration-150 group"
                    >
                      <td className="px-5 py-4 font-mono text-xs">
                        <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{scan.awsRegion}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          #{scan.id.substring(0, 8)}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-xs text-slate-400">
                        {formatDate(scan.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                            scan.status === "complete"
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : scan.status === "failed"
                              ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                              : "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 animate-pulse"
                          }`}
                        >
                          {scan.status.toUpperCase()}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-xs font-mono text-slate-300">
                        {scan.resourcesScanned} items
                      </td>

                      <td className="px-5 py-4 text-xs font-mono">
                        {scan.findingsCount > 0 ? (
                          <span className="text-amber-400 font-semibold flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>{scan.findingsCount} issues</span>
                          </span>
                        ) : (
                          <span className="text-emerald-400">Clean</span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right font-mono font-bold text-rose-400 text-sm">
                        {formatCurrency(wasteNum)}/mo
                      </td>

                      <td className="px-5 py-4 text-right">
                        <Link href={`/report/${scan.id}`}>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="text-xs gap-1 group-hover:border-cyan-500/40"
                          >
                            <span>View Report</span>
                            <ArrowRight className="w-3 h-3" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
