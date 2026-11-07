"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Sparkles } from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
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
    { href: "/dashboard", label: "AWS Scanner" },
    { href: "/dashboard", label: "Live Audit" },
    { href: "/dashboard/history", label: "Cost History" },
    { href: "https://github.com/karambitbarrage15/POIROT#readme", label: "Documentation", external: true },
    { href: "https://github.com/karambitbarrage15/POIROT", label: "GitHub", external: true },
  ];

  return (
    <header className="w-full pt-6 pb-2 px-4 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto rounded-full bg-[#160d27]/70 backdrop-blur-2xl border border-white/10 px-5 py-2.5 flex items-center justify-between shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        {/* Brand with Colorful Swirl */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400 via-rose-500 to-amber-400 p-[1.5px] flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
            <div className="w-full h-full bg-[#0d0718] rounded-full flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-cyan-400 via-pink-500 to-orange-400 opacity-90" />
            </div>
          </div>
          <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
            <span>POIROT</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            if (link.external) {
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-slate-300/80 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              );
            }
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-xs font-medium transition-colors ${
                  isActive ? "text-white font-semibold" : "text-slate-300/80 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Buttons */}
        <div className="flex items-center gap-2">
          {userEmail ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400 max-w-[120px] truncate">
                {userEmail}
              </span>
              <button
                suppressHydrationWarning
                onClick={handleSignOut}
                className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/5 transition-colors flex items-center gap-1"
              >
                <LogOut className="w-3 h-3" />
                <span>Exit</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-medium text-slate-300 hover:text-white px-4 py-1.5 rounded-full hover:bg-white/5 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/dashboard"
                className="text-xs font-semibold text-white px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 shadow-md shadow-pink-500/20 hover:brightness-110 transition-all active:scale-95"
              >
                Launch Audit
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
