import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { messageStore } from "@/lib/storage/messageStore";

// PATCH /api/messages/[id]/read — Protected: mark message as read
export async function PATCH(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const message = await messageStore.markAsRead(params.id);

    if (!message) {
      return NextResponse.json(
        { success: false, error: "Message not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: message,
      message: "Marked as read",
    });
  } catch (error) {
    console.error("PATCH /api/messages/[id]/read error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update message" },
      { status: 500 }
    );
  }
}
