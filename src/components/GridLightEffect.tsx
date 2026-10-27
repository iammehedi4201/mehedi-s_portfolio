"use client";

import React, { useEffect, useRef } from "react";

interface GridLightEffectProps {
  gridSize?: number;
  className?: string;
  maxSparks?: number;
}

interface Spark {
  x: number;
  y: number;
  direction: "up" | "down" | "left" | "right";
  speed: number;
  length: number;
  opacity: number;
  maxOpacity: number;
  state: "in" | "active" | "out";
  distanceTraveled: number;
  totalDistance: number;
  distanceSinceLastTurn: number;
  minTurnDistance: number;
}

export function GridLightEffect({
  gridSize = 24,
  className = "",
  maxSparks = 6,
}: GridLightEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Respect user's reduced-motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

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
        // Fallback remains gold
      }
    };

    updateColorFromCSS();

    // Resize handling with devicePixelRatio for razor-sharp hairlines
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

    // Responsive spark count (fewer on mobile for peak efficiency)
    const activeSparkCount = width < 768 ? Math.max(3, Math.floor(maxSparks / 2)) : maxSparks;

    const directions: ("up" | "down" | "left" | "right")[] = [
      "up",
      "down",
      "left",
      "right",
    ];

    const createSpark = (initialSpawn = false): Spark => {
      const isHorizontal = Math.random() > 0.5;
      const cols = Math.max(1, Math.floor(width / gridSize));
      const rows = Math.max(1, Math.floor(height / gridSize));

      let x: number;
      let y: number;
      let direction: "up" | "down" | "left" | "right";

      if (isHorizontal) {
        direction = Math.random() > 0.5 ? "right" : "left";
        const gridRow = Math.floor(Math.random() * (rows + 1));
        y = gridRow * gridSize;
        x = initialSpawn
          ? Math.floor(Math.random() * (cols + 1)) * gridSize
          : direction === "right"
          ? 0
          : cols * gridSize;
      } else {
        direction = Math.random() > 0.5 ? "down" : "up";
        const gridCol = Math.floor(Math.random() * (cols + 1));
        x = gridCol * gridSize;
        y = initialSpawn
          ? Math.floor(Math.random() * (rows + 1)) * gridSize
          : direction === "down"
          ? 0
          : rows * gridSize;
      }

      const totalDistance = gridSize * (8 + Math.floor(Math.random() * 16)); // Travels 8 to 24 cells
      const minTurnDistance = gridSize * (3 + Math.floor(Math.random() * 4)); // Can turn after 3-6 cells

      return {
        x,
        y,
        direction,
        speed: 55 + Math.random() * 45, // 55 to 100 px/s (smooth, elegant velocity)
        length: gridSize * 1.5 + Math.random() * gridSize * 1.5, // 36px to 72px tail
        opacity: 0,
        maxOpacity: 0.6 + Math.random() * 0.35, // 0.6 to 0.95 (vivid but soft)
        state: "in",
        distanceTraveled: 0,
        totalDistance,
        distanceSinceLastTurn: 0,
        minTurnDistance,
      };
    };

    const sparks: Spark[] = Array.from({ length: activeSparkCount }).map(() =>
      createSpark(true)
    );

    let isDocumentVisible = true;
    const handleVisibility = () => {
      isDocumentVisible = !document.hidden;
      if (isDocumentVisible) {
        lastTime = performance.now();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // Main animation loop
    const render = (time: number) => {
      animationFrameId = requestAnimationFrame(render);
      if (!isDocumentVisible) return;

      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      const { r, g, b } = primaryRgb;

      sparks.forEach((spark, index) => {
        // Opacity transition state machine
        if (spark.state === "in") {
          spark.opacity += delta * 2.5;
          if (spark.opacity >= spark.maxOpacity) {
            spark.opacity = spark.maxOpacity;
            spark.state = "active";
          }
        } else if (spark.state === "active") {
          if (spark.distanceTraveled >= spark.totalDistance * 0.8) {
            spark.state = "out";
          }
        } else if (spark.state === "out") {
          spark.opacity -= delta * 1.8;
          if (spark.opacity <= 0) {
            sparks[index] = createSpark(false);
            return;
          }
        }

        // Advance position along current direction
        const step = spark.speed * delta;
        spark.distanceTraveled += step;
        spark.distanceSinceLastTurn += step;

        const prevX = spark.x;
        const prevY = spark.y;

        switch (spark.direction) {
          case "right":
            spark.x += step;
            break;
          case "left":
            spark.x -= step;
            break;
          case "down":
            spark.y += step;
            break;
          case "up":
            spark.y -= step;
            break;
        }

        // Handle 90-degree turning at intersecting grid lines
        if (spark.distanceSinceLastTurn >= spark.minTurnDistance) {
          if (spark.direction === "right" || spark.direction === "left") {
            // Check if we crossed a vertical grid line
            const cellBefore = Math.floor(prevX / gridSize);
            const cellAfter = Math.floor(spark.x / gridSize);

            if (cellBefore !== cellAfter) {
              const gridCrossX = (spark.direction === "right" ? cellAfter : cellBefore) * gridSize;
              // 35% chance to make a 90-degree turn
              if (Math.random() < 0.35) {
                spark.x = gridCrossX;
                spark.direction = Math.random() > 0.5 ? "down" : "up";
                spark.distanceSinceLastTurn = 0;
              }
            }
          } else {
            // Check if we crossed a horizontal grid line
            const cellBefore = Math.floor(prevY / gridSize);
            const cellAfter = Math.floor(spark.y / gridSize);

            if (cellBefore !== cellAfter) {
              const gridCrossY = (spark.direction === "down" ? cellAfter : cellBefore) * gridSize;
              // 35% chance to make a 90-degree turn
              if (Math.random() < 0.35) {
                spark.y = gridCrossY;
                spark.direction = Math.random() > 0.5 ? "right" : "left";
                spark.distanceSinceLastTurn = 0;
              }
            }
          }
        }

        // Out-of-bounds reset
        if (
          spark.x < -gridSize ||
          spark.x > width + gridSize ||
          spark.y < -gridSize ||
          spark.y > height + gridSize
        ) {
          sparks[index] = createSpark(false);
          return;
        }

        if (spark.opacity <= 0.01) return;

        // Calculate tail start position
        let tailX = spark.x;
        let tailY = spark.y;
        switch (spark.direction) {
          case "right":
            tailX = spark.x - spark.length;
            break;
          case "left":
            tailX = spark.x + spark.length;
            break;
          case "down":
            tailY = spark.y - spark.length;
            break;
          case "up":
            tailY = spark.y + spark.length;
            break;
        }

        // 1. Draw glowing tail beam traveling along the grid line
        const gradient = ctx.createLinearGradient(tailX, tailY, spark.x, spark.y);
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
        gradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${0.35 * spark.opacity})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${0.95 * spark.opacity})`);

        ctx.save();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(spark.x, spark.y);
        ctx.stroke();

        // 2. Soft radial ambient halo around the spark head
        const haloRadius = 14;
        const haloGrad = ctx.createRadialGradient(
          spark.x,
          spark.y,
          0,
          spark.x,
          spark.y,
          haloRadius
        );
        haloGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0.5 * spark.opacity})`);
        haloGrad.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${0.2 * spark.opacity})`);
        haloGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, haloRadius, 0, Math.PI * 2);
        ctx.fill();

        // 3. Bright golden-white core nucleus at the spark head
        const coreGrad = ctx.createRadialGradient(
          spark.x,
          spark.y,
          0,
          spark.x,
          spark.y,
          2.5
        );
        coreGrad.addColorStop(0, `rgba(255, 255, 240, ${0.95 * spark.opacity})`);
        coreGrad.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${0.9 * spark.opacity})`);
        coreGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [gridSize, maxSparks]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
}
export default GridLightEffect;
