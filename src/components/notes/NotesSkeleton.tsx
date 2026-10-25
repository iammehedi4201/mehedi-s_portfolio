"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function NotesSkeleton() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Top Header with count badge and + New Note CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-ds-bg-white border border-ds-stroke-soft shadow-ds-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-36 rounded-lg" />
            <Skeleton className="h-5 w-10 rounded-full" />
          </div>
          <Skeleton className="h-4 w-48 rounded-md" />
        </div>
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>

      {/* Search bar and filter chips */}
      <div className="space-y-3">
        <Skeleton className="h-11 w-full rounded-xl" />
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full flex-shrink-0" />
          ))}
        </div>
      </div>

      {/* 6-card masonry note grid with code blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-6 rounded-2xl bg-ds-bg-white border border-ds-stroke-soft shadow-ds-sm space-y-4">
            <div className="flex justify-between items-start">
              <Skeleton className="h-5 w-3/4 rounded-lg" />
              <Skeleton className="h-4 w-12 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-4/5 rounded-md" />

            {/* Code snippet inside note */}
            <div className="p-3 rounded-xl bg-ds-bg-weak border border-ds-stroke-soft space-y-1.5 font-mono">
              <Skeleton className="h-3 w-4/5 rounded" />
              <Skeleton className="h-3 w-1/2 rounded" />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-ds-stroke-soft">
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
