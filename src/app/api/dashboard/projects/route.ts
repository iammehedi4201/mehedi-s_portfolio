import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Project from "@/lib/models/Project";

// GET /api/dashboard/projects — Protected: all projects (including drafts)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    const projects = await Project.find({ deletedAt: null })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error("GET /api/dashboard/projects error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
