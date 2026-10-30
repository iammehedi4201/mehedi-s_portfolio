"use client";

import React, { useEffect, useRef } from "react";

interface GridLightEffectProps {
  gridSize?: number;
  className?: string;
  maxStreams?: number;
}

interface DataStream {
  x: number;
  y: number;
  speed: number;
  length: number;
  maxOpacity: number;
  isDashed: boolean;
  dashPattern: number[];
}

export function GridLightEffect({
  gridSize = 24,
  className = "",
  maxStreams,
}: GridLightEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Respect user's reduced-motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let lastTime = performance.now();

    // Cache RGB from --brand-primary if available, else default to signature golden-yellow #E5A00D
    let primaryRgb = { r: 229, g: 160, b: 13 };

    const updateColorFromCSS = () => {
      try {
        const hex = getComputedStyle(document.documentElement)
          .getPropertyValue("--brand-primary")
          .trim();
        if (hex && hex.startsWith("#")) {
          const cleanHex = hex.replace("#", "");
          if (cleanHex.length === 6) {
            primaryRgb = {
              r: parseInt(cleanHex.substring(0, 2), 16),
              g: parseInt(cleanHex.substring(2, 4), 16),
              b: parseInt(cleanHex.substring(4, 6), 16),
            };
          }
        }
      } catch {
        // Fallback remains gold (#E5A00D)
      }
    };

    updateColorFromCSS();

    // Resize handling with devicePixelRatio for crisp rendering
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.scale(dpr, dpr);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);

    // Dynamic stream count: sparse & dim (e.g. 12 on desktop, 8 on tablet, 5 on mobile)
    const getStreamCount = () => {
      if (maxStreams !== undefined) return maxStreams;
      if (width >= 1024) return 12;
      if (width >= 640) return 8;
      return 5;
    };

    const createStream = (initialSpawn = false): DataStream => {
      const cols = Math.max(1, Math.floor(width / gridSize));
      const col = Math.floor(Math.random() * (cols + 1));
      const x = col * gridSize;

      // Length between 1.5 to 4.2 grid cells (e.g., 36px to 100px for 24px grid)
      const length = gridSize * (1.5 + Math.random() * 2.7);

      // Top-to-bottom motion: varying speed from 50 to 110 px/s for asynchronous flow
      const speed = 50 + Math.random() * 60;

      // Subtle, dim opacity (0.35 to 0.70 max) - never blinding or distracting
      const maxOpacity = 0.35 + Math.random() * 0.35;

      // 40% chance of a digital dashed packet; 60% smooth streak
      const isDashed = Math.random() < 0.4;
      const dashPattern = isDashed ? [7, 4] : [];

      // Initial spawn scatters streams across the entire viewport height
      // Continuous respawn places new streams staggered above the top edge
      const y = initialSpawn
        ? Math.random() * (height + length) - length
        : -length - Math.random() * 140;

      return {
        x,
        y,
        speed,
        length,
        maxOpacity,
        isDashed,
        dashPattern,
      };
    };

    let streams: DataStream[] = Array.from({ length: getStreamCount() }).map(() =>
      createStream(true)
    );

    // Pause animation when tab is inactive to preserve battery & CPU
    let isDocumentVisible = true;
    const handleVisibility = () => {
      isDocumentVisible = !document.hidden;
      if (isDocumentVisible) {
        lastTime = performance.now();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // Listen to live prefers-reduced-motion changes
    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        cancelAnimationFrame(animationFrameId);
        ctx.clearRect(0, 0, width, height);
      }
    };
    mediaQuery.addEventListener("change", handleMotionChange);

    // Main animation loop
    const render = (time: number) => {
      animationFrameId = requestAnimationFrame(render);
      if (!isDocumentVisible || width === 0 || height === 0) return;

      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      const { r, g, b } = primaryRgb;

      // Dynamically adjust stream count on resize
      const targetCount = getStreamCount();
      if (streams.length < targetCount) {
        streams.push(createStream(false));
      } else if (streams.length > targetCount) {
        streams.pop();
      }

      streams.forEach((stream, index) => {
        // Progress top-to-bottom
        stream.y += stream.speed * delta;

        // Reset when the tail fully leaves below the viewport
        if (stream.y - stream.length > height + 20) {
          streams[index] = createStream(false);
          return;
        }

        // Calculate smooth entrance and exit opacity fades
        const headY = stream.y;
        const tailY = stream.y - stream.length;

        // Fade in as the head enters from the top
        const fadeIn = Math.min(1, Math.max(0, headY / 60));
        // Fade out as the tail leaves through the bottom
        const fadeOut = Math.min(1, Math.max(0, (height - tailY) / 60));
        const effectiveOpacity = stream.maxOpacity * fadeIn * fadeOut;

        if (effectiveOpacity <= 0.01) return;

        ctx.save();

        // 1. Draw glowing vertical data streak / streak packets along the grid line
        const gradient = ctx.createLinearGradient(stream.x, tailY, stream.x, headY);
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${0.28 * effectiveOpacity})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${0.85 * effectiveOpacity})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        if (stream.isDashed) {
          ctx.setLineDash(stream.dashPattern);
        } else {
          ctx.setLineDash([]);
        }

        ctx.beginPath();
        ctx.moveTo(stream.x, tailY);
        ctx.lineTo(stream.x, headY);
        ctx.stroke();

        ctx.setLineDash([]); // Reset dash for dots & halo

        // 2. Micro-nodes at grid intersections within the streak (digital data feeling)
        const startGridY = Math.ceil(tailY / gridSize) * gridSize;
        for (let nodeY = startGridY; nodeY < headY - 3; nodeY += gridSize) {
          if (nodeY >= 0 && nodeY <= height) {
            const distanceRatio = Math.max(0, 1 - (headY - nodeY) / stream.length);
            const nodeOpacity = effectiveOpacity * (0.15 + 0.55 * distanceRatio);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${nodeOpacity})`;
            ctx.beginPath();
            ctx.arc(stream.x, nodeY, 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // 3. Ambient soft radial halo around the leading head
        if (headY >= -10 && headY <= height + 10) {
          const haloRadius = 11;
          const haloGrad = ctx.createRadialGradient(
            stream.x,
            headY,
            0,
            stream.x,
            headY,
            haloRadius
          );
          haloGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0.45 * effectiveOpacity})`);
          haloGrad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${0.15 * effectiveOpacity})`);
          haloGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

          ctx.fillStyle = haloGrad;
          ctx.beginPath();
          ctx.arc(stream.x, headY, haloRadius, 0, Math.PI * 2);
          ctx.fill();

          // 4. Bright golden-white leading core nucleus
          const coreRadius = 2.2;
          const coreGrad = ctx.createRadialGradient(
            stream.x,
            headY,
            0,
            stream.x,
            headY,
            coreRadius
          );
          coreGrad.addColorStop(0, `rgba(255, 252, 235, ${0.95 * effectiveOpacity})`);
          coreGrad.addColorStop(0.65, `rgba(${r}, ${g}, ${b}, ${0.85 * effectiveOpacity})`);
          coreGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

          ctx.fillStyle = coreGrad;
          ctx.beginPath();
          ctx.arc(stream.x, headY, coreRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      mediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, [gridSize, maxStreams]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
}

export default GridLightEffect;
