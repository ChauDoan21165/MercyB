import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, AlertCircle, CheckCircle2, Music, FileSearch2 } from "lucide-react";

type AuditResult = {
  missingFiles: string[];
  unusedFiles: string[];
  referencedFiles: string[];
  existingFiles: string[];
};

const AudioAssetAuditor = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);

  const runAudit = async () => {
    setLoading(true);
    try {
      // 1. Collect all audio filenames referenced in rooms entries
      const { data: rooms, error: roomError } = await supabase
        .from("rooms")
        .select("id, entries");

      if (roomError) throw roomError;

      const referenced = new Set<string>();

      (rooms || []).forEach((room) => {
        if (!room.entries) return;
        try {
          const entries = Array.isArray(room.entries) ? room.entries : [];
          entries.forEach((entry: any) => {
            const audio = entry?.audio;
            if (typeof audio === "string" && audio.trim()) {
              referenced.add(audio.trim());
            }
          });
        } catch (err) {
          console.warn("Error parsing entries for room", room.id, err);
        }
      });

      const referencedFiles = Array.from(referenced);

      // 2. List all audio files in storage bucket "room-audio"
      const { data: storageFiles, error: storageError } = await supabase.storage
        .from("room-audio")
        .list("", { limit: 10000, offset: 0 });

      if (storageError) throw storageError;

      const existingFiles = (storageFiles || []).map((f) => f.name);

      // 3. Compare
      const missingFiles = referencedFiles.filter(
        (f) => !existingFiles.includes(f)
      );
      const unusedFiles = existingFiles.filter(
        (f) => !referencedFiles.includes(f)
      );

      setResult({
        missingFiles,
        unusedFiles,
        referencedFiles,
        existingFiles,
      });

      toast({
        title: "Audio audit complete",
        description: `Missing: ${missingFiles.length}, Unused: ${unusedFiles.length}`,
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Audio audit failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto max-w-5xl px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Audio Asset Auditor</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Compare all JSON-referenced audio filenames with actual files in the
              "room-audio" bucket.
            </p>
          </div>
          <Button size="sm" onClick={runAudit} disabled={loading}>
            <RefreshCw
              className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`}
            />
            Run Audit
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Music className="h-4 w-4" />
              Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            {!result && (
              <p className="text-muted-foreground">
                No audit run yet. Click &quot;Run Audit&quot; to start.
              </p>
            )}
            {result && (
              <>
                <p>
                  <CheckCircle2 className="inline h-4 w-4 mr-1 text-green-500" />
                  Referenced files: <strong>{result.referencedFiles.length}</strong>
                </p>
                <p>
                  <FileSearch2 className="inline h-4 w-4 mr-1 text-muted-foreground" />
                  Files in bucket: <strong>{result.existingFiles.length}</strong>
                </p>
                <p>
                  <AlertCircle className="inline h-4 w-4 mr-1 text-red-500" />
                  Missing:{" "}
                  <strong className="text-red-600">
                    {result.missingFiles.length}
                  </strong>
                </p>
                <p>
                  <AlertCircle className="inline h-4 w-4 mr-1 text-yellow-500" />
                  Unused:{" "}
                  <strong className="text-yellow-600">
                    {result.unusedFiles.length}
                  </strong>
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Missing files ({result.missingFiles.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-72 overflow-auto text-xs">
                {result.missingFiles.length === 0 ? (
                  <p className="text-muted-foreground">None 🎉</p>
                ) : (
                  <ul className="list-disc pl-4 space-y-1">
                    {result.missingFiles.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Unused files ({result.unusedFiles.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-72 overflow-auto text-xs">
                {result.unusedFiles.length === 0 ? (
                  <p className="text-muted-foreground">None 🎉</p>
                ) : (
                  <ul className="list-disc pl-4 space-y-1">
                    {result.unusedFiles.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AudioAssetAuditor;
