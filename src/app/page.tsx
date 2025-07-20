"use client";
import React, { useState, useEffect, FC } from "react";
import Background from "./components/Background";
import Header from "./components/Header";
import SignInButton from "./components/SignInButton";
import ComingSoonModal from "./components/ComingSoonModal";

// Main Home Page
const Home: FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-start justify-center px-6 sm:pl-16 lg:pl-24 xl:pl-32 overflow-hidden">
      <Background />
      <div className={`space-y-8 transition-all duration-700 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <Header />
        <SignInButton onClick={() => setShowModal(true)} />
      </div>
      <ComingSoonModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default Home;