import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNotificationSound } from "@/hooks/useNotificationSound";

interface NotificationSettings {
  sound_enabled: boolean;
  alert_tone: 'alert' | 'warning' | 'chime' | 'bell';
}

export const NotificationPreferences = () => {
  const { toast } = useToast();
  const { playNotificationSound } = useNotificationSound();
  const [settings, setSettings] = useState<NotificationSettings>({
    sound_enabled: true,
    alert_tone: 'alert',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from('admin_notification_settings')
        .select('*')
        .eq('admin_user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings({
          sound_enabled: data.sound_enabled,
          alert_tone: data.alert_tone as any,
        });
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
      toast({
        title: "Error",
        description: "Failed to load notification preferences",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { error } = await supabase
        .from('admin_notification_settings')
        .upsert({
          admin_user_id: user.id,
          sound_enabled: settings.sound_enabled,
          alert_tone: settings.alert_tone,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Saved! ✓",
        description: "Notification preferences updated successfully",
      });
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast({
        title: "Error",
        description: "Failed to save notification preferences",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const testSound = () => {
    playNotificationSound(settings.alert_tone);
    toast({
      title: "Test Alert",
      description: `Playing ${settings.alert_tone} tone`,
    });
  };

  if (loading) {
    return (
      <Card className="border-primary/20">
        <CardContent className="p-8">
          <p className="text-sm text-muted-foreground text-center">Loading settings...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Customize your admin notification settings and alert sounds
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sound Enable/Disable */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="sound-enabled" className="text-base">
              Sound Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Play sounds for high-priority alerts and suspicious activity
            </p>
          </div>
          <Switch
            id="sound-enabled"
            checked={settings.sound_enabled}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, sound_enabled: checked })
            }
          />
        </div>

        {/* Alert Tone Selection */}
        {settings.sound_enabled && (
          <div className="space-y-3">
            <Label className="text-base">Alert Tone</Label>
            <RadioGroup
              value={settings.alert_tone}
              onValueChange={(value) =>
                setSettings({ ...settings, alert_tone: value as any })
              }
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="alert" id="alert" />
                <Label htmlFor="alert" className="font-normal cursor-pointer">
                  Alert (High-pitched, urgent)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="warning" id="warning" />
                <Label htmlFor="warning" className="font-normal cursor-pointer">
                  Warning (Medium-pitched, moderate)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="chime" id="chime" />
                <Label htmlFor="chime" className="font-normal cursor-pointer">
                  Chime (Soft, gentle)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bell" id="bell" />
                <Label htmlFor="bell" className="font-normal cursor-pointer">
                  Bell (Classic notification)
                </Label>
              </div>
            </RadioGroup>

            {/* Test Sound Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={testSound}
              className="mt-2"
            >
              <Volume2 className="h-4 w-4 mr-2" />
              Test Sound
            </Button>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button
            onClick={saveSettings}
            disabled={saving}
            style={{ 
              background: 'var(--gradient-rainbow)',
              color: 'white'
            }}
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
