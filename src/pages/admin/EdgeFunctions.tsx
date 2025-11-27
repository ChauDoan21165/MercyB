import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle2, XCircle, AlertCircle, Activity, Shield, Zap, Database, Users, MessageSquare, Search, FileText, Settings, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EdgeFunction {
  name: string;
  category: string;
  description: string;
  icon: any;
  status: 'active' | 'unknown';
  isPublic: boolean;
}

const EDGE_FUNCTIONS: EdgeFunction[] = [
  // Core Product - Auth & Identity
  { name: 'get-profile', category: 'Core Product', description: 'Get user profile with subscription and role data', icon: Users, status: 'active', isPublic: false },
  { name: 'update-profile', category: 'Core Product', description: 'Update user profile information', icon: Users, status: 'active', isPublic: false },
  
  // Core Product - Rooms & Content
  { name: 'get-room', category: 'Core Product', description: 'Get room data with tier validation and access control', icon: Database, status: 'active', isPublic: false },
  { name: 'list-rooms', category: 'Core Product', description: 'List rooms with pagination, filters, and search', icon: Search, status: 'active', isPublic: false },
  { name: 'search-entries', category: 'Core Product', description: 'Full-text search across room entries with ranking', icon: Search, status: 'active', isPublic: false },
  { name: 'get-subscription-status', category: 'Core Product', description: 'Get user subscription tier and usage limits', icon: Users, status: 'active', isPublic: false },
  { name: 'sync-rooms', category: 'Core Product', description: 'Sync room data from JSON files to database', icon: RefreshCw, status: 'active', isPublic: false },
  
  // Payment & Subscription
  { name: 'paypal', category: 'Payment', description: 'PayPal payment webhook handler with signature verification', icon: TrendingUp, status: 'active', isPublic: true },
  
  // Communication
  { name: 'chat-room', category: 'Communication', description: 'Real-time chat with rate limiting and validation', icon: MessageSquare, status: 'active', isPublic: false },
  { name: 'matchmaking', category: 'Communication', description: 'AI-powered user matching for coaching/pairing', icon: Users, status: 'active', isPublic: false },
  
  // Content & Media
  { name: 'tts', category: 'Content & Media', description: 'Text-to-speech audio generation service', icon: Activity, status: 'active', isPublic: false },
  
  // Security & Safety
  { name: 'moderation', category: 'Security', description: 'Content moderation with AI filtering and user safety', icon: Shield, status: 'active', isPublic: false },
  { name: 'health-check', category: 'Security', description: 'System health monitoring and diagnostics', icon: Activity, status: 'active', isPublic: true },
  
  // Admin Operations
  { name: 'admin-list-users', category: 'Admin Operations', description: 'List all users with subscription details', icon: Users, status: 'active', isPublic: false },
  { name: 'admin-set-tier', category: 'Admin Operations', description: 'Set user subscription tier and duration', icon: Settings, status: 'active', isPublic: false },
  { name: 'admin-list-rooms', category: 'Admin Operations', description: 'List all rooms in the system', icon: Database, status: 'active', isPublic: false },
  { name: 'admin-publish-room', category: 'Admin Operations', description: 'Publish room to make it visible to users', icon: FileText, status: 'active', isPublic: false },
  { name: 'admin-hide-room', category: 'Admin Operations', description: 'Hide room from regular users', icon: FileText, status: 'active', isPublic: false },
  { name: 'export-room', category: 'Admin Operations', description: 'Export room data to JSON for backup', icon: FileText, status: 'active', isPublic: false },
];

export default function EdgeFunctions() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [healthData, setHealthData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (!roleData) {
        navigate('/');
        return;
      }

      setIsAdmin(true);
      await fetchHealthCheck();
    } catch (error) {
      console.error('Admin access check failed:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchHealthCheck = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('health-check', {
        method: 'POST',
        body: {},
      });

      if (error) throw error;
      setHealthData(data);
    } catch (error) {
      console.error('Health check failed:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchHealthCheck();
    setRefreshing(false);
    toast({
      title: 'Refreshed',
      description: 'Function status updated',
    });
  };

  const handleTestFunction = async (functionName: string) => {
    toast({
      title: 'Testing function',
      description: `Invoking ${functionName}...`,
    });

    try {
      const { data, error } = await supabase.functions.invoke(functionName, {
        method: 'POST',
        body: {},
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: `${functionName} is working correctly`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Function test failed',
        variant: 'destructive',
      });
    }
  };

  const groupedFunctions = EDGE_FUNCTIONS.reduce((acc, func) => {
    if (!acc[func.category]) {
      acc[func.category] = [];
    }
    acc[func.category].push(func);
    return acc;
  }, {} as Record<string, EdgeFunction[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Zap className="w-8 h-8 text-primary" />
            Edge Functions
          </h1>
          <p className="text-muted-foreground mt-1">
            Backend serverless functions • {EDGE_FUNCTIONS.length} total functions
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing} className="gap-2">
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Status
        </Button>
      </div>

      {/* System Health Summary */}
      {healthData && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              System Health
            </CardTitle>
            <CardDescription>Overall backend health status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className={`text-2xl font-bold ${healthData.status === 'healthy' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {healthData.status === 'healthy' ? <CheckCircle2 className="w-6 h-6 mx-auto mb-2" /> : <AlertCircle className="w-6 h-6 mx-auto mb-2" />}
                  {healthData.status.toUpperCase()}
                </div>
                <div className="text-xs text-muted-foreground">Overall Status</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">{healthData.latency}ms</div>
                <div className="text-xs text-muted-foreground">Response Time</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{healthData.checks?.rooms?.totalRooms || 0}</div>
                <div className="text-xs text-muted-foreground">Total Rooms</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{healthData.checks?.users?.activeUsers || 0}</div>
                <div className="text-xs text-muted-foreground">Active Users</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Functions by Category */}
      {Object.entries(groupedFunctions).map(([category, functions]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-xl">{category}</CardTitle>
            <CardDescription>{functions.length} functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {functions.map((func) => {
                const Icon = func.icon;
                return (
                  <div
                    key={func.name}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm font-semibold">{func.name}</span>
                          <Badge variant={func.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                            {func.status}
                          </Badge>
                          {func.isPublic && (
                            <Badge variant="outline" className="text-xs">
                              Public
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{func.description}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestFunction(func.name)}
                      className="gap-2"
                    >
                      <Activity className="w-3 h-3" />
                      Test
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
