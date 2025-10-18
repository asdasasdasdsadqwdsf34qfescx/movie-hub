"use client";
import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../services/supabaseClient";
import Background from "../components/Background";
import Alert from "../components/Alert";
import { friendlyAuthError } from "../../utils/friendlyAuthError";
import { toast } from "sonner";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const SignUpPage: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<"name" | "password" | "confirmPassword" | null>(null);
    const shakeControls = useAnimation();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) router.replace("/collection");
    };
    checkSession();
  }, [router]);

  const validate = () => {
    if (!name.trim()) return { field: "name" as const, message: "Name is required" };
    if (password.length < 8) return { field: "password" as const, message: "Password must be at least 8 characters" };
    if (password !== confirmPassword) return { field: "confirmPassword" as const, message: "Passwords do not match" };
    return null as null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

    const validationError = validate();
    if (validationError) {
      setLoading(false);
      setError(validationError.message);
      toast.error("Sign up error", { description: validationError.message });
      setFieldError(validationError.field);
      
      shakeControls.start({ x: [0, -8, 8, -6, 6, -3, 3, 0] }, { type: "tween", duration: 0.45 });
      
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    setLoading(false);

    if (signUpError) {
      const msg = friendlyAuthError(signUpError, "sign_up");
      setError(msg);
      toast.error("Sign up failed", { description: msg });
      setFieldError(null);
      
      shakeControls.start({ x: [0, -8, 8, -6, 6, -3, 3, 0] }, { type: "tween", duration: 0.45 });
      
      return;
    }

    if (data.session) {
      router.replace("/collection");
    } else {
      setInfo("Account created. Please check your email to confirm your address.");
    }
  };

  return (
    <motion.div className="relative min-h-screen w-full flex items-center justify-center px-6 overflow-x-hidden">
      <Background />
      <motion.div className="relative z-10 w-full max-w-md bg-gray-900/90 border border-gray-700 rounded-xl shadow-2xl p-8" initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}>
        <Link href="/" aria-label="Close and go home" className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-light transition-colors duration-200">&times;</Link>
        <motion.div animate={shakeControls}>
          <h1 className="text-2xl font-bold text-white mb-1 text-center">Sign Up</h1>
          <p className="text-gray-300 text-sm mb-6 text-center">Create your account</p>
        </motion.div>

        <motion.form onSubmit={handleSubmit} className="flex flex-col gap-4" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } }} initial="hidden" animate="show">
          <motion.div variants={{ hidden: { opacity: 0, y: 4 }, show: { opacity: 1, y: 0 } }}>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className={`${fieldError === "name" ? "border-red-500/50 animate-pulse" : ""}`}
              aria-invalid={fieldError === "name"}
              required
              autoFocus
            />
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 4 }, show: { opacity: 1, y: 0 } }}>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className={`${error && !fieldError ? "border-red-500/50" : ""}`}
              aria-invalid={Boolean(error && !fieldError)}
              required
            />
          </motion.div>

          <div className="relative">
            <motion.div variants={{ hidden: { opacity: 0, y: 4 }, show: { opacity: 1, y: 0 } }}>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 8 characters)"
                className={`pr-12 ${fieldError === "password" ? "border-red-500/50 animate-pulse" : ""}`}
                aria-invalid={fieldError === "password"}
                required
                minLength={8}
              />
            </motion.div>
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="relative">
            <motion.div variants={{ hidden: { opacity: 0, y: 4 }, show: { opacity: 1, y: 0 } }}>
              <Input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className={`pr-12 ${fieldError === "confirmPassword" ? "border-red-500/50 animate-pulse" : ""}`}
                aria-invalid={fieldError === "confirmPassword"}
                required
                minLength={8}
              />
            </motion.div>
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
              aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirm ? "Hide" : "Show"}
            </button>
          </div>

          {info && (
            <motion.div variants={{ hidden: { opacity: 0, y: 4 }, show: { opacity: 1, y: 0 } }}>
              <Alert variant="success" title="Check your inbox">
                {info}
              </Alert>
            </motion.div>
          )}

          <motion.div variants={{ hidden: { opacity: 0, y: 4 }, show: { opacity: 1, y: 0 } }} whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.98 }}>
            <Button type="submit" disabled={loading} className={`${loading ? "animate-pulse cursor-wait" : ""} w-full`}>
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </motion.div>
        </motion.form>

        <div className="mt-4 text-center text-gray-400">
          Already have an account? <Link href="/sign-in" className="text-blue-400 hover:underline">Sign In</Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SignUpPage;
