
"use client";

import { useState, useTransition } from "react";

export default function LoginForm({ redirect }: { redirect: string }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, redirect }),
      });

      if (res.ok) {
        const data = (await res.json()) as { redirect: string };
        window.location.href = data.redirect || "/";
      } else {
        const data = (await res.json().catch(() => ({}))) as { message?: string };
        setError(data.message || "Login failed");
      }
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-surface-900 via-surface-800 to-surface-900 flex items-center justify-center px-6 py-12">
      <section className="w-full max-w-md rounded-3xl border border-surface-700 bg-surface-800/80 shadow-card backdrop-blur-md p-8 space-y-6">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Access</p>
          <h1 className="text-2xl font-semibold text-white">Badge UI Login</h1>
          <p className="text-slate-400 text-sm">Badges and API stay public; only the UI is protected.</p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="flex flex-col gap-2 text-sm font-semibold text-slate-200">
            <span>Password</span>
            <input
              className="rounded-xl border border-surface-700 bg-surface-900 px-3 py-2 text-slate-100 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </label>

          <button
            className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-2.5 font-semibold text-slate-900 shadow-md transition hover:shadow-lg disabled:opacity-60 disabled:shadow-none"
            type="submit"
            disabled={pending}
          >
            {pending ? "Signing in..." : "Login"}
          </button>
        </form>

        {error && (
          <div className="rounded-xl border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}
      </section>
    </main>
  );
}
