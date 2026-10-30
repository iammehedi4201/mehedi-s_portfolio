"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, X, Plus, Sparkles, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
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

const COMMON_TECH_STACK = [
  "Next.js",
  "React.js",
  "TypeScript",
  "Node.js",
  "Express.js",
  "MongoDB",
  "Mongoose",
  "PostgreSQL",
  "Tailwind CSS",
  "Docker",
  "REST API",
  "JWT",
  "TanStack",
  "Framer Motion",
];

const PRESET_THUMBNAILS = [
  { label: "VIPB AMC", path: "/projects/vipbamc.png" },
  { label: "ICE Business Times", path: "/projects/icebusinesstimes.png" },
];

export function ProjectForm({
  editingProject,
  onSubmit,
  onClose,
  isSubmitting,
}: ProjectFormProps) {
  const [techInput, setTechInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(editingProject?.thumbnail || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageMode, setImageMode] = useState<"upload" | "url">("upload");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: editingProject
      ? {
          title: editingProject.title,
          timeline: editingProject.timeline || "",
          description: editingProject.description,
          thumbnail: editingProject.thumbnail || "",
          techStack: editingProject.techStack || [],
          category: editingProject.category || "fullstack",
          liveUrl: editingProject.liveUrl || "",
          githubUrl: editingProject.githubUrl || "",
          features: editingProject.features || [],
          status: editingProject.status || "draft",
        }
      : {
          title: "",
          timeline: "",
          description: "",
          thumbnail: "",
          techStack: [],
          category: "fullstack",
          liveUrl: "",
          githubUrl: "",
          features: [],
          status: "published",
        },
  });

  const techStack = watch("techStack") || [];
  const features = watch("features") || [];
  const thumbnailValue = watch("thumbnail") || "";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setValue("thumbnail", ""); // Clear text thumbnail when file is picked
  };

  const handleUrlThumbnail = (url: string) => {
    setValue("thumbnail", url);
    setPreviewUrl(url || null);
    setSelectedFile(null);
  };

  const addTech = (tagToAdd?: string) => {
    const tag = (tagToAdd ?? techInput).trim();
    if (tag && !techStack.includes(tag)) {
      setValue("techStack", [...techStack, tag], { shouldValidate: true });
    }
    setTechInput("");
  };

  const removeTech = (tag: string) => {
    setValue(
      "techStack",
      techStack.filter((t) => t !== tag),
      { shouldValidate: true }
    );
  };

  const addFeature = () => {
    const text = featureInput.trim();
    if (text && !features.includes(text)) {
      setValue("features", [...features, text]);
    }
    setFeatureInput("");
  };

  const removeFeature = (idx: number) => {
    setValue(
      "features",
      features.filter((_, i) => i !== idx)
    );
  };

  const handleFormSubmit = async (data: CreateProjectInput) => {
    await onSubmit(data, selectedFile);
  };

  return (
    <DialogContent className="max-w-3xl bg-dash-card border-white/[0.08] max-h-[92vh] overflow-y-auto text-foreground p-6 sm:p-8">
      <DialogHeader>
        <DialogTitle className="font-heading text-xl sm:text-2xl font-semibold tracking-tight flex items-center gap-2">
          {editingProject ? "Edit Project" : "New Portfolio Project"}
        </DialogTitle>
        <DialogDescription className="text-muted-foreground text-sm">
          {editingProject
            ? "Update your portfolio project details, live URLs, and key achievements."
            : "Fill in the details below to add a new project to your portfolio showcase."}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 pt-2">
        {/* Row 1: Title & Category */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Project Title <span className="text-red-400">*</span>
            </Label>
            <Input
              placeholder="e.g. VIPB Asset Management Company Ltd."
              {...register("title")}
              className="bg-white/[0.03] border-white/10 focus:border-brand-primary"
            />
            {errors.title && (
              <p className="text-xs text-red-400">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Category <span className="text-red-400">*</span>
            </Label>
            <Select
              onValueChange={(val) => setValue("category", val, { shouldValidate: true })}
              defaultValue={watch("category") || "fullstack"}
            >
              <SelectTrigger className="bg-white/[0.03] border-white/10">
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
            <input type="hidden" {...register("category")} />
            {errors.category && (
              <p className="text-xs text-red-400">{errors.category.message}</p>
            )}
          </div>
        </div>

        {/* Row 2: Timeline & Status */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Timeline / Period
            </Label>
            <Input
              placeholder="e.g. Jan 2026 — Mar 2026 or May 2026"
              {...register("timeline")}
              className="bg-white/[0.03] border-white/10"
            />
            <p className="text-[11px] text-muted-foreground">
              Displayed as the top badge on the project card.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Publication Status
            </Label>
            <Select
              onValueChange={(val: "published" | "draft") =>
                setValue("status", val, { shouldValidate: true })
              }
              defaultValue={watch("status") || "published"}
            >
              <SelectTrigger className="bg-white/[0.03] border-white/10">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="published">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Published (Live on Portfolio)
                  </span>
                </SelectItem>
                <SelectItem value="draft">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Draft (Hidden)
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" {...register("status")} />
          </div>
        </div>

        {/* Row 3: Description */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Description <span className="text-red-400">*</span>
          </Label>
          <Textarea
            placeholder="Comprehensive description of the application, architecture, and problem solved..."
            rows={3}
            {...register("description")}
            className="bg-white/[0.03] border-white/10 resize-y"
          />
          {errors.description && (
            <p className="text-xs text-red-400">{errors.description.message}</p>
          )}
        </div>

        {/* Row 4: Key Features / Bullet points */}
        <div className="space-y-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
              Key Achievements &amp; Contributions (Modal Bullets)
            </Label>
            <span className="text-[11px] text-muted-foreground">
              {features.length} added
            </span>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="e.g. Automated PDF tax certificates and weekly portfolio alerts..."
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addFeature();
                }
              }}
              className="bg-white/[0.03] border-white/10 text-xs"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addFeature}
              className="border-white/10 shrink-0"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Feature
            </Button>
          </div>

          {features.length > 0 && (
            <ul className="space-y-2 mt-2">
              {features.map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.05] text-xs text-foreground/90"
                >
                  <div className="flex items-start gap-2 min-w-0">
                    <span className="text-brand-primary font-bold mt-0.5">•</span>
                    <span className="break-words leading-relaxed">{feature}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFeature(idx)}
                    className="p-1 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400 shrink-0 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Row 5: Thumbnail Image (Upload or URL) */}
        <div className="space-y-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-brand-primary" />
              Thumbnail Image
            </Label>
            <div className="flex gap-1 bg-white/[0.04] p-0.5 rounded-lg border border-white/[0.06]">
              <button
                type="button"
                onClick={() => setImageMode("upload")}
                className={`text-[11px] px-2.5 py-1 rounded-md transition-colors ${
                  imageMode === "upload"
                    ? "bg-brand-primary text-black font-semibold"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                File Upload
              </button>
              <button
                type="button"
                onClick={() => setImageMode("url")}
                className={`text-[11px] px-2.5 py-1 rounded-md transition-colors ${
                  imageMode === "url"
                    ? "bg-brand-primary text-black font-semibold"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                Direct URL / Path
              </button>
            </div>
          </div>

          {previewUrl ? (
            <div className="relative w-full h-48 rounded-xl overflow-hidden group bg-black/40 border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Thumbnail Preview"
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setValue("thumbnail", "");
                    setPreviewUrl(null);
                    setSelectedFile(null);
                  }}
                >
                  <X className="h-4 w-4 mr-1" /> Remove Image
                </Button>
              </div>
            </div>
          ) : imageMode === "upload" ? (
            <Label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed border-white/10 bg-white/[0.01] hover:bg-white/[0.04] transition-all cursor-pointer group"
            >
              {isSubmitting ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-7 w-7 animate-spin text-brand-primary" />
                  <span className="text-xs text-muted-foreground">Uploading...</span>
                </div>
              ) : (
                <>
                  <div className="p-3 rounded-full bg-white/[0.05] group-hover:bg-white/[0.1] transition-colors mb-2">
                    <Upload className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                  </div>
                  <p className="text-xs font-semibold">Click or drag image to upload thumbnail</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    PNG, JPG, WebP (up to 5MB)
                  </p>
                </>
              )}
            </Label>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="https://... or /projects/vipbamc.png"
                  value={thumbnailValue}
                  onChange={(e) => handleUrlThumbnail(e.target.value)}
                  className="bg-white/[0.03] border-white/10 text-xs"
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-muted-foreground">Presets:</span>
                {PRESET_THUMBNAILS.map((preset) => (
                  <button
                    key={preset.path}
                    type="button"
                    onClick={() => handleUrlThumbnail(preset.path)}
                    className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
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

        {/* Row 6: Tech Stack */}
        <div className="space-y-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tech Stack <span className="text-red-400">*</span>
            </Label>
            <span className="text-[11px] text-muted-foreground">
              {techStack.length} technologies
            </span>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Type technology (e.g. Next.js, Redux, PostgreSQL)..."
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTech();
                }
              }}
              className="bg-white/[0.03] border-white/10 text-xs"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addTech()}
              className="border-white/10 shrink-0"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add
            </Button>
          </div>

          {/* Quick select popular tech pills */}
          <div className="pt-1">
            <p className="text-[11px] text-muted-foreground mb-1.5">Quick add:</p>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_TECH_STACK.map((tech) => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => addTech(tech)}
                  disabled={techStack.includes(tech)}
                  className={`text-[10px] px-2 py-0.5 rounded transition-all ${
                    techStack.includes(tech)
                      ? "opacity-40 cursor-not-allowed bg-white/[0.02] text-muted-foreground"
                      : "bg-white/[0.05] hover:bg-white/[0.1] text-foreground/90 border border-white/[0.06]"
                  }`}
                >
                  + {tech}
                </button>
              ))}
            </div>
          </div>

          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/[0.06]">
              {techStack.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="gap-1 text-xs py-1 px-2.5 bg-brand-primary/10 border-brand-primary/30 text-brand-primary hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer"
                  onClick={() => removeTech(tag)}
                  title="Click to remove"
                >
                  <span>{tag}</span>
                  <X className="w-3 h-3" />
                </Badge>
              ))}
            </div>
          )}
          {errors.techStack && (
            <p className="text-xs text-red-400">{errors.techStack.message}</p>
          )}
        </div>

        {/* Row 7: Live URL & GitHub URL */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <LinkIcon className="w-3 h-3" /> Live Platform URL (Optional)
            </Label>
            <Input
              placeholder="https://vipbamc.com/"
              {...register("liveUrl")}
              className="bg-white/[0.03] border-white/10 text-xs"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <LinkIcon className="w-3 h-3" /> GitHub Repo URL (Optional)
            </Label>
            <Input
              placeholder="https://github.com/... (leave empty for private work)"
              {...register("githubUrl")}
              className="bg-white/[0.03] border-white/10 text-xs"
            />
          </div>
        </div>

        <DialogFooter className="pt-4 border-t border-white/[0.06] flex items-center justify-between sm:justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="glow"
            disabled={isSubmitting}
            className="font-semibold min-w-[140px]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </span>
            ) : editingProject ? (
              "Update Project"
            ) : (
              "Create Project"
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
