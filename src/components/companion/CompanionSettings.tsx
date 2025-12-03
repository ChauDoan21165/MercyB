import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { getCompanionEnabled, setCompanionEnabled } from '@/hooks/useCompanionSession';

/**
 * Settings UI for enabling/disabling the companion
 */
export function CompanionSettings() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setEnabled(getCompanionEnabled());
  }, []);

  const handleToggle = (checked: boolean) => {
    setEnabled(checked);
    setCompanionEnabled(checked);
  };

  return (
    <div className="flex items-center justify-between space-x-4 p-4 rounded-lg border border-border">
      <div className="space-y-0.5">
        <Label htmlFor="companion-toggle" className="text-base">
          Companion Friend
        </Label>
        <p className="text-sm text-muted-foreground">
          Show friendly messages and tips while you learn
        </p>
      </div>
      <Switch
        id="companion-toggle"
        checked={enabled}
        onCheckedChange={handleToggle}
      />
    </div>
  );
}

export default CompanionSettings;
