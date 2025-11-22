import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Bell, Mail, MessageSquare, Save } from 'lucide-react';

export function SecurityAlertSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({
    discord_webhook_url: '',
    alert_email: '',
    uptime_check_enabled: true,
  });

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('security_monitoring_config')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setConfig({
          discord_webhook_url: data.discord_webhook_url || '',
          alert_email: data.alert_email || '',
          uptime_check_enabled: data.uptime_check_enabled ?? true,
        });
      }
    } catch (error) {
      console.error('Error loading config:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('security_monitoring_config')
        .upsert({
          id: '00000000-0000-0000-0000-000000000001',
          ...config,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Settings Saved",
        description: "Security alert settings have been updated.",
      });
    } catch (error) {
      console.error('Error saving config:', error);
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const testAlert = async () => {
    try {
      await supabase.functions.invoke('security-alert', {
        body: {
          incident_type: 'test_alert',
          severity: 'low',
          description: 'This is a test alert to verify your notification settings are working correctly.',
          metadata: { test: true }
        }
      });

      toast({
        title: "Test Alert Sent",
        description: "Check your Discord and email for the test notification.",
      });
    } catch (error) {
      console.error('Error sending test alert:', error);
      toast({
        title: "Error",
        description: "Failed to send test alert.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading settings...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Security Alert Settings
        </CardTitle>
        <CardDescription>
          Configure where to receive security alerts for mercyblade.link
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Discord Webhook */}
        <div className="space-y-2">
          <Label htmlFor="discord_webhook" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Discord Webhook URL
          </Label>
          <Input
            id="discord_webhook"
            type="url"
            placeholder="https://discord.com/api/webhooks/..."
            value={config.discord_webhook_url}
            onChange={(e) => setConfig({ ...config, discord_webhook_url: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Get instant alerts in your Discord server. 
            <a 
              href="https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline ml-1"
            >
              How to create a webhook
            </a>
          </p>
        </div>

        {/* Alert Email */}
        <div className="space-y-2">
          <Label htmlFor="alert_email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Alert Email Address
          </Label>
          <Input
            id="alert_email"
            type="email"
            placeholder="your@email.com"
            value={config.alert_email}
            onChange={(e) => setConfig({ ...config, alert_email: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Receive email alerts for critical incidents (requires RESEND_API_KEY configured)
          </p>
        </div>

        {/* Uptime Check Toggle */}
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="uptime_check" className="flex flex-col space-y-1">
            <span>Enable Uptime Monitoring</span>
            <span className="font-normal text-xs text-muted-foreground">
              Automatically check site status every 60 seconds
            </span>
          </Label>
          <Switch
            id="uptime_check"
            checked={config.uptime_check_enabled}
            onCheckedChange={(checked) => setConfig({ ...config, uptime_check_enabled: checked })}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button 
            onClick={saveConfig}
            disabled={saving}
            className="flex-1"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
          <Button 
            onClick={testAlert}
            variant="outline"
          >
            Send Test Alert
          </Button>
        </div>

        {/* Instructions */}
        <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
          <p className="font-medium">📋 Setup Instructions:</p>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>Create a Discord webhook in your server settings</li>
            <li>Paste the webhook URL above</li>
            <li>Add your email for critical alerts</li>
            <li>Click "Send Test Alert" to verify it works</li>
            <li>Save settings</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
