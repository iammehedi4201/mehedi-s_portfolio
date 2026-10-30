"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  children: React.ReactNode;
  id: string;
  className?: string;
}

export function SectionWrapper({ children, id, className }: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn("relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-canvas", className)}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  badge?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  title,
  subtitle,
  badge,
  align = "center",
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={cn("mb-14 sm:mb-16", align === "center" && "text-center")}
    >
      {badge && (
        <div className={cn("inline-flex items-center gap-2 mb-3", align === "center" ? "justify-center" : "justify-start")}>
          <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest bg-brand-subtle text-brand-subtle-text border border-brand-primary/30">
            {badge}
          </span>
        </div>
      )}
      <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-heading">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base sm:text-lg text-body font-normal max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className={cn("mt-5 h-1 w-14 rounded-full bg-brand-primary", align === "center" ? "mx-auto" : "")} />
    </motion.div>
  );
}
