"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";

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

/* ===== 3D Tilt Card ===== */
function TiltCard() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-150, 150], [15, -15]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-150, 150], [-15, 15]), { stiffness: 300, damping: 30 });

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
      className="relative w-72 h-80 sm:w-80 sm:h-96 rounded-2xl glass-card p-6 cursor-pointer"
    >
      <div style={{ transform: "translateZ(50px)" }} className="h-full flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </div>
          <pre className="text-xs sm:text-sm text-muted-foreground font-mono mt-4 leading-relaxed">
            <code>
              <span className="text-violet">const</span>{" "}
              <span className="text-electric">developer</span> = {`{`}{"\n"}
              {"  "}name: <span className="text-emerald-400">&quot;Mehedi Hasan&quot;</span>,{"\n"}
              {"  "}role: <span className="text-emerald-400">&quot;Full-Stack Dev&quot;</span>,{"\n"}
              {"  "}skills: [<span className="text-cyan">React</span>,{"\n"}
              {"    "}<span className="text-cyan">Next.js</span>,{"\n"}
              {"    "}<span className="text-cyan">Node.js</span>,{"\n"}
              {"    "}<span className="text-cyan">TypeScript</span>],{"\n"}
              {"  "}passion: <span className="text-amber-400">true</span>,{"\n"}
              {"  "}available: <span className="text-emerald-400">true</span>{"\n"}
              {`}`};
            </code>
          </pre>
        </div>
        <div className="h-1 w-full rounded-full bg-gradient-to-r from-electric via-violet to-cyan animate-gradient-x" />
      </div>
    </motion.div>
  );
}

export default function HeroSection() {
  const headline = useScrambleText("Full-Stack Developer", 40);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-mesh-gradient">
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
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-electric/10 blur-[100px]"
      />
      <motion.div
        animate={{ y: [0, 20, 0], x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-violet/5 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* Left — text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center lg:text-left"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm uppercase tracking-[0.3em] text-electric mb-4"
          >
            Welcome to my portfolio
          </motion.p>

          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-[1.05]">
            <span className="block text-foreground">Hi, I&apos;m</span>
            <span className="block gradient-text mt-2">Mehedi Hasan</span>
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-4 font-heading text-2xl sm:text-3xl text-muted-foreground h-10"
          >
            {headline}
            <span className="inline-block w-0.5 h-8 bg-electric ml-1 animate-blink" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6 max-w-lg text-muted-foreground text-base sm:text-lg mx-auto lg:mx-0"
          >
            I craft modern, performant web applications with attention to detail
            and a love for clean code. Let&apos;s build something amazing together.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start"
          >
            <Button size="xl" variant="glow" asChild>
              <a href="#projects">View My Work</a>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <a href="#contact">Get In Touch</a>
            </Button>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 flex gap-4 justify-center lg:justify-start"
          >
            {[
              { icon: Github, href: "https://github.com", label: "GitHub" },
              { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
              { icon: Mail, href: "mailto:hello@mehedi.dev", label: "Email" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-3 glass-card text-muted-foreground hover:text-electric hover:glow-blue transition-all duration-300"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </motion.div>
        </motion.div>

        {/* Right — 3D tilt card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex-shrink-0 hidden md:block"
        >
          <TiltCard />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-muted-foreground uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowDown className="h-5 w-5 text-electric" />
        </motion.div>
      </motion.div>
    </section>
  );
}
