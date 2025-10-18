"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../services/supabaseClient";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) router.replace("/sign-in");
    };
    check();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-950">
      <h1 className="text-3xl font-bold text-white mb-6">Welcome Home!</h1>
      <button
        onClick={handleSignOut}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded transition-colors duration-200"
      >
        Sign Out
      </button>
    </div>
  );
};

export default Home;
