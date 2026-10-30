import path from "path";
import fs from "fs/promises";
import dbConnect from "@/lib/db";
import Message from "@/lib/models/Message";
import type { Message as MessageType } from "@/types";

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "messages.json");

// Helper to safely read from local JSON storage
async function readLocalMessages(): Promise<MessageType[]> {
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Helper to write to local JSON storage
async function writeLocalMessages(messages: MessageType[]): Promise<void> {
  try {
    await fs.mkdir(path.dirname(DATA_FILE_PATH), { recursive: true });
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(messages, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to write to messages.json:", error);
  }
}

export const messageStore = {
  async getAll(page = 1, limit = 20): Promise<{
    messages: MessageType[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    // 1. Try MongoDB
    try {
      await dbConnect();
      const skip = (page - 1) * limit;

      const [mongoMessages, total] = await Promise.all([
        Message.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Message.countDocuments(),
      ]);

      const formatted = mongoMessages.map((m) => ({
        ...m,
        _id: m._id.toString(),
        createdAt: m.createdAt ? new Date(m.createdAt).toISOString() : new Date().toISOString(),
      })) as unknown as MessageType[];

      // Synchronize local JSON storage with latest messages
      if (page === 1 && formatted.length > 0) {
        writeLocalMessages(formatted).catch(() => {});
      }

      return {
        messages: formatted,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      };
    } catch {
      // 2. Fallback to local JSON storage when MongoDB is offline
      const local = await readLocalMessages();

      // Sort descending by createdAt
      local.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      const total = local.length;
      const skip = (page - 1) * limit;
      const paged = local.slice(skip, skip + limit);

      return {
        messages: paged,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      };
    }
  },

  async create(data: {
    name: string;
    email: string;
    subject: string;
    body: string;
  }): Promise<MessageType> {
    const local = await readLocalMessages();
    const newId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const nowIso = new Date().toISOString();

    const newMessage: MessageType = {
      _id: newId,
      name: data.name,
      email: data.email,
      subject: data.subject,
      body: data.body,
      isRead: false,
      createdAt: nowIso,
    };

    // 1. Try MongoDB
    try {
      await dbConnect();
      const created = await Message.create({
        name: data.name,
        email: data.email,
        subject: data.subject,
        body: data.body,
        isRead: false,
      });
      newMessage._id = created._id.toString();
    } catch {
      // MongoDB offline, fallback continues with local storage
    }

    // 2. Save to local storage
    local.unshift(newMessage);
    await writeLocalMessages(local);

    return newMessage;
  },

  async markAsRead(id: string): Promise<MessageType | null> {
    const local = await readLocalMessages();
    const index = local.findIndex((m) => m._id === id);

    // 1. Try MongoDB
    try {
      await dbConnect();
      const updated = await Message.findByIdAndUpdate(
        id,
        { isRead: true },
        { new: true }
      ).lean();

      if (updated) {
        const result = {
          ...updated,
          _id: updated._id.toString(),
          createdAt: updated.createdAt ? new Date(updated.createdAt).toISOString() : new Date().toISOString(),
        } as unknown as MessageType;

        if (index !== -1) {
          local[index].isRead = true;
          await writeLocalMessages(local);
        }

        return result;
      }
    } catch {
      // MongoDB offline
    }

    // 2. Update local storage
    if (index !== -1) {
      local[index].isRead = true;
      await writeLocalMessages(local);
      return local[index];
    }

    return null;
  },

  async countUnread(): Promise<number> {
    try {
      await dbConnect();
      return await Message.countDocuments({ isRead: false });
    } catch {
      const local = await readLocalMessages();
      return local.filter((m) => !m.isRead).length;
    }
  },

  async countTotal(): Promise<number> {
    try {
      await dbConnect();
      return await Message.countDocuments();
    } catch {
      const local = await readLocalMessages();
      return local.length;
    }
  },
};

