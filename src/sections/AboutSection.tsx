"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SectionWrapper, SectionHeading } from "@/components/section-wrapper";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const techStack = [
  { name: "React", color: "#61DAFB" },
  { name: "Next.js", color: "#ffffff" },
  { name: "TypeScript", color: "#3178C6" },
  { name: "Node.js", color: "#339933" },
  { name: "MongoDB", color: "#47A248" },
  { name: "Tailwind CSS", color: "#06B6D4" },
  { name: "PostgreSQL", color: "#4169E1" },
  { name: "Python", color: "#3776AB" },
  { name: "Docker", color: "#2496ED" },
  { name: "Git", color: "#F05032" },
  { name: "Redux", color: "#764ABC" },
  { name: "GraphQL", color: "#E10098" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

export default function AboutSection() {
  const [cvUrl, setCvUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/cv")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.cvUrl) setCvUrl(json.cvUrl);
      })
      .catch(() => {});
  }, []);

  return (
    <SectionWrapper id="about" className="bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-electric/5 rounded-full blur-[120px] -z-10" />

      <SectionHeading
        title="About Me"
        subtitle="Passionate developer who loves turning ideas into reality"
      />

      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Left — Avatar + Bio */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Avatar with glow border */}
          <div className="relative w-56 h-56 mx-auto lg:mx-0 group cursor-default">
            <div className="absolute inset-[-4px] rounded-full bg-gradient-to-br from-electric via-violet to-cyan animate-spin-slow opacity-80 blur-lg transition-all duration-500 group-hover:opacity-100 group-hover:scale-110" />
            <div className="relative w-full h-full rounded-full bg-background p-[2px]">
              <div className="w-full h-full rounded-full bg-secondary flex items-center justify-center overflow-hidden border border-white/10 shadow-inner">
                 <span className="text-6xl font-heading font-bold gradient-text selection:text-white">MH</span>
              </div>
            </div>
            {/* Pulsing indicator */}
            <div className="absolute bottom-6 right-6 w-5 h-5 rounded-full bg-emerald-500 border-4 border-background animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
          </div>

          <div className="space-y-4">
            <p className="text-xl font-heading text-foreground font-semibold leading-tight">
              Software Engineer crafting <span className="gradient-text">visual experiences</span> & robust backends.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              I&apos;m a <span className="text-electric font-medium">full-stack developer</span> with
              a passion for building modern, scalable web applications. With experience in both
              <span className="text-violet font-medium"> frontend</span> and
              <span className="text-cyan font-medium"> backend</span> technologies, I create
              end-to-end solutions that are performant, accessible, and visually stunning.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              I love exploring new technologies and continuously improving my craft. Currently focused on
              <span className="text-foreground font-semibold"> React Ecosystem</span> and
              <span className="text-foreground font-semibold"> Cloud Infrastructure</span>.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <Button variant="glow" size="lg" className="group rounded-full px-8" asChild>
              <a href={cvUrl || "#"} target={cvUrl ? "_blank" : "_self"} rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                {cvUrl ? "Download CV" : "CV Coming Soon"}
              </a>
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-8 hover:bg-white/5 transition-colors">
              Read My Blog
            </Button>
          </div>
        </motion.div>

        {/* Right — Tech Stack Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-6 text-center lg:text-left">
            Tech Stack
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {techStack.map((tech) => (
              <motion.div
                key={tech.name}
                variants={itemVariants}
                whileHover={{ scale: 1.08, y: -4 }}
                className="group glass-card rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer transition-all duration-200 hover:border-electric/30"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold"
                  style={{ backgroundColor: `${tech.color}15`, color: tech.color }}
                >
                  {tech.name.charAt(0)}
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors text-center">
                  {tech.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
