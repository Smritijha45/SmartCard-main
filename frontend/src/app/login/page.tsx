"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Sparkles, ArrowRight } from "lucide-react";

const GoogleIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

const GitHubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

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
    } catch {
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
    if (!email.trim() || !password.trim()) {
      setError("Please fill in both email and password.");
      return;
    }
    await performLogin(email, password);
  };

  const handleOAuthClick = async (provider: string) => {
    const demoEmail = provider === 'Google' ? 'alex.google@smartcard.id' : 'alex.github@smartcard.id';
    await performLogin(demoEmail, "demooauthpass");
  };

  const handleDemoLogin = async () => {
    setEmail("smriti.jha@smartcard.app");
    setPassword("demopassword123");
    await performLogin("smriti.jha@smartcard.app", "demopassword123");
  };

  return (
    <AuthLayout>
      <div className="bg-white dark:bg-[#131924] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-7 sm:p-9 shadow-sm relative transition-colors">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
          Welcome back
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1 mb-6 text-xs sm:text-sm">
          Sign in to manage your digital cards, leads, and analytics.
        </p>

        {/* 1-Click Demo Shortcut */}
        <div className="mb-5 p-3.5 bg-blue-50/70 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-medium text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
              <Sparkles size={13} className="text-blue-600 dark:text-blue-400" />
              Quick Sandbox Access
            </span>
            <span className="text-[10px] font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-md">
              1-Click Demo
            </span>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full h-9 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-900 dark:text-slate-100 font-medium text-xs rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Enter as Smriti Jha</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* OAuth Buttons (Visual/Demo Only) */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          <button
            type="button"
            onClick={() => handleOAuthClick('Google')}
            className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
          >
            <GoogleIcon className="w-4 h-4 shrink-0" />
            <span className="truncate">Google</span>
          </button>
          <button
            type="button"
            onClick={() => handleOAuthClick('GitHub')}
            className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
          >
            <GitHubIcon className="w-4 h-4 shrink-0" />
            <span className="truncate">GitHub</span>
          </button>
        </div>

        <div className="relative flex py-2 items-center mb-5">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          <span className="flex-shrink mx-3 text-slate-400 text-xs">Or continue with credentials</span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-slate-700 dark:text-slate-300 text-xs font-medium">
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
              <label className="block text-slate-700 dark:text-slate-300 text-xs font-medium">
                Password
              </label>
              <span className="text-[11px] text-slate-400">(Any non-empty works)</span>
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
            <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs rounded-lg">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full mt-2 h-10 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
          >
            {loading ? "Signing in..." : "Sign in to Dashboard"}
          </Button>
        </form>

        <div className="mt-6 text-center border-t border-slate-100 dark:border-slate-800/80 pt-5">
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-600 dark:text-blue-400 font-medium hover:underline ml-1">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
