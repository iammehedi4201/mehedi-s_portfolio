"use client";

import { motion } from "framer-motion";
import { SectionWrapper, SectionHeading } from "@/components/section-wrapper";

const skillCategories = [
  {
    title: "Frontend",
    color: "#3B82F6",
    skills: [
      { name: "React / Next.js", level: 95 },
      { name: "TypeScript", level: 90 },
      { name: "Tailwind CSS", level: 92 },
      { name: "Framer Motion", level: 85 },
      { name: "Redux / Zustand", level: 88 },
    ],
  },
  {
    title: "Backend",
    color: "#8B5CF6",
    skills: [
      { name: "Node.js / Express", level: 90 },
      { name: "Python / Django", level: 80 },
      { name: "MongoDB / Mongoose", level: 88 },
      { name: "PostgreSQL", level: 82 },
      { name: "REST / GraphQL APIs", level: 87 },
    ],
  },
  {
    title: "Tools",
    color: "#06B6D4",
    skills: [
      { name: "Git / GitHub", level: 92 },
      { name: "VS Code", level: 95 },
      { name: "Figma", level: 78 },
      { name: "Postman", level: 85 },
      { name: "Linux / Terminal", level: 80 },
    ],
  },
  {
    title: "DevOps",
    color: "#10B981",
    skills: [
      { name: "Docker", level: 78 },
      { name: "CI/CD (GitHub Actions)", level: 75 },
      { name: "Vercel / Netlify", level: 90 },
      { name: "AWS Basics", level: 65 },
      { name: "Nginx", level: 70 },
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
        <span className="text-xs font-heading font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">{name}</span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10">{level}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden relative">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: delay + 0.2, ease: "circOut" }}
          className="h-full rounded-full relative"
          style={{
            background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          }}
        >
          <div className="absolute top-0 right-0 h-full w-8 bg-white/20 blur-md animate-shimmer" />
        </motion.div>
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
        subtitle="A comprehensive overview of my specialized stack"
      />

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {skillCategories.map((category, ci) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: ci * 0.1 }}
            className="rounded-3xl border border-white/5 bg-secondary/20 backdrop-blur-sm p-8 space-y-8 hover:border-white/10 transition-all duration-500 group"
          >
            <div className="flex items-center gap-4">
              <div
                className="w-1 h-6 rounded-full transition-all duration-500 group-hover:h-8"
                style={{ backgroundColor: category.color, boxShadow: `0 0 15px ${category.color}80` }}
              />
              <h3 className="font-heading text-xl font-black uppercase tracking-[0.2em] leading-none">{category.title}</h3>
            </div>

            <div className="space-y-6">
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
