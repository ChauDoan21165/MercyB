/**
 * Mercy Host Settings Toggle
 * 
 * Toggle for enabling/disabling host in settings.
 */

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMercyHostContext } from './MercyHostProvider';
import { MercyAvatar } from './MercyAvatar';
import { AVATAR_STYLES, type MercyAvatarStyle } from '@/lib/mercy-host/avatarStyles';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface MercySettingsToggleProps {
  language?: 'en' | 'vi';
}

export function MercySettingsToggle({ language = 'en' }: MercySettingsToggleProps) {
  const mercy = useMercyHostContext();
  
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
        <CardContent className="space-y-4">
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
