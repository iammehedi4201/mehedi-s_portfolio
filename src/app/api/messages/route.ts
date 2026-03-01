import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Message from "@/lib/models/Message";
import { createMessageSchema } from "@/lib/schemas";

// POST /api/messages — Public: save contact form submission
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const parsed = createMessageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    await Message.create(parsed.data);

    return NextResponse.json(
      { success: true, message: "Message sent successfully!" },
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

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      Message.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Message.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      data: messages,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET /api/messages error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
