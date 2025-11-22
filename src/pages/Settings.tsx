import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SecurityAlertSettings } from '@/components/SecurityAlertSettings';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings as SettingsIcon, Shield } from 'lucide-react';

export default function Settings() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <SettingsIcon className="h-8 w-8" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your application settings and preferences
        </p>
      </div>

      <Tabs defaultValue="security" className="space-y-6">
        <TabsList>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security & Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="security" className="space-y-6">
          <SecurityAlertSettings />
          
          <Card>
            <CardHeader>
              <CardTitle>Security Monitoring</CardTitle>
              <CardDescription>
                Your site is protected with real-time monitoring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Uptime Monitoring</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatic health checks every 60 seconds to detect downtime
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Attack Detection</h3>
                  <p className="text-sm text-muted-foreground">
                    Monitors for suspicious status codes and failed login attempts
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Instant Alerts</h3>
                  <p className="text-sm text-muted-foreground">
                    Get notified immediately via Discord and email
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Security Dashboard</h3>
                  <p className="text-sm text-muted-foreground">
                    View all incidents and uptime history in real-time
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
