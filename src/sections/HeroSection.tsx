"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Linkedin, Mail, ArrowRight } from "lucide-react";
import { GridLightEffect } from "@/components/GridLightEffect";
import { EngineeringIdentityPanel } from "@/components/EngineeringIdentityPanel";

/* ===== Scramble text effect ===== */
function useScrambleText(text: string, speed = 30) {
  const [displayed, setDisplayed] = useState("");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= text.length) {
        const revealed = text.slice(0, i);
        const scrambled = Array.from({ length: Math.min(3, text.length - i) })
          .map(() => chars[Math.floor(Math.random() * chars.length)])
          .join("");
        setDisplayed(revealed + scrambled);
        i++;
      } else {
        clearInterval(interval);
        setDisplayed(text);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return displayed;
}

export default function HeroSection() {
  const headline = useScrambleText("Software Engineer", 35);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-mesh-gradient pt-20 sm:pt-24 lg:pt-28 pb-12 sm:pb-16">
      {/* Aurora background */}
      <div className="absolute inset-0 aurora-bg opacity-40 mix-blend-overlay" />
      <div className="absolute inset-0 bg-deep-dark/40" />

      {/* Grid Pattern Overlay with Subtle Animated Golden Light Sparks */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none">
        <GridLightEffect gridSize={24} />
      </div>

      {/* Floating orbs */}
      <motion.div
        animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-brand-primary/10 blur-[100px]"
      />
      <motion.div
        animate={{ y: [0, 20, 0], x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-brand-primary/5 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 lg:gap-16 w-full">
        {/* Left Column — Bio & CTAs */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-center lg:text-left w-full"
        >
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-surface-elevated border border-emerald-500/30 text-[11px] sm:text-xs font-semibold text-slate-200 shadow-sm mb-4 sm:mb-6 max-w-full"
          >
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="truncate">Available for engineering roles &amp; opportunities</span>
          </motion.div>

          {/* Heading (Geist Sans 700 Bold) */}
          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight text-heading">
            <span className="block text-body text-lg sm:text-2xl font-medium mb-1 sm:mb-2">Hello, I&apos;m</span>
            <span>Mehedi Hasan</span>
          </h1>

          {/* Scramble Title in Solid Brand Amber */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-2 sm:mt-3 font-heading text-xl sm:text-3xl lg:text-4xl font-bold text-brand-primary flex items-center justify-center lg:justify-start min-h-[38px] sm:min-h-[44px]"
          >
            <span>{headline}</span>
            <span className="inline-block w-0.5 h-6 sm:h-8 bg-brand-primary ml-1.5 animate-blink" />
          </motion.div>

          {/* Subtitle description (Geist Sans 400 Regular) */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-3.5 sm:mt-6 max-w-xl text-body text-sm sm:text-lg font-normal leading-relaxed mx-auto lg:mx-0"
          >
            Software Engineer specializing in Next.js, React, Express.js, and MongoDB. Building scalable web applications, dynamic CMS, and high-performance financial &amp; media platforms.
          </motion.p>

          {/* Solid Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-5 sm:mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start w-full sm:w-auto max-w-xs sm:max-w-none mx-auto lg:mx-0"
          >
            <Button size="xl" variant="primary" asChild className="w-full sm:w-auto">
              <a href="#projects" className="gap-2 justify-center">
                <span>View Featured Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button size="xl" variant="secondary" asChild className="w-full sm:w-auto">
              <a href="#contact" className="justify-center">Get In Touch</a>
            </Button>
          </motion.div>

          {/* Social Links (Solid) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-5 sm:mt-8 flex items-center gap-3 justify-center lg:justify-start"
          >
            {[
              { icon: Github, href: "https://github.com/iammehedi4201", label: "GitHub" },
              { icon: Linkedin, href: "https://www.linkedin.com/in/mehedi-hasan-4b81131a6", label: "LinkedIn" },
              { icon: Mail, href: "mailto:iammehedi296@gmail.com", label: "Email" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-10 h-10 rounded-xl bg-surface hover:bg-surface-elevated border border-border-subtle hover:border-brand-primary text-body hover:text-brand-primary flex items-center justify-center transition-colors shadow-sm"
              >
                <Icon className="h-4.5 w-4.5" />
              </a>
            ))}
            <span className="text-xs font-mono text-text-muted pl-2 hidden sm:inline-block">
              Dhaka, Bangladesh · +880-1775777038
            </span>
          </motion.div>
        </motion.div>

        {/* Right Column — Engineering Identity Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex-shrink-0 w-full lg:w-auto flex justify-center px-2 sm:px-0"
        >
          <EngineeringIdentityPanel />
        </motion.div>
      </div>

      {/* Solid Scroll Indicator (Desktop only) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="hidden lg:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 pointer-events-none"
      >
        <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="h-4 w-4 text-brand-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
}
