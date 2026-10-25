import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { projectStore } from "@/lib/storage/projectStore";

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

    const projects = await projectStore.getAll({ includeDrafts: true });
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error("GET /api/dashboard/projects error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// PUT /api/dashboard/projects — Bulk update order
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { projectIds } = await req.json();
    if (!projectIds || !Array.isArray(projectIds)) {
      return NextResponse.json(
        { success: false, error: "Invalid project IDs" },
        { status: 400 }
      );
    }

    await projectStore.updateOrder(projectIds);
    return NextResponse.json({ success: true, message: "Order updated" });
  } catch (error) {
    console.error("PUT /api/dashboard/projects error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update project order" },
      { status: 500 }
    );
  }
}
