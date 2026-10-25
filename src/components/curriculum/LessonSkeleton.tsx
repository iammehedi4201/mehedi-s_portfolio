"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function LessonSkeleton() {
  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* 7-part module stepper sidebar (4 cols) */}
      <div className="lg:col-span-4 p-6 rounded-3xl bg-ds-bg-white border border-ds-stroke-soft shadow-ds-sm space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-6 w-3/4 rounded-lg" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-ds-bg-weak/70 border border-ds-stroke-soft/60">
              <Skeleton className="h-6 w-6 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-4/5 rounded-md" />
                <Skeleton className="h-3 w-1/3 rounded-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main concept card with dark callout & code mockup (8 cols) */}
      <div className="lg:col-span-8 space-y-6">
        {/* Main concept container */}
        <div className="p-8 rounded-3xl bg-ds-bg-white border border-ds-stroke-soft shadow-ds-card space-y-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-28 rounded-full" />
          </div>
          <Skeleton className="h-9 w-2/3 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-11/12 rounded-md" />
            <Skeleton className="h-4 w-4/5 rounded-md" />
          </div>

          {/* Dark Glassmorphic Callout */}
          <div className="p-6 rounded-2xl bg-ds-bg-strong/5 dark:bg-ds-bg-white/5 border border-ds-stroke-soft space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded-lg" />
              <Skeleton className="h-5 w-40 rounded-md" />
            </div>
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
          </div>

          {/* Code Editor Mockup */}
          <div className="rounded-2xl border border-ds-stroke-soft bg-ds-bg-surface p-5 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-ds-stroke-soft/30">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-ds-error-base/60" />
                <div className="h-3 w-3 rounded-full bg-ds-warning-base/60" />
                <div className="h-3 w-3 rounded-full bg-ds-success-base/60" />
              </div>
              <Skeleton className="h-4 w-28 rounded-md" />
            </div>
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
            <Skeleton className="h-4 w-2/3 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
