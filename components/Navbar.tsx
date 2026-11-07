"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShieldAlert, Compass, History, LogOut, LogIn, ExternalLink, User } from "lucide-react";
import { Button } from "./ui/Button";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check local storage or session
    const storedUser = localStorage.getItem("poirot_user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserEmail(parsed.email || null);
      } catch (_) {}
    }
  }, [pathname]);

  const handleSignOut = () => {
    localStorage.removeItem("poirot_token");
    localStorage.removeItem("poirot_user");
    document.cookie = "poirot_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    setUserEmail(null);
    router.push("/login");
  };

  const navLinks = [
    { href: "/dashboard", label: "Scanner", icon: Compass },
    { href: "/dashboard/history", label: "Audit History", icon: History },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-cyan-400 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-100 flex items-center gap-1.5">
              <span>POIROT</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-400 uppercase">
                AI FinOps
              </span>
            </span>
            <span className="block text-[11px] text-slate-400 font-mono -mt-0.5">
              Cloud Cost Detective
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-slate-900 text-cyan-400 border border-slate-800 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User / Actions */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/karambitbarrage15/POIROT"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 font-medium rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
          >
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {userEmail ? (
            <div className="flex items-center gap-3">
              <span className="hidden lg:inline-block text-xs font-mono text-slate-400 max-w-[150px] truncate">
                {userEmail}
              </span>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-1.5 text-xs">
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400">
                <User className="w-3 h-3 text-cyan-400" />
                <span>Guest Mode</span>
              </span>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm" className="text-xs">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
