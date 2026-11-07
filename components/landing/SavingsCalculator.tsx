"use client";

import React, { useState } from "react";
import { DollarSign, TrendingDown, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const SavingsCalculator: React.FC = () => {
  const [monthlySpend, setMonthlySpend] = useState<number>(25000);

  // Industry average cloud waste is between 30% and 35%
  const wastePercentage = 0.32;
  const estimatedMonthlySavings = monthlySpend * wastePercentage;
  const estimatedAnnualSavings = estimatedMonthlySavings * 12;
  const engineeringHoursSaved = Math.round(monthlySpend / 1500) + 12;

  return (
    <div className="w-full max-w-4xl mx-auto p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="space-y-6">
        <div className="text-center space-y-2 max-w-lg mx-auto">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded-full">
            Interactive ROI Calculator
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-100">
            How much cloud budget are you burning?
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Drag the slider to your current monthly AWS spend to estimate immediate recoverable waste.
          </p>
        </div>

        {/* Spend Slider */}
        <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800/90 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Monthly AWS Cloud Bill</span>
            <span className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400">
              {formatCurrency(monthlySpend)}/mo
            </span>
          </div>

          <input
            type="range"
            min="2000"
            max="150000"
            step="1000"
            value={monthlySpend}
            onChange={(e) => setMonthlySpend(Number(e.target.value))}
            className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
          />

          <div className="flex justify-between text-[11px] font-mono text-slate-500">
            <span>$2,000/mo</span>
            <span>$50,000/mo</span>
            <span>$100,000/mo</span>
            <span>$150,000+/mo</span>
          </div>
        </div>

        {/* Calculated Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <div className="text-xs font-mono text-slate-400 uppercase">Monthly Recoverable</div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 mt-1">
              {formatCurrency(estimatedMonthlySavings)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">~32% FinOps waste factor</div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <div className="text-xs font-mono text-slate-400 uppercase">12-Month Projected ROI</div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400 mt-1">
              {formatCurrency(estimatedAnnualSavings)}
            </div>
            <div className="text-[11px] text-cyan-400/80 mt-1">Annual bottom-line profit</div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <div className="text-xs font-mono text-slate-400 uppercase">DevOps Time Saved</div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400 mt-1">
              ~{engineeringHoursSaved} hrs/mo
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Zero manual spreadsheet audits</div>
          </div>
        </div>

        <div className="text-center pt-2">
          <Link href="/dashboard">
            <Button size="lg" className="gap-2 shadow-lg shadow-cyan-500/20">
              <span>Audit Your Real AWS Spend Now</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
