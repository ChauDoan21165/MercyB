import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2, Search, Volume2, Check, X, AlertCircle, SkipForward } from 'lucide-react';
import type { AudioTask, BatchScanResult, BatchGenerateResult } from '@/lib/audioSchema';

type ScanScope = 'all' | 'calm-mind-only' | 'paths-only' | 'custom';

export default function AdminAudioBatch() {
  const [adminToken, setAdminToken] = useState('');
  const [scope, setScope] = useState<ScanScope>('paths-only');
  const [slugPrefix, setSlugPrefix] = useState('');
  
  const [isScanning, setIsScanning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [scanResult, setScanResult] = useState<BatchScanResult | null>(null);
  const [generateResult, setGenerateResult] = useState<BatchGenerateResult | null>(null);
  
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

  const handleScan = async () => {
    if (!adminToken.trim()) {
      toast({ title: 'Admin token required', variant: 'destructive' });
      return;
    }

    setIsScanning(true);
    setScanResult(null);
    setGenerateResult(null);

    try {
      const response = await supabase.functions.invoke('audio-batch-scan', {
        body: { scope, slugPrefix: scope === 'custom' ? slugPrefix : undefined },
        headers: { 'mb-admin-token': adminToken },
      });

      if (response.error) throw new Error(response.error.message);
      
      const data = response.data as BatchScanResult;
      if (!data.ok) throw new Error(data.error || 'Scan failed');

      setScanResult(data);
      toast({
        title: 'Scan Complete',
        description: `Found ${data.tasks.length} missing audio files`,
      });
    } catch (error) {
      toast({
        title: 'Scan Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleGenerate = async () => {
    if (!scanResult?.tasks.length) return;
    setShowConfirmDialog(false);
    setIsGenerating(true);
    setCurrentTaskIndex(0);
    setGenerateResult(null);

    const allResults: BatchGenerateResult['results'] = [];
    const tasks = scanResult.tasks;
    const batchSize = 50;

    try {
      // Process in batches of 50
      for (let i = 0; i < tasks.length; i += batchSize) {
        const batch = tasks.slice(i, i + batchSize);
        setCurrentTaskIndex(i);

        const response = await supabase.functions.invoke('audio-batch-generate', {
          body: { tasks: batch },
          headers: { 'mb-admin-token': adminToken },
        });

        if (response.error) throw new Error(response.error.message);

        const data = response.data as BatchGenerateResult;
        if (!data.ok) throw new Error('Generation failed');

        allResults.push(...data.results);
      }

      // Calculate summary
      const summary = {
        success: allResults.filter(r => r.status === 'success').length,
        skipped: allResults.filter(r => r.status === 'skipped_exists').length,
        errors: allResults.filter(r => r.status === 'error').length,
      };

      setGenerateResult({ ok: true, results: allResults, summary });
      toast({
        title: 'Generation Complete',
        description: `${summary.success} generated, ${summary.skipped} skipped, ${summary.errors} errors`,
      });

    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500"><Check className="w-3 h-3 mr-1" />Success</Badge>;
      case 'skipped_exists':
        return <Badge variant="secondary"><SkipForward className="w-3 h-3 mr-1" />Skipped</Badge>;
      case 'error':
        return <Badge variant="destructive"><X className="w-3 h-3 mr-1" />Error</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl space-y-6">
      <h1 className="text-2xl font-bold">Batch Audio Generator</h1>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Scan for Missing Audio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Admin Token</Label>
              <Input
                type="password"
                placeholder="MB_ADMIN_TOKEN"
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Scope</Label>
              <Select value={scope} onValueChange={(v) => setScope(v as ScanScope)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paths-only">All Paths</SelectItem>
                  <SelectItem value="calm-mind-only">Calm Mind Only</SelectItem>
                  <SelectItem value="custom">Custom Prefix</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {scope === 'custom' && (
              <div className="space-y-2 md:col-span-2">
                <Label>Slug Prefix</Label>
                <Input
                  placeholder="e.g. calm-mind"
                  value={slugPrefix}
                  onChange={(e) => setSlugPrefix(e.target.value)}
                />
              </div>
            )}
          </div>

          <Button onClick={handleScan} disabled={isScanning || !adminToken.trim()}>
            {isScanning ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Scanning...</>
            ) : (
              <><Search className="mr-2 h-4 w-4" />Scan for Missing Audio</>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Scan Results Summary */}
      {scanResult && (
        <Card>
          <CardHeader>
            <CardTitle>Scan Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-muted rounded-lg text-center">
                <div className="text-2xl font-bold">{scanResult.summary?.total || 0}</div>
                <div className="text-sm text-muted-foreground">Total Missing</div>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <div className="text-2xl font-bold">{scanResult.summary?.byLang.en || 0}</div>
                <div className="text-sm text-muted-foreground">English</div>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <div className="text-2xl font-bold">{scanResult.summary?.byLang.vi || 0}</div>
                <div className="text-sm text-muted-foreground">Vietnamese</div>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <div className="text-2xl font-bold">{scanResult.summary?.estimatedChars?.toLocaleString() || 0}</div>
                <div className="text-sm text-muted-foreground">Characters</div>
              </div>
            </div>

            {/* Breakdown by kind */}
            {scanResult.summary?.byKind && Object.keys(scanResult.summary.byKind).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {Object.entries(scanResult.summary.byKind).map(([key, count]) => (
                  <Badge key={key} variant="outline">
                    {key}: {count}
                  </Badge>
                ))}
              </div>
            )}

            {/* Cost estimate */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">
                  Estimated cost: ${scanResult.summary?.estimatedCostUsd?.toFixed(2) || '0.00'} USD
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Based on OpenAI TTS pricing ($0.015 / 1,000 characters)
              </p>
            </div>

            {/* Generate button */}
            {scanResult.tasks.length > 0 && (
              <Button
                onClick={() => setShowConfirmDialog(true)}
                disabled={isGenerating}
                className="w-full"
              >
                <Volume2 className="mr-2 h-4 w-4" />
                Generate All Missing Audio ({scanResult.tasks.length} files)
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Generation Progress */}
      {isGenerating && (
        <Card>
          <CardHeader>
            <CardTitle>Generating Audio...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={(currentTaskIndex / (scanResult?.tasks.length || 1)) * 100} />
            <p className="text-sm text-muted-foreground text-center">
              Processing task {currentTaskIndex + 1} of {scanResult?.tasks.length || 0}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Generation Results */}
      {generateResult && (
        <Card>
          <CardHeader>
            <CardTitle>Generation Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{generateResult.summary?.success || 0}</div>
                <div className="text-sm">Success</div>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <div className="text-2xl font-bold">{generateResult.summary?.skipped || 0}</div>
                <div className="text-sm">Skipped</div>
              </div>
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600">{generateResult.summary?.errors || 0}</div>
                <div className="text-sm">Errors</div>
              </div>
            </div>

            {/* Results table */}
            <div className="max-h-96 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Filename</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Error</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {generateResult.results.map((result, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-mono text-xs">{result.filename}</TableCell>
                      <TableCell>{getStatusBadge(result.status)}</TableCell>
                      <TableCell className="text-xs text-red-500">{result.error || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tasks Preview */}
      {scanResult && scanResult.tasks.length > 0 && !generateResult && (
        <Card>
          <CardHeader>
            <CardTitle>Missing Audio Tasks ({scanResult.tasks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Path</TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead>Kind</TableHead>
                    <TableHead>Lang</TableHead>
                    <TableHead>Filename</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scanResult.tasks.slice(0, 100).map((task, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{task.slug}</TableCell>
                      <TableCell>{task.day_index}</TableCell>
                      <TableCell><Badge variant="outline">{task.kind}</Badge></TableCell>
                      <TableCell><Badge variant="secondary">{task.lang.toUpperCase()}</Badge></TableCell>
                      <TableCell className="font-mono text-xs">{task.suggestedFilename}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {scanResult.tasks.length > 100 && (
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Showing first 100 of {scanResult.tasks.length} tasks
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Generate Missing Audio?</AlertDialogTitle>
            <AlertDialogDescription>
              This will call OpenAI TTS for <strong>{scanResult?.tasks.length || 0}</strong> items.
              <br /><br />
              Estimated cost: <strong>${scanResult?.summary?.estimatedCostUsd?.toFixed(2) || '0.00'} USD</strong>
              <br />
              Total characters: <strong>{scanResult?.summary?.estimatedChars?.toLocaleString() || 0}</strong>
              <br /><br />
              Existing audio files will NOT be overwritten.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleGenerate}>
              Generate Audio
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
