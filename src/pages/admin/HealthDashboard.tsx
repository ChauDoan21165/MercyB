import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Shield, Zap, ArrowLeft, Settings, Baby } from "lucide-react";

const tiers = [
  { id: "free", name: "Free", icon: Zap, color: "text-black" },
  { id: "vip1", name: "VIP 1", icon: Shield, color: "text-black" },
  { id: "vip2", name: "VIP 2", icon: Shield, color: "text-black" },
  { id: "vip3", name: "VIP 3", icon: Shield, color: "text-black" },
  { id: "vip4", name: "VIP 4", icon: Shield, color: "text-black" },
  { id: "vip5", name: "VIP 5", icon: Shield, color: "text-black" },
  { id: "vip6", name: "VIP 6", icon: Shield, color: "text-black" },
  { id: "vip7", name: "VIP 7", icon: Shield, color: "text-black" },
  { id: "vip9", name: "VIP 9", icon: Shield, color: "text-black" },
  { id: "kidslevel1", name: "Kids Level 1", icon: Baby, color: "text-black" },
  { id: "kidslevel2", name: "Kids Level 2", icon: Baby, color: "text-black" },
  { id: "kidslevel3", name: "Kids Level 3", icon: Baby, color: "text-black" },
];

export default function HealthDashboard() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <Link to="/admin">
          <Button variant="outline" size="sm" className="mb-2 border-black text-black hover:bg-gray-100">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2 text-black">System Health Dashboard</h1>
        <p className="text-gray-600">
          Monitor and validate room configurations across all tiers
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6 border-2 border-black bg-white">
          <div className="flex items-center space-x-3 mb-4">
            <Settings className="h-6 w-6 text-black" />
            <div>
              <h2 className="text-xl font-bold text-black">System Health Dashboard</h2>
              <p className="text-sm text-gray-600">
                Monitor overall system health and configuration
              </p>
            </div>
          </div>
          <Link to="/admin/system-health">
            <Button variant="outline" className="border-black text-black hover:bg-gray-100">
              <Activity className="h-4 w-4 mr-2" />
              View System Health
            </Button>
          </Link>
        </Card>

        <Card className="p-6 border-2 border-black bg-white">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-black mb-2">Room Health Check</h2>
            <p className="text-sm text-gray-600">
              Validate room configurations for each tier
            </p>
          </div>
          
          <div className="mb-4">
            <Link to="/admin/room-health/all">
              <Button className="w-full bg-black hover:bg-gray-800 text-white py-6 border-2 border-black">
                <Activity className="h-5 w-5 mr-2" />
                <span className="text-lg font-bold">Scan Entire App (All Tiers)</span>
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {tiers.map((tier) => {
              const Icon = tier.icon;
              return (
                <Link key={tier.id} to={`/admin/room-health/${tier.id}`}>
                  <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center space-y-2 border-2 border-black bg-white hover:bg-gray-100">
                    <Icon className={`h-6 w-6 ${tier.color}`} />
                    <span className="font-bold text-black">{tier.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
