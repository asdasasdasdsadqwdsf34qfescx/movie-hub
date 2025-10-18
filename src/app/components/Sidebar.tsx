"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Folder,
  BarChart3,
  ChevronUp,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/services/supabaseClient";
import { Button } from "./ui/button";
import CollapseToggle from "./CollapseToggle";
import { useSidebar } from "@/contexts/SidebarContext";

interface MenuItem {
  id: string;
  label: string;
  Icon: React.ComponentType<{
    size?: number;
    color?: string;
    strokeWidth?: number;
    className?: string;
  }>;
  subItems?: { label: string }[];
}

const Sidebar = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { expanded: isExpanded, setExpanded: setIsExpanded } = useSidebar();
  const [isDashboardOpen, setIsDashboardOpen] = useState(true);
  const [userDisplay, setUserDisplay] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    function extractName(meta: unknown): string | undefined {
      if (meta && typeof meta === "object") {
        const m = meta as { name?: unknown };
        return typeof m.name === "string" ? m.name : undefined;
      }
      return undefined;
    }
    async function load() {
      try {
        const { data } = await supabase.auth.getSession();
        if (mounted) {
          const metaName = extractName(
            data.session?.user?.user_metadata as unknown
          );
          setUserDisplay(metaName || data.session?.user?.email || "");
        }
      } catch {
        if (mounted) setUserDisplay("");
      }
    }
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const metaName = extractName(session?.user?.user_metadata as unknown);
        setUserDisplay(metaName || session?.user?.email || "");
      }
    );
    load();
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const menuItems: MenuItem[] = [
    {
      id: "collection",
      label: "Collection",
      Icon: Folder,
    },
    {
      id: "statistics",
      label: "Statistics",
      Icon: BarChart3,
    },
  ];

  const themeClasses = {
    dark: {
      bg: "bg-[rgba(15,9,12,0.56)] border-white/10",
      blur: "backdrop-blur-[80px]",
      text: "text-white",
      textMuted: "text-white/56",
      textDim: "text-white/32",
      activeBg: "bg-white/5 border-white/10",
      hoverBg: "hover:bg-white/5",
      divider: "bg-gradient-to-r from-transparent via-[#CC8B8B] to-transparent",
      promoBg: "bg-[rgba(56,14,36,0.10)] border-white/10",
      buttonBg: "bg-gradient-to-b from-[#E0822D] to-[#E0822D]",
      arrowBg: "bg-[rgba(15,9,12,0.40)] border-white/10",
      onlineIndicator: "bg-[#7FBA7A]",
      offlineIndicator: "bg-[#250D0E] border-[#9F9595]",
    },
    light: {
      bg: "bg-[#adadad] border-[#918d8d]",
      blur: "",
      text: "text-[#242220]",
      textMuted: "text-[rgba(36,34,32,0.56)]",
      textDim: "text-[rgba(36,34,32,0.40)]",
      activeBg: "bg-[rgba(36,34,32,0.04)] border-[#918d8d]",
      hoverBg: "hover:bg-[rgba(36,34,32,0.08)]",
      divider: "bg-gradient-to-r from-transparent via-[#432C2C] to-transparent",
      promoBg: "bg-[rgba(56,14,36,0.10)] border-[#918d8d]",
      buttonBg: "bg-gradient-to-b from-[#E58025] to-[#E58025]",
      arrowBg: "bg-[rgba(246,247,249,0.92)] border-[rgba(0,0,0,0.10)]",
      onlineIndicator: "bg-[#61AD5A]",
      offlineIndicator: "bg-[#D39D8A] border-[#666260]",
    },
  } as const;

  const colors = themeClasses[theme];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] lg:hidden transition-opacity duration-300 ${
          isExpanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsExpanded(false)}
        aria-hidden
      />
      <motion.aside
        initial={false}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className={`fixed left-4 top-4 bottom-4 h-auto ${
          isExpanded ? "w-64" : "w-[104px]"
        }
          ${colors.bg} border-[0.5px] rounded-[28px]
          ${colors.blur} shadow-[0_64px_64px_-32px_rgba(41,15,0,0.56)]
          transition-all duration-300 ease-in-out z-50 hidden lg:flex flex-col overflow-hidden pt-6`}
      >
        <div className="px-6 mb-4">
          <div className="flex items-center gap-3">
            {isExpanded && (
              <div className="overflow-hidden">
                <div
                  className={`text-[14px] font-medium ${colors.text} leading-5 break-all`}
                >
                  {userDisplay}
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className={`mt-1 inline-flex items-center px-2.5 py-1 text-xs rounded ${
                    theme === "dark"
                      ? "border-white/20 text-white/80 hover:bg-white/10"
                      : "border-[#f00707] text-[#242220]/80 hover:bg-black/5"
                  } transition-colors`}
                >
                  Log out
                </Button>
              </div>
            )}
          </div>
        </div>

        <CollapseToggle
          expanded={isExpanded}
          onToggle={() => setIsExpanded(!isExpanded)}
          theme={theme}
          surfaceClass={colors.arrowBg}
        />

        <div className={`h-[1px] w-full ${colors.divider} opacity-32 mb-4`}></div>

        <div className="px-6 flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden overscroll-contain">
          <div
            className={`text-[11px] uppercase tracking-wider ${
              colors.textDim
            } mb-2 ${isExpanded ? "px-5" : "text-center"}`}
          >
            Main
          </div>

          <div className="space-y-1">
            {menuItems.map((item) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                <Button
                  onClick={() => router.push(`/${item.id}`)}
                  variant="ghost"
                  className={`w-full flex items-center gap-4 ${
                    isExpanded ? "px-5" : "justify-center"
                  } py-4
                    rounded-xl transition-all duration-200
                    ${
                      pathname?.startsWith(`/${item.id}`)
                        ? `${colors.activeBg} border-[0.5px]`
                        : colors.hoverBg
                    }`}
                >
                  <item.Icon
                    className="w-6 h-6"
                    color={theme === "dark" ? "white" : "#242220"}
                    strokeWidth={2}
                  />
                  {isExpanded && (
                    <>
                      <span
                        className={`flex-1 text-left text-[14px] font-medium ${
                          pathname?.startsWith(`/${item.id}`)
                            ? colors.text
                            : colors.textMuted
                        }`}
                      >
                        {item.label}
                      </span>
                      {item.subItems && (
                        <ChevronUp
                          className={`w-6 h-6 transition-transform duration-200 ${
                            isDashboardOpen ? "rotate-180" : ""
                          }`}
                          color={
                            theme === "dark"
                              ? "rgba(255,255,255,0.32)"
                              : "rgba(36,34,32,0.48)"
                          }
                        />
                      )}
                    </>
                  )}
                </Button>

                {item.subItems && isDashboardOpen && isExpanded && (
                  <div className="ml-12 mt-1 space-y-2 border-l-[1px] border-white/16 pl-3">
                    {item.subItems.map((subItem, idx) => (
                      <Button
                        key={idx}
                        variant="ghost"
                        className={`w-full text-left px-4 py-2 rounded-lg text-[12px] font-medium
                          ${
                            subItem.label === "Statistic"
                              ? `${colors.activeBg} ${colors.text} border-[0.5px]`
                              : `${colors.textMuted} ${colors.hoverBg}`
                          }
                          transition-all duration-200`}
                      >
                        {subItem.label}
                      </Button>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
