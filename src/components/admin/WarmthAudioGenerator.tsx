import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2, Volume2, Check, AlertCircle } from 'lucide-react';

type WarmthCategory =
  | 'firstImpression'
  | 'roomEntry'
  | 'audioStart'
  | 'afterAudio'
  | 'reflectionIntro'
  | 'reflectionThanks'
  | 'returnAfterGap'
  | 'welcome';

const CATEGORY_OPTIONS: { value: WarmthCategory; label: string }[] = [
  { value: 'firstImpression', label: 'First Impression' },
  { value: 'roomEntry', label: 'Room Entry' },
  { value: 'audioStart', label: 'Audio Start' },
  { value: 'afterAudio', label: 'After Audio' },
  { value: 'reflectionIntro', label: 'Reflection Intro' },
  { value: 'reflectionThanks', label: 'Reflection Thanks' },
  { value: 'returnAfterGap', label: 'Return After Gap' },
  { value: 'welcome', label: 'Welcome (Long-form)' },
];

interface WarmthLinesData {
  [key: string]: {
    en: string[];
    vi: string[];
  };
}

export function WarmthAudioGenerator() {
  const [adminToken, setAdminToken] = useState('');
  const [category, setCategory] = useState<WarmthCategory>('firstImpression');
  const [language, setLanguage] = useState<'en' | 'vi'>('en');
  const [text, setText] = useState('');
  const [filename, setFilename] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGeneratedPath, setLastGeneratedPath] = useState<string | null>(null);
  const [warmthLines, setWarmthLines] = useState<WarmthLinesData | null>(null);

  // Load warmth lines for quick selection
  useEffect(() => {
    fetch('/data/warmth_lines_en_vi.json')
      .then(res => res.json())
      .then(data => setWarmthLines(data))
      .catch(err => console.error('Failed to load warmth lines:', err));
  }, []);

  // Auto-generate filename when category/language changes
  useEffect(() => {
    const timestamp = Date.now();
    setFilename(`${category}_${language}_${timestamp}.mp3`);
  }, [category, language]);

  // Load first line of selected category as default text
  useEffect(() => {
    if (warmthLines && warmthLines[category]) {
      const lines = warmthLines[category][language];
      if (lines && lines.length > 0) {
        setText(lines[0]);
      }
    }
  }, [category, language, warmthLines]);

  const handleGenerate = async () => {
    if (!adminToken.trim()) {
      toast({
        title: 'Admin Token Required',
        description: 'Please enter your admin token to generate audio.',
        variant: 'destructive',
      });
      return;
    }

    if (!text.trim()) {
      toast({
        title: 'Text Required',
        description: 'Please enter the text to convert to speech.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setLastGeneratedPath(null);

    try {
      const response = await supabase.functions.invoke('generate-warmth-audio', {
        body: {
          category,
          language,
          text: text.trim(),
          filename,
        },
        headers: {
          'mb-admin-token': adminToken,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const data = response.data;

      if (!data.ok) {
        throw new Error(data.error || 'Unknown error');
      }

      setLastGeneratedPath(data.publicUrl || data.filePath);
      toast({
        title: 'Audio Generated Successfully',
        description: `File: ${data.filename} (${Math.round(data.bytesGenerated / 1024)}KB)`,
      });

    } catch (error) {
      console.error('[WarmthAudioGenerator] Error:', error);
      toast({
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLoadRandomLine = () => {
    if (warmthLines && warmthLines[category]) {
      const lines = warmthLines[category][language];
      if (lines && lines.length > 0) {
        const randomIndex = Math.floor(Math.random() * lines.length);
        setText(lines[randomIndex]);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Warmth Audio Generator (OpenAI)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Admin Token */}
        <div className="space-y-2">
          <Label htmlFor="admin-token">Admin Token</Label>
          <Input
            id="admin-token"
            type="password"
            placeholder="Enter MB_ADMIN_TOKEN"
            value={adminToken}
            onChange={(e) => setAdminToken(e.target.value)}
          />
        </div>

        {/* Category Selection */}
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={category} onValueChange={(v) => setCategory(v as WarmthCategory)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Language Selection */}
        <div className="space-y-2">
          <Label>Language</Label>
          <Select value={language} onValueChange={(v) => setLanguage(v as 'en' | 'vi')}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="vi">Vietnamese</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Text Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="text">Text to Convert</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLoadRandomLine}
              disabled={!warmthLines}
            >
              Load Random Line
            </Button>
          </div>
          <Textarea
            id="text"
            placeholder="Enter the text to convert to speech..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
          />
          <p className="text-xs text-muted-foreground">
            Characters: {text.length} / 4096 max
          </p>
        </div>

        {/* Filename */}
        <div className="space-y-2">
          <Label htmlFor="filename">Filename</Label>
          <Input
            id="filename"
            placeholder="e.g. firstImpression_en_001.mp3"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
          />
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !text.trim() || !adminToken.trim()}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Volume2 className="mr-2 h-4 w-4" />
              Generate MP3
            </>
          )}
        </Button>

        {/* Result */}
        {lastGeneratedPath && (
          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-green-600">
              <Check className="h-4 w-4" />
              <span className="font-medium">Generated Successfully</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1 break-all">
              {lastGeneratedPath}
            </p>
            <audio controls src={lastGeneratedPath} className="mt-2 w-full" />
          </div>
        )}

        {/* Help Text */}
        <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">How to use:</p>
              <ol className="list-decimal list-inside mt-1 space-y-1">
                <li>Enter your MB_ADMIN_TOKEN</li>
                <li>Select category and language</li>
                <li>Edit or load a warmth line</li>
                <li>Click Generate MP3</li>
                <li>Audio will be stored in Supabase Storage</li>
              </ol>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
