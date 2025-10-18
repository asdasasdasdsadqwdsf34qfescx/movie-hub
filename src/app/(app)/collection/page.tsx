"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";

export default function Collection() {
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

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Collection</h1>
      <p className="text-lg opacity-70 mb-8">Browse and manage your collection with light and dark theme support.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map((item) => (
          <div key={item} className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]">
            <h3 className="text-xl font-semibold mb-2">Item {item}</h3>
            <p className="opacity-60">This card represents an item in your collection.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
