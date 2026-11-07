"use client";

import React, { useEffect, useRef } from "react";

interface InteractiveCursorLinesProps {
  className?: string;
  lineCount?: number;
  interactiveRadius?: number;
}

export const InteractiveCursorLines: React.FC<InteractiveCursorLinesProps> = ({
  className = "",
  lineCount = 14,
  interactiveRadius = 180,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight);

    // Mouse state with smooth damping
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      vx: 0,
      vy: 0,
      lastX: -1000,
      lastY: -1000,
      isHovered: false,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouse.isHovered = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);
    canvas.parentElement?.addEventListener("mouseleave", handleMouseLeave);

    // Color palettes matching POIROT dark violet theme
    const strokeColors = [
      "rgba(139, 92, 246, ",  // violet
      "rgba(56, 189, 248, ",  // cyan
      "rgba(244, 63, 94, ",   // rose
      "rgba(192, 132, 252, ", // purple
      "rgba(45, 212, 191, ",  // teal
    ];

    let time = 0;

    const render = () => {
      // Smooth mouse interpolation (spring/easing)
      if (mouse.isHovered) {
        const dx = mouse.targetX - mouse.x;
        const dy = mouse.targetY - mouse.y;
        mouse.vx = dx * 0.12;
        mouse.vy = dy * 0.12;
        mouse.x += mouse.vx;
        mouse.y += mouse.vy;
      } else {
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;
      }

      ctx.clearRect(0, 0, width, height);

      time += 0.015;

      const stepY = height / (lineCount + 1);
      const pointsPerLine = Math.max(30, Math.floor(width / 35));
      const stepX = width / (pointsPerLine - 1);

      // Store closest points to cursor for connecting magnetic beam rays
      const closePoints: { x: number; y: number; dist: number }[] = [];

      // Draw undulating interactive wave lines
      for (let i = 0; i < lineCount; i++) {
        const baseLineY = stepY * (i + 1);
        const colorPrefix = strokeColors[i % strokeColors.length];
        const lineOffset = i * 0.45;

        ctx.beginPath();

        const linePoints: { x: number; y: number }[] = [];

        for (let j = 0; j < pointsPerLine; j++) {
          const px = j * stepX;

          // Ambient fluid wave equation
          const wave1 = Math.sin(time + j * 0.18 + lineOffset) * 14;
          const wave2 = Math.cos(time * 0.8 + j * 0.12 + i * 0.3) * 8;
          let py = baseLineY + wave1 + wave2;

          // Interactive cursor reaction: lines distort and warp as cursor moves
          if (mouse.x > -500) {
            const distToMouse = Math.hypot(px - mouse.x, py - mouse.y);
            if (distToMouse < interactiveRadius) {
              const factor = 1 - distToMouse / interactiveRadius;
              // Smooth cubic falloff
              const force = factor * factor * (3 - 2 * factor);

              // Directional deflection: push lines away with a wave ripple
              const angle = Math.atan2(py - mouse.y, px - mouse.x);
              const pushY = Math.sin(angle) * force * 55;
              const pushX = Math.cos(angle) * force * 20;

              // Mouse velocity wake effect
              const velocityPush = (mouse.vy * 0.4 + mouse.vx * 0.2) * force;

              py += pushY + velocityPush;

              if (j % 3 === 0 && distToMouse < interactiveRadius * 0.8) {
                closePoints.push({ x: px + pushX, y: py, dist: distToMouse });
              }
            }
          }

          linePoints.push({ x: px, y: py });
        }

        // Draw smooth Bézier curve through line points
        if (linePoints.length > 0) {
          ctx.moveTo(linePoints[0].x, linePoints[0].y);

          for (let k = 0; k < linePoints.length - 1; k++) {
            const p0 = linePoints[k];
            const p1 = linePoints[k + 1];
            const midX = (p0.x + p1.x) / 2;
            const midY = (p0.y + p1.y) / 2;
            ctx.quadraticCurveTo(p0.x, p0.y, midX, midY);
          }

          // Last segment to edge
          const last = linePoints[linePoints.length - 1];
          ctx.lineTo(last.x, last.y);

          // Dynamic line opacity: brighter near cursor
          const lineDistToMouse = Math.abs(baseLineY - mouse.y);
          const isNearMouse = lineDistToMouse < interactiveRadius * 1.2;
          const alpha = isNearMouse ? 0.45 : 0.18;

          ctx.strokeStyle = `${colorPrefix}${alpha})`;
          ctx.lineWidth = isNearMouse ? 1.6 : 1.0;
          ctx.stroke();
        }
      }

      // Draw subtle glowing magnetic rays connecting cursor to the nearest lines
      if (mouse.isHovered && mouse.x > 0 && closePoints.length > 0) {
        closePoints.sort((a, b) => a.dist - b.dist);
        const nearest = closePoints.slice(0, 4);

        nearest.forEach((pt) => {
          const rayAlpha = Math.max(0, 0.4 - pt.dist / (interactiveRadius * 1.5));
          if (rayAlpha > 0.05) {
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(pt.x, pt.y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${rayAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // Tiny particle bead at intersection
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(56, 189, 248, 0.7)";
            ctx.fill();
          }
        });

        // Ambient radial light following cursor
        const radialGlow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          interactiveRadius * 0.9
        );
        radialGlow.addColorStop(0, "rgba(168, 85, 247, 0.12)");
        radialGlow.addColorStop(0.5, "rgba(56, 189, 248, 0.05)");
        radialGlow.addColorStop(1, "rgba(9, 5, 16, 0)");

        ctx.fillStyle = radialGlow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, interactiveRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      canvas.parentElement?.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [lineCount, interactiveRadius]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none select-none z-0 ${className}`}
      style={{ willChange: "transform" }}
    />
  );
};
