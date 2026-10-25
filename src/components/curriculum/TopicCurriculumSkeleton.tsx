"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function TopicCurriculumSkeleton() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Course Header */}
      <div className="p-8 rounded-3xl bg-ds-bg-white border border-ds-stroke-soft shadow-ds-card space-y-4">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-10 w-2/3 rounded-xl" />
        <Skeleton className="h-4 w-4/5 rounded-md" />
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-9 w-32 rounded-xl" />
          <Skeleton className="h-9 w-40 rounded-xl" />
        </div>
      </div>

      {/* Prerequisites Checklist Card */}
      <div className="p-6 rounded-2xl bg-ds-bg-white border border-ds-stroke-soft space-y-4">
        <Skeleton className="h-5 w-48 rounded-md" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-ds-bg-weak border border-ds-stroke-soft/60">
              <Skeleton className="h-5 w-5 rounded-md" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
            </div>
          ))}
        </div>
      </div>

      {/* Phase with Lesson Rows */}
      <div className="p-6 rounded-3xl bg-ds-bg-white border border-ds-stroke-soft space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-ds-stroke-soft">
          <Skeleton className="h-6 w-44 rounded-lg" />
          <Skeleton className="h-4 w-20 rounded-md" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-ds-bg-weak border border-ds-stroke-soft">
              <div className="flex items-center gap-4 flex-1">
                <Skeleton className="h-7 w-7 rounded-lg" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-3/5 rounded-md" />
                  <Skeleton className="h-3 w-1/4 rounded-sm" />
                </div>
              </div>
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
