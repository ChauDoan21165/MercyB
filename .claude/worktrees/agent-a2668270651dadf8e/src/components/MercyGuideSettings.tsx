import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useMercyGuide } from '@/hooks/useMercyGuide';

/**
 * Settings toggle for Mercy Guide assistant
 * Can be placed in any settings/profile page
 */
export function MercyGuideSettings() {
  const { isEnabled, setGuideEnabled } = useMercyGuide();

  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border bg-card">
      <div className="space-y-0.5">
        <Label htmlFor="mercy-guide-toggle" className="text-sm font-medium">
          Show Mercy Guide assistant
        </Label>
        <p className="text-xs text-muted-foreground">
          Hiện trợ lý Mercy Guide
        </p>
      </div>
      <Switch
        id="mercy-guide-toggle"
        checked={isEnabled}
        onCheckedChange={setGuideEnabled}
      />
    </div>
  );
}
