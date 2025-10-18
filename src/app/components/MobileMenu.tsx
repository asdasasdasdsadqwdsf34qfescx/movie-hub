"use client";
import React, { useState } from "react";
import { Menu, X, Folder, BarChart3, LogOut } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const surface = theme === "dark"
    ? "bg-[rgba(15,9,12,0.92)] border-white/10 text-white"
    : "bg-white border-neutral-300 text-[#242220]";

  const go = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="lg:hidden">
      <Button
        onClick={() => setOpen(true)}
        variant="ghost"
        className="fixed top-6 left-6 z-50 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </Button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[95] bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.aside
              className={`fixed left-0 top-0 bottom-0 z-[100] w-72 ${surface} border-r backdrop-blur-md shadow-2xl`}
              initial={{ x: -280, opacity: 0.9 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0.9 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-center justify-between px-4 py-4">
                <div className="font-semibold">Menu</div>
                <Button
                  onClick={() => setOpen(false)}
                  variant="ghost"
                  className="p-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <nav className="px-2 py-2">
                <button
                  onClick={() => go("/collection")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${pathname?.startsWith("/collection") ? "bg-white/10 border border-white/20" : "hover:bg-white/5"}`}
                >
                  <Folder className="w-5 h-5" />
                  <span>Collection</span>
                </button>
                <button
                  onClick={() => go("/statistics")}
                  className={`mt-1 w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${pathname?.startsWith("/statistics") ? "bg-white/10 border border-white/20" : "hover:bg-white/5"}`}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>Statistics</span>
                </button>
              </nav>

              <div className="px-4 py-4 border-t border-white/10 mt-auto">
                <button
                  onClick={signOut}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold"
                >
                  <LogOut className="w-4 h-4" /> Log out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
