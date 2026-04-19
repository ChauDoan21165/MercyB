// src/hooks/useVersionCheck.ts

import { useState, useEffect, useCallback } from "react";

interface VersionInfo {
  version: string;
  hash: string;
  buildTime: string;
  app: string;
  semver: string;
}

const VERSION_STORAGE_KEY = "mb_app_version";
const BLOCKED_STORAGE_KEY = "mb_min_version_blocked";
const CHECK_INTERVAL       = 45 * 1000; // 45 seconds
const FETCH_TIMEOUT_MS     = 10000;

export function useVersionCheck() {
  const [currentVersion, setCurrentVersion]   = useState<VersionInfo | null>(null);
  const [latestVersion, setLatestVersion]     = useState<VersionInfo | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isBlocked, setIsBlocked]             = useState(false);
  const [checking, setChecking]               = useState(false);

  const checkForUpdates = useCallback(async () => {
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
      const wasBlocked       = localStorage.getItem(BLOCKED_STORAGE_KEY) === "true";

      if (!storedVersionStr) {
        localStorage.setItem(VERSION_STORAGE_KEY, JSON.stringify(serverVersion));
        setCurrentVersion(serverVersion);
        if (import.meta.env.DEV) {
          console.log("[version] Initial version stored:", serverVersion.version);
        }
        return;
      }

      let storedVersion: VersionInfo;
      try {
        storedVersion = JSON.parse(storedVersionStr) as VersionInfo;
      } catch {
        // Corrupt storage — reset and treat as fresh
        localStorage.setItem(VERSION_STORAGE_KEY, JSON.stringify(serverVersion));
        setCurrentVersion(serverVersion);
        return;
      }

      setCurrentVersion(storedVersion);

      if (
        serverVersion.version !== storedVersion.version ||
        serverVersion.hash    !== storedVersion.hash
      ) {
        if (import.meta.env.DEV) {
          console.log(
            "[version] New version detected:",
            serverVersion.version,
            "from",
            storedVersion.version,
          );
        }
        setUpdateAvailable(true);
        localStorage.setItem(BLOCKED_STORAGE_KEY, "true");
        setIsBlocked(true);
      } else {
        if (wasBlocked) {
          localStorage.removeItem(BLOCKED_STORAGE_KEY);
          setIsBlocked(false);
        }
      }
    } catch (error) {
      // AbortError from timeout or network failure — silent in production
      if (import.meta.env.DEV) {
        console.warn("[version] Check failed:", error);
      }
    } finally {
      setChecking(false);
    }
  }, []);

  const applyUpdate = useCallback(() => {
    localStorage.removeItem(VERSION_STORAGE_KEY);
    localStorage.removeItem(BLOCKED_STORAGE_KEY);
    window.location.reload();
  }, []);

  const dismissUpdate = useCallback(() => {
    setUpdateAvailable(false);
    // isBlocked remains true until reload
  }, []);

  useEffect(() => {
    const wasBlocked = localStorage.getItem(BLOCKED_STORAGE_KEY) === "true";
    if (wasBlocked) setIsBlocked(true);

    const initialTimer = window.setTimeout(checkForUpdates, 3000);
    const interval     = window.setInterval(checkForUpdates, CHECK_INTERVAL);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(interval);
    };
  }, [checkForUpdates]);

  return {
    currentVersion,
    latestVersion,
    updateAvailable,
    isBlocked,
    checking,
    checkForUpdates,
    applyUpdate,
    dismissUpdate,
  };
}