import { useVersionCheck } from '@/hooks/useVersionCheck';
import { UpdateBanner } from '@/components/UpdateBanner';
import { VersionBadge } from '@/components/VersionBadge';

/**
 * AppVersionManager - Handles version checking, update banners, and version badge
 * Place this component inside the app to enable auto-update detection
 */
export function AppVersionManager() {
  const { updateAvailable, applyUpdate, dismissUpdate } = useVersionCheck();

  return (
    <>
      {/* Update banner at top when new version available */}
      <UpdateBanner 
        visible={updateAvailable}
        onUpdate={applyUpdate}
        onDismiss={dismissUpdate}
      />
      
      {/* Version badge at bottom-left corner */}
      <VersionBadge />
    </>
  );
}
