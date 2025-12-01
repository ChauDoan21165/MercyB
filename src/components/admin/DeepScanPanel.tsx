/**
 * L8 — Deep Scan Panel Component
 * Triggers deep validation checks (audio, entries, JSON structure)
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DeepScanPanelProps {
  onScan: () => Promise<void>;
  isScanning: boolean;
}

export const DeepScanPanel = ({ onScan, isScanning }: DeepScanPanelProps) => {
  const [lastScanTime, setLastScanTime] = useState<Date | null>(null);

  const handleScan = async () => {
    await onScan();
    setLastScanTime(new Date());
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Deep Scan</h3>
          <p className="text-sm text-muted-foreground">
            Comprehensive validation including audio accessibility, entry structure, and JSON integrity checks.
          </p>
        </div>

        <Alert>
          <AlertDescription className="text-sm">
            <strong>What Deep Scan checks:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>JSON file existence and structure</li>
              <li>Audio file accessibility (HTTP 200 checks)</li>
              <li>Entry count validation (2-8 entries)</li>
              <li>Bilingual content completeness</li>
              <li>Database vs JSON sync</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {lastScanTime ? (
              <span>Last scan: {lastScanTime.toLocaleTimeString()}</span>
            ) : (
              <span>No recent scans</span>
            )}
          </div>

          <Button onClick={handleScan} disabled={isScanning}>
            {isScanning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Run Deep Scan
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
