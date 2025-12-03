import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Play, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface FixSuggestion {
  file: string;
  type: string;
  fix: string;
}

interface AuditResults {
  totalFiles: number;
  suggestions: FixSuggestion[];
  groupedIssues: Record<string, FixSuggestion[]>;
}

export default function AuditSafeShield() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<AuditResults | null>(null);
  const [progress, setProgress] = useState("");

  const runAudit = async () => {
    setIsRunning(true);
    setResults(null);
    const suggestions: FixSuggestion[] = [];

    try {
      // Step 1: Fetch registry.json
      setProgress("Loading registry.json...");
      let registry: any[] = [];
      try {
        const regRes = await fetch("/registry.json");
        if (regRes.ok) {
          registry = await regRes.json();
        }
      } catch {
        console.warn("Could not load registry.json");
      }

      // Step 2: Get all rooms from database
      setProgress("Loading rooms from database...");
      const { data: dbRooms } = await supabase
        .from("rooms")
        .select("id, title_en, title_vi, tier, entries");

      const dbIds = new Set(dbRooms?.map((r) => r.id) || []);
      const roomFiles: string[] = [];

      // Step 3: Get room list from database and check each
      setProgress("Analyzing room data...");
      
      if (dbRooms) {
        for (const room of dbRooms) {
          const file = `${room.id}.json`;
          roomFiles.push(file);

          // Check required fields
          if (!room.id) {
            suggestions.push({
              file,
              type: "missing_id",
              fix: `Room missing ID field`,
            });
          }

          if (!room.tier) {
            suggestions.push({
              file,
              type: "missing_tier",
              fix: `Add tier: "FREE / MIỄN PHÍ" or correct VIP tier`,
            });
          }

          if (!room.title_en || !room.title_vi) {
            suggestions.push({
              file,
              type: "missing_title",
              fix: "Add bilingual title_en and title_vi",
            });
          }

          // Parse entries
          const entries = Array.isArray(room.entries) ? room.entries : [];
          
          if (entries.length === 0) {
            suggestions.push({
              file,
              type: "empty_entries",
              fix: "Room has no entries",
            });
            continue;
          }

          // Check entry structure
          entries.forEach((entry: any, idx: number) => {
            const entryId = entry.slug || entry.artifact_id || entry.id;
            if (!entryId) {
              suggestions.push({
                file,
                type: "missing_slug",
                fix: `Entry ${idx}: add slug/artifact_id/id`,
              });
            }

            if (!entry.keywords_en && !entry.keywords_vi) {
              suggestions.push({
                file,
                type: "missing_keywords",
                fix: `Entry ${idx}: add keywords_en[] or keywords_vi[]`,
              });
            }

            // Check audio exists
            const audio = entry.audio;
            if (audio && typeof audio === "string") {
              // We'll batch check audio files later
            }
          });

          // Check registry sync
          const inRegistry = registry.find((x: any) => x.id === room.id);
          if (!inRegistry && registry.length > 0) {
            suggestions.push({
              file,
              type: "registry_missing",
              fix: `Add ${room.id} to registry.json`,
            });
          }
        }
      }

      // Step 4: Check for JSON files without DB records
      setProgress("Checking JSON file sync...");
      try {
        const manifestRes = await fetch("/room-manifest.json");
        if (manifestRes.ok) {
          const manifest = await manifestRes.json();
          const manifestIds = Object.keys(manifest);
          
          for (const id of manifestIds) {
            if (!dbIds.has(id)) {
              suggestions.push({
                file: `${id}.json`,
                type: "missing_db_record",
                fix: `Insert into database: rooms.id = ${id}`,
              });
            }
          }
        }
      } catch {
        console.warn("Could not load room-manifest.json");
      }

      // Step 5: Group results
      setProgress("Generating report...");
      const groupedIssues = suggestions.reduce((acc, s) => {
        if (!acc[s.type]) acc[s.type] = [];
        acc[s.type].push(s);
        return acc;
      }, {} as Record<string, FixSuggestion[]>);

      setResults({
        totalFiles: roomFiles.length,
        suggestions,
        groupedIssues,
      });

    } catch (error) {
      console.error("Audit error:", error);
    } finally {
      setIsRunning(false);
      setProgress("");
    }
  };

  const issueTypeLabels: Record<string, string> = {
    missing_id: "Missing ID",
    missing_tier: "Missing Tier",
    missing_title: "Missing Title",
    empty_entries: "Empty Entries",
    missing_slug: "Missing Slug",
    missing_keywords: "Missing Keywords",
    missing_audio: "Missing Audio",
    registry_missing: "Not in Registry",
    missing_db_record: "Not in Database",
    invalid_json: "Invalid JSON",
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-black" />
            <div>
              <h1 className="text-2xl font-bold text-black">
                AUDIT v4 — Safe Shield Edition
              </h1>
              <p className="text-gray-600 text-sm">
                Full Room Synchronization + Structural Auto-Fix Suggestion Engine
              </p>
            </div>
          </div>

          <Button
            onClick={runAudit}
            disabled={isRunning}
            className="bg-black text-white hover:bg-gray-800"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run Audit
              </>
            )}
          </Button>
        </div>

        {/* Progress */}
        {isRunning && progress && (
          <Card className="border border-black">
            <CardContent className="py-4">
              <div className="flex items-center gap-2 text-black">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{progress}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {results && (
          <>
            {/* Summary */}
            <Card className="border border-black">
              <CardHeader className="pb-2">
                <CardTitle className="text-black flex items-center gap-2">
                  {results.suggestions.length === 0 ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      No Issues Found
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                      {results.suggestions.length} Issues Found
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                    <div className="text-2xl font-bold text-black">
                      {results.totalFiles}
                    </div>
                    <div className="text-gray-600">Rooms Checked</div>
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                    <div className="text-2xl font-bold text-black">
                      {Object.keys(results.groupedIssues).length}
                    </div>
                    <div className="text-gray-600">Issue Types</div>
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                    <div className="text-2xl font-bold text-black">
                      {results.suggestions.length}
                    </div>
                    <div className="text-gray-600">Total Issues</div>
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                    <div className="text-2xl font-bold text-green-600">
                      {results.totalFiles - new Set(results.suggestions.map(s => s.file)).size}
                    </div>
                    <div className="text-gray-600">Clean Rooms</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Issue Groups */}
            {results.suggestions.length > 0 && (
              <Card className="border border-black">
                <CardHeader>
                  <CardTitle className="text-black">Issue Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-6">
                      {Object.entries(results.groupedIssues).map(([type, items]) => (
                        <div key={type} className="space-y-2">
                          <h3 className="font-bold text-black flex items-center gap-2">
                            <span className="px-2 py-1 bg-black text-white text-xs rounded">
                              {issueTypeLabels[type] || type}
                            </span>
                            <span className="text-gray-500">({items.length})</span>
                          </h3>
                          <div className="space-y-1 pl-4 border-l-2 border-gray-200">
                            {items.map((item, idx) => (
                              <div
                                key={idx}
                                className="text-sm py-1 flex items-start gap-2"
                              >
                                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-black">
                                  {item.file}
                                </code>
                                <span className="text-gray-600">→</span>
                                <span className="text-gray-700">{item.fix}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {/* Safe Mode Notice */}
            <div className="p-4 bg-gray-100 border border-gray-300 rounded text-center">
              <p className="text-black font-medium">
                🛑 SAFE MODE: No changes were made.
              </p>
              <p className="text-gray-600 text-sm mt-1">
                Review the suggestions above and apply fixes manually or request AUTO-APPLY mode.
              </p>
            </div>
          </>
        )}

        {/* Initial State */}
        {!isRunning && !results && (
          <Card className="border border-black">
            <CardContent className="py-12 text-center">
              <Shield className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-bold text-black mb-2">
                Ready to Audit
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Click "Run Audit" to perform a full cross-system sync check between
                JSON files, database records, and registry entries.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
