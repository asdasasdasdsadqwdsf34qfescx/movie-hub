"use client";
import React, { useState, useEffect, FC } from "react";
import Background from "./components/Background";
import Header from "./components/Header";
import SignInButton from "./components/SignInButton";
import ThemeToggle from "./components/ThemeToggle";
import { useRouter } from "next/navigation";
import { useAuthSession } from "@/hooks/useAuthSession";

// Main Home Page
const Home: FC = () => {
  const router = useRouter();
  const { loading, isAuthenticated } = useAuthSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-start justify-center px-6 sm:pl-16 lg:pl-24 xl:pl-32 overflow-hidden">
      <Background />
      <ThemeToggle />
      <div className={`relative z-10 space-y-8 transition-all duration-700 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <Header />
        <div className="flex gap-4">
          <SignInButton onClick={() => router.push('/sign-in')} />
          {isAuthenticated && !loading && (
            <button
              onClick={() => router.push('/collection')}
              className="group relative px-8 py-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:border-white/20"
            >
              <span className="relative z-10 text-white font-medium">
                View Dashboard
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
