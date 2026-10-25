"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Top Welcome Telemetry Banner */}
      <div className="p-8 rounded-3xl bg-ds-bg-white border border-ds-stroke-soft shadow-ds-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 flex-1">
          <Skeleton className="h-4 w-32 rounded-full" />
          <Skeleton className="h-9 w-3/4 rounded-xl" />
          <Skeleton className="h-4 w-1/2 rounded-lg" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>

      {/* 4 Metric Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-2xl bg-ds-bg-white border border-ds-stroke-soft shadow-ds-sm space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-3 w-32 rounded-md" />
          </div>
        ))}
      </div>

      {/* Main Charts & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Analytics Chart (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-ds-bg-white border border-ds-stroke-soft shadow-ds-card space-y-5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-44 rounded-lg" />
            <Skeleton className="h-8 w-28 rounded-lg" />
          </div>
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>

        {/* Right Distribution / Mastery Doughnut (1 col) */}
        <div className="p-6 rounded-3xl bg-ds-bg-white border border-ds-stroke-soft shadow-ds-card space-y-5">
          <Skeleton className="h-6 w-36 rounded-lg" />
          <div className="flex items-center justify-center py-6">
            <Skeleton className="h-44 w-44 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-4/5 rounded-md" />
          </div>
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="p-6 rounded-3xl bg-ds-bg-white border border-ds-stroke-soft shadow-ds-card space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-40 rounded-lg" />
          <Skeleton className="h-4 w-24 rounded-md" />
        </div>
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>
    </div>
  );
}
