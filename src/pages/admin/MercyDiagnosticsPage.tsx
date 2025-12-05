/**
 * Mercy Diagnostics Admin Page
 * 
 * Shows engine state, last events, heartbeat status.
 */

import { useState, useEffect } from 'react';
import { useMercyHostContext } from '@/components/mercy/MercyHostProvider';
import { mercyHeartbeat, type HeartbeatStatus } from '@/lib/mercy-host/heartbeat';
import { eventLimiter } from '@/lib/mercy-host/eventLimiter';
import { loadValidatedMemory, resetMemory, type MercyMemoryV2 } from '@/lib/mercy-host/memorySchema';
import { hostSignal } from '@/lib/mercy-host/hostSignal';
import { runFullValidation } from '@/lib/mercy-host/validation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  RefreshCw, 
  Trash2, 
  Play, 
  AlertTriangle, 
  CheckCircle,
  Volume2,
  Sparkles,
  User,
  Clock,
  Zap
} from 'lucide-react';

export default function MercyDiagnosticsPage() {
  const mercy = useMercyHostContext();
  const [heartbeatStatus, setHeartbeatStatus] = useState<HeartbeatStatus | null>(null);
  const [memory, setMemory] = useState<MercyMemoryV2 | null>(null);
  const [limiterStatus, setLimiterStatus] = useState<{ queueLength: number; lastEventTime: number }>({ queueLength: 0, lastEventTime: 0 });
  const [validationResult, setValidationResult] = useState<ReturnType<typeof runFullValidation> | null>(null);

  useEffect(() => {
    // Initial load
    setHeartbeatStatus(mercyHeartbeat.forceCheck());
    setMemory(loadValidatedMemory());
    setLimiterStatus(eventLimiter.getStatus());
    setValidationResult(runFullValidation(mercy));

    // Refresh every 5s
    const interval = setInterval(() => {
      setHeartbeatStatus(mercyHeartbeat.getStatus());
      setLimiterStatus(eventLimiter.getStatus());
    }, 5000);

    return () => clearInterval(interval);
  }, [mercy]);

  const handleResetEngine = () => {
    resetMemory();
    mercy.init({ tier: 'free', language: 'en' });
    setMemory(loadValidatedMemory());
    setValidationResult(runFullValidation(mercy));
  };

  const handleForceGreet = () => {
    hostSignal.sendGreeting();
    mercy.greet();
  };

  const handleForceVoice = () => {
    hostSignal.playVoice('encouragement');
    mercy.onEvent('achievement' as any);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Mercy Diagnostics</h1>
          <p className="text-muted-foreground">Engine state, heartbeat, and system health</p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 mb-6">
          <Button onClick={handleResetEngine} variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Reset Engine
          </Button>
          <Button onClick={handleForceGreet} variant="outline" size="sm">
            <Sparkles className="h-4 w-4 mr-2" />
            Force Greet
          </Button>
          <Button onClick={handleForceVoice} variant="outline" size="sm">
            <Volume2 className="h-4 w-4 mr-2" />
            Force Voice
          </Button>
          <Button 
            onClick={() => setHeartbeatStatus(mercyHeartbeat.forceCheck())} 
            variant="outline" 
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <Tabs defaultValue="state" className="space-y-4">
          <TabsList>
            <TabsTrigger value="state">Engine State</TabsTrigger>
            <TabsTrigger value="heartbeat">Heartbeat</TabsTrigger>
            <TabsTrigger value="memory">Memory</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          {/* Engine State Tab */}
          <TabsContent value="state">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <StateCard title="Enabled" value={mercy.isEnabled ? 'Yes' : 'No'} icon={<Zap />} />
              <StateCard title="Presence" value={mercy.presenceState} icon={<User />} />
              <StateCard title="Tier" value={mercy.currentTier} icon={<Activity />} />
              <StateCard title="Tone" value={mercy.currentTone} />
              <StateCard title="Avatar" value={mercy.avatarStyle} icon={<Sparkles />} />
              <StateCard title="Language" value={mercy.language.toUpperCase()} />
              <StateCard title="Animation" value={mercy.currentAnimation || 'None'} />
              <StateCard title="Bubble Visible" value={mercy.isBubbleVisible ? 'Yes' : 'No'} />
              <StateCard title="User Name" value={mercy.userName || 'Guest'} icon={<User />} />
            </div>
          </TabsContent>

          {/* Heartbeat Tab */}
          <TabsContent value="heartbeat">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Heartbeat Status
                  {heartbeatStatus?.isHealthy ? (
                    <Badge className="bg-green-500/20 text-green-600">Healthy</Badge>
                  ) : (
                    <Badge variant="destructive">Unhealthy</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {heartbeatStatus && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <CheckItem label="Animation Alive" checked={heartbeatStatus.checks.animationAlive} />
                      <CheckItem label="Avatar Mounted" checked={heartbeatStatus.checks.avatarMounted} />
                      <CheckItem label="Bubble Valid" checked={heartbeatStatus.checks.bubbleStateValid} />
                      <CheckItem label="Memory Accessible" checked={heartbeatStatus.checks.memoryAccessible} />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Last check: {new Date(heartbeatStatus.lastCheck).toLocaleTimeString()}</p>
                      <p>Repair count: {heartbeatStatus.repairCount}</p>
                      {heartbeatStatus.errors.length > 0 && (
                        <div className="mt-2 text-red-500">
                          Errors: {heartbeatStatus.errors.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Memory Tab */}
          <TabsContent value="memory">
            <Card>
              <CardHeader>
                <CardTitle>Memory State</CardTitle>
              </CardHeader>
              <CardContent>
                {memory && (
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div><span className="text-muted-foreground">Version:</span> {memory.version}</div>
                      <div><span className="text-muted-foreground">Total Visits:</span> {memory.totalVisits}</div>
                      <div><span className="text-muted-foreground">Sessions:</span> {memory.sessionCount}</div>
                      <div><span className="text-muted-foreground">Onboarded:</span> {memory.hasOnboarded ? 'Yes' : 'No'}</div>
                      <div><span className="text-muted-foreground">Last Room:</span> {memory.lastRoom || 'None'}</div>
                      <div><span className="text-muted-foreground">Greeted Rooms:</span> {memory.greetedRooms.length}</div>
                      <div><span className="text-muted-foreground">Silence Mode:</span> {memory.hostPreferences.silenceMode ? 'On' : 'Off'}</div>
                      <div><span className="text-muted-foreground">Last Visit:</span> {memory.lastVisitISO ? new Date(memory.lastVisitISO).toLocaleDateString() : 'Never'}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Validation Tab */}
          <TabsContent value="validation">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Validation Results
                  {validationResult?.overall ? (
                    <Badge className="bg-green-500/20 text-green-600">All Pass</Badge>
                  ) : (
                    <Badge variant="destructive">Issues Found</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {validationResult && (
                  <div className="space-y-4">
                    <ValidationSection title="Tiers" result={validationResult.tiers} />
                    <ValidationSection title="Voice Pack" result={validationResult.voicePack} />
                    <ValidationSection title="Event Map" result={validationResult.eventMap} />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Event Limiter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-muted-foreground">Queue Length:</span> {limiterStatus.queueLength}</div>
                    <div><span className="text-muted-foreground">Last Event:</span> {limiterStatus.lastEventTime ? new Date(limiterStatus.lastEventTime).toLocaleTimeString() : 'Never'}</div>
                  </div>
                  <div className="pt-4">
                    <h4 className="font-medium mb-2">Signal History</h4>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {hostSignal.getHistory().slice(-10).reverse().map((signal, i) => (
                        <div key={i} className="text-xs p-2 bg-muted rounded">
                          <span className="font-medium">{signal.type}</span>
                          <span className="text-muted-foreground ml-2">
                            {signal.source} • {new Date(signal.timestamp || 0).toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StateCard({ 
  title, 
  value, 
  icon 
}: { 
  title: string; 
  value: string; 
  icon?: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            {icon}
            {title}
          </span>
          <span className="font-medium">{value}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function CheckItem({ label, checked }: { label: string; checked: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {checked ? (
        <CheckCircle className="h-4 w-4 text-green-500" />
      ) : (
        <AlertTriangle className="h-4 w-4 text-red-500" />
      )}
      <span className="text-sm">{label}</span>
    </div>
  );
}

function ValidationSection({ 
  title, 
  result 
}: { 
  title: string; 
  result: { valid: boolean; errors: string[]; warnings: string[] };
}) {
  return (
    <div className="border border-border rounded p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">{title}</span>
        {result.valid ? (
          <Badge className="bg-green-500/20 text-green-600">Pass</Badge>
        ) : (
          <Badge variant="destructive">Fail</Badge>
        )}
      </div>
      {(result.errors.length > 0 || result.warnings.length > 0) && (
        <div className="text-xs space-y-1">
          {result.errors.map((e, i) => (
            <p key={i} className="text-red-500">• {e}</p>
          ))}
          {result.warnings.map((w, i) => (
            <p key={i} className="text-yellow-500">• {w}</p>
          ))}
        </div>
      )}
    </div>
  );
}
