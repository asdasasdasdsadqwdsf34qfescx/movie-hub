"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../services/supabaseClient";
import Background from "../components/Background";

const SignInPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError(signInError.message);
      return;
    }

    router.replace("/home");
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-6 overflow-x-hidden">
      <Background />
      <div className="relative z-10 w-full max-w-md bg-gray-900/90 border border-gray-700 rounded-xl shadow-2xl p-8">
        <h1 className="text-2xl font-bold text-white mb-1 text-center">Sign In</h1>
        <p className="text-gray-300 text-sm mb-6 text-center">
          Log in with your email and password
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none"
            required
            autoFocus
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none"
            required
          />
          {error && (
            <div className="text-red-400 text-sm text-center" role="alert">{error}</div>
          )}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors duration-200 disabled:opacity-50 flex-1"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
            <a
              href="/sign-up"
              className="flex-1 text-center bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold py-2 rounded transition-colors duration-200 border border-neutral-300"
            >
              Sign Up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
