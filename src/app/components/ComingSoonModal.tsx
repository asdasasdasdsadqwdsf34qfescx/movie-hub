import React, { FC } from "react";

interface ComingSoonModalProps {
  open: boolean;
  onClose: () => void;
}

const ComingSoonModal: FC<ComingSoonModalProps> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
        onClick={onClose}
      />
      <div className="relative z-10 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl px-8 py-6 flex flex-col items-center max-w-sm w-full mx-4 animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-light transition-colors duration-200 focus:outline-none"
          aria-label="Close"
        >
          &times;
        </button>
        <div className="mb-4 p-3 bg-blue-900/30 rounded-full border border-blue-700/50 animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
        <p className="text-gray-300 text-center mb-6">
          This app is currently in development. Stay tuned for upcoming features!
        </p>
      </div>
    </div>
  );
};

export default ComingSoonModal;
