"use client";
import React, { useState, useEffect, FC } from "react";
import Background from "./components/Background";
import Header from "./components/Header";
import SignInButton from "./components/SignInButton";
import { useRouter } from "next/navigation";

// Main Home Page
const Home: FC = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-start justify-center px-6 sm:pl-16 lg:pl-24 xl:pl-32 overflow-hidden">
      <Background />
      <div className={`relative z-10 space-y-8 transition-all duration-700 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <Header />
        <SignInButton onClick={() => router.push('/sign-in')} />
      </div>
    </div>
  );
};

export default Home;
