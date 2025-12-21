import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Shield, Users, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SecurityEvent {
  id: string;
  event_type: string;
  severity: string;
  user_id: string | null;
  created_at: string;
  metadata: any;
}

export default function SecurityMonitor() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    criticalEvents: 0,
    blockedAttempts: 0,
    suspiciousActivity: 0,
  });

  useEffect(() => {
    loadSecurityEvents();
    loadStats();

    // Refresh every 30 seconds
    const interval = setInterval(() => {
      loadSecurityEvents();
      loadStats();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  async function loadSecurityEvents() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('security_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      setEvents(data || []);
    } catch (error) {
      console.error('Failed to load security events:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    try {
      // Total events (last 24h)
      const { count: total } = await supabase
        .from('security_events')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      // Critical events
      const { count: critical } = await supabase
        .from('security_events')
        .select('*', { count: 'exact', head: true })
        .eq('severity', 'critical')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      // Blocked attempts
      const { count: blocked } = await supabase
        .from('security_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'blocked_access')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      // Suspicious activity
      const { count: suspicious } = await supabase
        .from('security_events')
        .select('*', { count: 'exact', head: true })
        .in('event_type', ['tier_spoof_attempt', 'tamper_detected', 'rate_limit_exceeded'])
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      setStats({
        totalEvents: total || 0,
        criticalEvents: critical || 0,
        blockedAttempts: blocked || 0,
        suspiciousActivity: suspicious || 0,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }

  function getSeverityColor(severity: string) {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Security Monitor</h1>
            <p className="text-muted-foreground">
              Real-time security event monitoring and threat detection
            </p>
          </div>
          <Button onClick={() => { loadSecurityEvents(); loadStats(); }} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Events (24h)</p>
              <p className="text-2xl font-bold">{stats.totalEvents}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <div>
              <p className="text-sm text-muted-foreground">Critical Events</p>
              <p className="text-2xl font-bold">{stats.criticalEvents}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Lock className="h-8 w-8 text-orange-600" />
            <div>
              <p className="text-sm text-muted-foreground">Blocked Attempts</p>
              <p className="text-2xl font-bold">{stats.blockedAttempts}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-yellow-600" />
            <div>
              <p className="text-sm text-muted-foreground">Suspicious Activity</p>
              <p className="text-2xl font-bold">{stats.suspiciousActivity}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Critical Alerts */}
      {stats.criticalEvents > 0 && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {stats.criticalEvents} critical security event{stats.criticalEvents !== 1 ? 's' : ''} detected in the last 24 hours. Review immediately.
          </AlertDescription>
        </Alert>
      )}

      {/* Events List */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Security Events</h2>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading events...
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No security events recorded
          </div>
        ) : (
          <div className="space-y-2">
            {events.map(event => (
              <Card key={event.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Badge variant={getSeverityColor(event.severity)}>
                        {event.severity.toUpperCase()}
                      </Badge>
                      <span className="font-medium">{event.event_type.replace(/_/g, ' ').toUpperCase()}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(event.created_at).toLocaleString()}
                    </p>
                    {event.metadata && (
                      <pre className="text-xs text-muted-foreground mt-2 bg-muted p-2 rounded">
                        {JSON.stringify(event.metadata, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
