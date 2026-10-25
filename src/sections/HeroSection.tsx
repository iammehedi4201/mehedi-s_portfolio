"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Linkedin, Mail, Sparkles, Code2, ArrowRight } from "lucide-react";

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

/* ===== 3D Tilt Developer Terminal Card (Solid colors only) ===== */
function DeveloperTerminalCard() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-150, 150], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-150, 150], [-10, 10]), { stiffness: 300, damping: 30 });

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }

  return (
    <motion.div
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative w-80 sm:w-96 rounded-2xl bg-surface border border-border-subtle shadow-card p-6 sm:p-7 cursor-default"
    >
      <div style={{ transform: "translateZ(30px)" }} className="h-full flex flex-col justify-between space-y-4">
        {/* Terminal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-color-error" />
            <div className="h-3 w-3 rounded-full bg-color-warning" />
            <div className="h-3 w-3 rounded-full bg-color-success" />
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-text-muted">
            <Code2 className="w-3.5 h-3.5 text-brand-primary" />
            <span>developer.ts</span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            online
          </span>
        </div>

        {/* Code Block (Solid) */}
        <pre className="text-xs sm:text-[13px] text-body font-mono leading-relaxed bg-surface-subtle p-4 rounded-xl border border-border-subtle overflow-hidden">
          <code>
            <span className="text-brand-primary font-bold">const</span>{" "}
            <span className="text-heading font-bold">engineer</span> = {"{\n"}
            {"  "}name: <span className="text-emerald-400">&quot;Mehedi Hasan&quot;</span>,{"\n"}
            {"  "}role: <span className="text-emerald-400">&quot;Software Engineer&quot;</span>,{"\n"}
            {"  "}company: <span className="text-emerald-400">&quot;Antopolis&quot;</span>,{"\n"}
            {"  "}stack: [<span className="text-brand-primary">&quot;Next.js&quot;</span>,{"\n"}
            {"    "}<span className="text-brand-primary">&quot;React&quot;</span>,{"\n"}
            {"    "}<span className="text-brand-primary">&quot;Express.js&quot;</span>,{"\n"}
            {"    "}<span className="text-brand-primary">&quot;MongoDB&quot;</span>],{"\n"}
            {"  "}cleanArchitecture: <span className="text-color-warning font-bold">true</span>,{"\n"}
            {"  "}available: <span className="text-emerald-400 font-bold">true</span>{"\n"}
            {"}"};
          </code>
        </pre>

        {/* Solid Accent Bar */}
        <div className="h-1 w-full rounded-full bg-brand-primary" />
      </div>
    </motion.div>
  );
}

export default function HeroSection() {
  const headline = useScrambleText("Software Engineer", 35);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-mesh-gradient pt-28 pb-16">
      {/* Aurora background */}
      <div className="absolute inset-0 aurora-bg opacity-40 mix-blend-overlay" />
      <div className="absolute inset-0 bg-deep-dark/40" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

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

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 w-full">
        {/* Left Column — Bio & CTAs */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-center lg:text-left"
        >
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-surface-elevated border border-emerald-500/30 text-xs font-semibold text-slate-200 shadow-sm mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span>Available for engineering roles &amp; opportunities</span>
          </motion.div>

          {/* Heading (Solid color, NO gradients) */}
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.08] tracking-tight text-heading">
            <span className="block text-body text-xl sm:text-2xl font-bold mb-2">Hello, I&apos;m</span>
            <span>Mehedi Hasan</span>
          </h1>

          {/* Scramble Title in Solid Brand Amber */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-3 font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-primary flex items-center justify-center lg:justify-start min-h-[44px]"
          >
            <span>{headline}</span>
            <span className="inline-block w-0.5 h-7 sm:h-8 bg-brand-primary ml-1.5 animate-blink" />
          </motion.div>

          {/* Subtitle description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 max-w-xl text-body text-base sm:text-lg leading-relaxed mx-auto lg:mx-0"
          >
            Software Engineer specializing in Next.js, React, Express.js, and MongoDB. Building scalable web applications, dynamic CMS, and high-performance financial &amp; media platforms.
          </motion.p>

          {/* Solid Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 flex flex-wrap gap-3.5 justify-center lg:justify-start"
          >
            <Button size="xl" variant="primary" asChild>
              <a href="#projects" className="gap-2">
                <span>View Featured Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button size="xl" variant="secondary" asChild>
              <a href="#contact">Get In Touch</a>
            </Button>
          </motion.div>

          {/* Social Links (Solid) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8 flex items-center gap-3 justify-center lg:justify-start"
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

        {/* Right Column — Developer Terminal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex-shrink-0"
        >
          <DeveloperTerminalCard />
        </motion.div>
      </div>

      {/* Solid Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none"
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
