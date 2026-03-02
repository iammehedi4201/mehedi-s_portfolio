import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { toast } from "sonner";
import {
  useDashboardProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  useUpdateProjectOrder,
} from "@/hooks/dashboard/useProjects";
import { type CreateProjectInput } from "@/lib/schemas";
import type { Project } from "@/types";

export function useProjectManagement() {
  const queryClient = useQueryClient();
  const { data: projects, isLoading } = useDashboardProjects();
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();
  const updateOrderMutation = useUpdateProjectOrder();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = useMemo(() => {
    return ["all", ...Array.from(new Set(projects?.map((p) => p.category) || []))];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return activeCategory === "all"
      ? projects
      : projects?.filter((p) => p.category === activeCategory);
  }, [projects, activeCategory]);

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
        const reordered = arrayMove(projects, oldIndex, newIndex).map(
          (p, idx) => ({ ...p, order: idx })
        );
        const projectIds = reordered.map((p) => p._id);
        const previousProjects = projects;

        queryClient.setQueryData(["dashboard-projects"], reordered);

        try {
          await updateOrderMutation.mutateAsync(projectIds);
          toast.success("Order updated successfully");
        } catch (error) {
          queryClient.setQueryData(["dashboard-projects"], previousProjects);
          toast.error("Failed to update order");
        }
      }
    }
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

  const onSubmit = async (data: CreateProjectInput, selectedFile: File | null) => {
    try {
      let finalThumbnail = data.thumbnail;

      if (selectedFile) {
        const uploadToast = toast.loading("Uploading image to Cloudinary...");
        try {
          finalThumbnail = await uploadToCloudinary(selectedFile);
          toast.dismiss(uploadToast);
        } catch (error) {
          toast.error("Image upload failed. Please try again.");
          toast.dismiss(uploadToast);
          return;
        }
      }

      const projectData = { ...data, thumbnail: finalThumbnail };

      if (editingProject) {
        await updateMutation.mutateAsync({ id: editingProject._id, data: projectData });
        toast.success("Project updated successfully");
      } else {
        await createMutation.mutateAsync(projectData);
        toast.success("Project created successfully");
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

  const openCreate = () => {
    setEditingProject(null);
    setDialogOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditingProject(project);
    setDialogOpen(true);
  };

  return {
    projects,
    isLoading,
    activeCategory,
    setActiveCategory,
    categories,
    filteredProjects,
    sensors,
    handleDragEnd,
    onSubmit,
    handleDelete,
    toggleStatus,
    openCreate,
    openEdit,
    dialogOpen,
    setDialogOpen,
    editingProject,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
  };
}
