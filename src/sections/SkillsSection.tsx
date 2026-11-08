"use client";

import { motion } from "framer-motion";
import { SectionWrapper, SectionHeading } from "@/components/section-wrapper";
import { Layout, Server, Database, GitBranch } from "lucide-react";

interface SkillCategory {
  id: string;
  label: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  coreSkills: string[];
  supportingSkills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    id: "01",
    label: "FRONTEND",
    title: "Frontend Development",
    icon: Layout,
    coreSkills: ["Next.js", "React.js", "TypeScript", "JavaScript"],
    supportingSkills: [
      "Redux",
      "TanStack Query",
      "React Hook Form",
      "Tailwind CSS",
      "Material UI",
      "Ant Design",
      "Shadcn UI",
    ],
  },
  {
    id: "02",
    label: "BACKEND",
    title: "Backend Development",
    icon: Server,
    coreSkills: ["Node.js", "Express.js", "NestJS", "REST APIs"],
    supportingSkills: [
      "JWT Auth",
      "Middleware Architecture",
      "API Security",
      "Nodemailer",
      "Bcrypt",
    ],
  },
  {
    id: "03",
    label: "DATABASES",
    title: "Database Management",
    icon: Database,
    coreSkills: ["MongoDB", "PostgreSQL", "Prisma", "Mongoose"],
    supportingSkills: [
      "Document Modeling",
      "Relational Schemas",
      "Data Validation",
      "Query Optimization",
    ],
  },
  {
    id: "04",
    label: "PLATFORMS",
    title: "Tools & Platforms",
    icon: GitBranch,
    coreSkills: ["DigitalOcean", "CI/CD", "Postman", "Git & GitHub"],
    supportingSkills: [
      "Linux / Bash",
      "Vercel",
      "Docker Basics",
      "npm / pnpm",
    ],
  },
];

export default function SkillsSection() {
  return (
    <SectionWrapper id="skills" className="bg-canvas relative">
      <SectionHeading
        badge="Technical Arsenal"
        title="Technical Skills"
        subtitle="Core competencies, frameworks, and engineering tools I work with"
      />

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {skillCategories.map((category, idx) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              className="rounded-2xl border border-border-subtle bg-surface p-6 sm:p-7 flex flex-col justify-between hover:border-brand-primary/40 transition-all duration-200 group shadow-sm"
            >
              <div>
                {/* Header: Numbered Label & Subtle Icon */}
                <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                    <span className="text-[11px] font-mono tracking-widest text-brand-primary uppercase font-semibold">
                      {`${category.id} // ${category.label}`}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-surface-subtle border border-border-subtle flex items-center justify-center text-text-muted group-hover:text-brand-primary group-hover:border-brand-primary/30 transition-colors">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                {/* Title */}
                <div className="pt-4 pb-4">
                  <h3 className="font-heading text-lg font-bold text-text-heading tracking-tight">
                    {category.title}
                  </h3>
                </div>

                {/* Core Technologies — 2x2 Grid with high visual clarity */}
                <div className="grid grid-cols-2 gap-2.5 mb-5">
                  {category.coreSkills.map((tech) => (
                    <div
                      key={tech}
                      className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-surface-subtle/60 border border-border-subtle hover:bg-surface-elevated hover:border-brand-primary/40 transition-all group/item"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-primary group-hover/item:scale-125 transition-transform flex-shrink-0" />
                      <span className="text-sm font-semibold text-text-heading group-hover/item:text-brand-primary transition-colors truncate">
                        {tech}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Supporting Stack & Libraries */}
              <div className="pt-3.5 border-t border-border-subtle/70 mt-auto">
                <div className="flex flex-wrap gap-1.5">
                  {category.supportingSkills.map((tool) => (
                    <span
                      key={tool}
                      className="text-xs font-mono px-2.5 py-1 rounded-lg bg-surface-elevated/60 border border-border-subtle text-text-muted hover:text-text-heading hover:border-brand-primary/30 transition-colors"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
