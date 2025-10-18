"use client";
import React from "react";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";
import MobileMenu from "../components/MobileMenu";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { usePathname } from "next/navigation";

function ContentWrapper({ children }: { children: React.ReactNode }) {
  const { expanded } = useSidebar();
  const pathname = usePathname();
  const mlClass = pathname?.startsWith("/home") ? "lg:pl-0" : expanded ? "lg:pl-[280px]" : "lg:pl-[136px]";
  return (
    <div className={`min-h-screen w-full relative ${mlClass} transition-all duration-300 overflow-x-hidden`}>
      <Sidebar />
      <ThemeToggle />
      {/* Mobile-only hamburger menu */}
      <div className="lg:hidden"><MobileMenu /></div>
      <div>{children}</div>
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
