import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, CheckCircle, XCircle, Activity, Bell } from 'lucide-react';
import { format } from 'date-fns';

interface UptimeCheck {
  id: string;
  url: string;
  status_code: number | null;
  response_time_ms: number;
  is_up: boolean;
  error_message: string | null;
  checked_at: string;
}

interface SecurityIncident {
  id: string;
  incident_type: string;
  severity: string;
  description: string;
  resolved: boolean;
  created_at: string;
}

export default function SecurityDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [siteStatus, setSiteStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [recentChecks, setRecentChecks] = useState<UptimeCheck[]>([]);
  const [incidents, setIncidents] = useState<SecurityIncident[]>([]);
  const [attackMode, setAttackMode] = useState(false);

  useEffect(() => {
    checkAdminAccess();
    loadSecurityData();
    
    // Set up real-time subscription for new incidents
    const channel = supabase
      .channel('security_incidents')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'security_incidents'
      }, () => {
        loadSecurityData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/');
      return;
    }

    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!roles) {
      toast({
        title: "Access Denied",
        description: "You need admin access to view the security dashboard.",
        variant: "destructive",
      });
      navigate('/');
    }
  };

  const loadSecurityData = async () => {
    try {
      // Get recent uptime checks
      const { data: checks } = await supabase
        .from('uptime_checks')
        .select('*')
        .order('checked_at', { ascending: false })
        .limit(10);

      setRecentChecks(checks || []);

      // Determine current site status
      if (checks && checks.length > 0) {
        setSiteStatus(checks[0].is_up ? 'online' : 'offline');
      }

      // Get recent incidents
      const { data: incidentData } = await supabase
        .from('security_incidents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      setIncidents(incidentData || []);

      // Get attack mode status
      const { data: config } = await supabase
        .from('security_monitoring_config')
        .select('attack_mode_enabled')
        .single();

      setAttackMode(config?.attack_mode_enabled || false);

    } catch (error) {
      console.error('Error loading security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerUnderAttack = async () => {
    try {
      // Enable attack mode
      const { error: configError } = await supabase
        .from('security_monitoring_config')
        .update({ attack_mode_enabled: true })
        .eq('id', '00000000-0000-0000-0000-000000000001');

      if (configError) throw configError;

      // Send emergency alert
      await supabase.functions.invoke('security-alert', {
        body: {
          incident_type: 'under_attack',
          severity: 'critical',
          description: '🚨 EMERGENCY: Admin manually triggered "Under Attack" mode!',
          metadata: {
            triggered_by: (await supabase.auth.getUser()).data.user?.email,
            timestamp: new Date().toISOString(),
          }
        }
      });

      setAttackMode(true);

      toast({
        title: "Under Attack Mode Activated",
        description: "Emergency alerts sent. Enhanced security enabled.",
      });

    } catch (error) {
      console.error('Error triggering attack mode:', error);
      toast({
        title: "Error",
        description: "Failed to activate under attack mode.",
        variant: "destructive",
      });
    }
  };

  const disableAttackMode = async () => {
    try {
      const { error } = await supabase
        .from('security_monitoring_config')
        .update({ attack_mode_enabled: false })
        .eq('id', '00000000-0000-0000-0000-000000000001');

      if (error) throw error;

      setAttackMode(false);

      toast({
        title: "Attack Mode Disabled",
        description: "Normal security mode restored.",
      });

    } catch (error) {
      console.error('Error disabling attack mode:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  if (loading) {
    return <div className="container mx-auto p-6">Loading security dashboard...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Security Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor mercyblade.link security and uptime
          </p>
        </div>
        <Button 
          onClick={() => navigate('/settings')}
          variant="outline"
        >
          <Bell className="h-4 w-4 mr-2" />
          Alert Settings
        </Button>
      </div>

      {/* Site Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Current Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {siteStatus === 'online' ? (
              <>
                <CheckCircle className="h-12 w-12 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-green-500">ONLINE</p>
                  <p className="text-sm text-muted-foreground">mercyblade.link is running normally</p>
                </div>
              </>
            ) : siteStatus === 'offline' ? (
              <>
                <XCircle className="h-12 w-12 text-red-500" />
                <div>
                  <p className="text-2xl font-bold text-red-500">OFFLINE</p>
                  <p className="text-sm text-muted-foreground">mercyblade.link is not responding!</p>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">Checking status...</p>
            )}
          </div>

          <div className="mt-6">
            {attackMode ? (
              <Button 
                onClick={disableAttackMode}
                variant="outline"
                className="w-full"
              >
                Disable Attack Mode
              </Button>
            ) : (
              <Button 
                onClick={triggerUnderAttack}
                variant="destructive"
                className="w-full"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                I'm Under Attack!
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Incidents */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Incidents</CardTitle>
          <CardDescription>Last 10 security events</CardDescription>
        </CardHeader>
        <CardContent>
          {incidents.length === 0 ? (
            <p className="text-muted-foreground">No incidents recorded</p>
          ) : (
            <div className="space-y-3">
              {incidents.map((incident) => (
                <div 
                  key={incident.id}
                  className="border rounded-lg p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={getSeverityColor(incident.severity)}>
                        {incident.severity.toUpperCase()}
                      </Badge>
                      <span className="font-medium">{incident.incident_type}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(incident.created_at), 'PPp')}
                    </span>
                  </div>
                  <p className="text-sm">{incident.description}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Uptime History */}
      <Card>
        <CardHeader>
          <CardTitle>Uptime Check History</CardTitle>
          <CardDescription>Last 10 health checks</CardDescription>
        </CardHeader>
        <CardContent>
          {recentChecks.length === 0 ? (
            <p className="text-muted-foreground">No checks recorded yet</p>
          ) : (
            <div className="space-y-2">
              {recentChecks.map((check) => (
                <div 
                  key={check.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    {check.is_up ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm">
                      {check.is_up ? 'UP' : 'DOWN'} - Status {check.status_code || 'N/A'}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{check.response_time_ms}ms</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(check.checked_at), 'HH:mm:ss')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
