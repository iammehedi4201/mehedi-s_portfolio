/* ===== TYPES — Shared across portfolio & dashboard ===== */

export interface Project {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  techStack: string[];
  category: string;
  liveUrl: string;
  githubUrl: string;
  order: number;
  status: "published" | "draft";
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export interface AnalyticsEvent {
  _id: string;
  type: "view" | "click";
  projectId?: string;
  page?: string;
  referrer?: string;
  userAgent?: string;
  createdAt: string;
}

export interface AnalyticsSummary {
  totalViews: number;
  totalClicks: number;
  dailyViews: { date: string; count: number }[];
  topProjects: { projectId: string; title: string; clicks: number }[];
  recentEvents: AnalyticsEvent[];
}

export interface DashboardStats {
  totalProjects: number;
  publishedProjects: number;
  draftProjects: number;
  unreadMessages: number;
  totalMessages: number;
  totalViews: number;
  totalClicks: number;
  viewsTrend: number; // percentage change
  clicksTrend: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
