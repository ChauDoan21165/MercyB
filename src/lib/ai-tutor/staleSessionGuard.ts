import { useCallback, useState } from "react";

export const AI_TUTOR_STALE_SESSION_MESSAGE =
  "Có phiên bản mới — tải lại trang để dùng bản mới nhất";

export const RUNNING_BUNDLE_HASH = String(
  import.meta.env.VITE_MERCYB_BUILD_HASH ?? "",
).trim();

export interface VersionManifest {
  hash?: unknown;
  version?: unknown;
  buildTime?: unknown;
  app?: unknown;
  semver?: unknown;
}

export type StaleSessionGuardResult =
  | { status: "current"; shouldBlock: false; runningHash: string; latestHash: string }
  | { status: "stale"; shouldBlock: true; runningHash: string; latestHash: string }
  | { status: "unversioned"; shouldBlock: false; runningHash: string; latestHash?: string }
  | { status: "unavailable"; shouldBlock: false; runningHash: string; reason: "fetch" | "http" | "json" };

export type FetchVersionManifest = (url: string, init: RequestInit) => Promise<Response>;

export interface CheckAiTutorStaleSessionOptions {
  runningHash?: string;
  fetchVersion?: FetchVersionManifest;
  nowMs?: () => number;
}

export interface UseAiTutorStaleSessionGuardOptions extends CheckAiTutorStaleSessionOptions {
  reload?: () => void;
}

export interface AiTutorStaleSessionNoticeState {
  message: string;
  runningHash: string;
  latestHash: string;
}

export async function checkAiTutorStaleSession({
  runningHash = RUNNING_BUNDLE_HASH,
  fetchVersion = fetch,
  nowMs = Date.now,
}: CheckAiTutorStaleSessionOptions = {}): Promise<StaleSessionGuardResult> {
  const bakedHash = runningHash.trim();
  if (!bakedHash) {
    return { status: "unversioned", shouldBlock: false, runningHash: bakedHash };
  }

  let response: Response;
  try {
    response = await fetchVersion(`/version.json?t=${nowMs()}`, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    });
  } catch {
    return { status: "unavailable", shouldBlock: false, runningHash: bakedHash, reason: "fetch" };
  }

  if (!response.ok) {
    return { status: "unavailable", shouldBlock: false, runningHash: bakedHash, reason: "http" };
  }

  let manifest: VersionManifest;
  try {
    manifest = (await response.json()) as VersionManifest;
  } catch {
    return { status: "unavailable", shouldBlock: false, runningHash: bakedHash, reason: "json" };
  }

  const latestHash = typeof manifest.hash === "string" ? manifest.hash.trim() : "";
  if (!latestHash) {
    return { status: "unversioned", shouldBlock: false, runningHash: bakedHash };
  }

  if (latestHash !== bakedHash) {
    return { status: "stale", shouldBlock: true, runningHash: bakedHash, latestHash };
  }

  return { status: "current", shouldBlock: false, runningHash: bakedHash, latestHash };
}

export function useAiTutorStaleSessionGuard({
  reload = () => window.location.reload(),
  runningHash,
  fetchVersion,
  nowMs,
}: UseAiTutorStaleSessionGuardOptions = {}) {
  const [checking, setChecking] = useState(false);
  const [notice, setNotice] = useState<AiTutorStaleSessionNoticeState | null>(null);

  const guardBeforeSubmit = useCallback(async () => {
    setChecking(true);
    try {
      const result = await checkAiTutorStaleSession({
        runningHash,
        fetchVersion,
        nowMs,
      });
      if (result.status === "stale") {
        setNotice({
          message: AI_TUTOR_STALE_SESSION_MESSAGE,
          runningHash: result.runningHash,
          latestHash: result.latestHash,
        });
        return false;
      }
      setNotice(null);
      return true;
    } finally {
      setChecking(false);
    }
  }, [fetchVersion, nowMs, runningHash]);

  const reloadLatest = useCallback(() => {
    reload();
  }, [reload]);

  return {
    checking,
    notice,
    stale: notice !== null,
    guardBeforeSubmit,
    reloadLatest,
  };
}
