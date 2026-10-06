"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();

      localStorage.setItem('smartcard_authenticated', 'true');
      localStorage.setItem('token', data.data?.accessToken || ('dummy_token_' + Date.now()));
      localStorage.setItem('smartcard_user', JSON.stringify(data.data?.user || { name: name || 'Taylor Reed', email }));

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      // Local fallback for offline/dummy auth
      localStorage.setItem('smartcard_authenticated', 'true');
      localStorage.setItem('token', 'dummy_token_' + Date.now());
      localStorage.setItem('smartcard_user', JSON.stringify({ name: name || 'Taylor Reed', email }));
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignUp = async () => {
    setName("Smriti Jha");
    setEmail("smriti.jha@smartcard.app");
    setPassword("demopassword123");
    
    setLoading(true);
    try {
      localStorage.setItem('smartcard_authenticated', 'true');
      localStorage.setItem('token', 'dummy_token_' + Date.now());
      localStorage.setItem('smartcard_user', JSON.stringify({ name: 'Smriti Jha', email: 'smriti.jha@smartcard.app' }));
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-[#0e1424] rounded-xl border-2 border-black p-7 sm:p-9 shadow-[6px_6px_0px_#000000] relative">
        <div className="absolute -top-3.5 right-6 bg-yellow-400 text-black border-2 border-black px-3 py-0.5 rounded font-mono font-bold text-xs uppercase shadow-[2px_2px_0px_#000] -rotate-1">
          Zero NFC • 100% Free
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white mb-1 tracking-tight">
          Create SmartCard
        </h2>
        <p className="text-gray-400 mb-6 text-sm">
          Claim your digital professional identity in under 60 seconds.
        </p>

        {/* Instant Access Banner */}
        <div className="mb-6 p-3.5 bg-cyan-950/40 border-2 border-cyan-500 rounded-lg shadow-[3px_3px_0px_#06B6D4]">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-cyan-200 flex items-center gap-1.5">
              <Sparkles size={14} className="text-cyan-400" />
              Quick Sandbox Test
            </span>
            <span className="text-[10px] font-mono font-bold uppercase bg-cyan-500 text-black px-2 py-0.5 rounded border border-black">
              Instant
            </span>
          </div>
          <button
            type="button"
            onClick={handleDemoSignUp}
            disabled={loading}
            className="w-full h-10 bg-white hover:bg-gray-100 text-black font-extrabold text-xs tracking-wide uppercase rounded border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Launch Demo Account Instantly</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="relative flex py-2 items-center mb-5">
          <div className="flex-grow border-t-2 border-gray-800"></div>
          <span className="flex-shrink mx-3 text-gray-500 font-mono text-xs uppercase font-bold">Or register new card</span>
          <div className="flex-grow border-t-2 border-gray-800"></div>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-gray-300 text-xs font-mono font-bold uppercase tracking-wider">
              Full Name
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Sarah Jenkins"
            />
          </div>

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

          <div className="space-y-1.5 pt-1 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
              <span>Free lifetime tier included</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
              <span>No credit card or hardware required</span>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full mt-2 h-12 text-sm font-black uppercase tracking-wider"
          >
            {loading ? "Creating..." : "Claim My Free SmartCard"}
          </Button>
        </form>

        <div className="mt-6 text-center border-t-2 border-gray-800 pt-5">
          <p className="text-gray-400 text-xs">
            Already have an account?{" "}
            <Link href="/login" className="text-cyan-400 font-bold hover:underline ml-1">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
