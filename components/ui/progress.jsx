"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

function Progress({ className, value, ...props }) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 transition-all"
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
          background: `linear-gradient(90deg,
      #FF3B3B 0%,
      #FFA500 25%,
      #FFD60A 50%,
      #00FF9C 75%,
      #00FAFF 100%)`,
          backgroundSize: "200% 100%",
          backgroundPosition: `${100 - value}% 0`,
        }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
