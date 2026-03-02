import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { createProjectSchema, type CreateProjectInput } from "@/lib/schemas";
import type { Project } from "@/types";

interface ProjectFormProps {
  editingProject: Project | null;
  onSubmit: (data: CreateProjectInput, selectedFile: File | null) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
}

export function ProjectForm({
  editingProject,
  onSubmit,
  onClose,
  isSubmitting,
}: ProjectFormProps) {
  const [techInput, setTechInput] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(editingProject?.thumbnail || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: editingProject ? {
      title: editingProject.title,
      description: editingProject.description,
      thumbnail: editingProject.thumbnail,
      techStack: editingProject.techStack,
      category: editingProject.category,
      liveUrl: editingProject.liveUrl,
      githubUrl: editingProject.githubUrl,
      status: editingProject.status,
    } : {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
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

  const handleFormSubmit = async (data: CreateProjectInput) => {
    await onSubmit(data, selectedFile);
  };

  return (
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

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
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
            <Select
              onValueChange={(val) => setValue("category", val)}
              defaultValue={watch("category") || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fullstack">Fullstack</SelectItem>
                <SelectItem value="frontend">Frontend</SelectItem>
                <SelectItem value="backend">Backend</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="tooling">Tooling</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {/* keep a hidden input so RHF is aware of the field */}
            <input type="hidden" {...register("category")} />
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
                <Image
                  src={previewUrl}
                  alt="Thumbnail Preview"
                  key={previewUrl}
                  fill
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
                {isSubmitting ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-electric" />
                    <span className="text-sm text-muted-foreground font-medium">Processing...</span>
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
              disabled={isSubmitting}
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
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="glow"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : editingProject
              ? "Update Project"
              : "Create Project"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
