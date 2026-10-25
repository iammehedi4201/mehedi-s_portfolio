"use client";

import { motion } from "framer-motion";
import { SectionWrapper, SectionHeading } from "@/components/section-wrapper";
import { Briefcase, GraduationCap, Award } from "lucide-react";

const timelineItems = [
  {
    year: "Oct 2024 — Sep 2026",
    title: "Software Engineer",
    company: "Antopolis",
    description: "Contributed as a core member of the development team, working on scalable web applications using Next.js, React, shadcn/ui, Express.js, and MongoDB. Planned and built real-world product features, dynamic CMS, admin dashboards, and customer-facing platforms with clean architecture and continuous integration workflows.",
    icon: Briefcase,
    type: "work" as const,
  },
  {
    year: "Apr 2024 — May 2024",
    title: "Full Stack Developer Intern",
    company: "Qwik IT",
    description: "Completed a full-stack development internship gaining practical experience building and maintaining web applications. Worked with frontend and backend technologies to implement application features and support development tasks.",
    icon: Briefcase,
    type: "work" as const,
  },
  {
    year: "2019 — 2023",
    title: "BSc in Computer Science and Engineering",
    company: "Daffodil International University",
    description: "Graduated with a CGPA of 3.54 / 4.00. Specialized in software engineering, algorithms, database systems, object-oriented programming, and modern web application development.",
    icon: GraduationCap,
    type: "education" as const,
  },
];

export default function TimelineSection() {
  return (
    <SectionWrapper id="timeline">
      <SectionHeading
        title="Engineering Journey"
        subtitle="A chronological timeline of my professional experience, education, and milestones"
      />

      <div className="relative max-w-3xl mx-auto">
        {/* Solid Center Timeline Line (Zero Gradients) */}
        <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-border-subtle" />

        <div className="space-y-12">
          {timelineItems.map((item, i) => {
            const Icon = item.icon;
            const isLeft = i % 2 === 0;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative flex items-start gap-6 md:gap-0 ${
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Content card */}
                <div className={`flex-1 ${isLeft ? "md:pr-12" : "md:pl-12"} pl-12 md:pl-0`}>
                  <div className="rounded-xl border border-border-subtle bg-surface p-5 hover:border-brand-primary transition-all duration-300 shadow-sm group">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono font-bold text-brand-primary bg-surface-elevated border border-border-subtle px-2.5 py-0.5 rounded">
                        {item.year}
                      </span>
                    </div>
                    <h3 className="font-heading text-lg font-bold text-text-heading group-hover:text-brand-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm font-medium text-text-muted mt-0.5">{item.company}</p>
                    <p className="text-sm text-text-body mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Center dot node (Solid, Zero Gradients) */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-surface border-2 border-brand-primary flex items-center justify-center z-10 shadow-sm">
                  <Icon className="h-3.5 w-3.5 text-brand-primary" />
                </div>

                {/* Spacer for the other side */}
                <div className="hidden md:block flex-1" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}

