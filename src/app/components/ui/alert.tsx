"use client";
import * as React from "react";
import { cn } from "@/lib/cn";

export function Alert({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="status"
      className={cn(
        "w-full rounded-lg border px-4 py-3",
        "bg-gray-900/80 border-gray-700 text-gray-100",
        className
      )}
      {...props}
    />
  );
}

export function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h5 className={cn("mb-1 font-semibold text-sm", className)} {...props} />;
}

export function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm leading-relaxed text-gray-300", className)} {...props} />;
}
