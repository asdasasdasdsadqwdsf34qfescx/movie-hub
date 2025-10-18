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

import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";

function Icon({ variant }: { variant: Variant }) {
  switch (variant) {
    case "error":
      return <AlertCircle className="h-5 w-5" />;
    case "success":
      return <CheckCircle2 className="h-5 w-5" />;
    case "warning":
      return <AlertTriangle className="h-5 w-5" />;
    default:
      return <Info className="h-5 w-5" />;
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
