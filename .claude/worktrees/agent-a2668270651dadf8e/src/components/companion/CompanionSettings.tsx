import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Info, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getCompanionEnabled, setCompanionEnabled, getMutedRoomsList, clearMutedRooms } from '@/hooks/useCompanionSession';
import { getAppLanguage, setAppLanguage } from '@/lib/companionLines';

export function CompanionSettings() {
  const [enabled, setEnabled] = useState(true);
  const [language, setLanguage] = useState<'en' | 'vi'>('en');
  const [mutedCount, setMutedCount] = useState(0);

  useEffect(() => {
    setEnabled(getCompanionEnabled());
    setLanguage(getAppLanguage());
    setMutedCount(getMutedRoomsList().length);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-x-4 p-4 rounded-lg border border-border">
        <div className="space-y-0.5 flex-1">
          <div className="flex items-center gap-2">
            <Label htmlFor="companion-toggle" className="text-base">Mercy Companion</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="text-muted-foreground hover:text-foreground"><Info className="h-4 w-4" /></button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs text-sm">
                  Mercy only uses your in-app activity (rooms, paths, moods). We never access anything outside this app.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-sm text-muted-foreground">Show friendly messages while you learn</p>
        </div>
        <Switch id="companion-toggle" checked={enabled} onCheckedChange={(c) => { setEnabled(c); setCompanionEnabled(c); }} />
      </div>

      <div className="p-4 rounded-lg border border-border">
        <Label className="text-base mb-3 block">Mercy's Language</Label>
        <div className="flex gap-2">
          <Button variant={language === 'en' ? 'default' : 'outline'} size="sm" onClick={() => { setLanguage('en'); setAppLanguage('en'); }}>English</Button>
          <Button variant={language === 'vi' ? 'default' : 'outline'} size="sm" onClick={() => { setLanguage('vi'); setAppLanguage('vi'); }}>Tiếng Việt</Button>
        </div>
      </div>

      {mutedCount > 0 && (
        <div className="flex items-center justify-between p-4 rounded-lg border border-border">
          <div><p className="text-sm font-medium">{mutedCount} room{mutedCount > 1 ? 's' : ''} muted</p><p className="text-xs text-muted-foreground">Mercy won't appear in these rooms</p></div>
          <Button variant="ghost" size="sm" onClick={() => { clearMutedRooms(); setMutedCount(0); }} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4 mr-1" />Clear</Button>
        </div>
      )}
    </div>
  );
}

export default CompanionSettings;
