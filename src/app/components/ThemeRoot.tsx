"use client";
import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeRoot({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const scheme = theme === "dark"
    ? "bg-[#0a0a0a] text-[#ededed]"
    : "bg-[#f5f5f5] text-[#171717]";
  return (
    <div className={`${scheme} min-h-screen w-full transition-colors duration-300`}>{children}</div>
  );
}
