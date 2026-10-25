"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function RoadmapsSkeleton() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Learning Roadmaps hero */}
      <div className="p-8 rounded-3xl bg-ds-bg-white border border-ds-stroke-soft shadow-ds-card space-y-3">
        <Skeleton className="h-6 w-28 rounded-full" />
        <Skeleton className="h-9 w-2/3 rounded-xl" />
        <Skeleton className="h-4 w-4/5 rounded-md" />
      </div>

      {/* Category filter tabs & search */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {["Frontend", "Backend", "Fullstack", "DevOps", "Database"].map((cat) => (
            <Skeleton key={cat} className="h-9 w-24 rounded-full flex-shrink-0" />
          ))}
        </div>
        <Skeleton className="h-10 w-full sm:w-64 rounded-xl" />
      </div>

      {/* 8 skill cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="p-6 rounded-2xl bg-ds-bg-white border border-ds-stroke-soft shadow-ds-sm space-y-4">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <Skeleton className="h-5 w-3/4 rounded-lg" />
            <Skeleton className="h-3 w-full rounded-md" />
            <Skeleton className="h-3 w-4/5 rounded-md" />
            <div className="pt-2 border-t border-ds-stroke-soft flex justify-between items-center">
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-4 w-12 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
