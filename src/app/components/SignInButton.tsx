import React, { FC } from "react";

interface SignInButtonProps {
  onClick: () => void;
}

const SignInButton: FC<SignInButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="group relative px-8 py-3.5 rounded-lg bg-gradient-to-r from-[#e63946] to-[#ff758f] text-lg font-semibold text-white transition-all duration-300 hover:shadow-xl hover:shadow-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-black/50 animate-pulse hover:animate-none"
  >
    <span className="relative z-10 flex items-center">
      Sign In
      <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </span>
    <span className="absolute inset-0 bg-gradient-to-r from-[#ff758f] to-[#e63946] opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300" />
  </button>
);

export default SignInButton;
