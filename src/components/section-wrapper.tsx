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
      className={cn("relative py-24 px-4 sm:px-6 lg:px-8", className)}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  title,
  subtitle,
  align = "center",
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn("mb-16", align === "center" && "text-center")}
    >
      <h2 className="font-heading text-4xl font-bold sm:text-5xl">
        <span className="gradient-text">{title}</span>
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      <div className="mt-6 mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-electric to-violet" />
    </motion.div>
  );
}
