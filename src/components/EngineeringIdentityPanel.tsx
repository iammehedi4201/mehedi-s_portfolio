"use client";

import { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Copy, Check, Building2, Layers, Cpu, Server, Database } from "lucide-react";

interface TechCardProps {
  name: string;
  category: string;
  description: string;
  icon: typeof Layers;
}

const CORE_STACK: TechCardProps[] = [
  {
    name: "Next.js",
    category: "Full-Stack",
    description: "SSR & App Architecture",
    icon: Layers,
  },
  {
    name: "React",
    category: "UI Layer",
    description: "Modular Component Systems",
    icon: Cpu,
  },
  {
    name: "Express.js",
    category: "Backend",
    description: "REST APIs & Middleware",
    icon: Server,
  },
  {
    name: "MongoDB",
    category: "Database",
    description: "Data Models & Aggregations",
    icon: Database,
  },
];

export function EngineeringIdentityPanel() {
  const [copied, setCopied] = useState(false);

  // Subtle 3D tilt with high damping, active only on desktop
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-150, 150], [6, -6]), { stiffness: 280, damping: 28 });
  const rotateY = useSpring(useTransform(x, [-150, 150], [-6, 6]), { stiffness: 280, damping: 28 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (typeof window !== "undefined" && window.innerWidth < 1024) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const handleCopy = () => {
    const text =
      "Mehedi Hasan — Software Engineer at Antopolis\nCore Stack: Next.js, React, Express.js, MongoDB\nClean Architecture & Scalable Web Applications";
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative w-full max-w-[360px] sm:max-w-[420px] rounded-2xl bg-surface border border-border-subtle shadow-card p-4 sm:p-6 cursor-default select-none transition-colors hover:border-brand-primary/30 mx-auto"
    >
      <div style={{ transform: "translateZ(20px)" }} className="flex flex-col space-y-3.5 sm:space-y-4">
        {/* Top Asymmetric Bar: Spec Identifier + Availability Pill */}
        <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm bg-brand-primary" />
            <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-text-muted uppercase">
              Profile // Identity
            </span>
          </div>

          {/* Genuine Availability Tag (available: true) */}
          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono font-medium px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Available
          </span>
        </div>

        {/* Identity Block: Responsive Side-by-Side Name, Role & Company */}
        <div className="flex items-start justify-between gap-2.5 pt-0.5">
          <div className="min-w-0">
            <span className="text-[10px] sm:text-[11px] font-mono text-text-muted uppercase tracking-wider block mb-0.5">
              Software Engineer
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-heading font-sans leading-tight truncate">
              Mehedi Hasan
            </h2>
          </div>

          {/* Company Badge */}
          <div className="text-right px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-surface-subtle border border-border-subtle flex-shrink-0">
            <span className="text-[8px] sm:text-[9px] font-mono text-text-muted uppercase tracking-wider block">
              Company
            </span>
            <p className="text-xs sm:text-sm font-semibold text-brand-primary font-sans flex items-center justify-end gap-1 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-brand-primary flex-shrink-0" />
              <span>Antopolis</span>
            </p>
          </div>
        </div>

        {/* Core Stack: Modular 2x2 Architectural Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-text-muted">
              Core Technology Stack
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono text-brand-primary">
              4 Core Pillars
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {CORE_STACK.map((tech) => {
              const Icon = tech.icon;
              return (
                <div
                  key={tech.name}
                  className="group relative p-2 sm:p-2.5 rounded-xl bg-surface-subtle border border-border-subtle hover:border-brand-primary/40 hover:bg-surface-elevated transition-colors duration-200"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[8px] sm:text-[9px] font-mono text-text-muted uppercase tracking-wider">
                      {tech.category}
                    </span>
                    <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-text-muted group-hover:text-brand-primary transition-colors flex-shrink-0" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-heading font-sans leading-snug">
                    {tech.name}
                  </h4>
                  <p className="text-[9px] sm:text-[10px] text-text-muted font-sans mt-0.5 leading-tight">
                    {tech.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Engineering Philosophy / Discipline (cleanArchitecture: true) */}
        <div className="grid grid-cols-2 gap-2 p-2.5 sm:p-3 rounded-xl bg-surface-subtle border border-border-subtle">
          <div>
            <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-wider text-text-muted block">
              Architecture
            </span>
            <p className="text-xs sm:text-[13px] font-semibold text-heading font-sans mt-0.5 leading-snug">
              Clean Architecture
            </p>
            <p className="text-[9px] sm:text-[10px] text-text-muted font-sans mt-0.5 leading-tight">
              Modular &amp; Decoupled
            </p>
          </div>

          <div className="border-l border-border-subtle pl-2.5 sm:pl-3">
            <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-wider text-text-muted block">
              Focus
            </span>
            <p className="text-xs sm:text-[13px] font-semibold text-heading font-sans mt-0.5 leading-snug">
              Scalable Systems
            </p>
            <p className="text-[9px] sm:text-[10px] text-text-muted font-sans mt-0.5 leading-tight">
              CMS, APIs &amp; Dashboards
            </p>
          </div>
        </div>

        {/* Bottom Meta & Functional Action */}
        <div className="pt-1 flex items-center justify-between text-xs">
          <span className="text-[10px] sm:text-[11px] font-mono text-text-muted">
            Dhaka, Bangladesh
          </span>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-text-muted hover:text-brand-primary transition-colors px-2 py-0.5 rounded-md hover:bg-surface-subtle"
            aria-label="Copy profile summary"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-color-success" />
                <span className="text-color-success font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Summary</span>
              </>
            )}
          </button>
        </div>

        {/* Solid Signature Accent Line */}
        <div className="h-1 w-full rounded-full bg-brand-primary" />
      </div>
    </motion.div>
  );
}
