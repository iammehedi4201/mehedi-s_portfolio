"use client";

import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog } from "@/components/ui/dialog";
import { FolderKanban, Plus } from "lucide-react";
import { SortableRow } from "@/components/dashboard/SortableRow";
import { ProjectForm } from "@/components/dashboard/ProjectForm";
import { useProjectManagement } from "@/hooks/dashboard/useProjectManagement";

export default function DashboardProjectsPage() {
  const {
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
    isSubmitting,
  } = useProjectManagement();

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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {dialogOpen && (
          <ProjectForm
            editingProject={editingProject}
            onClose={() => setDialogOpen(false)}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </Dialog>
    </div>
  );
}
