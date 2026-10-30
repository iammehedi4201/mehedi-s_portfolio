import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "brand"
    | "feature"
    | "secondary"
    | "outline"
    | "success"
    | "warning"
    | "info"
    | "error";
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors select-none",
          {
            "bg-brand-subtle text-brand-subtle-text border border-brand-primary/30":
              variant === "default" || variant === "brand" || variant === "feature",
            "bg-surface-subtle text-heading border border-border-subtle":
              variant === "secondary",
            "border border-border-subtle text-body bg-transparent":
              variant === "outline",
            "bg-color-success-subtle text-color-success border border-color-success/30":
              variant === "success",
            "bg-color-warning-subtle text-color-warning border border-color-warning/30":
              variant === "warning",
            "bg-color-info-subtle text-color-info border border-color-info/30":
              variant === "info",
            "bg-color-error-subtle text-color-error border border-color-error/30":
              variant === "error",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge };
