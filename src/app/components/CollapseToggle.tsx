"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface CollapseToggleProps {
  expanded: boolean;
  onToggle: () => void;
  theme: "dark" | "light";
  surfaceClass: string; // e.g., colors.arrowBg from Sidebar theme
  positionClass?: string; // override for absolute positioning if needed
}

const CollapseToggle: React.FC<CollapseToggleProps> = ({
  expanded,
  onToggle,
  theme,
  surfaceClass,
  positionClass,
}) => {
  const textColor = theme === "dark" ? "text-white" : "text-[#242220]";
  const strokeColor = theme === "dark" ? "#FFFFFF" : "#242220";
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-label="Toggle sidebar"
      aria-pressed={expanded}
      className={`absolute ${positionClass ?? "right-[-14px] top-1/2 -translate-y-1/2"}
        w-9 h-9 rounded-full ${surfaceClass} border-[0.5px]
        flex items-center justify-center ${textColor} opacity-100
        shadow-[0_0_8px_rgba(0,0,0,0.35)] hover:scale-110 transition-transform duration-300
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40
        z-[9999]`}
    >
      <ChevronRight
        aria-hidden
        className={`w-7 h-7 -translate-x-[2px] drop-shadow-[0_0_2px_rgba(0,0,0,0.9)] transition-transform duration-300 ${expanded ? 'rotate-180' : 'rotate-0'} pointer-events-none`}
        color={strokeColor}
        strokeWidth={3}
      />
    </motion.button>
  );
};

export default CollapseToggle;
