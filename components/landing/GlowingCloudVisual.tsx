"use client";

import React from "react";

export const GlowingCloudVisual: React.FC = () => {
  return (
    <div className="relative w-full h-[420px] sm:h-[500px] lg:h-[580px] flex items-center justify-center select-none pointer-events-none">
      {/* Volumetric background bloom lights */}
      <div className="absolute top-1/4 left-1/6 w-80 h-80 bg-cyan-500/20 rounded-full blur-[110px] -z-10 animate-pulse duration-[6000ms]" />
      <div className="absolute top-1/3 right-1/6 w-96 h-96 bg-rose-500/25 rounded-full blur-[120px] -z-10 animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-10 left-1/3 w-64 h-32 bg-purple-500/20 rounded-full blur-[70px] -z-10" />

      {/* Cloud Container with Seamless Feathered Radial Vignette (Zero rectangular edges) */}
      <div className="relative w-full h-full max-w-[560px] flex items-center justify-center">
        <div
          className="relative w-full h-full flex items-center justify-center overflow-hidden"
          style={{
            maskImage: "radial-gradient(ellipse 68% 62% at 50% 48%, black 45%, transparent 72%)",
            WebkitMaskImage: "radial-gradient(ellipse 68% 62% at 50% 48%, black 45%, transparent 72%)",
          }}
        >
          <img
            src="/images/hero-cloud.jpg"
            alt="Developer-First AI Cloud Platform Neon Cloud"
            className="w-full h-full object-contain scale-105 filter contrast-110 brightness-105 drop-shadow-[0_25px_60px_rgba(244,63,94,0.3)] transition-transform duration-1000 ease-out hover:scale-110"
          />
        </div>

        {/* Ambient floor reflection pool beneath the falling droplets */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-gradient-to-t from-pink-500/20 via-purple-500/10 to-transparent blur-xl rounded-full" />
      </div>
    </div>
  );
};
