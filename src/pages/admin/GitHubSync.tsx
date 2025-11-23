import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Play, RefreshCw } from 'lucide-react';
import { useUserAccess } from '@/hooks/useUserAccess';

export default function GitHubSync() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useUserAccess();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [config, setConfig] = useState({
    id: '',
    repository_url: '',
    branch: 'main',
    base_path: 'public/data',
    is_enabled: true,
    sync_interval_minutes: 60,
  });
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    loadConfig();
    loadLogs();
  }, [isAdmin]);

  const loadConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('github_sync_config')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setConfig(data);
      }
    } catch (error) {
      console.error('Error loading config:', error);
      toast({
        title: 'Error',
        description: 'Failed to load sync configuration',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('github_sync_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error loading logs:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (config.id) {
        const { error } = await supabase
          .from('github_sync_config')
          .update(config)
          .eq('id', config.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('github_sync_config')
          .insert(config)
          .select()
          .single();

        if (error) throw error;
        setConfig(data);
      }

      toast({
        title: 'Success',
        description: 'Configuration saved successfully',
      });
    } catch (error) {
      console.error('Error saving config:', error);
      toast({
        title: 'Error',
        description: 'Failed to save configuration',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('github-sync');

      if (error) throw error;

      toast({
        title: 'Sync Complete',
        description: `Checked: ${data.results.checked}, Downloaded: ${data.results.downloaded}, Failed: ${data.results.failed}`,
      });

      loadLogs();
    } catch (error) {
      console.error('Error syncing:', error);
      toast({
        title: 'Sync Error',
        description: 'Failed to sync files from GitHub',
        variant: 'destructive',
      });
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/admin')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold">GitHub Auto-Sync</h1>
          <p className="text-muted-foreground mt-2">
            Automatically sync missing room files from GitHub repository
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sync Configuration</CardTitle>
            <CardDescription>
              Configure the GitHub repository to sync missing files from
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="repository_url">GitHub Repository URL</Label>
              <Input
                id="repository_url"
                placeholder="https://github.com/username/repo"
                value={config.repository_url}
                onChange={(e) =>
                  setConfig({ ...config, repository_url: e.target.value })
                }
              />
              <p className="text-sm text-muted-foreground">
                Example: https://github.com/ChauDoan21165/MercyB
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Input
                  id="branch"
                  placeholder="main"
                  value={config.branch}
                  onChange={(e) => setConfig({ ...config, branch: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="base_path">Base Path</Label>
                <Input
                  id="base_path"
                  placeholder="public/data"
                  value={config.base_path}
                  onChange={(e) =>
                    setConfig({ ...config, base_path: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sync_interval">Sync Interval (minutes)</Label>
              <Input
                id="sync_interval"
                type="number"
                min="5"
                value={config.sync_interval_minutes}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    sync_interval_minutes: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_enabled"
                checked={config.is_enabled}
                onCheckedChange={(checked) =>
                  setConfig({ ...config, is_enabled: checked })
                }
              />
              <Label htmlFor="is_enabled">Enable automatic sync</Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Configuration'}
              </Button>
              <Button
                variant="secondary"
                onClick={handleSync}
                disabled={syncing || !config.repository_url}
              >
                {syncing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Sync Now
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Sync Logs</CardTitle>
            <CardDescription>Last 10 sync operations</CardDescription>
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <p className="text-muted-foreground">No sync logs yet</p>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 border rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">
                        {new Date(log.sync_started_at).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Status: {log.status} | Checked: {log.files_checked} |
                        Downloaded: {log.files_downloaded} | Failed:{' '}
                        {log.files_failed}
                      </p>
                    </div>
                    <div
                      className={`px-2 py-1 rounded text-xs ${
                        log.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : log.status === 'running'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {log.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
