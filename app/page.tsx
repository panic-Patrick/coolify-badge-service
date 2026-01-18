"use client";

import { useEffect, useMemo, useState } from "react";

type BadgeStyle = "flat" | "flat-square" | "plastic" | "for-the-badge" | "social";

const STYLE_OPTIONS: Array<{ value: BadgeStyle; label: string }> = [
  { value: "flat", label: "Flat" },
  { value: "flat-square", label: "Flat square" },
  { value: "plastic", label: "Plastic" },
  { value: "for-the-badge", label: "For the badge" },
  { value: "social", label: "Social" },
];

export default function Page() {
  const [appUuid, setAppUuid] = useState("j4c8owgkw4k8888ckkgc84s4");
  const [label, setLabel] = useState("");
  const [host, setHost] = useState<string>("");
  const [style, setStyle] = useState<BadgeStyle>("flat");
  const [copied, setCopied] = useState<"url" | "md" | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHost(window.location.origin);
    }
  }, []);

  const badgeUrl = useMemo(() => {
    const base = host || "http://localhost:3000";
    const url = new URL(`/api/badge/${appUuid || "<app_uuid>"}`, base);
    if (label) url.searchParams.set("label", label);
    if (style) url.searchParams.set("style", style);
    return url.toString();
  }, [appUuid, host, label, style]);

  const previewUrl = useMemo(() => {
    const base = host || "http://localhost:3000";
    const url = new URL(`/api/badge/${appUuid || "<app_uuid>"}`, base);
    const previewLabel = label || "your-label";
    if (previewLabel) url.searchParams.set("label", previewLabel);
    if (style) url.searchParams.set("style", style);
    return url.toString();
  }, [appUuid, host, label, style]);

  const copy = (text: string) => {
    if (navigator?.clipboard) {
      void navigator.clipboard.writeText(text);
    }
  };

  const logout = async () => {
    setSigningOut(true);
    await fetch("/api/auth", { method: "DELETE" }).catch(() => undefined);
    window.location.href = "/login";
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-surface-900 via-surface-800 to-surface-900 px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row">
        <section className="w-full rounded-3xl border border-surface-700 bg-surface-800/80 shadow-card backdrop-blur-md p-8 space-y-6">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold text-white">Coolify Badge Builder</h1>
              <p className="text-slate-400">Customize the badge text and copy the ready-to-use URL.</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="h-10 rounded-xl border border-surface-700 bg-surface-900 px-4 text-sm font-semibold text-slate-100 transition hover:border-sky-400 hover:text-sky-200 disabled:opacity-60"
              disabled={signingOut}
            >
              {signingOut ? "Signing out..." : "Logout"}
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-200">
              <span>App UUID</span>
              <input
                className="rounded-xl border border-surface-700 bg-surface-900 px-3 py-2 text-slate-100 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30"
                value={appUuid}
                onChange={(e) => setAppUuid(e.target.value)}
                placeholder="your-app-uuid"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-200">
              <span>Left text (label)</span>
              <input
                className="rounded-xl border border-surface-700 bg-surface-900 px-3 py-2 text-slate-100 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. deploy"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-200">
              <span>Host (optional)</span>
              <input
                className="rounded-xl border border-surface-700 bg-surface-900 px-3 py-2 text-slate-100 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="https://badges.example.com"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-200">
              <span>Style</span>
              <select
                className="rounded-xl border border-surface-700 bg-surface-900 px-3 py-2 text-slate-100 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30"
                value={style}
                onChange={(e) => setStyle(e.target.value as BadgeStyle)}
              >
                {STYLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-surface-700 bg-surface-900 px-4 py-3 space-y-2">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.12em] text-slate-400">
                <span>Badge URL</span>
                <button
                  type="button"
                  className="text-xs text-sky-300 hover:text-sky-200"
                  onClick={() => {
                    copy(badgeUrl);
                    setCopied("url");
                    setTimeout(() => setCopied(null), 1200);
                  }}
                >
                  {copied === "url" ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="text-left font-mono break-all text-slate-100">{badgeUrl}</div>
            </div>

            <div className="rounded-2xl border border-surface-700 bg-surface-900 px-4 py-3 space-y-2">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.12em] text-slate-400">
                <span>Markdown</span>
                <button
                  type="button"
                  className="text-xs text-sky-300 hover:text-sky-200"
                  onClick={() => {
                    const text = `![Deployment Status](${badgeUrl})`;
                    copy(text);
                    setCopied("md");
                    setTimeout(() => setCopied(null), 1200);
                  }}
                >
                  {copied === "md" ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="text-left font-mono break-all text-slate-100">![Deployment Status]({badgeUrl})</div>
            </div>
          </div>

          <div className="rounded-2xl border border-surface-700 bg-surface-900 px-4 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[11px] uppercase tracking-[0.12em] text-slate-400">Preview</div>
              <div className="text-[11px] text-slate-500">No-cache SVG</div>
            </div>
            <div className="inline-flex rounded-xl bg-surface-800 px-3 py-2 border border-surface-700">
              <img src={previewUrl} alt="Badge preview" className="h-10 w-auto" />
            </div>
          </div>
        </section>

        <aside className="w-full lg:w-80 rounded-3xl border border-surface-700 bg-surface-800/70 shadow-card backdrop-blur-md p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Status Legend</h2>
            <p className="text-slate-400 text-sm">Colors and texts shown on the badge.</p>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-2 rounded-xl bg-surface-900 px-3 py-2 border border-surface-700">
              <dt className="text-slate-200">Live</dt>
              <dd className="text-emerald-300 font-mono">#3fb950</dd>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-xl bg-surface-900 px-3 py-2 border border-surface-700">
              <dt className="text-slate-200">Deploying</dt>
              <dd className="text-sky-300 font-mono">#2188ff</dd>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-xl bg-surface-900 px-3 py-2 border border-surface-700">
              <dt className="text-slate-200">Failed</dt>
              <dd className="text-rose-300 font-mono">#f85149</dd>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-xl bg-surface-900 px-3 py-2 border border-surface-700">
              <dt className="text-slate-200">Queued</dt>
              <dd className="text-slate-300 font-mono">#6e7681</dd>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-xl bg-surface-900 px-3 py-2 border border-surface-700">
              <dt className="text-slate-200">No history</dt>
              <dd className="text-slate-200 font-mono">#d1d5da</dd>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-xl bg-surface-900 px-3 py-2 border border-surface-700">
              <dt className="text-slate-200">Fallback</dt>
              <dd className="text-amber-200 font-mono">#cea61b</dd>
            </div>
          </dl>
        </aside>
      </div>
    </main>
  );
}
