import { useCallback } from 'react';
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

  // Handle reload with service worker cleanup
  const handleReload = useCallback(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(regs => {
        regs.forEach(r => {
          r.unregister();
          console.log('[version] Unregistered service worker:', r.scope);
        });
      });
    }
    // Clear version storage and reload
    localStorage.removeItem('mb_app_version');
    localStorage.removeItem('mb_min_version_blocked');
    window.location.reload();
  }, []);

  return (
    <>
      {/* Hard block overlay when update is required */}
      <VersionBlockOverlay 
        visible={isBlocked}
        onReload={handleReload}
        latestVersion={latestVersion?.version}
      />
      
      {/* Update banner at top when new version available (but not blocking) */}
      <UpdateBanner 
        visible={updateAvailable && !isBlocked}
        onUpdate={handleReload}
        onDismiss={dismissUpdate}
      />
      
      {/* Version badge at bottom-left corner */}
      <VersionBadge />
    </>
  );
}
