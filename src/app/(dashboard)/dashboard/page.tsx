"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "@/hooks/dashboard/useAnalytics";
import {
  FolderKanban,
  MessageSquare,
  Eye,
  MousePointerClick,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function DashboardOverview() {
  const { data: stats, isLoading } = useDashboardStats();

  const statCards = stats
    ? [
        {
          label: "Total Projects",
          value: stats.totalProjects,
          icon: FolderKanban,
          color: "#3B82F6",
          sub: `${stats.publishedProjects} published`,
        },
        {
          label: "Unread Messages",
          value: stats.unreadMessages,
          icon: MessageSquare,
          color: "#8B5CF6",
          sub: `${stats.totalMessages} total`,
        },
        {
          label: "Page Views",
          value: stats.totalViews,
          icon: Eye,
          color: "#06B6D4",
          trend: stats.viewsTrend,
        },
        {
          label: "Link Clicks",
          value: stats.totalClicks,
          icon: MousePointerClick,
          color: "#10B981",
          trend: stats.clicksTrend,
        },
      ]
    : [];

  return (
    <div className="space-y-8">
      <motion.div {...fadeUp} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-heading font-bold">Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back! Here&apos;s what&apos;s happening with your portfolio.
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="bg-dash-card border-white/[0.06]">
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-20 mt-2" />
                </CardContent>
              </Card>
            ))
          : statCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  {...fadeUp}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <Card className="bg-dash-card border-white/[0.06] hover:border-white/[0.12] transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {card.label}
                      </CardTitle>
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${card.color}15` }}
                      >
                        <Icon className="h-4.5 w-4.5" style={{ color: card.color }} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{card.value.toLocaleString()}</div>
                      <div className="flex items-center gap-1 mt-1">
                        {card.trend !== undefined ? (
                          <>
                            {card.trend >= 0 ? (
                              <TrendingUp className="h-3 w-3 text-emerald-400" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-400" />
                            )}
                            <span
                              className={`text-xs font-medium ${
                                card.trend >= 0 ? "text-emerald-400" : "text-red-400"
                              }`}
                            >
                              {card.trend >= 0 ? "+" : ""}
                              {card.trend}%
                            </span>
                            <span className="text-xs text-muted-foreground">vs last week</span>
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground">{card.sub}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
      </div>

      {/* Quick Actions */}
      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.5 }}>
        <Card className="bg-dash-card border-white/[0.06]">
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <a
              href="/dashboard/projects"
              className="px-4 py-2 rounded-lg bg-electric/10 text-electric text-sm font-medium hover:bg-electric/20 transition-colors"
            >
              + New Project
            </a>
            <a
              href="/dashboard/messages"
              className="px-4 py-2 rounded-lg bg-violet/10 text-violet text-sm font-medium hover:bg-violet/20 transition-colors"
            >
              View Messages
            </a>
            <a
              href="/dashboard/cv"
              className="px-4 py-2 rounded-lg bg-cyan/10 text-cyan text-sm font-medium hover:bg-cyan/20 transition-colors"
            >
              Update CV
            </a>
            <a
              href="/"
              target="_blank"
              className="px-4 py-2 rounded-lg bg-white/[0.06] text-muted-foreground text-sm font-medium hover:bg-white/[0.1] transition-colors"
            >
              Visit Portfolio →
            </a>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
