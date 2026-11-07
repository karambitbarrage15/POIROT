"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const SavingsCalculator: React.FC = () => {
  const [monthlySpend, setMonthlySpend] = useState<number>(40000);

  // Industry average cloud waste is between 30% and 35%
  const wastePercentage = 0.32;
  const estimatedMonthlySavings = monthlySpend * wastePercentage;
  const estimatedAnnualSavings = estimatedMonthlySavings * 12;
  const engineeringHoursSaved = Math.round(monthlySpend / 1200) + 8;

  return (
    <div className="w-full max-w-4xl mx-auto py-8 space-y-10">
      {/* Title & Context */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/40">
          Interactive ROI Calculator
        </span>
        <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          How much cloud budget are you burning?
        </h3>
        <p className="text-sm text-[#9c91b0] leading-relaxed">
          Drag the slider to your current monthly AWS spend to estimate immediate recoverable waste.
        </p>
      </div>

      {/* Main Interactive Control (Single Surface - No nested boxes) */}
      <div className="space-y-6 pt-2">
        <div className="flex items-baseline justify-between border-b border-white/10 pb-4">
          <span className="text-xs font-mono text-[#8b80a1] uppercase tracking-wider">
            Current Monthly AWS Spend
          </span>
          <span className="text-3xl sm:text-4xl font-bold font-mono bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
            {formatCurrency(monthlySpend)}/mo
          </span>
        </div>

        {/* Custom Range Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min="2000"
            max="150000"
            step="1000"
            value={monthlySpend}
            onChange={(e) => setMonthlySpend(Number(e.target.value))}
            className="w-full h-2 bg-[#1b122e] rounded-full appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
          />

          <div className="flex justify-between text-[11px] font-mono text-[#6c6183] pt-1">
            <span>$2,000/mo</span>
            <span>$50,000/mo</span>
            <span>$100,000/mo</span>
            <span>$150,000+/mo</span>
          </div>
        </div>
      </div>

      {/* Result Metrics (Clean typography with hairline dividers - NO nested cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10 pt-4 border-t border-white/10">
        <div className="py-4 sm:py-0 sm:px-6 text-center space-y-1">
          <div className="text-xs font-mono text-[#8b80a1] uppercase tracking-wider">
            Monthly Recoverable
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">
            {formatCurrency(estimatedMonthlySavings)}
          </div>
          <div className="text-[11px] text-[#716788]">~32% FinOps waste factor</div>
        </div>

        <div className="py-4 sm:py-0 sm:px-6 text-center space-y-1">
          <div className="text-xs font-mono text-[#8b80a1] uppercase tracking-wider">
            12-Month Projected ROI
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400">
            {formatCurrency(estimatedAnnualSavings)}
          </div>
          <div className="text-[11px] text-[#716788]">Annual bottom-line profit</div>
        </div>

        <div className="py-4 sm:py-0 sm:px-6 text-center space-y-1">
          <div className="text-xs font-mono text-[#8b80a1] uppercase tracking-wider">
            DevOps Time Saved
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400">
            ~{engineeringHoursSaved} hrs/mo
          </div>
          <div className="text-[11px] text-[#716788]">Zero manual spreadsheet audits</div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center pt-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 text-white font-semibold text-sm shadow-xl shadow-pink-500/20 hover:brightness-110 transition-all active:scale-95"
        >
          <span>Audit Your Real AWS Spend Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
