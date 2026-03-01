"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Upload, Projector as ImagePlus, X, GripVertical } from "lucide-react";
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
  useUpdateProjectOrder,
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
  const queryClient = useQueryClient();
  const { data: projects, isLoading } = useDashboardProjects();
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();
  const updateOrderMutation = useUpdateProjectOrder();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [techInput, setTechInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = ["all", ...Array.from(new Set(projects?.map((p) => p.category) || []))];

  const filteredProjects = activeCategory === "all"
    ? projects
    : projects?.filter((p) => p.category === activeCategory);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && projects) {
      const oldIndex = projects.findIndex((p) => p._id === active.id);
      const newIndex = projects.findIndex((p) => p._id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        // Reorder and assign correct order values
        const reordered = arrayMove(projects, oldIndex, newIndex).map(
          (p, idx) => ({ ...p, order: idx })
        );
        const projectIds = reordered.map((p) => p._id);

        // Save previous state for rollback
        const previousProjects = projects;

        // Optimistically update the cache (with order values set)
        queryClient.setQueryData(["dashboard-projects"], reordered);

        try {
          await updateOrderMutation.mutateAsync(projectIds);
          toast.success("Order updated successfully");
        } catch (error) {
          // Revert to previous state on failure
          queryClient.setQueryData(["dashboard-projects"], previousProjects);
          toast.error("Failed to update order");
        }
      }
    }
  };

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
    setPreviewUrl(null);
    setSelectedFile(null);
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
    setPreviewUrl(project.thumbnail || null);
    setSelectedFile(null);
    setDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    try {
      const signRes = await fetch("/api/cloudinary/sign", { method: "POST" });
      const signData = await signRes.json();

      if (!signRes.ok || signData.error) {
        throw new Error(signData.error || "Failed to sign upload");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signData.apiKey);
      formData.append("timestamp", signData.timestamp.toString());
      formData.append("signature", signData.signature);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error(data.error?.message || "Cloudinary upload failed");
      }
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      throw err;
    }
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
      setIsUploading(true);
      let finalThumbnail = data.thumbnail;

      // If a new file was selected, upload it first
      if (selectedFile) {
        const uploadToast = toast.loading("Uploading image to Cloudinary...");
        try {
          finalThumbnail = await uploadToCloudinary(selectedFile);
          toast.dismiss(uploadToast);
        } catch (error) {
          toast.error("Image upload failed. Please try again.");
          toast.dismiss(uploadToast);
          setIsUploading(false);
          return;
        }
      }

      const projectData = { ...data, thumbnail: finalThumbnail };

      if (editingProject) {
        await updateMutation.mutateAsync({ id: editingProject._id, data: projectData });
        toast.success("Project updated and saved to MongoDB!");
      } else {
        await createMutation.mutateAsync(projectData);
        toast.success("Project created and saved to MongoDB!");
      }
      setDialogOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setIsUploading(false);
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

      {/* Category Tabs/Filter */}
      {projects && projects.length > 0 && (
        <div className="flex flex-wrap gap-2 pb-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "glow" : "ghost"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className="capitalize text-xs h-8"
            >
              {cat}
            </Button>
          ))}
        </div>
      )}

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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <div className="min-w-[800px]">
                <div className="grid grid-cols-[40px_1fr_150px_120px_120px_120px] gap-4 px-6 py-3 border-b border-white/[0.06] text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <div></div>
                  <div>Title</div>
                  <div className="block md:block">Category</div>
                  <div>Status</div>
                  <div className="hidden sm:block">Date</div>
                  <div className="text-right">Actions</div>
                </div>
                
                <SortableContext
                  items={filteredProjects?.map((p) => p._id) || []}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="divide-y divide-white/[0.04]">
                    {filteredProjects?.map((project, i) => (
                      <SortableRow
                        key={project._id}
                        project={project}
                        i={i}
                        openEdit={openEdit}
                        handleDelete={handleDelete}
                        toggleStatus={toggleStatus}
                      />
                    ))}
                  </div>
                </SortableContext>
              </div>
            </DndContext>
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
              <Label>Thumbnail Image</Label>
              <div className="relative">
                {previewUrl ? (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden group bg-white/[0.03] border border-white/[0.06]">
                    <img
                      src={previewUrl}
                      alt="Thumbnail Preview"
                      key={previewUrl}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => {
                          setValue("thumbnail", "");
                          setPreviewUrl(null);
                          setSelectedFile(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer group"
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-electric" />
                        <span className="text-sm text-muted-foreground font-medium">Uploading to Cloudinary...</span>
                      </div>
                    ) : (
                      <>
                        <div className="p-3 rounded-full bg-white/[0.05] group-hover:bg-white/[0.1] transition-colors mb-2">
                          <Upload className="h-6 w-6 text-muted-foreground group-hover:text-foreground" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">Click to upload thumbnail</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG or WebP (max 5MB)
                          </p>
                        </div>
                      </>
                    )}
                  </Label>
                )}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </div>
              {errors.thumbnail && (
                <p className="text-xs text-red-400 mt-1">{errors.thumbnail.message}</p>
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

interface SortableRowProps {
  project: Project;
  i: number;
  openEdit: (project: Project) => void;
  handleDelete: (id: string) => void;
  toggleStatus: (project: Project) => void;
}

function SortableRow({
  project,
  i,
  openEdit,
  handleDelete,
  toggleStatus,
}: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project._id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    position: "relative" as const,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: i * 0.05 }}
      className={`grid grid-cols-[40px_1fr_150px_120px_120px_120px] gap-4 items-center px-6 py-4 hover:bg-white/[0.02] transition-colors ${
        isDragging ? "bg-white/[0.05] shadow-xl ring-1 ring-white/10 z-50 cursor-grabbing" : ""
      }`}
    >
      <div className="flex items-center justify-center">
        <button
          {...attributes}
          {...listeners}
          className="p-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex items-center gap-3 min-w-0">
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

      <div className="hidden md:block">
        <span className="text-sm text-muted-foreground capitalize">
          {project.category}
        </span>
      </div>

      <div>
        <Badge
          variant={project.status === "published" ? "success" : "warning"}
          className="cursor-pointer"
          onClick={() => toggleStatus(project)}
        >
          {project.status}
        </Badge>
      </div>

      <div className="hidden sm:block">
        <span className="text-sm text-muted-foreground">
          {new Date(project.createdAt).toLocaleDateString()}
        </span>
      </div>

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
    </motion.div>
  );
}
