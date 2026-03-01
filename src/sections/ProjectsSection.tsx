"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionWrapper, SectionHeading } from "@/components/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useProjects, useAnalytics } from "@/hooks";
import { ExternalLink, Github } from "lucide-react";

const categories = ["all", "frontend", "backend", "fullstack", "mobile"];

export default function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { projects, isLoading } = useProjects(activeCategory);
  const { logClick } = useAnalytics();
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null);

  return (
    <SectionWrapper id="projects" className="bg-background relative overflow-hidden">
       {/* Background accent */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[150px] -z-10 pointer-events-none" />

      <SectionHeading
        title="Featured Projects"
        subtitle="Exploring the intersection of design and engineering"
      />

      {/* Filter Tabs */}
      <div className="flex justify-center mb-16">
        <div className="inline-flex gap-2 p-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative px-6 py-2 rounded-full text-xs font-heading font-black uppercase tracking-widest transition-all duration-500 ${
                activeCategory === cat
                  ? "text-black"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {activeCategory === cat && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl glass-card overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-6 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-muted-foreground text-lg">No projects found in this category.</p>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {projects.map((project, i) => (
              <motion.div
                key={project._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group spotlight-card rounded-xl glass-card overflow-hidden cursor-pointer"
                onClick={() => setSelectedProject(project)}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty(
                    "--mouse-x",
                    `${e.clientX - rect.left}px`
                  );
                  e.currentTarget.style.setProperty(
                    "--mouse-y",
                    `${e.clientY - rect.top}px`
                  );
                }}
              >
                {/* Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-electric/10 to-violet/10 overflow-hidden">
                  {project.thumbnail ? (
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl font-heading font-bold gradient-text">
                        {project.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-deep-dark/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                          logClick(project._id);
                        }}
                        className="rounded-full p-3 bg-electric/20 text-electric hover:bg-electric/30 transition-colors"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                          logClick(project._id);
                        }}
                        className="rounded-full p-3 bg-violet/20 text-violet hover:bg-violet/30 transition-colors"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <h3 className="font-heading text-xl font-semibold group-hover:text-electric transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.techStack.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.techStack.length - 4}
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Project Detail Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-2xl glass-card border-border">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading text-2xl gradient-text">
                  {selectedProject.title}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  {selectedProject.category}
                </DialogDescription>
              </DialogHeader>

              {selectedProject.thumbnail && (
                <div className="rounded-lg overflow-hidden h-56">
                  <img
                    src={selectedProject.thumbnail}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <p className="text-muted-foreground leading-relaxed">
                {selectedProject.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {selectedProject.techStack.map((tech) => (
                  <Badge key={tech}>{tech}</Badge>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                {selectedProject.liveUrl && (
                  <Button variant="glow" asChild>
                    <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                    </a>
                  </Button>
                )}
                {selectedProject.githubUrl && (
                  <Button variant="outline" asChild>
                    <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" /> Source Code
                    </a>
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </SectionWrapper>
  );
}
