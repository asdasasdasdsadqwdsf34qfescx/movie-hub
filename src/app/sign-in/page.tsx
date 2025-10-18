"use client";
import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "../../services/supabaseClient";
import Background from "../components/Background";
import { friendlyAuthError } from "../../utils/friendlyAuthError";
import { toast } from "sonner";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const SignInPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const shakeControls = useAnimation();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace("/home");
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (signInError) {
      const msg = friendlyAuthError(signInError, "sign_in");
      setError(msg);
      toast.error("Sign in failed", { description: msg });
      setShake(true);
      shakeControls.start({ x: [0, -8, 8, -6, 6, -3, 3, 0] }, { type: "tween", duration: 0.45 });
      setTimeout(() => setShake(false), 600);
      return;
    }

    router.replace("/home");
  };

  return (
    <motion.div className="relative min-h-screen w-full flex items-center justify-center px-6 overflow-x-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
      <Background />
      <motion.div className="relative z-10 w-full max-w-md bg-gray-900/90 border border-gray-700 rounded-xl shadow-2xl p-8" initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}>
        <motion.div animate={shakeControls}>
          <h1 className="text-2xl font-bold text-white mb-1 text-center">Sign In</h1>
          <p className="text-gray-300 text-sm mb-6 text-center">
            Log in with your email and password
          </p>
        </motion.div>
        <motion.form onSubmit={handleSubmit} className="flex flex-col gap-4" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } }} initial="hidden" animate="show">
          <motion.div variants={{ hidden: { opacity: 0, y: 4 }, show: { opacity: 1, y: 0 } }}>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className={`${error ? "border-red-500/50 animate-inputPulse" : ""}`}
              aria-invalid={Boolean(error)}
              required
              autoFocus
            />
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 4 }, show: { opacity: 1, y: 0 } }}>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={`${error ? "border-red-500/50 animate-inputPulse" : ""}`}
              aria-invalid={Boolean(error)}
              required
            />
          </motion.div>
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.div variants={{ hidden: { opacity: 0, y: 4 }, show: { opacity: 1, y: 0 } }} whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.98 }} className="flex-1">
              <Button type="submit" disabled={loading} className={`${loading ? "animate-pulse cursor-wait" : ""} w-full`}>
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </motion.div>
            <a
              href="/sign-up"
              className="flex-1 text-center bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold py-2 rounded transition-colors duration-200 border border-neutral-300"
            >
              Sign Up
            </a>
          </div>
        </motion.form>
      </motion.div>
    </motion.div>
  );
};

export default SignInPage;
