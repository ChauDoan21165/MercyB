import { useEffect } from 'react';
import { useVersionCheck } from '@/hooks/useVersionCheck';
import { UpdateBanner } from '@/components/UpdateBanner';
import { VersionBadge } from '@/components/VersionBadge';
import { VersionBlockOverlay } from '@/components/VersionBlockOverlay';

/**
 * AppVersionManager - Handles version checking, update banners, and version badge
 * Place this component inside the app to enable auto-update detection
 */
export function AppVersionManager() {
  const { updateAvailable, isBlocked, latestVersion, applyUpdate, dismissUpdate } = useVersionCheck();

  // Unregister any service workers on mount to prevent Safari cache issues
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
          console.log('[version] Unregistered service worker:', registration.scope);
        }
      });
    }
  }, []);

  return (
    <>
      {/* Hard block overlay when update is required */}
      <VersionBlockOverlay 
        visible={isBlocked}
        onReload={applyUpdate}
        latestVersion={latestVersion?.version}
      />
      
      {/* Update banner at top when new version available (but not blocking) */}
      <UpdateBanner 
        visible={updateAvailable && !isBlocked}
        onUpdate={applyUpdate}
        onDismiss={dismissUpdate}
      />
      
      {/* Version badge at bottom-left corner */}
      <VersionBadge />
    </>
  );
}
