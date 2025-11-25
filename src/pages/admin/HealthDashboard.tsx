import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Shield, Zap, ArrowLeft, Settings } from "lucide-react";

const tiers = [
  { id: "free", name: "Free", icon: Zap, color: "text-blue-500" },
  { id: "vip1", name: "VIP 1", icon: Shield, color: "text-purple-500" },
  { id: "vip2", name: "VIP 2", icon: Shield, color: "text-purple-600" },
  { id: "vip3", name: "VIP 3", icon: Shield, color: "text-purple-700" },
  { id: "vip4", name: "VIP 4", icon: Shield, color: "text-indigo-500" },
  { id: "vip5", name: "VIP 5", icon: Shield, color: "text-indigo-600" },
  { id: "vip6", name: "VIP 6", icon: Shield, color: "text-indigo-700" },
  { id: "vip7", name: "VIP 7", icon: Shield, color: "text-indigo-800" },
  { id: "vip9", name: "VIP 9", icon: Shield, color: "text-amber-600" },
];

export default function HealthDashboard() {
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
          Monitor and validate room configurations across all tiers
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Settings className="h-6 w-6 text-blue-500" />
            <div>
              <h2 className="text-xl font-semibold">System Health Dashboard</h2>
              <p className="text-sm text-muted-foreground">
                Monitor overall system health and configuration
              </p>
            </div>
          </div>
          <Link to="/admin/system-health">
            <Button variant="secondary">
              <Activity className="h-4 w-4 mr-2" />
              View System Health
            </Button>
          </Link>
        </Card>

        <Card className="p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Main Tier Rooms</h2>
            <p className="text-sm text-muted-foreground">
              Validate room configurations for each tier
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {tiers.map((tier) => {
              const Icon = tier.icon;
              return (
                <Link key={tier.id} to={`/admin/room-health/${tier.id}`}>
                  <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center space-y-2">
                    <Icon className={`h-6 w-6 ${tier.color}`} />
                    <span className="font-semibold">{tier.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
          <div className="mt-4">
            <Link to="/admin/room-health/all">
              <Button variant="secondary" className="w-full">
                <Activity className="h-4 w-4 mr-2" />
                Check All Tiers
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
