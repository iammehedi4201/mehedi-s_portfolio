"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { SectionWrapper, SectionHeading } from "@/components/section-wrapper";
import { Button } from "@/components/ui/button";
import { FileText, Sparkles, Code2 } from "lucide-react";

const techStack = [
  { name: "Next.js", category: "Full-Stack", color: "#E5A00D" },
  { name: "React", category: "Frontend", color: "#0284C7" },
  { name: "TypeScript", category: "Language", color: "#2563EB" },
  { name: "Express.js", category: "Backend", color: "#D97706" },
  { name: "Node.js", category: "Backend", color: "#16A34A" },
  { name: "MongoDB", category: "Database", color: "#15803D" },
  { name: "PostgreSQL", category: "Database", color: "#3B82F6" },
  { name: "Tailwind CSS", category: "Styling", color: "#0D9488" },
  { name: "Shadcn UI", category: "UI System", color: "#7C3AED" },
  { name: "Redux / Zustand", category: "State", color: "#8B5CF6" },
  { name: "Python", category: "Language", color: "#F59E0B" },
  { name: "DigitalOcean", category: "Cloud & DevOps", color: "#0284C7" },
];

const METRICS = [
  { value: "3.54", label: "CGPA / 4.00", description: "BSc in CSE, Daffodil Int'l Univ (2023)" },
  { value: "Antopolis", label: "Software Engineer", description: "Oct 2024 – Sep 2026" },
  { value: "Qwik IT", label: "Full Stack Intern", description: "Apr 2024 – May 2024" },
  { value: "Live", label: "Production Platforms", description: "VIPB AMC & ICE Business Times" },
];

export default function AboutSection() {
  const cvUrl = "/Mehedi_Hasan_CV.pdf";

  return (
    <SectionWrapper id="about" className="bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] -z-10" />

      <SectionHeading
        badge="About The Engineer"
        title="Engineering Scalable Web Solutions"
        subtitle="Software Engineer focused on reliable backend systems, modular UI architecture, and high-performance full-stack applications."
      />

      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column (5 cols) — Developer Avatar & Stats */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-5 space-y-8"
        >
          {/* Avatar (New Headshot with Ambient Framing) */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto lg:mx-0 cursor-default">
            <div className="w-full h-full rounded-3xl bg-surface border border-border-subtle shadow-card overflow-hidden group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/mehedi-about.jpg"
                alt="Mehedi Hasan - Software Engineer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Status Beacon */}
            <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-surface-elevated border border-emerald-500/30 text-slate-200 text-[11px] font-semibold flex items-center gap-2 shadow-card z-10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span>Available for Hire</span>
            </div>
          </div>

          {/* Key Metric Highlights (Solid) */}
          <div className="grid grid-cols-2 gap-3.5">
            {METRICS.map((metric) => (
              <div
                key={metric.label}
                className="p-4 rounded-xl bg-surface border border-border-subtle shadow-card hover:border-brand-primary transition-colors"
              >
                <p className="text-xl sm:text-2xl font-semibold font-heading text-brand-primary truncate tracking-tight">
                  {metric.value}
                </p>
                <p className="text-xs font-semibold text-heading mt-1">
                  {metric.label}
                </p>
                <p className="text-[11px] text-text-muted mt-0.5 leading-snug font-normal">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column (7 cols) — Bio & Tech Arsenal */}
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 space-y-8"
        >
          {/* Bio text */}
          <div className="space-y-3.5 text-body text-base leading-relaxed font-normal">
            <h3 className="text-2xl font-semibold font-heading text-heading tracking-tight">
              Building scalable web apps with <span className="text-brand-primary">clean architecture</span>.
            </h3>
            <p>
              I&apos;m a Software Engineer based in Dhaka, Bangladesh, with professional experience at <strong>Antopolis</strong> building web applications, dynamic CMS platforms, and admin dashboards. I work with <strong>Next.js, React, Express.js, and MongoDB</strong> to develop reliable and maintainable solutions.
            </p>
            <p>
              I hold a B.Sc. in Computer Science and Engineering from <strong>Daffodil International University</strong>, graduating with a CGPA of 3.54/4.00. I value clean code, well-structured APIs, and building applications that deliver a reliable user experience.
            </p>
          </div>

          {/* Action CTAs (Solid) */}
          <div className="flex flex-wrap gap-3.5 pt-2">
            <Button variant="primary" size="lg" className="rounded-xl px-7" asChild>
              <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                <FileText className="mr-2 h-4 w-4" />
                View Resume
              </a>
            </Button>
            <Button variant="secondary" size="lg" className="rounded-xl px-7" asChild>
              <a href="#projects">
                <Sparkles className="mr-2 h-4 w-4 text-brand-primary" />
                View Live Projects
              </a>
            </Button>
          </div>

          {/* Tech Stack Grid (Solid) */}
          <div className="pt-4 border-t border-border-subtle">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-brand-primary" />
              <span>Core Technologies & Tooling</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {techStack.map((tech) => (
                <div
                  key={tech.name}
                  className="p-3 rounded-xl bg-surface border border-border-subtle hover:border-brand-primary transition-colors flex items-center gap-3 shadow-sm cursor-default group"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0"
                    style={{ backgroundColor: `${tech.color}18`, color: tech.color }}
                  >
                    {tech.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-heading group-hover:text-brand-primary transition-colors truncate">
                      {tech.name}
                    </p>
                    <p className="text-[10px] text-text-muted truncate font-normal">
                      {tech.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
