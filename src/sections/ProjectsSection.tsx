"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionWrapper, SectionHeading } from "@/components/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useProjects, useAnalytics } from "@/hooks";
import { ExternalLink, Github, FolderCode } from "lucide-react";
import type { Project } from "@/types";

// Genuine production projects extracted from Mehedi Hasan's verified CV (fallback)
const REAL_PROJECTS: Project[] = [
  {
    _id: "proj-vipbamc",
    title: "VIPB Asset Management Company Ltd.",
    timeline: "Jan 2026 — Mar 2026",
    description:
      "Full-stack Mutual Fund Investment Platform supporting Individual, Joint, and Company investor accounts. Features automated recurring SIP installments, lump sum investments, investor & admin dashboards, tax certificates, PDF reports, Excel record exports, and weekly portfolio email alerts.",
    thumbnail: "/projects/vipbamc.png",
    techStack: [
      "Next.js",
      "React.js",
      "Express.js",
      "MongoDB",
      "Mongoose",
      "JWT",
      "Recharts",
      "Nodemailer",
      "TanStack",
      "Tailwind CSS",
    ],
    category: "fullstack",
    liveUrl: "https://vipbamc.com/",
    githubUrl: "",
    features: [
      "Individual, Joint, and Company investor account onboarding",
      "SIP (Systematic Investment Plan) and Lump Sum investment processing with automated recurring installments",
      "Investor & admin portals for tracking portfolio performance, withdrawals, and transactions",
      "Automated PDF tax certificates, financial reports, Excel exports, and email alert services",
    ],
    order: 0,
    status: "published",
    deletedAt: null,
    createdAt: "2026-01-15T00:00:00.000Z",
    updatedAt: "2026-03-20T00:00:00.000Z",
  },
  {
    _id: "proj-icebusinesstimes",
    title: "ICE Business Times",
    timeline: "May 2026",
    description:
      "Full-stack business magazine platform and dedicated Content Management System (CMS) enabling administrators to publish, schedule, and organize magazine articles with dynamic categorization, search, archive, SEO-friendly routing, and role-based authentication.",
    thumbnail: "/projects/icebusinesstimes.png",
    techStack: [
      "Next.js",
      "React.js",
      "Express.js",
      "MongoDB",
      "Mongoose",
      "REST API",
      "Tailwind CSS",
      "Shadcn UI",
      "JWT Authentication",
      "DigitalOcean",
    ],
    category: "fullstack",
    liveUrl: "https://icebusinesstimes.com",
    githubUrl: "",
    features: [
      "Full-featured Content Management System (CMS) for editors and publications",
      "Dynamic article categorization, archive management, and SEO-friendly routing",
      "Secure role-based authentication and authorization for admins, editors, and managers",
      "High-performance REST APIs and optimized database operations hosted on DigitalOcean",
    ],
    order: 1,
    status: "published",
    deletedAt: null,
    createdAt: "2026-05-01T00:00:00.000Z",
    updatedAt: "2026-05-15T00:00:00.000Z",
  },
];

export default function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { logClick } = useAnalytics();
  const { projects: apiProjects, isLoading } = useProjects();

  const availableProjects = useMemo(() => {
    return apiProjects.length > 0 ? apiProjects : REAL_PROJECTS;
  }, [apiProjects]);

  const categories = useMemo(() => {
    const cats = new Set<string>(["all"]);
    availableProjects.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats);
  }, [availableProjects]);

  const projects = availableProjects.filter(
    (p) => activeCategory === "all" || p.category === activeCategory
  );

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <SectionWrapper id="projects">
      <SectionHeading
        badge="Verified Production Work"
        title="Featured Engineering Projects"
        subtitle="Full-scale production web applications built, deployed, and maintained with clean architecture and robust APIs."
      />

      {/* Category Filter Pills (if multiple categories available) */}
      {categories.length > 2 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-brand-primary text-brand-on-primary shadow-sm"
                  : "bg-surface border border-border-subtle text-muted-foreground hover:text-heading hover:border-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Projects Grid (Solid, 2-column showcase with real screenshots) */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <AnimatePresence mode="popLayout">
          {projects.map((project, i) => (
            <motion.div
              key={project._id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              onClick={() => setSelectedProject(project)}
              className="group rounded-2xl bg-surface border border-border-subtle hover:border-brand-primary shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              {/* Visual Thumbnail Header with Real Screenshot */}
              <div className="relative h-56 sm:h-64 bg-surface-subtle border-b border-border-subtle overflow-hidden">
                {project.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FolderCode className="w-12 h-12 text-brand-primary opacity-50" />
                  </div>
                )}

                {/* Status Badges */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-surface/95 backdrop-blur-sm border border-border-subtle text-heading shadow-sm">
                    {project.timeline || "Production"}
                  </span>
                </div>

                <div className="absolute top-3.5 right-3.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface/90 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-[10px] font-bold shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live Production</span>
                  </span>
                </div>

                {/* Hover Quick Action Buttons */}
                <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.stopPropagation();
                        logClick(project._id);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-primary text-brand-on-primary font-bold text-xs shadow-md hover:bg-brand-hover transition-colors"
                      title="Visit Live Website"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Visit Live Website</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h3 className="font-heading font-semibold text-xl text-heading group-hover:text-brand-primary transition-colors">
                      {project.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-body font-normal leading-relaxed line-clamp-3 mt-2">
                    {project.description}
                  </p>
                </div>

                {/* Tech stack badges */}
                <div className="pt-2 border-t border-border-subtle">
                  <div className="flex flex-wrap gap-1.5">
                    {(project.techStack || []).map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-[11px] font-semibold">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Project Detail Modal with Full Screenshot & Bullet Features */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-2xl bg-surface border-border-subtle">
          {selectedProject && (
            <div className="space-y-5">
              {/* Project Screenshot in Modal */}
              {selectedProject.thumbnail && (
                <div className="rounded-xl overflow-hidden border border-border-subtle max-h-64 relative bg-surface-subtle">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedProject.thumbnail}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface/90 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-[10px] font-bold shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Live Site</span>
                    </span>
                  </div>
                </div>
              )}

              <DialogHeader>
                <div className="inline-flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-subtle text-brand-subtle-text border border-brand-primary/30">
                    {selectedProject.timeline || "Production"}
                  </span>
                </div>
                <DialogTitle className="font-heading text-2xl font-semibold tracking-tight text-heading">
                  {selectedProject.title}
                </DialogTitle>
                <DialogDescription className="text-body text-sm font-normal leading-relaxed mt-1">
                  {selectedProject.description}
                </DialogDescription>
              </DialogHeader>

              {/* Key Features Bullet List from CV */}
              {selectedProject.features && selectedProject.features.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-heading uppercase tracking-wider">
                    Key Achievements &amp; Contributions
                  </h4>
                  <ul className="space-y-1.5 text-xs text-body font-normal leading-relaxed">
                    {selectedProject.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-brand-primary font-bold mt-0.5">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technologies */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-heading uppercase tracking-wider">
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedProject.techStack || []).map((tech) => (
                    <Badge key={tech} variant="brand" className="text-xs py-1 font-medium">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-3 border-t border-border-subtle">
                {selectedProject.liveUrl && (
                  <Button variant="primary" asChild>
                    <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" /> Visit Live Platform
                    </a>
                  </Button>
                )}
                {selectedProject.githubUrl && (
                  <Button variant="secondary" asChild>
                    <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" /> Source Code
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SectionWrapper>
  );
}
