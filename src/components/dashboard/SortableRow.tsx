import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Pencil, Trash2, ExternalLink } from "lucide-react";
import type { Project } from "@/types";

interface SortableRowProps {
  project: Project;
  i: number;
  openEdit: (project: Project) => void;
  handleDelete: (id: string) => void;
  toggleStatus: (project: Project) => void;
}

export function SortableRow({
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

  const formattedDate =
    project.createdAt && !isNaN(new Date(project.createdAt).getTime())
      ? new Date(project.createdAt).toLocaleDateString()
      : "Recent";

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
          title="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-lg bg-surface-elevated border border-border-subtle flex items-center justify-center flex-shrink-0 overflow-hidden">
          {project.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs font-bold font-mono text-brand-primary">
              {project.title.charAt(0)}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate text-foreground">{project.title}</p>
          <p className="text-xs text-muted-foreground truncate max-w-[280px]">
            {project.description}
          </p>
        </div>
      </div>

      <div className="hidden md:block">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">
          {project.category}
        </span>
      </div>

      <div>
        <Badge
          variant={project.status === "published" ? "success" : "warning"}
          className="cursor-pointer select-none"
          onClick={() => toggleStatus(project)}
          title="Click to toggle status"
        >
          {project.status}
        </Badge>
      </div>

      <div className="hidden sm:block">
        <span className="text-xs text-muted-foreground font-mono">
          {formattedDate}
        </span>
      </div>

      <div className="flex items-center justify-end gap-2">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md hover:bg-white/[0.06] text-muted-foreground hover:text-foreground transition-colors"
            title="Visit live website"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
        <button
          onClick={() => openEdit(project)}
          className="p-1.5 rounded-md hover:bg-white/[0.06] text-muted-foreground hover:text-foreground transition-colors"
          title="Edit project"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => handleDelete(project._id)}
          className="p-1.5 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
          title="Delete project"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
