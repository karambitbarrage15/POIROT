"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RegionSelector } from "@/components/RegionSelector";
import { ProgressTracker } from "@/components/ProgressTracker";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import {
  Compass,
  Play,
  History,
  ShieldCheck,
  Cpu,
  Database,
  HardDrive,
  Layers,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

interface Region {
  id: string;
  name: string;
  default?: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [regions, setRegions] = useState<Region[]>([
    { id: "ap-southeast-1", name: "Asia Pacific (Singapore)", default: true },
    { id: "us-east-1", name: "US East (N. Virginia)" },
    { id: "us-east-2", name: "US East (Ohio)" },
    { id: "eu-west-1", name: "Europe (Ireland)" },
    { id: "ap-south-1", name: "Asia Pacific (Mumbai)" },
  ]);
  const [selectedRegion, setSelectedRegion] = useState("ap-southeast-1");
  const [isScanning, setIsScanning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [completedScanId, setCompletedScanId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/aws/regions")
      .then((res) => res.json())
      .then((data) => {
        if (data.regions && data.regions.length > 0) {
          setRegions(data.regions);
          if (data.defaultRegion) {
            setSelectedRegion(data.defaultRegion);
          }
        }
      })
      .catch((err) => console.warn("Using default fallback regions:", err));
  }, []);

  const handleStartAudit = () => {
    setIsScanning(true);
    setIsError(false);
    setCurrentStep(1);
    setStatusMessage(`Connecting to AWS SDK in ${selectedRegion}...`);
    setCompletedScanId(null);

    const token = localStorage.getItem("poirot_token");
    const url = `/api/scan/stream?region=${encodeURIComponent(selectedRegion)}`;

    // Set up EventSource or Fetch with ReadableStream
    // Using fetch with ReadableStream allows passing custom headers like Authorization Bearer
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    fetch(url, { headers })
      .then(async (response) => {
        if (!response.body) {
          throw new Error("ReadableStream not supported on this response");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith("data: ")) {
              try {
                const jsonStr = trimmed.replace("data: ", "").trim();
                const { event, payload } = JSON.parse(jsonStr);

                if (payload?.step) {
                  setCurrentStep(payload.step);
                }
                if (payload?.message) {
                  setStatusMessage(payload.message);
                }

                if (event === "COMPLETE") {
                  setCurrentStep(4);
                  if (payload.scanId) {
                    setCompletedScanId(payload.scanId);
                    // Automatically redirect to report after 2 seconds
                    setTimeout(() => {
                      router.push(`/report/${payload.scanId}`);
                    }, 2200);
                  }
                  setIsScanning(false);
                } else if (event === "ERROR") {
                  setIsError(true);
                  setIsScanning(false);
                }
              } catch (parseError) {
                console.warn("SSE parse error:", parseError);
              }
            }
          }
        }
      })
      .catch((err) => {
        console.error("Scan stream failed:", err);
        setIsError(true);
        setStatusMessage(err?.message || "Failed to establish SSE stream connection");
        setIsScanning(false);
      });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100 flex items-center gap-2.5">
            <Compass className="w-7 h-7 text-cyan-400" />
            <span>Infrastructure Cost Audit</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Scan active AWS resource inventory and trigger FinOps anomaly detection
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push("/dashboard/history")}
            className="text-xs gap-1.5"
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit History</span>
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Control Column */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Play className="w-4 h-4 text-cyan-400" />
                <span>Launch New Audit</span>
              </CardTitle>
              <CardDescription>
                Select your target region to scan live AWS EC2, EBS, RDS, and S3 resources.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <RegionSelector
                regions={regions}
                selectedRegion={selectedRegion}
                onChange={setSelectedRegion}
                disabled={isScanning}
              />

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs text-slate-400">
                <div className="flex items-center gap-2 text-slate-200 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Configured Scanner Engines</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    <span>EC2 & Stopped VMs</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                    <span>Orphaned EBS</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    <span>Idle RDS DBs</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                    <span>Unassociated EIPs</span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full text-base py-3 shadow-lg shadow-cyan-500/20"
                onClick={handleStartAudit}
                isLoading={isScanning}
                disabled={isScanning}
              >
                <span>{isScanning ? "Investigating AWS Scope..." : "Run AI Cloud Cost Audit"}</span>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Info Card */}
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 text-xs text-slate-400 space-y-2">
            <span className="text-slate-200 font-semibold block uppercase tracking-wider text-[10px]">
              How POIROT Operates:
            </span>
            <p className="leading-relaxed">
              POIROT runs read-only AWS metadata queries to extract infrastructure states without altering any resources. The compressed snapshot is dispatched to Meta Llama 3.3 70B via OpenRouter for FinOps reasoning and remediation synthesis.
            </p>
          </div>
        </div>

        {/* Right Stream / Progress Column */}
        <div className="lg:col-span-7 space-y-6">
          {currentStep > 0 ? (
            <div className="space-y-4">
              <ProgressTracker
                currentStep={currentStep}
                statusMessage={statusMessage}
                isError={isError}
              />

              {completedScanId && (
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/50 flex items-center justify-between animate-fadeIn">
                  <div className="text-xs text-emerald-300">
                    <span className="font-semibold block">Audit Complete!</span>
                    <span>Redirecting to full report...</span>
                  </div>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => router.push(`/report/${completedScanId}`)}
                    className="gap-1.5 text-xs"
                  >
                    <span>View Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[350px] flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-slate-800 bg-slate-900/20">
              <div className="w-14 h-14 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 text-cyan-400 flex items-center justify-center mb-4">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-semibold text-slate-200">No active audit in progress</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Select your desired AWS region on the left and click "Run AI Cloud Cost Audit" to inspect your account.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
