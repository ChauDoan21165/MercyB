import { useState, useEffect, useCallback } from 'react';

interface VersionInfo {
  version: string;
  hash: string;
  buildTime: string;
  app: string;
  semver: string;
}

const VERSION_STORAGE_KEY = 'mb_app_version';
const BLOCKED_STORAGE_KEY = 'mb_min_version_blocked';
const CHECK_INTERVAL = 45 * 1000; // 45 seconds

export function useVersionCheck() {
  const [currentVersion, setCurrentVersion] = useState<VersionInfo | null>(null);
  const [latestVersion, setLatestVersion] = useState<VersionInfo | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [checking, setChecking] = useState(false);

  const checkForUpdates = useCallback(async () => {
    try {
      setChecking(true);
      // Add cache-busting query param
      const response = await fetch(`/version.json?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        console.warn('[version] Failed to fetch version.json:', response.status);
        return;
      }

      const serverVersion: VersionInfo = await response.json();
      setLatestVersion(serverVersion);
      
      // Get stored version
      const storedVersionStr = localStorage.getItem(VERSION_STORAGE_KEY);
      const wasBlocked = localStorage.getItem(BLOCKED_STORAGE_KEY) === 'true';
      
      if (!storedVersionStr) {
        // First time - store current version
        localStorage.setItem(VERSION_STORAGE_KEY, JSON.stringify(serverVersion));
        setCurrentVersion(serverVersion);
        console.log('[version] Initial version stored:', serverVersion.version);
        return;
      }

      const storedVersion: VersionInfo = JSON.parse(storedVersionStr);
      setCurrentVersion(storedVersion);

      // Compare versions
      if (serverVersion.version !== storedVersion.version || 
          serverVersion.hash !== storedVersion.hash) {
        console.log('[version] New version detected:', serverVersion.version, 'from', storedVersion.version);
        console.log('[version] Server semver:', serverVersion.semver, '| Stored semver:', storedVersion.semver);
        setUpdateAvailable(true);
        
        // Set blocked flag
        localStorage.setItem(BLOCKED_STORAGE_KEY, 'true');
        setIsBlocked(true);
      } else {
        // Versions match - clear blocked flag
        if (wasBlocked) {
          localStorage.removeItem(BLOCKED_STORAGE_KEY);
          setIsBlocked(false);
        }
      }
    } catch (error) {
      console.warn('[version] Check failed:', error);
    } finally {
      setChecking(false);
    }
  }, []);

  const applyUpdate = useCallback(() => {
    // Clear stored version so it gets refreshed on reload
    localStorage.removeItem(VERSION_STORAGE_KEY);
    localStorage.removeItem(BLOCKED_STORAGE_KEY);
    window.location.reload();
  }, []);

  const dismissUpdate = useCallback(() => {
    setUpdateAvailable(false);
    // Note: isBlocked remains true until reload
  }, []);

  // Initial check and periodic checks
  useEffect(() => {
    // Check if blocked on mount
    const wasBlocked = localStorage.getItem(BLOCKED_STORAGE_KEY) === 'true';
    if (wasBlocked) {
      setIsBlocked(true);
    }

    // Initial check after short delay
    const initialTimer = setTimeout(checkForUpdates, 3000);

    // Periodic checks
    const interval = setInterval(checkForUpdates, CHECK_INTERVAL);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
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
    dismissUpdate
  };
}
