import * as React from "react";
import { cn } from "@/lib/utils";

const Badge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & {
    variant?: "default" | "secondary" | "outline" | "success" | "warning";
  }
>(({ className, variant = "default", ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        {
          "bg-primary/10 text-primary border border-primary/20":
            variant === "default",
          "bg-secondary text-secondary-foreground": variant === "secondary",
          "border border-border text-foreground": variant === "outline",
          "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20":
            variant === "success",
          "bg-amber-500/10 text-amber-400 border border-amber-500/20":
            variant === "warning",
        },
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

export { Badge };
