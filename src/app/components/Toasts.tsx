"use client";
import { motion } from "framer-motion";
import toast, { ToastOptions } from "react-hot-toast";
import React from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

const baseOptions: ToastOptions = {
  duration: 4500,
  position: "top-right",
};

function ErrorIcon() {
  return <AlertCircle className="h-5 w-5 text-red-400" />;
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
          <X className="h-5 w-5" />
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
        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
        <div className="min-w-0">
          <p className="toast-title toast-title-success">{title}</p>
          <p className="toast-message toast-message-success" title={message}>{message}</p>
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="ml-2 text-gray-300 hover:text-white transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="toast-progress toast-progress-success" />
    </motion.div>
  ), baseOptions);
}
