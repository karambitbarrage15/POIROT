"use client";

import React, { useState, useMemo } from "react";
import { FindingCard, FindingItem } from "./FindingCard";
import { Search, Filter, AlertTriangle } from "lucide-react";

interface FindingsListProps {
  findings: FindingItem[];
}

export const FindingsList: React.FC<FindingsListProps> = ({ findings }) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = useMemo(() => {
    const set = new Set<string>();
    findings.forEach((f) => {
      if (f.category) set.add(f.category);
    });
    return Array.from(set);
  }, [findings]);

  const filteredFindings = useMemo(() => {
    return findings.filter((f) => {
      // Severity filter
      if (selectedSeverity !== "ALL" && f.severity.toUpperCase() !== selectedSeverity) {
        return false;
      }
      // Category filter
      if (selectedCategory !== "ALL" && f.category.toUpperCase() !== selectedCategory) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = f.issueTitle.toLowerCase().includes(query);
        const matchesId = f.resourceId.toLowerCase().includes(query);
        const matchesName = f.resourceName?.toLowerCase().includes(query);
        const matchesType = f.resourceType.toLowerCase().includes(query);
        if (!matchesTitle && !matchesId && !matchesName && !matchesType) {
          return false;
        }
      }
      return true;
    });
  }, [findings, selectedSeverity, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by resource ID, name, or service..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        {/* Severity Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((sev) => {
            const count =
              sev === "ALL"
                ? findings.length
                : findings.filter((f) => f.severity.toUpperCase() === sev).length;
            const isSelected = selectedSeverity === sev;

            return (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  isSelected
                    ? "bg-cyan-500 text-slate-950 font-semibold shadow-sm"
                    : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                <span>{sev}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? "bg-cyan-600/30 text-slate-950 font-bold" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category Dropdown */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-1.5 px-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c.toUpperCase()}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Results List */}
      {filteredFindings.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-slate-900/40 border border-slate-800/80">
          <AlertTriangle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-semibold text-slate-300">No findings match your filter</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your severity filter or search terms to display detected cost issues.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFindings.map((finding, idx) => (
            <FindingCard key={finding.id || idx} finding={finding} />
          ))}
        </div>
      )}
    </div>
  );
};
