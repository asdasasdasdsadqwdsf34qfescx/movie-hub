"use client";
import { motion } from "framer-motion";
import toast, { ToastOptions } from "react-hot-toast";
import React from "react";

const baseOptions: ToastOptions = {
  duration: 4500,
  position: "top-right",
};

function ErrorIcon() {
  return (
    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 8a1 1 0 000 2v4a1 1 0 102 0V9a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
  );
}

export function showErrorToast(message: string, title = "Something went wrong") {
  return toast.custom((t) => (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      role="alert"
      aria-live="assertive"
      className={`toast-surface ${t.visible ? "toast-enter" : "toast-exit"}`}
      data-type="error"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5"><ErrorIcon /></div>
        <div className="min-w-0">
          <p className="toast-title">{title}</p>
          <p className="toast-message" title={message}>{message}</p>
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="ml-2 text-gray-400 hover:text-white transition-colors"
          aria-label="Dismiss notification"
        >
          ×
        </button>
      </div>
      <div className="toast-progress" />
    </motion.div>
  ), baseOptions);
}

export function showSuccessToast(message: string, title = "Success") {
  return toast.custom((t) => (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      role="status"
      aria-live="polite"
      className={`toast-surface toast-success ${t.visible ? "toast-enter" : "toast-exit"}`}
      data-type="success"
    >
      <div className="flex items-start gap-3">
        <svg className="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879A1 1 0 106.293 10.293l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <div className="min-w-0">
          <p className="toast-title toast-title-success">{title}</p>
          <p className="toast-message toast-message-success" title={message}>{message}</p>
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="ml-2 text-gray-300 hover:text-white transition-colors"
          aria-label="Dismiss notification"
        >
          ×
        </button>
      </div>
      <div className="toast-progress toast-progress-success" />
    </motion.div>
  ), baseOptions);
}
