"use client";

import React from "react";
import { Globe } from "lucide-react";

interface Region {
  id: string;
  name: string;
  default?: boolean;
}

interface RegionSelectorProps {
  regions: Region[];
  selectedRegion: string;
  onChange: (regionId: string) => void;
  disabled?: boolean;
}

export const RegionSelector: React.FC<RegionSelectorProps> = ({
  regions,
  selectedRegion,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="w-full space-y-1.5">
      <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider">
        Target AWS Regional Scope
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cyan-400">
          <Globe className="w-4 h-4" />
        </div>
        <select
          value={selectedRegion}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 font-medium focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer transition-colors"
        >
          {regions.map((r) => (
            <option key={r.id} value={r.id} className="bg-slate-900 text-slate-100 py-1">
              {r.name} ({r.id})
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};
