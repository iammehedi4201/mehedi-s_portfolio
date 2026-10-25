"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function MockInterviewSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header banner */}
      <div className="p-8 rounded-3xl bg-ds-bg-white border border-ds-stroke-soft shadow-ds-card space-y-3">
        <Skeleton className="h-6 w-28 rounded-full" />
        <Skeleton className="h-8 w-2/3 rounded-xl" />
        <Skeleton className="h-4 w-4/5 rounded-md" />
      </div>

      {/* Track selector grid */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-32 rounded-md" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 rounded-xl bg-ds-bg-white border border-ds-stroke-soft text-center space-y-2">
              <Skeleton className="h-6 w-6 mx-auto rounded-md" />
              <Skeleton className="h-4 w-16 mx-auto rounded-md" />
            </div>
          ))}
        </div>
      </div>

      {/* Selectors: Question count & timer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-ds-bg-white border border-ds-stroke-soft space-y-3">
          <Skeleton className="h-4 w-28 rounded-md" />
          <div className="flex gap-2">
            {[5, 10, 15, 20].map((num) => (
              <Skeleton key={num} className="h-9 flex-1 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-ds-bg-white border border-ds-stroke-soft space-y-3">
          <Skeleton className="h-4 w-28 rounded-md" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-9 flex-1 rounded-xl" />
            ))}
          </div>
        </div>
      </div>

      {/* Start button */}
      <div className="flex justify-center pt-2">
        <Skeleton className="h-12 w-52 rounded-xl" />
      </div>
    </div>
  );
}
