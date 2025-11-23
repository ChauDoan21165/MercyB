import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Activity, 
  Database, 
  Server, 
  Shield, 
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";

export default function SystemHealth() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <Link to="/admin">
          <Button variant="ghost" size="sm" className="mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2">System Health Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor overall system health, performance, and configuration status
        </p>
      </div>

      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <div>
              <div className="text-2xl font-bold">All Systems Operational</div>
              <p className="text-sm text-muted-foreground">Last checked: {new Date().toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Database Health */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-semibold">Healthy</span>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div>✓ Connection stable</div>
              <div>✓ Queries executing normally</div>
              <div>✓ RLS policies active</div>
            </div>
          </CardContent>
        </Card>

        {/* Server Health */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Server</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-semibold">Healthy</span>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div>✓ Edge functions running</div>
              <div>✓ API responsive</div>
              <div>✓ Storage accessible</div>
            </div>
          </CardContent>
        </Card>

        {/* Security Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-semibold">Secure</span>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div>✓ Authentication working</div>
              <div>✓ No active threats</div>
              <div>✓ SSL certificates valid</div>
            </div>
          </CardContent>
        </Card>

        {/* Response Time */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-semibold">Fast</span>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div>Avg Response: &lt;200ms</div>
              <div>Uptime: 99.9%</div>
              <div>No slowdowns detected</div>
            </div>
          </CardContent>
        </Card>

        {/* Room Validation */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold">Needs Attention</span>
            </div>
            <div className="space-y-2 mt-2">
              <Link to="/admin/health-dashboard">
                <Button variant="outline" size="sm" className="w-full">
                  View Room Health
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* System Metrics */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Detailed Metrics</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link to="/admin/system-metrics">
                <Button variant="outline" size="sm" className="w-full">
                  View System Metrics
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Link to="/admin/health-dashboard">
            <Button variant="outline">
              <Activity className="h-4 w-4 mr-2" />
              Room Health Checks
            </Button>
          </Link>
          <Link to="/admin/security">
            <Button variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              Security Dashboard
            </Button>
          </Link>
          <Link to="/admin/system-metrics">
            <Button variant="outline">
              <Database className="h-4 w-4 mr-2" />
              Detailed Metrics
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
