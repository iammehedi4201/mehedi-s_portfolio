"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface InteractiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  gridSize?: number;
  highlightRadius?: number;
}

export function InteractiveGrid({
  children,
  className,
  gridSize = 32,
  ...props
}: InteractiveGridProps) {
  return (
    <div className={cn("relative overflow-hidden", className)} {...props}>
      {/* Background Architectural Grid Pattern (Solid SVG lines, Zero Gradients) */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-40 [color:var(--border-subtle)]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="arch-grid-pattern"
            width={gridSize}
            height={gridSize}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#arch-grid-pattern)" />
      </svg>

      {/* Content wrapper */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

