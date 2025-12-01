import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VipTierCoverage {
  tierId: string;
  label: string;
  expectedCount: number;
  dbActiveCount: number;
  missingRoomIds: string[];
  inactiveRoomIds: string[];
  wrongTierRoomIds: string[];
}

interface VipTierCoveragePanelProps {
  coverage: VipTierCoverage[];
}

export function VipTierCoveragePanel({ coverage }: VipTierCoveragePanelProps) {
  if (!coverage || coverage.length === 0) {
    return null;
  }

  const hasAnyIssues = coverage.some(
    t => t.expectedCount !== t.dbActiveCount || 
         t.missingRoomIds.length > 0 || 
         t.inactiveRoomIds.length > 0 || 
         t.wrongTierRoomIds.length > 0
  );

  return (
    <Card className="p-6 border-2 border-black bg-white">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-black">VIP Tier Coverage</h2>
          {!hasAnyIssues && (
            <Badge className="bg-green-500 text-white">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              All Tiers Matched
            </Badge>
          )}
        </div>
        
        <p className="text-sm text-gray-600">
          Compares registry/JSON expected rooms against database active rooms for each VIP tier.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left py-3 px-2 font-bold text-black">Tier</th>
                <th className="text-left py-3 px-2 font-bold text-black">Expected</th>
                <th className="text-left py-3 px-2 font-bold text-black">Active in DB</th>
                <th className="text-left py-3 px-2 font-bold text-black">Status</th>
                <th className="text-left py-3 px-2 font-bold text-black">Missing</th>
                <th className="text-left py-3 px-2 font-bold text-black">Inactive</th>
                <th className="text-left py-3 px-2 font-bold text-black">Wrong Tier</th>
              </tr>
            </thead>
            <tbody>
              {coverage.map((t) => {
                const hasMismatch = t.expectedCount !== t.dbActiveCount;
                const hasMissing = t.missingRoomIds.length > 0;
                const hasInactive = t.inactiveRoomIds.length > 0;
                const hasWrongTier = t.wrongTierRoomIds.length > 0;
                const hasAnyIssue = hasMismatch || hasMissing || hasInactive || hasWrongTier;

                return (
                  <tr 
                    key={t.tierId} 
                    className={`border-b border-gray-200 ${hasAnyIssue ? 'bg-red-50' : 'bg-white'}`}
                  >
                    <td className="py-3 px-2 font-semibold text-black">{t.label.split(' / ')[0]}</td>
                    <td className="py-3 px-2 text-black">{t.expectedCount}</td>
                    <td className={`py-3 px-2 font-bold ${hasMismatch ? 'text-red-600' : 'text-green-600'}`}>
                      {t.dbActiveCount}
                    </td>
                    <td className="py-3 px-2">
                      {!hasAnyIssue ? (
                        <Badge className="bg-green-500 text-white text-xs">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          OK
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Mismatch
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      {hasMissing ? (
                        <details className="cursor-pointer">
                          <summary className="text-red-600 font-semibold hover:underline">
                            {t.missingRoomIds.length} missing
                          </summary>
                          <div className="mt-2 p-2 bg-white border border-gray-300 rounded text-xs font-mono space-y-1 max-h-40 overflow-y-auto">
                            {t.missingRoomIds.map((id) => (
                              <div key={id} className="text-gray-700">{id}</div>
                            ))}
                          </div>
                        </details>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      {hasInactive ? (
                        <details className="cursor-pointer">
                          <summary className="text-orange-600 font-semibold hover:underline">
                            {t.inactiveRoomIds.length} inactive
                          </summary>
                          <div className="mt-2 p-2 bg-white border border-gray-300 rounded text-xs font-mono space-y-1 max-h-40 overflow-y-auto">
                            {t.inactiveRoomIds.map((id) => (
                              <div key={id} className="text-gray-700">{id}</div>
                            ))}
                            <div className="mt-2 pt-2 border-t border-gray-200 text-gray-600">
                              💡 Set is_active = true in DB to show these rooms
                            </div>
                          </div>
                        </details>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      {hasWrongTier ? (
                        <details className="cursor-pointer">
                          <summary className="text-purple-600 font-semibold hover:underline">
                            {t.wrongTierRoomIds.length} wrong tier
                          </summary>
                          <div className="mt-2 p-2 bg-white border border-gray-300 rounded text-xs font-mono space-y-1 max-h-40 overflow-y-auto">
                            {t.wrongTierRoomIds.map((id) => (
                              <div key={id} className="text-gray-700">{id}</div>
                            ))}
                            <div className="mt-2 pt-2 border-t border-gray-200 text-gray-600">
                              💡 These rooms are in DB with tier="{t.label}" but not expected for this tier
                            </div>
                          </div>
                        </details>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {hasAnyIssues && (
          <Alert className="border-2 border-red-500 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-sm text-red-800">
              <strong>Action Required:</strong> VIP tier mismatches detected. Click details to see missing/inactive/wrong-tier rooms. 
              Fix by registering missing rooms to DB or updating tier values to match expected labels.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Card>
  );
}
