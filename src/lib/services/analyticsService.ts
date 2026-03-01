import type { ApiResponse, AnalyticsSummary, DashboardStats } from "@/types";

const BASE = "/api";

export const analyticsService = {
  async getSummary(): Promise<AnalyticsSummary> {
    const res = await fetch(`${BASE}/analytics/summary`);
    const json: ApiResponse<AnalyticsSummary> = await res.json();
    if (!json.success) throw new Error(json.error || "Failed to fetch");
    return json.data!;
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${BASE}/dashboard/stats`);
    const json: ApiResponse<DashboardStats> = await res.json();
    if (!json.success) throw new Error(json.error || "Failed to fetch");
    return json.data!;
  },
};
