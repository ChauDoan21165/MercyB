// src/pages/Home.tsx — v2025-12-14-01
import React from "react";
import { useHomepageConfig } from "@/hooks/useHomepageConfig";

function SafeHome() {
  let configResult;

  try {
    configResult = useHomepageConfig();
  } catch (e) {
    console.error("❌ useHomepageConfig crashed:", e);

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="max-w-md p-6 rounded-xl border border-slate-700 bg-slate-900">
          <h1 className="text-xl font-semibold mb-2">
            Homepage temporarily unavailable
          </h1>
          <p className="text-sm text-slate-300">
            The homepage configuration failed to load.
          </p>
          <p className="text-xs text-slate-500 mt-3">
            Home.tsx v2025-12-14-01
          </p>
        </div>
      </div>
    );
  }

  const { config, loading, error } = configResult;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading homepage…
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Failed to load homepage config
      </div>
    );
  }

  // 👇 render your existing homepage JSX BELOW
  return (
    <>
      {/* KEEP ALL YOUR EXISTING HOMEPAGE JSX HERE */}
    </>
  );
}

export default SafeHome;
