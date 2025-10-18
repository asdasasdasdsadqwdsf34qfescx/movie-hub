"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../services/supabaseClient";
import Background from "../components/Background";

const SignUpPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) router.replace("/home");
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session) {
      router.replace("/home");
    } else {
      setInfo("Account created. Please check your email to confirm your address.");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-6 overflow-x-hidden">
      <Background />
      <div className="relative z-10 w-full max-w-md bg-gray-900/90 border border-gray-700 rounded-xl shadow-2xl p-8">
        <h1 className="text-2xl font-bold text-white mb-1 text-center">Sign Up</h1>
        <p className="text-gray-300 text-sm mb-6 text-center">Create your account with email and password</p>
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
          {error && <div className="text-red-400 text-sm text-center" role="alert">{error}</div>}
          {info && <div className="text-green-400 text-sm text-center" role="status">{info}</div>}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors duration-200 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
        <div className="mt-4 text-center text-gray-400">
          Already have an account? <Link href="/sign-in" className="text-blue-400 hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
