import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/lib/services/analyticsService";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: analyticsService.getDashboardStats,
  });
}

export function useDashboardAnalytics() {
  return useQuery({
    queryKey: ["dashboard-analytics"],
    queryFn: analyticsService.getSummary,
  });
}
