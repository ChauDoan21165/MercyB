/**
 * Audio Coverage Panel
 * 
 * Displays audio completeness metrics per room and tier in UnifiedHealthCheck
 */

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Volume2, Loader2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  generateAudioCoverageReport,
  getCoverageBadge,
  type AudioCoverageReport,
  type TierAudioSummary,
} from "@/lib/health/audioCoverage";

export function AudioCoveragePanel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AudioCoverageReport | null>(null);
  const [expandedTiers, setExpandedTiers] = useState<Set<string>>(new Set());

  const loadCoverage = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateAudioCoverageReport();
      setReport(data);
    } catch (err: any) {
      console.error('[AudioCoveragePanel] Error:', err);
      setError(err?.message || 'Failed to load audio coverage');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-load on mount
    loadCoverage();
  }, []);

  const toggleTier = (tier: string) => {
    setExpandedTiers(prev => {
      const next = new Set(prev);
      if (next.has(tier)) {
        next.delete(tier);
      } else {
        next.add(tier);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <Card className="p-6 bg-white border border-black">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="font-bold text-black">Loading audio coverage...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-white border border-black">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-bold text-black">Audio Coverage Error</div>
            <div className="text-sm mt-1 text-black">{error}</div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadCoverage}
              className="mt-2 border-black text-black"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </Card>
    );
  }

  if (!report) {
    return null;
  }

  const overallBadge = getCoverageBadge(report.overallCoverage);

  return (
    <Card className="p-6 bg-white border border-black">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Volume2 className="h-6 w-6 text-black" />
          <h2 className="text-xl font-bold text-black">Audio Coverage / Phủ sóng Audio</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadCoverage}
          className="border-black text-black"
        >
          Refresh
        </Button>
      </div>

      {/* Overall Summary */}
      <div className="mb-6 p-4 bg-gray-50 border border-black">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-black">Overall Coverage</span>
          <Badge className={overallBadge.color}>
            {report.overallCoverage}% - {overallBadge.label}
          </Badge>
        </div>
        <div className="text-sm text-black space-y-1">
          <div>Total Rooms: <span className="font-bold">{report.totalRooms}</span></div>
          <div>Total Entries: <span className="font-bold">{report.totalEntries}</span></div>
          <div>Entries with Audio: <span className="font-bold">{report.entriesWithAudio}</span> / {report.totalEntries}</div>
          <div>Missing Audio: <span className="font-bold text-red-600">{report.totalEntries - report.entriesWithAudio}</span></div>
        </div>
      </div>

      {/* By Tier */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-black mb-2">Coverage by Tier / Theo cấp độ</h3>
        
        {report.byTier.map((tierSummary) => {
          const isExpanded = expandedTiers.has(tierSummary.tier);
          const tierBadge = getCoverageBadge(tierSummary.avgCoverage);
          
          return (
            <div key={tierSummary.tier} className="border border-black">
              {/* Tier Header */}
              <button
                onClick={() => toggleTier(tierSummary.tier)}
                className="w-full p-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-black" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-black" />
                  )}
                  <span className="font-bold text-black">{tierSummary.tierLabel}</span>
                  <span className="text-sm text-black">({tierSummary.totalRooms} rooms)</span>
                </div>
                <Badge className={tierBadge.color}>
                  {tierSummary.avgCoverage}% avg
                </Badge>
              </button>

              {/* Expanded Room List */}
              {isExpanded && (
                <div className="bg-white">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr className="border-t border-black">
                        <th className="px-3 py-2 text-left text-xs font-bold text-black">Room</th>
                        <th className="px-3 py-2 text-center text-xs font-bold text-black">Entries</th>
                        <th className="px-3 py-2 text-center text-xs font-bold text-black">With Audio</th>
                        <th className="px-3 py-2 text-center text-xs font-bold text-black">Coverage</th>
                        <th className="px-3 py-2 text-center text-xs font-bold text-black">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tierSummary.rooms.map((room) => {
                        const roomBadge = getCoverageBadge(room.coveragePercent);
                        
                        return (
                          <tr key={room.roomId} className="border-t border-gray-200 hover:bg-gray-50">
                            <td className="px-3 py-2 text-sm text-black">
                              <div className="font-medium">{room.roomTitle}</div>
                              <div className="text-xs text-gray-600">{room.roomId}</div>
                              {room.missingAudioSlugs.length > 0 && (
                                <details className="mt-1">
                                  <summary className="text-xs text-red-600 cursor-pointer">
                                    {room.missingAudioSlugs.length} missing
                                  </summary>
                                  <div className="text-xs text-gray-600 mt-1 pl-4">
                                    {room.missingAudioSlugs.slice(0, 5).join(', ')}
                                    {room.missingAudioSlugs.length > 5 && ` +${room.missingAudioSlugs.length - 5} more`}
                                  </div>
                                </details>
                              )}
                            </td>
                            <td className="px-3 py-2 text-center text-sm font-medium text-black">
                              {room.totalEntries}
                            </td>
                            <td className="px-3 py-2 text-center text-sm font-medium text-black">
                              {room.audioEntries}
                            </td>
                            <td className="px-3 py-2 text-center text-sm font-bold text-black">
                              {room.coveragePercent}%
                            </td>
                            <td className="px-3 py-2 text-center">
                              <Badge className={`${roomBadge.color} text-xs`}>
                                {roomBadge.label}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
