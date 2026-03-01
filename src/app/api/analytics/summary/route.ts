import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import AnalyticsEvent from "@/lib/models/AnalyticsEvent";
import Project from "@/lib/models/Project";

// GET /api/analytics/summary — Protected: aggregated stats
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

    // Total counts
    const [totalViews, totalClicks] = await Promise.all([
      AnalyticsEvent.countDocuments({ type: "view" }),
      AnalyticsEvent.countDocuments({ type: "click" }),
    ]);

    // Daily views for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyViews = await AnalyticsEvent.aggregate([
      {
        $match: {
          type: "view",
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: "$_id", count: 1, _id: 0 } },
    ]);

    // Top clicked projects
    const topClicksRaw = await AnalyticsEvent.aggregate([
      { $match: { type: "click", projectId: { $ne: null } } },
      {
        $group: {
          _id: "$projectId",
          clicks: { $sum: 1 },
        },
      },
      { $sort: { clicks: -1 } },
      { $limit: 10 },
    ]);

    // Enrich with project titles
    const projectIds = topClicksRaw.map((t) => t._id);
    const projects = await Project.find({ _id: { $in: projectIds } })
      .select("title")
      .lean();
    const projectMap = new Map(projects.map((p) => [p._id.toString(), p.title]));

    const topProjects = topClicksRaw.map((t) => ({
      projectId: t._id.toString(),
      title: projectMap.get(t._id.toString()) || "Unknown",
      clicks: t.clicks,
    }));

    // Recent events
    const recentEvents = await AnalyticsEvent.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        totalViews,
        totalClicks,
        dailyViews,
        topProjects,
        recentEvents,
      },
    });
  } catch (error) {
    console.error("GET /api/analytics/summary error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
