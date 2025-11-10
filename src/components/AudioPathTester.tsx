import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AudioPlayer } from "./AudioPlayer";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const AudioPathTester = () => {
  const [audioPath, setAudioPath] = useState("/audio/Starting_Balanced_Meal_Planning_Free.mp3");
  const [testResult, setTestResult] = useState<'idle' | 'success' | 'error' | 'testing'>('idle');
  const [errorDetails, setErrorDetails] = useState<string>("");
  const [fileInfo, setFileInfo] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const testAudioPath = async () => {
    setTestResult('testing');
    setErrorDetails("");
    setFileInfo(null);

    try {
      // Try HEAD request first
      const headResponse = await fetch(audioPath, { method: 'HEAD' });
      
      if (!headResponse.ok) {
        setTestResult('error');
        setErrorDetails(`HTTP ${headResponse.status}: ${headResponse.statusText}`);
        return;
      }

      // Get file info
      const contentType = headResponse.headers.get('content-type');
      const contentLength = headResponse.headers.get('content-length');
      
      setFileInfo({
        contentType,
        contentLength: contentLength ? `${(parseInt(contentLength) / 1024).toFixed(2)} KB` : 'Unknown',
        status: headResponse.status
      });

      // Try to create audio element to verify playability
      const audio = new Audio();
      
      audio.addEventListener('canplay', () => {
        setTestResult('success');
      });

      audio.addEventListener('error', (e: any) => {
        setTestResult('error');
        setErrorDetails(`Audio element error: ${e.message || 'Failed to load audio'}`);
      });

      audio.src = audioPath;
      audio.load();

      // Timeout after 5 seconds
      setTimeout(() => {
        if (testResult === 'testing') {
          setTestResult('error');
          setErrorDetails('Timeout: Audio took too long to load');
        }
      }, 5000);

    } catch (error) {
      setTestResult('error');
      setErrorDetails(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const commonPaths = [
    "/audio/Starting_Balanced_Meal_Planning_Free.mp3",
    "/audio/Building_Hydration_Habits_Free.mp3",
    "/audio/Trying_Mindful_Eating_Free.mp3",
    "Starting_Balanced_Meal_Planning_Free.mp3",
    "audio/Starting_Balanced_Meal_Planning_Free.mp3"
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold">Audio Path Tester</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Test if audio files are accessible and playable
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="audio-path">Audio Path</Label>
          <div className="flex gap-2">
            <Input
              id="audio-path"
              value={audioPath}
              onChange={(e) => setAudioPath(e.target.value)}
              placeholder="/audio/filename.mp3"
              className="flex-1"
            />
            <Button onClick={testAudioPath} disabled={testResult === 'testing'}>
              {testResult === 'testing' ? 'Testing...' : 'Test'}
            </Button>
          </div>
        </div>

        {/* Common paths quick select */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Quick Test Paths:</Label>
          <div className="flex flex-wrap gap-2">
            {commonPaths.map((path) => (
              <Button
                key={path}
                variant="outline"
                size="sm"
                onClick={() => setAudioPath(path)}
                className="text-xs"
              >
                {path}
              </Button>
            ))}
          </div>
        </div>

        {/* Test Result */}
        {testResult !== 'idle' && (
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center gap-2">
              {testResult === 'success' && (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium text-green-700">Audio file accessible</span>
                </>
              )}
              {testResult === 'error' && (
                <>
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="font-medium text-red-700">Audio file failed</span>
                </>
              )}
              {testResult === 'testing' && (
                <>
                  <AlertCircle className="h-5 w-5 text-blue-500 animate-pulse" />
                  <span className="font-medium text-blue-700">Testing...</span>
                </>
              )}
            </div>

            {fileInfo && (
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Type: {fileInfo.contentType || 'Unknown'}</Badge>
                  <Badge variant="outline">Size: {fileInfo.contentLength}</Badge>
                  <Badge variant="outline">Status: {fileInfo.status}</Badge>
                </div>
              </div>
            )}

            {errorDetails && (
              <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950/20 p-3 rounded border border-red-200 dark:border-red-800">
                <strong>Error:</strong> {errorDetails}
              </div>
            )}
          </div>
        )}

        {/* Audio Player */}
        {testResult === 'success' && (
          <div className="pt-4 border-t">
            <Label className="text-sm font-medium mb-2 block">Test Playback:</Label>
            <AudioPlayer
              audioPath={audioPath}
              isPlaying={isPlaying}
              onPlayPause={() => setIsPlaying(!isPlaying)}
              onEnded={() => setIsPlaying(false)}
            />
          </div>
        )}
      </Card>

      {/* Debug Info */}
      <Card className="p-4">
        <h3 className="font-medium mb-2">Debug Information</h3>
        <div className="space-y-2 text-sm font-mono">
          <div>
            <span className="text-muted-foreground">Full Path:</span>{" "}
            <code className="bg-muted px-2 py-1 rounded">{audioPath}</code>
          </div>
          <div>
            <span className="text-muted-foreground">Resolved URL:</span>{" "}
            <code className="bg-muted px-2 py-1 rounded break-all">
              {window.location.origin}{audioPath}
            </code>
          </div>
        </div>
      </Card>
    </div>
  );
};
