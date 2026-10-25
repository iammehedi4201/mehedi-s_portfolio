import path from "path";
import fs from "fs/promises";
import dbConnect from "@/lib/db";
import Project from "@/lib/models/Project";
import type { Project as ProjectType } from "@/types";

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "projects.json");

// Helper to safely read from local JSON storage
async function readLocalProjects(): Promise<ProjectType[]> {
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Could not read local projects.json, returning empty list:", error);
    return [];
  }
}

// Helper to write to local JSON storage
async function writeLocalProjects(projects: ProjectType[]): Promise<void> {
  try {
    await fs.mkdir(path.dirname(DATA_FILE_PATH), { recursive: true });
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(projects, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to write to projects.json:", error);
  }
}

export const projectStore = {
  async getAll({
    includeDrafts = true,
    category,
  }: {
    includeDrafts?: boolean;
    category?: string;
  } = {}): Promise<ProjectType[]> {
    try {
      await dbConnect();

      // Check if DB is empty and auto-seed if needed
      const count = await Project.countDocuments({ deletedAt: null });
      if (count === 0) {
        const local = await readLocalProjects();
        if (local.length > 0) {
          const docs = local.map((p, idx) => ({
            ...p,
            order: typeof p.order === "number" ? p.order : idx,
          }));
          await Project.insertMany(docs);
        }
      }

      const filter: Record<string, unknown> = { deletedAt: null };
      if (!includeDrafts) {
        filter.status = "published";
      }
      if (category && category !== "all") {
        filter.category = category;
      }

      const mongoProjects = await Project.find(filter).sort({ order: 1 }).lean();
      return mongoProjects.map((p) => ({
        ...p,
        _id: p._id.toString(),
        createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : new Date().toISOString(),
      })) as unknown as ProjectType[];
    } catch {
      // Fallback to local JSON file when MongoDB is offline / unavailable
      let local = await readLocalProjects();

      local = local.filter((p) => !p.deletedAt);
      if (!includeDrafts) {
        local = local.filter((p) => p.status === "published");
      }
      if (category && category !== "all") {
        local = local.filter((p) => p.category === category);
      }

      local.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      return local;
    }
  },

  async getById(id: string): Promise<ProjectType | null> {
    try {
      await dbConnect();
      const doc = await Project.findById(id).lean();
      if (!doc || doc.deletedAt) return null;
      return {
        ...doc,
        _id: doc._id.toString(),
        createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : new Date().toISOString(),
      } as unknown as ProjectType;
    } catch {
      const local = await readLocalProjects();
      const found = local.find((p) => p._id === id && !p.deletedAt);
      return found || null;
    }
  },

  async create(data: Partial<ProjectType>): Promise<ProjectType> {
    const local = await readLocalProjects();
    const newId = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const nowIso = new Date().toISOString();

    const maxOrder = local.reduce((max, p) => Math.max(max, p.order ?? 0), -1);
    const newProject: ProjectType = {
      _id: newId,
      title: data.title || "Untitled Project",
      timeline: data.timeline || "",
      description: data.description || "",
      thumbnail: data.thumbnail || "",
      techStack: data.techStack || [],
      category: data.category || "fullstack",
      liveUrl: data.liveUrl || "",
      githubUrl: data.githubUrl || "",
      features: data.features || [],
      order: typeof data.order === "number" ? data.order : maxOrder + 1,
      status: data.status || "draft",
      deletedAt: null,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    // Try MongoDB
    try {
      await dbConnect();
      const created = await Project.create({
        ...newProject,
        _id: undefined, // allow Mongo to assign its own ObjectId or pass through
      });
      newProject._id = created._id.toString();
    } catch {
      // MongoDB offline, fallback continues with local store
    }

    local.push(newProject);
    await writeLocalProjects(local);
    return newProject;
  },

  async update(id: string, data: Partial<ProjectType>): Promise<ProjectType | null> {
    const local = await readLocalProjects();
    const index = local.findIndex((p) => p._id === id);

    // Try MongoDB
    try {
      await dbConnect();
      await Project.findByIdAndUpdate(id, { ...data, updatedAt: new Date() });
    } catch {
      // MongoDB offline
    }

    if (index !== -1) {
      local[index] = {
        ...local[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      await writeLocalProjects(local);
      return local[index];
    }

    return null;
  },

  async delete(id: string): Promise<boolean> {
    const local = await readLocalProjects();
    const index = local.findIndex((p) => p._id === id);

    // Try MongoDB
    try {
      await dbConnect();
      await Project.findByIdAndUpdate(id, { deletedAt: new Date() });
    } catch {
      // MongoDB offline
    }

    if (index !== -1) {
      local[index].deletedAt = new Date().toISOString();
      await writeLocalProjects(local);
      return true;
    }

    return false;
  },

  async updateOrder(projectIds: string[]): Promise<void> {
    const local = await readLocalProjects();

    projectIds.forEach((id, index) => {
      const p = local.find((item) => item._id === id);
      if (p) {
        p.order = index;
      }
    });

    await writeLocalProjects(local);

    // Try MongoDB
    try {
      await dbConnect();
      await Promise.all(
        projectIds.map((id, index) =>
          Project.findByIdAndUpdate(id, { order: index }).catch(() => null)
        )
      );
    } catch {
      // MongoDB offline
    }
  },
};
