import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Music, FileText } from "lucide-react";

interface RoomIssue {
  roomFile: string;
  issues: string[];
  warnings: string[];
  audioFiles: { path: string; exists: boolean }[];
  hasKeywordsEn: boolean;
  hasKeywordsVi: boolean;
  entryCount: number;
}

export default function DebugRooms() {
  const [results, setResults] = useState<RoomIssue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAllRooms();
  }, []);

  const checkAllRooms = async () => {
    setLoading(true);
    const roomFiles: string[] = [];
    
    // Scan public directory for JSON files
    const tiers = ['free', 'vip1', 'vip2', 'vip3'];
    const roomBases = [
      'philosophy_of_everyday', 'stoicism', 'women_health', 'meaning_of_life',
      'God With Us', 'nutrition', 'obesity', 'stress', 'Sleep', 'sleep',
      'confidence', 'soulmate', 'mental_health', 'AI', 'Human Right',
      'Mental Health', 'Mental SharpnessVIP3', 'Shadow Work'
    ];

    // Build list of expected files
    for (const base of roomBases) {
      for (const tier of tiers) {
        const variants = [
          `${base}_${tier}.json`,
          `${base}_${tier.toUpperCase()}.json`,
          `${base.replace(/_/g, ' ')}_${tier}.json`,
          `${base.replace(/_/g, ' ')}_${tier === 'free' ? 'Free' : tier.toUpperCase()}.json`,
        ];
        roomFiles.push(...variants);
      }
    }

    const uniqueFiles = [...new Set(roomFiles)];
    const issuesFound: RoomIssue[] = [];

    for (const file of uniqueFiles) {
      try {
        const res = await fetch(`/${file}`);
        if (!res.ok) continue;

        const data = await res.json();
        const issues: string[] = [];
        const warnings: string[] = [];
        const audioFiles: { path: string; exists: boolean }[] = [];

        // Check for keywords
        const hasKeywordsEn = !!(data.keywords_en && data.keywords_en.length > 0);
        const hasKeywordsVi = !!(data.keywords_vi && data.keywords_vi.length > 0);

        if (!hasKeywordsEn) {
          issues.push('Missing keywords_en at top level');
        }
        if (!hasKeywordsVi) {
          warnings.push('Missing keywords_vi at top level');
        }

        // Check entries
        const entries = data.entries || [];
        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i];
          
          // Extract audio path
          let audioPath = '';
          if (typeof entry.audio === 'string') {
            audioPath = entry.audio;
          } else if (entry.audio?.en) {
            audioPath = entry.audio.en;
          }

          if (audioPath) {
            // Normalize path
            const normalizedPath = audioPath.startsWith('/') ? audioPath : `/${audioPath}`;
            
            // Check if audio file exists
            try {
              const audioRes = await fetch(normalizedPath, { method: 'HEAD' });
              audioFiles.push({
                path: normalizedPath,
                exists: audioRes.ok
              });
              
              if (!audioRes.ok) {
                issues.push(`Audio not found: ${normalizedPath}`);
              }
            } catch {
              audioFiles.push({ path: normalizedPath, exists: false });
              issues.push(`Audio check failed: ${normalizedPath}`);
            }
          } else {
            warnings.push(`Entry ${i} has no audio field`);
          }
        }

        if (issues.length > 0 || warnings.length > 0 || !hasKeywordsEn || !hasKeywordsVi) {
          issuesFound.push({
            roomFile: file,
            issues,
            warnings,
            audioFiles,
            hasKeywordsEn,
            hasKeywordsVi,
            entryCount: entries.length
          });
        }
      } catch (error) {
        // File doesn't exist or invalid JSON - skip silently
      }
    }

    setResults(issuesFound);
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Room Health Check</h1>
        <p className="text-muted-foreground">
          Automated scan of all room JSON files for audio and keyword issues
        </p>
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-pulse">Scanning all rooms...</div>
          </CardContent>
        </Card>
      ) : results.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
            <p className="text-lg font-medium">All rooms are healthy!</p>
            <p className="text-sm text-muted-foreground mt-2">
              No missing audio files or keyword issues detected
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <p className="text-sm font-medium">
              Found {results.length} room(s) with issues
            </p>
          </div>

          {results.map((result, idx) => (
            <Card key={idx} className="border-orange-200 dark:border-orange-800">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{result.roomFile}</CardTitle>
                    <CardDescription>
                      {result.entryCount} entries • {result.audioFiles.length} audio files
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {result.hasKeywordsEn ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <FileText className="w-3 h-3 mr-1" />
                        EN Keywords
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        <FileText className="w-3 h-3 mr-1" />
                        No EN Keywords
                      </Badge>
                    )}
                    {result.hasKeywordsVi ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <FileText className="w-3 h-3 mr-1" />
                        VI Keywords
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        <FileText className="w-3 h-3 mr-1" />
                        No VI Keywords
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.issues.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-red-600 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Critical Issues ({result.issues.length})
                    </h4>
                    <ul className="space-y-1 text-sm">
                      {result.issues.map((issue, i) => (
                        <li key={i} className="pl-6 text-red-600">• {issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.warnings.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-orange-600 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Warnings ({result.warnings.length})
                    </h4>
                    <ul className="space-y-1 text-sm">
                      {result.warnings.map((warning, i) => (
                        <li key={i} className="pl-6 text-orange-600">• {warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.audioFiles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Music className="w-4 h-4" />
                      Audio Files ({result.audioFiles.length})
                    </h4>
                    <div className="grid grid-cols-1 gap-1 text-xs">
                      {result.audioFiles.map((audio, i) => (
                        <div key={i} className="flex items-center gap-2 pl-6">
                          {audio.exists ? (
                            <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                          ) : (
                            <AlertCircle className="w-3 h-3 text-red-500 flex-shrink-0" />
                          )}
                          <code className={audio.exists ? 'text-green-700' : 'text-red-700'}>
                            {audio.path}
                          </code>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
