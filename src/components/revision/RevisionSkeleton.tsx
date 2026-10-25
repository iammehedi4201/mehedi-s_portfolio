"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function RevisionSkeleton() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {/* Top Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <Skeleton className="h-4 w-28 rounded-md" />
          <Skeleton className="h-4 w-16 rounded-md" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>

      {/* 3D Flip Card Placeholder */}
      <div className="p-10 rounded-3xl bg-ds-bg-white border border-ds-stroke-soft shadow-ds-lg min-h-[320px] flex flex-col justify-between items-center text-center space-y-6">
        <Skeleton className="h-5 w-24 rounded-full" />
        <div className="space-y-3 w-full max-w-md">
          <Skeleton className="h-7 w-full rounded-lg" />
          <Skeleton className="h-7 w-3/4 mx-auto rounded-lg" />
        </div>
        <Skeleton className="h-4 w-36 rounded-md" />
      </div>

      {/* 4 SM-2 Interval Grading Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Again (<1m)", color: "border-ds-error-base/30" },
          { label: "Hard (1d)", color: "border-ds-warning-base/30" },
          { label: "Good (3d)", color: "border-ds-info-base/30" },
          { label: "Easy (7d)", color: "border-ds-success-base/30" },
        ].map((btn, i) => (
          <div key={i} className={`p-4 rounded-2xl bg-ds-bg-white border ${btn.color} text-center space-y-2 shadow-ds-sm`}>
            <Skeleton className="h-4 w-16 mx-auto rounded-md" />
            <Skeleton className="h-3 w-10 mx-auto rounded-sm" />
          </div>
        ))}
      </div>
    </div>
  );
}
