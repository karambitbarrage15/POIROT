"use client";

import React, { useEffect, useRef } from "react";

export const GlowingCloudVisual: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle rain streams
    interface Particle {
      x: number;
      y: number;
      speed: number;
      length: number;
      size: number;
      color: string;
      glowColor: string;
      opacity: number;
    }

    const colors = [
      { fill: "#38bdf8", glow: "rgba(56, 189, 248, 0.8)" }, // cyan
      { fill: "#818cf8", glow: "rgba(129, 140, 248, 0.8)" }, // indigo
      { fill: "#f43f5e", glow: "rgba(244, 63, 94, 0.9)" }, // pink/rose
      { fill: "#fb7185", glow: "rgba(251, 113, 133, 0.8)" }, // coral
      { fill: "#fb923c", glow: "rgba(251, 146, 60, 0.8)" }, // orange
      { fill: "#ffffff", glow: "rgba(255, 255, 255, 0.9)" }, // white hot
    ];

    const particles: Particle[] = Array.from({ length: 45 }, () => {
      const c = colors[Math.floor(Math.random() * colors.length)];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 1.2 + Math.random() * 2.5,
        length: 8 + Math.random() * 22,
        size: 1.5 + Math.random() * 2.5,
        color: c.fill,
        glowColor: c.glow,
        opacity: 0.3 + Math.random() * 0.7,
      };
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // Draw vertical falling fiber stream
        ctx.beginPath();
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = p.opacity * 0.6;
        ctx.moveTo(p.x, p.y - p.length);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        // Draw glowing head droplet
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.glowColor;
        ctx.shadowBlur = 12;
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        // Update position
        p.y += p.speed;
        if (p.y > height + 20) {
          p.y = Math.random() * 80;
          p.x = Math.random() * width;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-[450px] sm:h-[540px] lg:h-[620px] flex items-center justify-center select-none pointer-events-none">
      {/* Background ambient multi-color bloom glows */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-500/20 rounded-full blur-[90px] -z-10" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-rose-500/25 rounded-full blur-[100px] -z-10" />

      {/* The 3D Rendered Neon Cloud Artwork */}
      <div className="relative w-full h-full max-w-[580px] flex items-center justify-center">
        <img
          src="/images/hero-cloud.jpg"
          alt="AI Cloud Platform Neon Cloud"
          className="w-full h-full object-contain mix-blend-screen scale-105 transition-transform duration-700 hover:scale-110 drop-shadow-[0_20px_50px_rgba(244,63,94,0.25)]"
        />

        {/* Live animated vertical particle canvas overlaid on the rain streams */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full mix-blend-screen pointer-events-none"
        />
      </div>
    </div>
  );
};
