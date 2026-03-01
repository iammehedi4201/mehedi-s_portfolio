import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { messageService } from "@/lib/services/messageService";

export function useDashboardMessages(page = 1) {
  return useQuery({
    queryKey: ["dashboard-messages", page],
    queryFn: () => messageService.getAll(page),
  });
}

export function useMarkMessageRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => messageService.markAsRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dashboard-messages"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}
