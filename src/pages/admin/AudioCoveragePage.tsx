// src/pages/admin/AudioCoveragePage.tsx — MB-BLUE-94.1 — 2025-12-24 (+0700)
/**
 * AudioCoveragePage
 * Minimal admin page wrapper for AudioCoveragePanel.
 */

import { AudioCoveragePanel } from "@/components/admin/AudioCoveragePanel";

export default function AudioCoveragePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold mb-4">Audio Coverage</h1>
      <AudioCoveragePanel />
    </div>
  );
}
