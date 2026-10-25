"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function TrackBrowseSkeleton() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Topic header */}
      <div className="p-6 rounded-3xl bg-ds-bg-white border border-ds-stroke-soft space-y-2">
        <Skeleton className="h-7 w-48 rounded-lg" />
        <Skeleton className="h-4 w-72 rounded-md" />
      </div>

      {/* Search and filter toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Skeleton className="h-11 flex-1 rounded-xl" />
        <Skeleton className="h-11 w-36 rounded-xl" />
      </div>

      {/* 5 expandable question accordion items */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-5 rounded-2xl bg-ds-bg-white border border-ds-stroke-soft flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
            </div>
            <Skeleton className="h-5 w-5 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
