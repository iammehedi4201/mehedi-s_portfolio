"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useDashboardProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from "@/hooks/dashboard/useProjects";
import { createProjectSchema, type CreateProjectInput } from "@/lib/schemas";
import type { Project } from "@/types";
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Github,
  FolderKanban,
  MoreVertical,
} from "lucide-react";

export default function DashboardProjectsPage() {
  const { data: projects, isLoading } = useDashboardProjects();
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [techInput, setTechInput] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      thumbnail: "",
      techStack: [],
      category: "",
      liveUrl: "",
      githubUrl: "",
      status: "draft",
    },
  });

  const techStack = watch("techStack");
  const thumbnailUrl = watch("thumbnail");

  const openCreate = () => {
    setEditingProject(null);
    reset({
      title: "",
      description: "",
      thumbnail: "",
      techStack: [],
      category: "",
      liveUrl: "",
      githubUrl: "",
      status: "draft",
    });
    setTechInput("");
    setDialogOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditingProject(project);
    reset({
      title: project.title,
      description: project.description,
      thumbnail: project.thumbnail,
      techStack: project.techStack,
      category: project.category,
      liveUrl: project.liveUrl,
      githubUrl: project.githubUrl,
      status: project.status,
    });
    setTechInput("");
    setDialogOpen(true);
  };

  const addTech = () => {
    const tag = techInput.trim();
    if (tag && !techStack.includes(tag)) {
      setValue("techStack", [...techStack, tag]);
    }
    setTechInput("");
  };

  const removeTech = (tag: string) => {
    setValue(
      "techStack",
      techStack.filter((t) => t !== tag)
    );
  };

  const onSubmit = async (data: CreateProjectInput) => {
    try {
      if (editingProject) {
        await updateMutation.mutateAsync({ id: editingProject._id, data });
        toast.success("Project updated!");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Project created!");
      }
      setDialogOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Project deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const toggleStatus = async (project: Project) => {
    const newStatus = project.status === "published" ? "draft" : "published";
    try {
      await updateMutation.mutateAsync({
        id: project._id,
        data: { status: newStatus },
      });
      toast.success(`Project ${newStatus}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your portfolio projects
          </p>
        </div>
        <Button variant="glow" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      {/* Projects Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : !projects || projects.length === 0 ? (
        <Card className="bg-dash-card border-white/[0.06]">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FolderKanban className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No projects yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first project to get started
            </p>
            <Button variant="glow" className="mt-4" onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" /> Create Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-dash-card border-white/[0.06] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {projects.map((project, i) => (
                  <motion.tr
                    key={project._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-electric/20 to-violet/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold gradient-text">
                            {project.title.charAt(0)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{project.title}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {project.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground capitalize">
                        {project.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={project.status === "published" ? "success" : "warning"}
                        className="cursor-pointer"
                        onClick={() => toggleStatus(project)}
                      >
                        {project.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-md hover:bg-white/[0.06] text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => openEdit(project)}
                          className="p-1.5 rounded-md hover:bg-white/[0.06] text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(project._id)}
                          className="p-1.5 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl bg-dash-card border-white/[0.06] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {editingProject ? "Edit Project" : "New Project"}
            </DialogTitle>
            <DialogDescription>
              {editingProject
                ? "Update your project details below."
                : "Fill in the details for your new project."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input placeholder="My Awesome Project" {...register("title")} />
                {errors.title && (
                  <p className="text-xs text-red-400">{errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input placeholder="fullstack" {...register("category")} />
                {errors.category && (
                  <p className="text-xs text-red-400">{errors.category.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe your project..."
                rows={3}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-red-400">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Thumbnail URL</Label>
              <Input placeholder="https://example.com/image.png" {...register("thumbnail")} />
              {thumbnailUrl && (
                <div className="mt-2 rounded-lg overflow-hidden h-32 bg-white/[0.03]">
                  <img
                    src={thumbnailUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            {/* Tech Stack tags */}
            <div className="space-y-2">
              <Label>Tech Stack</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add technology..."
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTech();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addTech}>
                  Add
                </Button>
              </div>
              {techStack.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {techStack.map((tag) => (
                    <Badge
                      key={tag}
                      className="cursor-pointer hover:bg-red-500/10"
                      onClick={() => removeTech(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              )}
              {errors.techStack && (
                <p className="text-xs text-red-400">{errors.techStack.message}</p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Live URL</Label>
                <Input placeholder="https://..." {...register("liveUrl")} />
              </div>
              <div className="space-y-2">
                <Label>GitHub URL</Label>
                <Input placeholder="https://github.com/..." {...register("githubUrl")} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Label>Status</Label>
              <select
                {...register("status")}
                className="rounded-lg border border-input bg-background/50 px-3 py-2 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="glow"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Saving..."
                  : editingProject
                  ? "Update Project"
                  : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
