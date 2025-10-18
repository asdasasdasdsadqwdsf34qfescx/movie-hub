"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";

export default function Statistics() {
  const router = useRouter();
  useEffect(() => {
    let mounted = true;
    async function check() {
      try {
        const { data } = await supabase.auth.getSession();
        if (mounted && !data.session) router.replace("/sign-in");
      } catch {
        if (mounted) router.replace("/sign-in");
      }
    }
    check();
    return () => { mounted = false; };
  }, [router]);

  const cards = [
    { title: "Total Items", value: "128" },
    { title: "Views", value: "12,450" },
    { title: "Favorites", value: "64" },
    { title: "Shares", value: "312" },
    { title: "New this week", value: "18" },
    { title: "Active users", value: "245" },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Statistics</h1>
      <p className="text-lg opacity-70 mb-8">Overview of your usage metrics and trends.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]">
            <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
            <p className="opacity-80 text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
