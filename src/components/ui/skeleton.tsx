import * as React from "react";
import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-ds-bg-soft/80 border border-ds-stroke-soft/40 relative overflow-hidden",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
