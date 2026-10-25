import { z } from "zod";

/* ===== Project Schemas ===== */
export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  timeline: z.string().optional().default(""),
  description: z.string().min(1, "Description is required"),
  thumbnail: z.string().optional().default(""),
  techStack: z.array(z.string()).min(1, "At least one technology is required"),
  category: z.string().min(1, "Category is required"),
  liveUrl: z.string().optional().default(""),
  githubUrl: z.string().optional().default(""),
  features: z.array(z.string()).optional().default([]),
  status: z.enum(["published", "draft"]).default("draft"),
  order: z.number().int().min(0).optional(),
});
export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

/* ===== Message Schema ===== */
export const createMessageSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required").max(200),
  body: z.string().min(1, "Message is required").max(5000),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;

/* ===== Analytics Schemas ===== */
export const logViewSchema = z.object({
  page: z.string().min(1),
  referrer: z.string().optional(),
});

export const logClickSchema = z.object({
  projectId: z.string().min(1),
  referrer: z.string().optional(),
});

export type LogViewInput = z.infer<typeof logViewSchema>;
export type LogClickInput = z.infer<typeof logClickSchema>;

/* ===== Auth Schema ===== */
export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
