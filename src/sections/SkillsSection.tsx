"use client";

import { motion } from "framer-motion";
import { SectionWrapper, SectionHeading } from "@/components/section-wrapper";

const skillCategories = [
  {
    title: "Frontend Development",
    color: "#E5A00D", // Brand Signal Amber
    skills: [
      { name: "Next.js & React", level: 95 },
      { name: "TypeScript & JavaScript", level: 92 },
      { name: "Tailwind CSS & ShadCN UI", level: 94 },
      { name: "Zustand & Redux", level: 88 },
      { name: "Framer Motion & GSAP", level: 86 },
    ],
  },
  {
    title: "Backend & Systems",
    color: "#38BDF8", // Solid Sky
    skills: [
      { name: "Node.js & Express.js", level: 92 },
      { name: "Nest.js & Scalable REST APIs", level: 88 },
      { name: "ASP.NET Web API & MVC", level: 80 },
      { name: "Python & System Architecture", level: 82 },
    ],
  },
  {
    title: "Database Management",
    color: "#10B981", // Solid Emerald
    skills: [
      { name: "MongoDB & Mongoose", level: 94 },
      { name: "PostgreSQL & Prisma", level: 88 },
      { name: "Firebase & Firestore", level: 85 },
      { name: "TypeORM & Data Modeling", level: 82 },
    ],
  },
  {
    title: "Cloud, DevOps & Engineering",
    color: "#FB923C", // Solid Warm Coral
    skills: [
      { name: "AI-Driven Development", level: 90 },
      { name: "DigitalOcean & Linux", level: 86 },
      { name: "CI/CD & Git / GitHub", level: 92 },
      { name: "Vercel, Postman & Agile", level: 90 },
    ],
  },
];

function SkillBar({ name, level, color, delay }: { name: string; level: number; color: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="space-y-2.5"
    >
      <div className="flex justify-between items-center group">
        <span className="text-xs font-heading font-medium uppercase tracking-wider text-text-muted group-hover:text-text-heading transition-colors">
          {name}
        </span>
        <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-surface-elevated border border-border-subtle text-text-body">
          {level}%
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-surface-elevated border border-border-subtle overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: delay + 0.1, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </motion.div>
  );
}

export default function SkillsSection() {
  return (
    <SectionWrapper id="skills" className="bg-background relative">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />

      <SectionHeading
        title="Technical Arsenal"
        subtitle="A comprehensive overview of my specialized development stack"
      />

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {skillCategories.map((category, ci) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: ci * 0.1 }}
            className="rounded-2xl border border-border-subtle bg-surface p-7 space-y-6 hover:border-border-strong transition-all duration-300 group shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-1.5 h-6 rounded-full transition-all duration-300 group-hover:h-8"
                style={{ backgroundColor: category.color }}
              />
              <h3 className="font-heading text-lg font-semibold uppercase tracking-wide text-text-heading">
                {category.title}
              </h3>
            </div>

            <div className="space-y-5">
              {category.skills.map((skill, si) => (
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  level={skill.level}
                  color={category.color}
                  delay={(ci * 0.1) + (si * 0.05)}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

