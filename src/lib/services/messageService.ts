import type { ApiResponse, Message, PaginatedResponse } from "@/types";

const BASE = "/api";

export const messageService = {
  async getAll(page = 1, limit = 20): Promise<PaginatedResponse<Message>> {
    const res = await fetch(`${BASE}/messages?page=${page}&limit=${limit}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || "Failed to fetch");
    return json;
  },

  async markAsRead(id: string): Promise<Message> {
    const res = await fetch(`${BASE}/messages/${id}/read`, {
      method: "PATCH",
    });
    const json: ApiResponse<Message> = await res.json();
    if (!json.success) throw new Error(json.error || "Failed to update");
    return json.data!;
  },
};
