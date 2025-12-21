import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SecurityAlertSettings } from '@/components/SecurityAlertSettings';
import { ProfilePrivacySettings } from '@/components/ProfilePrivacySettings';
import { AdminAuditLog } from '@/components/admin/AdminAuditLog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings as SettingsIcon, Shield, Lock, FileText } from 'lucide-react';
import { useAdminCheck } from '@/hooks/useAdminCheck';

export default function Settings() {
  const { isAdmin, loading: adminLoading } = useAdminCheck();

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

      <Tabs defaultValue="privacy" className="space-y-6">
        <TabsList>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Privacy
          </TabsTrigger>
          {isAdmin && (
            <>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security & Alerts
              </TabsTrigger>
              <TabsTrigger value="audit" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Audit Log
              </TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="privacy" className="space-y-6">
          <ProfilePrivacySettings />
        </TabsContent>

        {isAdmin && (
          <>
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

            <TabsContent value="audit" className="space-y-6">
              <AdminAuditLog />
              
              <Card>
                <CardHeader>
                  <CardTitle>About Audit Logging</CardTitle>
                  <CardDescription>
                    Security and compliance through transparent access tracking
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">What's Tracked</h3>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4">
                        <li>Payment data access</li>
                        <li>Security events viewing</li>
                        <li>User profile access</li>
                        <li>Admin actions</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Data Collected</h3>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4">
                        <li>Timestamp of access</li>
                        <li>Admin user identifier</li>
                        <li>Action performed</li>
                        <li>Record accessed</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm">
                      <strong>Purpose:</strong> Audit logs help detect unauthorized access, 
                      ensure compliance with data protection regulations, and maintain accountability 
                      for sensitive data access.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
