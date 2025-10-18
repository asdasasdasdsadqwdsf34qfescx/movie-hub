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

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-center">Statistics</h1>
      <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-200">
        <p className="font-medium">🚧 Under Development</p>
        <p className="text-sm opacity-80 mt-1">This page is currently under development. Features will be available soon.</p>
      </div>
    </div>
  );
}
