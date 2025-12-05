/**
 * Mercy Style Selector
 * 
 * Settings component to choose Mercy avatar style.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { MercyAvatarAngelic } from './MercyAvatarAngelic';
import { MercyAvatarMinimalist } from './MercyAvatarMinimalist';
import { MercyAvatarAbstract } from './MercyAvatarAbstract';
import { 
  AVATAR_STYLES, 
  getSavedAvatarStyle, 
  saveAvatarStyle, 
  type MercyAvatarStyle 
} from '@/lib/mercy-host/avatarStyles';
import { toast } from 'sonner';

interface MercyStyleSelectorProps {
  language?: 'en' | 'vi';
  onStyleChange?: (style: MercyAvatarStyle) => void;
}

export function MercyStyleSelector({ 
  language = 'en',
  onStyleChange 
}: MercyStyleSelectorProps) {
  const [selectedStyle, setSelectedStyle] = useState<MercyAvatarStyle>(getSavedAvatarStyle);
  
  const handleStyleChange = (style: MercyAvatarStyle) => {
    setSelectedStyle(style);
    saveAvatarStyle(style);
    onStyleChange?.(style);
    toast.success(
      language === 'vi' 
        ? 'Đã cập nhật phong cách Mercy' 
        : 'Mercy style updated'
    );
  };
  
  const getAvatarPreview = (style: MercyAvatarStyle) => {
    switch (style) {
      case 'angelic':
        return <MercyAvatarAngelic size={80} animate={false} />;
      case 'abstract':
        return <MercyAvatarAbstract size={80} animate={false} />;
      case 'minimalist':
      default:
        return <MercyAvatarMinimalist size={80} animate={false} />;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === 'vi' ? 'Chọn phong cách Mercy' : 'Choose Mercy Style'}
        </CardTitle>
        <CardDescription>
          {language === 'vi' 
            ? 'Chọn cách Mercy hiển thị trong ứng dụng'
            : 'Select how Mercy appears throughout the app'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={selectedStyle} 
          onValueChange={(value) => handleStyleChange(value as MercyAvatarStyle)}
          className="grid gap-4"
        >
          {AVATAR_STYLES.map((style) => (
            <div key={style.id} className="flex items-center space-x-4">
              <RadioGroupItem value={style.id} id={style.id} />
              <Label 
                htmlFor={style.id} 
                className="flex items-center gap-4 cursor-pointer flex-1 p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-shrink-0">
                  {getAvatarPreview(style.id)}
                </div>
                <div>
                  <p className="font-medium">
                    {language === 'vi' ? style.name.vi : style.name.en}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'vi' ? style.description.vi : style.description.en}
                  </p>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
