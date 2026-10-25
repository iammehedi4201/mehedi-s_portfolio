import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import AnalyticsEvent from "@/lib/models/AnalyticsEvent";
import { logClickSchema } from "@/lib/schemas";

// POST /api/analytics/click — Public: log a project link click
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const parsed = logClickSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid data" },
        { status: 400 }
      );
    }

    await AnalyticsEvent.create({
      type: "click",
      projectId: parsed.data.projectId,
      referrer: parsed.data.referrer || "",
      userAgent: req.headers.get("user-agent") || "",
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    // Graceful silent fallback if database is offline in local development
    return NextResponse.json(
      { success: false, offline: true },
      { status: 200 }
    );
  }
}
