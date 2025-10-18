"use client";
import React from "react";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";

function ContentWrapper({ children }: { children: React.ReactNode }) {
  const { expanded } = useSidebar();
  const mlClass = expanded ? "lg:ml-[280px]" : "lg:ml-[136px]";
  return (
    <div className={`min-h-screen w-full relative ${mlClass} transition-all duration-300`}>
      <Sidebar />
      <ThemeToggle />
      <div className="p-8">{children}</div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <ContentWrapper>{children}</ContentWrapper>
    </SidebarProvider>
  );
}
