import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectService } from "@/lib/services/projectService";
import type { Project } from "@/types";

export function useDashboardProjects() {
  return useQuery({
    queryKey: ["dashboard-projects"],
    queryFn: projectService.getAll,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Project>) => projectService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dashboard-projects"] }),
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) =>
      projectService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dashboard-projects"] }),
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => projectService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dashboard-projects"] }),
  });
}

export function useUpdateProjectOrder() {
  return useMutation({
    mutationFn: (projectIds: string[]) => projectService.updateOrder(projectIds),
    // No onSuccess invalidation — the caller handles optimistic updates
    // and error rollback manually to avoid refetch-overwrite race conditions
  });
}
