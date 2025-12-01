import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

interface SyncStats {
  totalDbRooms: number;
  totalJsonFiles: number;
  dbWithoutJson: number;
  jsonWithoutDb: number;
}

interface RoomHealthSummaryProps {
  syncStats: SyncStats | null;
  loading: boolean;
}

export function RoomHealthSummary({ syncStats, loading }: RoomHealthSummaryProps) {
  if (loading) {
    return (
      <Card className="p-6 bg-white border-black">
        <h2 className="text-xl font-bold mb-4">Loading health summary...</h2>
      </Card>
    );
  }

  if (!syncStats) {
    return null;
  }

  const isHealthy = syncStats.dbWithoutJson === 0 && syncStats.jsonWithoutDb === 0;
  const hasWarnings = syncStats.dbWithoutJson > 0 || syncStats.jsonWithoutDb > 0;

  return (
    <Card className="p-6 bg-white border-black mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-black">SYNC HEALTH SUMMARY</h2>
        {isHealthy && (
          <Badge className="bg-green-100 text-green-800 border-green-800">
            <CheckCircle2 className="w-4 h-4 mr-1" />
            All Systems Green
          </Badge>
        )}
        {hasWarnings && (
          <Badge className="bg-red-100 text-red-800 border-red-800">
            <AlertCircle className="w-4 h-4 mr-1" />
            Action Required
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Database Rooms"
          value={syncStats.totalDbRooms}
          icon={<CheckCircle2 className="w-5 h-5" />}
        />
        <StatCard
          label="JSON Files"
          value={syncStats.totalJsonFiles}
          icon={<CheckCircle2 className="w-5 h-5" />}
        />
        <StatCard
          label="DB Without JSON"
          value={syncStats.dbWithoutJson}
          icon={<XCircle className="w-5 h-5" />}
          warning={syncStats.dbWithoutJson > 0}
        />
        <StatCard
          label="JSON Without DB"
          value={syncStats.jsonWithoutDb}
          icon={<AlertCircle className="w-5 h-5" />}
          warning={syncStats.jsonWithoutDb > 0}
        />
      </div>
    </Card>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  warning?: boolean;
}

function StatCard({ label, value, icon, warning }: StatCardProps) {
  return (
    <div className={`p-4 border-2 rounded-lg ${warning ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={warning ? 'text-red-600' : 'text-gray-600'}>{icon}</div>
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <div className={`text-3xl font-bold ${warning ? 'text-red-700' : 'text-black'}`}>
        {value}
      </div>
    </div>
  );
}
