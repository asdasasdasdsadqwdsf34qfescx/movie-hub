import React, { FC } from "react";
import { Info, X } from "lucide-react";

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
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="mb-4 p-3 bg-blue-900/30 rounded-full border border-blue-700/50 animate-pulse">
          <Info className="h-8 w-8 text-blue-400" />
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
