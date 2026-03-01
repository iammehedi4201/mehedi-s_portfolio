import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Project from "@/lib/models/Project";
import Message from "@/lib/models/Message";
import AnalyticsEvent from "@/lib/models/AnalyticsEvent";

// GET /api/dashboard/stats — Protected: aggregated dashboard stats
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

    const [
      totalProjects,
      publishedProjects,
      draftProjects,
      unreadMessages,
      totalMessages,
      totalViews,
      totalClicks,
    ] = await Promise.all([
      Project.countDocuments({ deletedAt: null }),
      Project.countDocuments({ deletedAt: null, status: "published" }),
      Project.countDocuments({ deletedAt: null, status: "draft" }),
      Message.countDocuments({ isRead: false }),
      Message.countDocuments(),
      AnalyticsEvent.countDocuments({ type: "view" }),
      AnalyticsEvent.countDocuments({ type: "click" }),
    ]);

    // Calculate trend (compare last 7 days vs previous 7 days)
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const [recentViews, previousViews, recentClicks, previousClicks] =
      await Promise.all([
        AnalyticsEvent.countDocuments({
          type: "view",
          createdAt: { $gte: sevenDaysAgo },
        }),
        AnalyticsEvent.countDocuments({
          type: "view",
          createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo },
        }),
        AnalyticsEvent.countDocuments({
          type: "click",
          createdAt: { $gte: sevenDaysAgo },
        }),
        AnalyticsEvent.countDocuments({
          type: "click",
          createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo },
        }),
      ]);

    const viewsTrend = previousViews
      ? Math.round(((recentViews - previousViews) / previousViews) * 100)
      : 0;
    const clicksTrend = previousClicks
      ? Math.round(((recentClicks - previousClicks) / previousClicks) * 100)
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalProjects,
        publishedProjects,
        draftProjects,
        unreadMessages,
        totalMessages,
        totalViews,
        totalClicks,
        viewsTrend,
        clicksTrend,
      },
    });
  } catch (error) {
    console.error("GET /api/dashboard/stats error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
