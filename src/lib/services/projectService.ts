import type { ApiResponse, Project } from "@/types";

const BASE = "/api";

export const projectService = {
  async getAll(): Promise<Project[]> {
    const res = await fetch(`${BASE}/dashboard/projects`);
    const json: ApiResponse<Project[]> = await res.json();
    if (!json.success) throw new Error(json.error || "Failed to fetch");
    return json.data || [];
  },

  async getPublished(category?: string): Promise<Project[]> {
    const params = category && category !== "all" ? `?category=${category}` : "";
    const res = await fetch(`${BASE}/projects${params}`);
    const json: ApiResponse<Project[]> = await res.json();
    if (!json.success) throw new Error(json.error || "Failed to fetch");
    return json.data || [];
  },

  async getById(id: string): Promise<Project> {
    const res = await fetch(`${BASE}/projects/${id}`);
    const json: ApiResponse<Project> = await res.json();
    if (!json.success) throw new Error(json.error || "Failed to fetch");
    return json.data!;
  },

  async create(data: Partial<Project>): Promise<Project> {
    const res = await fetch(`${BASE}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json: ApiResponse<Project> = await res.json();
    if (!json.success) throw new Error(json.error || "Failed to create");
    return json.data!;
  },

  async update(id: string, data: Partial<Project>): Promise<Project> {
    const res = await fetch(`${BASE}/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json: ApiResponse<Project> = await res.json();
    if (!json.success) throw new Error(json.error || "Failed to update");
    return json.data!;
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${BASE}/projects/${id}`, { method: "DELETE" });
    const json: ApiResponse = await res.json();
    if (!json.success) throw new Error(json.error || "Failed to delete");
  },
};
