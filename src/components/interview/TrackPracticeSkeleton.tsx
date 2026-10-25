"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function TrackPracticeSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header with Topic Progress & Difficulty Pill */}
      <div className="flex items-center justify-between p-6 rounded-2xl bg-ds-bg-white border border-ds-stroke-soft">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-40 rounded-lg" />
          <Skeleton className="h-3 w-24 rounded-md" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Question Prompt Card */}
      <div className="p-8 rounded-3xl bg-ds-bg-white border border-ds-stroke-soft shadow-ds-card space-y-6">
        <Skeleton className="h-7 w-4/5 rounded-xl" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-3/4 rounded-md" />

        {/* Code snippet block */}
        <div className="p-5 rounded-2xl bg-ds-bg-surface border border-ds-stroke-soft space-y-2 font-mono">
          <Skeleton className="h-4 w-2/3 rounded-md" />
          <Skeleton className="h-4 w-1/2 rounded-md" />
          <Skeleton className="h-4 w-4/5 rounded-md" />
        </div>

        {/* Answer reveal button */}
        <div className="pt-4 flex justify-center">
          <Skeleton className="h-11 w-48 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
