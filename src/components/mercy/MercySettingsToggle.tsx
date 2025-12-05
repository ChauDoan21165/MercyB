/**
 * Mercy Host Settings Toggle
 * 
 * Toggle for enabling/disabling host in settings.
 * Phase 6: Added ritual intensity slider and silence mode.
 */

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMercyHostContext } from './MercyHostProvider';
import { MercyAvatar } from './MercyAvatar';
import { AVATAR_STYLES, type MercyAvatarStyle } from '@/lib/mercy-host/avatarStyles';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { VolumeX, Volume2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RitualIntensity } from '@/lib/mercy-host/engine';

interface MercySettingsToggleProps {
  language?: 'en' | 'vi';
}

const RITUAL_INTENSITY_LABELS: Record<RitualIntensity, { en: string; vi: string }> = {
  off: { en: 'Off', vi: 'Tắt' },
  minimal: { en: 'Light', vi: 'Nhẹ' },
  normal: { en: 'Full', vi: 'Đầy đủ' }
};

const RITUAL_INTENSITY_DESCRIPTIONS: Record<RitualIntensity, { en: string; vi: string }> = {
  off: { 
    en: 'No rituals or ceremonies', 
    vi: 'Không có nghi lễ hay lễ kỷ niệm' 
  },
  minimal: { 
    en: 'Only streak milestones and gentle rituals', 
    vi: 'Chỉ cột mốc streak và nghi lễ nhẹ nhàng' 
  },
  normal: { 
    en: 'All rituals and VIP ceremonies enabled', 
    vi: 'Tất cả nghi lễ và lễ VIP được bật' 
  }
};

export function MercySettingsToggle({ language = 'en' }: MercySettingsToggleProps) {
  const mercy = useMercyHostContext();
  
  const intensityToSlider = (intensity: RitualIntensity): number => {
    switch (intensity) {
      case 'off': return 0;
      case 'minimal': return 50;
      case 'normal': return 100;
    }
  };

  const sliderToIntensity = (value: number): RitualIntensity => {
    if (value <= 25) return 'off';
    if (value <= 75) return 'minimal';
    return 'normal';
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MercyAvatar size={32} style={mercy.avatarStyle} animate={false} />
              {language === 'vi' ? 'Mercy Host' : 'Mercy Host'}
            </CardTitle>
            <CardDescription>
              {language === 'vi' 
                ? 'Trợ lý ảo chào đón và hướng dẫn bạn'
                : 'Virtual assistant that welcomes and guides you'
              }
            </CardDescription>
          </div>
          <Switch
            checked={mercy.isEnabled}
            onCheckedChange={mercy.setEnabled}
            aria-label={language === 'vi' ? 'Bật/tắt Mercy Host' : 'Toggle Mercy Host'}
          />
        </div>
      </CardHeader>
      
      {mercy.isEnabled && (
        <CardContent className="space-y-6">
          {/* Avatar Style Selection */}
          <div className="space-y-2">
            <Label>
              {language === 'vi' ? 'Phong cách avatar' : 'Avatar Style'}
            </Label>
            <RadioGroup
              value={mercy.avatarStyle}
              onValueChange={(value) => mercy.setAvatarStyle(value as MercyAvatarStyle)}
              className="flex gap-4"
            >
              {AVATAR_STYLES.map((style) => (
                <div key={style.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={style.id} id={`avatar-${style.id}`} />
                  <Label htmlFor={`avatar-${style.id}`} className="cursor-pointer">
                    {language === 'vi' ? style.name.vi : style.name.en}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          {/* Language Selection */}
          <div className="space-y-2">
            <Label>
              {language === 'vi' ? 'Ngôn ngữ Mercy' : 'Mercy Language'}
            </Label>
            <RadioGroup
              value={mercy.language}
              onValueChange={(value) => mercy.setLanguage(value as 'en' | 'vi')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="en" id="lang-en" />
                <Label htmlFor="lang-en" className="cursor-pointer">English</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="vi" id="lang-vi" />
                <Label htmlFor="lang-vi" className="cursor-pointer">Tiếng Việt</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Ritual Intensity Slider - Phase 6 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                {language === 'vi' ? 'Cường độ nghi lễ' : 'Ritual Intensity'}
              </Label>
              <span className="text-sm font-medium text-muted-foreground">
                {RITUAL_INTENSITY_LABELS[mercy.ritualIntensity][language]}
              </span>
            </div>
            <Slider
              value={[intensityToSlider(mercy.ritualIntensity)]}
              onValueChange={([value]) => mercy.setRitualIntensity(sliderToIntensity(value))}
              max={100}
              step={50}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              {RITUAL_INTENSITY_DESCRIPTIONS[mercy.ritualIntensity][language]}
            </p>
          </div>

          {/* Silence Mode Toggle - Phase 6 */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              {mercy.silenceMode ? (
                <VolumeX className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Volume2 className="h-4 w-4 text-primary" />
              )}
              <div>
                <Label className="cursor-pointer">
                  {language === 'vi' ? 'Chế độ im lặng' : 'Silence Mode'}
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {language === 'vi' 
                    ? 'Tắt giọng nói và hoạt ảnh lớn'
                    : 'Mutes voice and large animations'
                  }
                </p>
              </div>
            </div>
            <Switch
              checked={mercy.silenceMode}
              onCheckedChange={mercy.setSilenceMode}
              aria-label={language === 'vi' ? 'Bật/tắt chế độ im lặng' : 'Toggle silence mode'}
            />
          </div>
          
          {/* Keyboard shortcut hint */}
          <p className="text-xs text-muted-foreground">
            {language === 'vi' 
              ? 'Phím tắt: Shift+M để bật/tắt nhanh'
              : 'Keyboard shortcut: Shift+M to toggle'
            }
          </p>
        </CardContent>
      )}
    </Card>
  );
}
