import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import AnalyticsEvent from "@/lib/models/AnalyticsEvent";
import { logViewSchema } from "@/lib/schemas";

// POST /api/analytics/view — Public: log a page view
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const parsed = logViewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid data" },
        { status: 400 }
      );
    }

    await AnalyticsEvent.create({
      type: "view",
      page: parsed.data.page,
      referrer: parsed.data.referrer || "",
      userAgent: req.headers.get("user-agent") || "",
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("POST /api/analytics/view error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to log view" },
      { status: 500 }
    );
  }
}
