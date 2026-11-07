"use client";

import React from "react";
import { formatCurrency } from "@/lib/utils";
import { Layers, AlertTriangle, DollarSign, TrendingDown } from "lucide-react";

interface SummaryCardsProps {
  resourcesScanned: number;
  findingsCount: number;
  totalMonthlyWasteUSD: number;
  criticalCount?: number;
  highCount?: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  resourcesScanned,
  findingsCount,
  totalMonthlyWasteUSD,
  criticalCount = 0,
  highCount = 0,
}) => {
  const annualSavings = totalMonthlyWasteUSD * 12;

  const cards = [
    {
      title: "Monthly Wastage",
      value: formatCurrency(totalMonthlyWasteUSD),
      description: "Immediate optimization target",
      icon: DollarSign,
      color: "text-rose-400",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20",
    },
    {
      title: "Annualized Savings",
      value: formatCurrency(annualSavings),
      description: "Projected 12-month reduction",
      icon: TrendingDown,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      title: "Flagged Resources",
      value: findingsCount.toString(),
      description: `${criticalCount} critical • ${highCount} high priority`,
      icon: AlertTriangle,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    {
      title: "Resources Audited",
      value: resourcesScanned.toString(),
      description: "EC2, EBS, RDS, EIP, S3",
      icon: Layers,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-5 rounded-xl border bg-slate-900/80 backdrop-blur-sm ${card.borderColor} shadow-lg transition-transform duration-200 hover:-translate-y-0.5`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                {card.title}
              </span>
              <div className={`p-2 rounded-lg ${card.bgColor} ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className={`text-2xl font-bold tracking-tight ${card.color} font-mono`}>
              {card.value}
            </div>
            <div className="text-xs text-slate-400 mt-1">{card.description}</div>
          </div>
        );
      })}
    </div>
  );
};
