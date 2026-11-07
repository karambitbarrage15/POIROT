import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "critical" | "high" | "medium" | "low" | "orphaned" | "overprovisioned" | "misconfigured" | "lifecycle" | "idle" | "default";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = "default",
  ...props
}) => {
  const variants = {
    critical: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    high: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    low: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    orphaned: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    overprovisioned: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    misconfigured: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    lifecycle: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    idle: "bg-slate-500/15 text-slate-400 border-slate-500/30",
    default: "bg-slate-800 text-slate-300 border-slate-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide uppercase transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
