"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionWrapper, SectionHeading } from "@/components/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { useProjects, useAnalytics } from "@/hooks";
import { ExternalLink, Github, FolderCode, X, Sparkles, Layers } from "lucide-react";
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

      {/* Project Case Study Split-Screen Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent
          hideDefaultClose
          className="max-w-5xl lg:max-w-6xl w-[95vw] md:w-[90vw] p-0 bg-surface border border-border-subtle rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] md:max-h-[85vh] flex flex-col focus:outline-none"
        >
          {selectedProject && (
            <div className="flex flex-col h-full max-h-[92vh] md:max-h-[85vh]">
              {/* Top Case Study Toolbar */}
              <div className="flex items-center justify-between px-5 sm:px-7 py-3.5 border-b border-border-subtle bg-surface z-20 flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-sm bg-brand-primary" />
                  <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-text-muted uppercase">
                    Case Study // {selectedProject.category === "fullstack" ? "Full-Stack System" : selectedProject.category}
                  </span>
                  {selectedProject.liveUrl && (
                    <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Live Platform
                    </span>
                  )}
                </div>

                {/* Properly Positioned Clean Close Button */}
                <DialogClose asChild>
                  <button
                    type="button"
                    className="rounded-xl p-1.5 text-text-muted hover:text-heading bg-surface-subtle hover:bg-surface-elevated border border-border-subtle transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    aria-label="Close dialog"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </DialogClose>
              </div>

              {/* Split Screen Content Body */}
              <div className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-visible min-h-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {/* LEFT PANE: Prominent Screenshot & Primary Action */}
                <div className="w-full md:w-[44%] lg:w-[45%] bg-surface-subtle/30 md:border-r border-b md:border-b-0 border-border-subtle p-5 sm:p-6 flex flex-col justify-between space-y-4 flex-shrink-0">
                  <div className="space-y-3.5">
                    {/* Framed Screenshot Showcase */}
                    {selectedProject.thumbnail && (
                      <div className="rounded-xl overflow-hidden border border-border-subtle bg-surface shadow-sm group">
                        {/* Browser-style minimal window bar */}
                        <div className="flex items-center justify-between px-3 py-1.5 bg-surface-subtle border-b border-border-subtle text-[11px] font-mono text-text-muted">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-border-strong/40" />
                            <span className="w-2 h-2 rounded-full bg-border-strong/40" />
                            <span className="w-2 h-2 rounded-full bg-border-strong/40" />
                          </div>
                          <span className="text-[10px] text-text-muted/70 truncate max-w-[180px]">
                            {selectedProject.liveUrl
                              ? selectedProject.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")
                              : "mehedihasan.dev"}
                          </span>
                          <span className="w-2" />
                        </div>

                        {/* Screenshot image */}
                        <div className="relative aspect-[16/10] bg-surface-subtle overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={selectedProject.thumbnail}
                            alt={selectedProject.title}
                            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                          />
                        </div>
                      </div>
                    )}

                    {/* Quick Metadata Grid */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-surface border border-border-subtle">
                      <div>
                        <span className="text-[9px] font-mono text-text-muted uppercase tracking-wider block">
                          Timeline
                        </span>
                        <p className="text-xs font-semibold text-heading font-sans mt-0.5">
                          {selectedProject.timeline || "Production"}
                        </p>
                      </div>
                      <div className="border-l border-border-subtle pl-2.5">
                        <span className="text-[9px] font-mono text-text-muted uppercase tracking-wider block">
                          Status
                        </span>
                        <p className="text-xs font-semibold text-color-success font-sans mt-0.5 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-color-success" />
                          Production Live
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Primary CTA Buttons on Desktop */}
                  <div className="space-y-2 pt-1 hidden md:block">
                    {selectedProject.liveUrl && (
                      <Button size="lg" variant="primary" asChild className="w-full justify-center shadow-sm">
                        <a
                          href={selectedProject.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="gap-2 font-semibold"
                        >
                          <span>Visit Live Platform</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    {selectedProject.githubUrl && (
                      <Button size="lg" variant="secondary" asChild className="w-full justify-center">
                        <a
                          href={selectedProject.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="gap-2 font-medium"
                        >
                          <Github className="w-4 h-4" />
                          <span>View Source Code</span>
                        </a>
                      </Button>
                    )}
                  </div>
                </div>

                {/* RIGHT PANE: Structured Case Study Details */}
                <div className="w-full md:w-[56%] lg:w-[55%] p-5 sm:p-6 lg:p-7 flex flex-col justify-between space-y-3.5 sm:space-y-4 overflow-y-auto md:overflow-visible [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {/* Title & Overview */}
                  <div>
                    <div className="inline-flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-brand-subtle text-brand-subtle-text border border-brand-primary/30 uppercase tracking-wider">
                        {selectedProject.timeline || "Production"}
                      </span>
                      <span className="text-xs font-mono text-text-muted">
                        · {selectedProject.category === "fullstack" ? "Full-Stack System" : selectedProject.category}
                      </span>
                    </div>

                    <DialogTitle className="font-heading text-xl sm:text-2xl lg:text-[25px] font-bold tracking-tight text-heading leading-tight">
                      {selectedProject.title}
                    </DialogTitle>

                    <DialogDescription className="text-text-body text-xs sm:text-[13.5px] font-normal leading-relaxed mt-2">
                      {selectedProject.description}
                    </DialogDescription>
                  </div>

                  {/* Key Achievements & Contributions (Clean 2-Column Grid) */}
                  {selectedProject.features && selectedProject.features.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
                        <h4 className="text-[10px] sm:text-[11px] font-mono font-bold text-text-muted uppercase tracking-wider">
                          Key Achievements &amp; Contributions
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedProject.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-surface-subtle border border-border-subtle hover:border-brand-primary/40 transition-colors flex items-start gap-2.5"
                          >
                            <span className="text-[9px] font-mono text-brand-primary font-bold px-1.5 py-0.5 rounded bg-surface border border-border-subtle flex-shrink-0 mt-0.5">
                              0{idx + 1}
                            </span>
                            <p className="text-[11px] sm:text-xs text-heading font-sans leading-snug">
                              {feature}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Technologies Used Badges */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-brand-primary" />
                      <h4 className="text-[10px] sm:text-[11px] font-mono font-bold text-text-muted uppercase tracking-wider">
                        Technologies &amp; Architecture
                      </h4>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {(selectedProject.techStack || []).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-surface-subtle border border-border-subtle text-heading hover:border-brand-primary/40 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Mobile-Only Action Button (Bottom Anchor) */}
                  <div className="md:hidden pt-3 border-t border-border-subtle space-y-2">
                    {selectedProject.liveUrl && (
                      <Button size="lg" variant="primary" asChild className="w-full justify-center">
                        <a
                          href={selectedProject.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="gap-2 font-semibold"
                        >
                          <span>Visit Live Platform</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    {selectedProject.githubUrl && (
                      <Button size="lg" variant="secondary" asChild className="w-full justify-center">
                        <a
                          href={selectedProject.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="gap-2 font-medium"
                        >
                          <Github className="w-4 h-4" />
                          <span>View Source Code</span>
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SectionWrapper>
  );
}
