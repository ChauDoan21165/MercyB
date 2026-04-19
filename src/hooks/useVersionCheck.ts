// src/hooks/useVersionCheck.ts

import { useState, useEffect, useCallback, useRef } from "react";

interface VersionInfo {
  version: string;
  hash: string;
  buildTime: string;
  app: string;
  semver: string;
}

const VERSION_STORAGE_KEY = "mb_app_version";
const CHECK_INTERVAL_MS   = 60 * 1000; // 60 seconds
const FETCH_TIMEOUT_MS    = 10000;

export function useVersionCheck() {
  const [currentVersion, setCurrentVersion]   = useState<VersionInfo | null>(null);
  const [latestVersion, setLatestVersion]     = useState<VersionInfo | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [checking, setChecking]               = useState(false);

  const inFlightRef = useRef(false);

  const checkForUpdates = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    try {
      setChecking(true);

      const controller = new AbortController();
      const timeoutId  = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

      let response: Response;
      try {
        response = await fetch(`/version.json?t=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
          signal: controller.signal,
        });
      } finally {
        window.clearTimeout(timeoutId);
      }

      if (!response.ok) {
        if (import.meta.env.DEV) {
          console.warn("[version] Failed to fetch version.json:", response.status);
        }
        return;
      }

      let serverVersion: VersionInfo;
      try {
        serverVersion = (await response.json()) as VersionInfo;
      } catch {
        if (import.meta.env.DEV) {
          console.warn("[version] version.json is not valid JSON");
        }
        return;
      }

      setLatestVersion(serverVersion);

      const storedVersionStr = localStorage.getItem(VERSION_STORAGE_KEY);

      if (!storedVersionStr) {
        localStorage.setItem(VERSION_STORAGE_KEY, JSON.stringify(serverVersion));
        setCurrentVersion(serverVersion);
        return;
      }

      let storedVersion: VersionInfo;
      try {
        storedVersion = JSON.parse(storedVersionStr) as VersionInfo;
      } catch {
        localStorage.setItem(VERSION_STORAGE_KEY, JSON.stringify(serverVersion));
        setCurrentVersion(serverVersion);
        return;
      }

      setCurrentVersion(storedVersion);

      if (
        serverVersion.version !== storedVersion.version ||
        serverVersion.hash    !== storedVersion.hash
      ) {
        setUpdateAvailable(true);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn("[version] Check failed:", error);
      }
    } finally {
      inFlightRef.current = false;
      setChecking(false);
    }
  }, []);

  const applyUpdate = useCallback(async () => {
    // 1. Persist the new version so we don't prompt again after reload
    if (latestVersion) {
      localStorage.setItem(VERSION_STORAGE_KEY, JSON.stringify(latestVersion));
    } else {
      localStorage.removeItem(VERSION_STORAGE_KEY);
    }

    // 2. Tell the service worker to activate the new version immediately
    try {
      if ("serviceWorker" in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg?.waiting) {
          reg.waiting.postMessage({ type: "SKIP_WAITING" });
        }
      }
    } catch {
      // ignore — fall through to reload
    }

    // 3. Hard reload to pick up the new bundle
    window.location.reload();
  }, [latestVersion]);

  const dismissUpdate = useCallback(() => {
    setUpdateAvailable(false);
  }, []);

  useEffect(() => {
    const initialTimer = window.setTimeout(checkForUpdates, 3000);
    const interval     = window.setInterval(checkForUpdates, CHECK_INTERVAL_MS);

    // Also check when the tab regains focus — catches users who return after a deploy
    const onVisible = () => {
      if (document.visibilityState === "visible") checkForUpdates();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [checkForUpdates]);

  return {
    currentVersion,
    latestVersion,
    updateAvailable,
    checking,
    checkForUpdates,
    applyUpdate,
    dismissUpdate,
  };
}