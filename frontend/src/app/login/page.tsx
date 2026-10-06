"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = localStorage.getItem("smartcard_authenticated");
      if (isAuth === "true") {
        router.replace("/dashboard");
      }
    }
  }, [router]);

  const performLogin = async (loginEmail: string, loginPass: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPass }),
      });
      const data = await res.json();

      localStorage.setItem('smartcard_authenticated', 'true');
      localStorage.setItem('token', data.data?.accessToken || ('dummy_token_' + Date.now()));
      localStorage.setItem('smartcard_user', JSON.stringify(data.data?.user || { name: loginEmail.split('@')[0] || 'Smriti Jha', email: loginEmail }));

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      // Local fallback for offline/dummy auth
      localStorage.setItem('smartcard_authenticated', 'true');
      localStorage.setItem('token', 'dummy_token_' + Date.now());
      localStorage.setItem('smartcard_user', JSON.stringify({ name: loginEmail.split('@')[0] || 'Smriti Jha', email: loginEmail }));
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await performLogin(email, password);
  };

  const handleDemoLogin = async () => {
    setEmail("smriti.jha@smartcard.app");
    setPassword("demopassword123");
    await performLogin("smriti.jha@smartcard.app", "demopassword123");
  };

  return (
    <AuthLayout>
      <div className="bg-[#0e1424] rounded-xl border-2 border-black p-7 sm:p-9 shadow-[6px_6px_0px_#000000] relative">
        {/* Playful Neo Badge */}
        <div className="absolute -top-3.5 right-6 bg-cyan-400 text-black border-2 border-black px-3 py-0.5 rounded font-mono font-bold text-xs uppercase shadow-[2px_2px_0px_#000] rotate-2 flex items-center gap-1">
          <ShieldCheck size={13} />
          <span>Dummy Auth Mode</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white mb-1 tracking-tight">
          Welcome Back
        </h2>
        <p className="text-gray-400 mb-6 text-sm">
          Sign in to manage your digital cards, leads, and analytics.
        </p>

        {/* 1-Click Demo Shortcut */}
        <div className="mb-6 p-3.5 bg-blue-950/60 border-2 border-blue-500/80 rounded-lg shadow-[3px_3px_0px_#2563EB]">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-blue-200 flex items-center gap-1.5">
              <Sparkles size={14} className="text-cyan-400" />
              Instant Sandbox Access
            </span>
            <span className="text-[10px] font-mono font-bold uppercase bg-blue-600 text-white px-2 py-0.5 rounded border border-black">
              1-Click
            </span>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full h-10 bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs tracking-wide uppercase rounded border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Enter Dashboard as Smriti Jha</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="relative flex py-2 items-center mb-5">
          <div className="flex-grow border-t-2 border-gray-800"></div>
          <span className="flex-shrink mx-3 text-gray-500 font-mono text-xs uppercase font-bold">Or enter credentials</span>
          <div className="flex-grow border-t-2 border-gray-800"></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-gray-300 text-xs font-mono font-bold uppercase tracking-wider">
              Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@company.com"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-gray-300 text-xs font-mono font-bold uppercase tracking-wider">
                Password
              </label>
              <span className="text-[11px] text-gray-400 font-mono">(Any password works)</span>
            </div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-950/60 border-2 border-red-500 text-red-200 text-xs font-bold rounded shadow-[2px_2px_0px_#000]">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full mt-2 h-12 text-sm font-black uppercase tracking-wider"
          >
            {loading ? "Signing In..." : "Sign In to Dashboard"}
          </Button>
        </form>

        <div className="mt-6 text-center border-t-2 border-gray-800 pt-5">
          <p className="text-gray-400 text-xs">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-cyan-400 font-bold hover:underline ml-1">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
