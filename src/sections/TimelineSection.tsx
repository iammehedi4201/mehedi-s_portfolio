"use client";

import { motion } from "framer-motion";
import { SectionWrapper, SectionHeading } from "@/components/section-wrapper";
import { Briefcase, GraduationCap, Award } from "lucide-react";

const timelineItems = [
  {
    year: "2024 — Present",
    title: "Senior Full-Stack Developer",
    company: "Freelance / Open Source",
    description: "Building production-grade web applications with Next.js, React, and Node.js. Contributing to open-source projects and mentoring junior developers.",
    icon: Briefcase,
    type: "work" as const,
  },
  {
    year: "2023 — 2024",
    title: "Full-Stack Developer",
    company: "Tech Company",
    description: "Led development of customer-facing web applications. Implemented CI/CD pipelines and microservices architecture.",
    icon: Briefcase,
    type: "work" as const,
  },
  {
    year: "2022 — 2023",
    title: "Frontend Developer",
    company: "Startup Inc",
    description: "Built responsive UI components with React and TypeScript. Collaborated closely with design team to deliver pixel-perfect interfaces.",
    icon: Briefcase,
    type: "work" as const,
  },
  {
    year: "2022",
    title: "AWS Cloud Practitioner",
    company: "Amazon Web Services",
    description: "Earned certification demonstrating knowledge of AWS cloud services, architecture, and best practices.",
    icon: Award,
    type: "cert" as const,
  },
  {
    year: "2019 — 2023",
    title: "BSc in Computer Science",
    company: "University",
    description: "Graduated with honors. Focused on software engineering, algorithms, and web technologies. Multiple hackathon wins.",
    icon: GraduationCap,
    type: "education" as const,
  },
];

export default function TimelineSection() {
  return (
    <SectionWrapper id="timeline">
      <SectionHeading
        title="My Journey"
        subtitle="A timeline of my education and professional experience"
      />

      <div className="relative max-w-3xl mx-auto">
        {/* Glowing center line */}
        <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5">
          <div className="h-full w-full bg-gradient-to-b from-electric via-violet to-cyan" />
          <div className="absolute inset-0 blur-sm bg-gradient-to-b from-electric via-violet to-cyan opacity-50" />
        </div>

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
                  <div className="glass-card rounded-xl p-5 hover:border-electric/30 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-electric bg-electric/10 px-2 py-1 rounded-full">
                        {item.year}
                      </span>
                    </div>
                    <h3 className="font-heading text-lg font-semibold">{item.title}</h3>
                    <p className="text-sm text-violet mt-0.5">{item.company}</p>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Center dot */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-deep-dark border-2 border-electric flex items-center justify-center z-10 shadow-glow-blue">
                  <Icon className="h-3.5 w-3.5 text-electric" />
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
