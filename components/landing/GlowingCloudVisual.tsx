"use client";

import React from "react";

export const GlowingCloudVisual: React.FC = () => {
  return (
    <div className="relative w-full h-[420px] sm:h-[500px] lg:h-[580px] flex items-center justify-center select-none pointer-events-none">
      {/* Volumetric background bloom lights */}
      <div className="absolute top-1/4 left-1/6 w-80 h-80 bg-cyan-500/20 rounded-full blur-[110px] -z-10 animate-pulse duration-[6000ms]" />
      <div className="absolute top-1/3 right-1/6 w-96 h-96 bg-rose-500/25 rounded-full blur-[120px] -z-10 animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-10 left-1/3 w-64 h-32 bg-purple-500/20 rounded-full blur-[70px] -z-10" />

      {/* Cloud Container with Seamless Feathered Radial Vignette & Screen Blend (Zero rectangular edges) */}
      <div className="relative w-full h-full max-w-[560px] flex items-center justify-center">
        <div
          className="relative w-full h-full flex items-center justify-center overflow-visible"
          style={{
            maskImage: "radial-gradient(ellipse 80% 75% at 50% 48%, black 45%, transparent 82%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 75% at 50% 48%, black 45%, transparent 82%)",
          }}
        >
          <img
            src="/images/hero-cloud.jpg"
            alt="Developer-First AI Cloud Platform Neon Cloud"
            style={{ mixBlendMode: "screen" }}
            className="w-full h-full object-contain scale-105 filter contrast-115 brightness-105 drop-shadow-[0_25px_60px_rgba(244,63,94,0.35)] transition-transform duration-1000 ease-out hover:scale-110"
          />
        </div>

        {/* Ambient floor reflection pool beneath the falling droplets */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-14 bg-gradient-to-t from-pink-500/25 via-purple-500/15 to-transparent blur-2xl rounded-full pointer-events-none" />
      </div>
    </div>
  );
};
