// src/pages/AccountPage.tsx
import React from "react";
import { Link } from "react-router-dom";

export default function AccountPage() {
  return (
    <div className="mx-auto w-full max-w-[980px] px-4 py-6">
      <div className="mb-card p-5 md:p-6">
        <h1 className="text-xl font-black mb-2">Account</h1>
        <p className="opacity-80 mb-4">
          This page is a placeholder. Wire it to your real profile / tier / billing status later.
        </p>

        <div className="flex flex-wrap gap-2">
          <Link className="px-3 py-2 rounded-full border font-bold" to="/tiers">
            Browse tiers
          </Link>
          <Link className="px-3 py-2 rounded-full border font-bold" to="/upgrade">
            Upgrade
          </Link>
          <Link className="px-3 py-2 rounded-full border font-bold" to="/">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
