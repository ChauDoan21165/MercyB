import React, { useState, useEffect } from 'react';
import { Settings, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  CompanionProfile, 
  EnglishLevel, 
  getCompanionProfile, 
  updateCompanionProfile 
} from '@/services/companion';

interface MercyGuideProfileSettingsProps {
  onClose?: () => void;
  onSaved?: (profile: CompanionProfile) => void;
}

const ENGLISH_LEVELS: { value: EnglishLevel; label_en: string; label_vi: string }[] = [
  { value: 'beginner', label_en: 'Beginner', label_vi: 'Mới bắt đầu' },
  { value: 'lower_intermediate', label_en: 'Lower-Intermediate', label_vi: 'Sơ trung cấp' },
  { value: 'intermediate', label_en: 'Intermediate', label_vi: 'Trung cấp' },
  { value: 'advanced', label_en: 'Advanced', label_vi: 'Nâng cao' },
];

export function MercyGuideProfileSettings({ onClose, onSaved }: MercyGuideProfileSettingsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState('');
  const [level, setLevel] = useState<EnglishLevel>('beginner');
  const [goal, setGoal] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getCompanionProfile();
        if (profile.preferred_name) setName(profile.preferred_name);
        if (profile.english_level) setLevel(profile.english_level);
        if (profile.learning_goal) setGoal(profile.learning_goal);
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const patch: Partial<CompanionProfile> = {
        preferred_name: name.trim() || null,
        english_level: level,
        learning_goal: goal.trim() || null,
      };
      
      await updateCompanionProfile(patch);
      
      toast.success(
        <div>
          <p>Saved. Mercy Guide will adjust to you.</p>
          <p className="text-xs opacity-70">Đã lưu. Mercy Guide sẽ điều chỉnh cho phù hợp với bạn.</p>
        </div>
      );
      
      onSaved?.(patch);
      onClose?.();
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error('Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Settings className="h-4 w-4 text-muted-foreground" />
        <h4 className="font-medium text-sm">My Guide Settings</h4>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="guide-name" className="text-xs">
            Your name / Tên của bạn
          </Label>
          <Input
            id="guide-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="What should I call you?"
            className="h-8 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="guide-level" className="text-xs">
            English level / Trình độ tiếng Anh
          </Label>
          <Select value={level} onValueChange={(v) => setLevel(v as EnglishLevel)}>
            <SelectTrigger id="guide-level" className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ENGLISH_LEVELS.map((lvl) => (
                <SelectItem key={lvl.value} value={lvl.value}>
                  <span>{lvl.label_en}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({lvl.label_vi})
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="guide-goal" className="text-xs">
            Learning goal (optional) / Mục tiêu học
          </Label>
          <Textarea
            id="guide-goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g. I want to understand simple stories"
            className="text-sm min-h-[60px] resize-none"
            rows={2}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button size="sm" onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
          ) : (
            <Save className="h-4 w-4 mr-1" />
          )}
          Save
        </Button>
      </div>
    </div>
  );
}
