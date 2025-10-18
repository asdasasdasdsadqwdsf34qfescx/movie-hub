"use client";
import * as React from "react";
import { cn } from "@/lib/cn";


export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full px-4 py-2 rounded bg-gray-800 border text-white focus:outline-none",
        "border-gray-700 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

export default Input;
