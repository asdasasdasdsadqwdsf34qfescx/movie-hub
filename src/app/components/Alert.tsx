"use client";
import React from "react";

type Variant = "error" | "success" | "info" | "warning";

interface AlertProps {
  variant?: Variant;
  title?: string;
  children: React.ReactNode;
  className?: string;
  role?: "alert" | "status";
}

const variantClasses: Record<Variant, { container: string; icon: string; title: string; text: string; border: string; }> = {
  error: {
    container: "bg-red-900/20 border-red-500/40",
    icon: "text-red-400",
    title: "text-red-300",
    text: "text-red-200",
    border: "border-red-500/40",
  },
  success: {
    container: "bg-emerald-900/20 border-emerald-500/40",
    icon: "text-emerald-400",
    title: "text-emerald-300",
    text: "text-emerald-200",
    border: "border-emerald-500/40",
  },
  info: {
    container: "bg-sky-900/20 border-sky-500/40",
    icon: "text-sky-400",
    title: "text-sky-300",
    text: "text-sky-200",
    border: "border-sky-500/40",
  },
  warning: {
    container: "bg-amber-900/20 border-amber-500/40",
    icon: "text-amber-400",
    title: "text-amber-300",
    text: "text-amber-200",
    border: "border-amber-500/40",
  },
};

function Icon({ variant }: { variant: Variant }) {
  switch (variant) {
    case "error":
      return (
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 8a1 1 0 000 2v4a1 1 0 102 0V9a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      );
    case "success":
      return (
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879A1 1 0 106.293 10.293l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    case "warning":
      return (
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.72-1.36 3.485 0l6.518 11.59c.75 1.334-.213 2.986-1.742 2.986H3.48c-1.53 0-2.492-1.652-1.743-2.986l6.52-11.59zM11 14a1 1 0 11-2 0 1 1 0 012 0zm-1-2a1 1 0 01-1-1V8a1 1 0 112 0v3a1 1 0 01-1 1z" clipRule="evenodd" />
        </svg>
      );
    default:
      return (
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM9 9a1 1 0 102 0V6a1 1 0 10-2 0v3zm1 4a1 1 0 100 2h.01a1 1 0 100-2H10z" clipRule="evenodd" />
        </svg>
      );
  }
}

export const Alert: React.FC<AlertProps> = ({ variant = "info", title, children, className = "", role }) => {
  const v = variantClasses[variant];
  const effectiveRole = role || (variant === "error" ? "alert" : "status");
  return (
    <div
      className={`w-full border ${v.container} ${v.border} rounded-lg p-3 sm:p-4 flex items-start gap-3 ${className}`}
      role={effectiveRole}
      aria-live={effectiveRole === "alert" ? "assertive" : "polite"}
    >
      <div className={`${v.icon} mt-0.5 sm:mt-0`}>
        <Icon variant={variant} />
      </div>
      <div className="min-w-0">
        {title && <p className={`text-xs sm:text-sm font-semibold ${v.title}`}>{title}</p>}
        <div className={`text-xs sm:text-sm leading-relaxed ${v.text}`}>{children}</div>
      </div>
    </div>
  );
};

export default Alert;
