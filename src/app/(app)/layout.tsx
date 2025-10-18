"use client";
import React from "react";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full relative">
      <Sidebar />
      <ThemeToggle />
      <div className="ml-[280px] p-8 transition-all duration-300">{children}</div>
    </div>
  );
}
