"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export const FaqAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Does POIROT require write permissions in my AWS account?",
      a: "No. POIROT requires strictly read-only describe permissions (ec2:Describe*, rds:Describe*, s3:ListAllMyBuckets). It cannot provision, modify, stop, or delete any resource. All remediation scripts are provided as copyable AWS CLI commands for you to review and execute.",
    },
    {
      q: "How does the AI reasoning engine differ from traditional billing alerts?",
      a: "Traditional tools show lagging billing charts days after charges accumulate. POIROT inspects your active infrastructure state directly: cross-referencing stopped instances with unreleased Elastic IPs, finding unattached disks, and checking non-prod Multi-AZ databases against 2026 FinOps pricing baselines.",
    },
    {
      q: "How is OpenRouter's Meta Llama 3.3 70B model completely free?",
      a: "OpenRouter provides free community endpoints for select open-source models including meta-llama/llama-3.3-70b-instruct:free. We configured strict $0 limits so your account can never be billed.",
    },
    {
      q: "What if my AWS account currently has zero resources in a region?",
      a: "POIROT includes an intelligent Demo Mock Fallback toggle on the dashboard. If your AWS account returns 0 resources in a selected region, it will load 5 realistic sample waste scenarios so you can experience the AI reasoning engine and UI report.",
    },
    {
      q: "Where are my AWS credentials stored?",
      a: "Your AWS keys exist only on your local machine inside .env.local. They are never committed to Git, never pushed to GitHub, and never sent to any third party.",
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded-full">
          Frequently Asked Questions
        </span>
        <h2 className="text-3xl font-extrabold text-slate-100">
          Everything you need to know.
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-5 text-left flex items-center justify-between text-sm font-semibold text-slate-200 hover:text-cyan-400 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-cyan-400" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-0 text-xs text-slate-400 leading-relaxed border-t border-slate-800/40">
                  <p className="pt-3">{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
