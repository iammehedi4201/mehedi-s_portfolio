import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createMessageSchema } from "@/lib/schemas";
import { messageStore } from "@/lib/storage/messageStore";

// POST /api/messages — Public: save contact form submission
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createMessageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const message = await messageStore.create(parsed.data);

    return NextResponse.json(
      { success: true, message: "Message sent successfully!", data: message },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/messages error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send message" },
      { status: 500 }
    );
  }
}

// GET /api/messages — Protected: all messages with pagination
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const result = await messageStore.getAll(page, limit);

    return NextResponse.json({
      success: true,
      data: result.messages,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    });
  } catch (error) {
    console.error("GET /api/messages error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
