"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function InterviewHubSkeleton() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Banner */}
      <div className="p-8 rounded-3xl bg-ds-bg-white border border-ds-stroke-soft shadow-ds-card space-y-3">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-8 w-1/2 rounded-xl" />
        <Skeleton className="h-4 w-2/3 rounded-md" />
      </div>

      {/* 4 quick stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-2xl bg-ds-bg-white border border-ds-stroke-soft space-y-2">
            <Skeleton className="h-3 w-16 rounded-md" />
            <Skeleton className="h-7 w-20 rounded-lg" />
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>

      {/* Search Input */}
      <Skeleton className="h-11 w-full rounded-xl" />

      {/* 6 interview topic cards with mastery bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-6 rounded-2xl bg-ds-bg-white border border-ds-stroke-soft shadow-ds-sm space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32 rounded-lg" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full rounded-md" />
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs">
                <Skeleton className="h-3 w-14 rounded-sm" />
                <Skeleton className="h-3 w-10 rounded-sm" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
