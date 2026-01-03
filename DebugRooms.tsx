import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Music, FileText } from "lucide-react";

interface AudioCheck {
  path: string;
  exists: boolean;
}

interface RoomIssue {
  roomFile: string;
  issues: string[];
  warnings: string[];
  audioFiles: AudioCheck[];
  hasKeywordsEn: boolean;
  hasKeywordsVi: boolean;
  entryCount: number;
}

interface RoomJson {
  keywords_en?: string[];
  keywords_vi?: string[];
  entries?: Array<{
    audio?: string | { en?: string };
  }>;
}

export default function DebugRooms() {
  const [results, setResults] = useState<RoomIssue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    void checkAllRooms();
  }, []);

  async function checkAllRooms(): Promise<void> {
    setLoading(true);

    const tiers = ["free", "vip1", "vip2", "vip3"];
    const roomBases = [
      "philosophy_of_everyday",
      "stoicism",
      "women_health",
      "meaning_of_life",
      "nutrition",
      "obesity",
      "stress",
      "sleep",
      "confidence",
      "soulmate",
      "mental_health",
      "shadow_work",
    ];

    const roomFiles: string[] = [];

    for (const base of roomBases) {
      for (const tier of tiers) {
        roomFiles.push(`${base}_${tier}.json`);
      }
    }

    const uniqueFiles = Array.from(new Set(roomFiles));
    const issuesFound: RoomIssue[] = [];

    for (const file of uniqueFiles) {
      try {
        const res = await fetch(`/${file}`);
        if (!res.ok) continue;

        const data = (await res.json()) as RoomJson;

        const issues: string[] = [];
        const warnings: string[] = [];
        const audioFiles: AudioCheck[] = [];

        const hasKeywordsEn = Boolean(data.keywords_en?.length);
        const hasKeywordsVi = Boolean(data.keywords_vi?.length);

        if (!hasKeywordsEn) {
          issues.push("Missing keywords_en at top level");
        }
        if (!hasKeywordsVi) {
          warnings.push("Missing keywords_vi at top level");
        }

        const entries = data.entries ?? [];

        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i];

          let audioPath = "";
          if (typeof entry.audio === "string") {
            audioPath = entry.audio;
          } else if (entry.audio?.en) {
            audioPath = entry.audio.en;
          }

          if (!audioPath) {
            warnings.push(`Entry ${i} has no audio`);
            continue;
          }

          const normalizedPath = audioPath.startsWith("/")
            ? audioPath
            : `/${audioPath}`;

          try {
            const audioRes = await fetch(normalizedPath, { method: "HEAD" });
            audioFiles.push({
              path: normalizedPath,
              exists: audioRes.ok,
            });

            if (!audioRes.ok) {
              issues.push(`Audio not found: ${normalizedPath}`);
            }
          } catch {
            audioFiles.push({ path: normalizedPath, exists: false });
            issues.push(`Audio check failed: ${normalizedPath}`);
          }
        }

        if (issues.length || warnings.length) {
          issuesFound.push({
            roomFile: file,
            issues,
            warnings,
            audioFiles,
            hasKeywordsEn,
            hasKeywordsVi,
            entryCount: entries.length,
          });
        }
      } catch {
        // silently skip invalid JSON or missing files
      }
    }

    setResults(issuesFound);
    setLoading(false);
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Room Health Check</h1>
        <p className="text-muted-foreground">
          Automated scan of room JSON files
        </p>
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-12 text-center">
            Scanning rooms…
          </CardContent>
        </Card>
      ) : results.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
            All rooms are healthy.
          </CardContent>
        </Card>
      ) : (
        results.map((result) => (
          <Card key={result.roomFile}>
            <CardHeader>
              <CardTitle>{result.roomFile}</CardTitle>
              <CardDescription>
                {result.entryCount} entries
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.issues.map((issue) => (
                <p key={issue} className="text-red-600 flex gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {issue}
                </p>
              ))}

              {result.warnings.map((warning) => (
                <p key={warning} className="text-orange-600 flex gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {warning}
                </p>
              ))}

              <div className="flex gap-2">
                <Badge variant="outline">
                  <FileText className="w-3 h-3 mr-1" />
                  EN keywords: {result.hasKeywordsEn ? "OK" : "Missing"}
                </Badge>
                <Badge variant="outline">
                  <FileText className="w-3 h-3 mr-1" />
                  VI keywords: {result.hasKeywordsVi ? "OK" : "Missing"}
                </Badge>
              </div>

              {result.audioFiles.map((audio) => (
                <div key={audio.path} className="flex items-center gap-2">
                  {audio.exists ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  <Music className="w-4 h-4" />
                  <code className="text-xs">{audio.path}</code>
                </div>
              ))}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
