"use client";

import React from "react";
import { CheckCircle2, Loader2, Circle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProgressStep {
  id: number;
  label: string;
  description: string;
}

const STEPS: ProgressStep[] = [
  { id: 1, label: "Authentication", description: "Verifying AWS credentials & regional scope" },
  { id: 2, label: "Resource Extraction", description: "Scanning EC2, EBS, RDS, S3 configurations" },
  { id: 3, label: "AI Reasoning Engine", description: "FinOps anomaly detection with Llama 3.3 70B" },
  { id: 4, label: "Audit Report Generation", description: "Saving findings & calculating total savings" },
];

interface ProgressTrackerProps {
  currentStep: number;
  statusMessage?: string;
  isError?: boolean;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  currentStep,
  statusMessage,
  isError = false,
}) => {
  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <span>Audit Execution Stream</span>
            {currentStep < 4 && !isError && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry streamed via Server-Sent Events (SSE)
          </p>
        </div>
        <div className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2.5 py-1 rounded-md">
          Step {Math.min(currentStep, 4)} of 4
        </div>
      </div>

      <div className="space-y-4">
        {STEPS.map((step) => {
          const isComplete = currentStep > step.id || (currentStep === 4 && !isError);
          const isActive = currentStep === step.id && !isError;
          const isPending = currentStep < step.id;

          return (
            <div
              key={step.id}
              className={cn(
                "flex items-start gap-4 p-3.5 rounded-lg border transition-all duration-300",
                isActive && "bg-cyan-950/20 border-cyan-500/40 shadow-sm shadow-cyan-500/10",
                isComplete && "bg-slate-900/40 border-slate-800/80",
                isPending && "bg-slate-950/30 border-slate-900 opacity-50"
              )}
            >
              <div className="mt-0.5">
                {isError && currentStep === step.id ? (
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                ) : isComplete ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : isActive ? (
                  <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4
                    className={cn(
                      "text-sm font-medium",
                      isActive ? "text-cyan-300 font-semibold" : isComplete ? "text-slate-200" : "text-slate-500"
                    )}
                  >
                    {step.label}
                  </h4>
                  {isActive && (
                    <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider animate-pulse">
                      In Progress
                    </span>
                  )}
                  {isComplete && (
                    <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
                      Done
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {statusMessage && (
        <div
          className={cn(
            "mt-5 p-3 rounded-lg border text-xs font-mono flex items-center gap-2",
            isError
              ? "bg-rose-950/30 border-rose-800/60 text-rose-300"
              : "bg-slate-950/80 border-slate-800 text-slate-300"
          )}
        >
          <span className="text-cyan-400">&gt;</span>
          <span className="truncate">{statusMessage}</span>
        </div>
      )}
    </div>
  );
};
