"use client";
import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "default" | "ghost" | "outline";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  default: "bg-blue-600 text-white hover:bg-blue-700",
  ghost: "bg-transparent text-inherit hover:bg-white/10",
  outline: "bg-transparent border border-gray-700 text-inherit hover:bg-gray-800/40",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, type = "button", variant = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded font-semibold",
          "transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none",
          "px-4 py-2",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export default Button;
