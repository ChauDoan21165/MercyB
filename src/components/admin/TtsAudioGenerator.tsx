import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Volume2, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TtsAudioGeneratorProps {
  slug: string;
  initialTextEn?: string;
  initialTextVi?: string;
  onAudioGenerated?: (kind: string, language: string, filename: string) => void;
}

type AudioKind = 'content' | 'reflection' | 'dare' | 'welcome' | 'intro';

export function TtsAudioGenerator({ 
  slug, 
  initialTextEn = '', 
  initialTextVi = '',
  onAudioGenerated 
}: TtsAudioGeneratorProps) {
  const { toast } = useToast();
  const [generating, setGenerating] = useState<string | null>(null);
  const [generatedFiles, setGeneratedFiles] = useState<Set<string>>(new Set());
  
  const [textEn, setTextEn] = useState(initialTextEn);
  const [textVi, setTextVi] = useState(initialTextVi);
  const [selectedKind, setSelectedKind] = useState<AudioKind>('content');
  const [adminToken, setAdminToken] = useState('');

  const generateAudio = async (language: 'en' | 'vi', kind: AudioKind) => {
    const text = language === 'en' ? textEn : textVi;
    
    if (!text.trim()) {
      toast({
        title: 'Error',
        description: `No ${language.toUpperCase()} text provided`,
        variant: 'destructive',
      });
      return;
    }

    if (!adminToken) {
      toast({
        title: 'Error',
        description: 'Admin token required',
        variant: 'destructive',
      });
      return;
    }

    const filename = kind === 'welcome' 
      ? `${slug}_welcome_${language}.mp3`
      : `${slug}_${kind}_${language}.mp3`;
    
    const key = `${kind}_${language}`;
    setGenerating(key);

    try {
      const response = await supabase.functions.invoke('generate-room-audio', {
        body: {
          slug,
          kind,
          language,
          text,
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
        throw new Error(data.error || 'Generation failed');
      }

      setGeneratedFiles(prev => new Set([...prev, key]));
      
      toast({
        title: 'Audio Generated',
        description: `${filename} created successfully (${Math.round(data.bytesGenerated / 1024)}KB)`,
      });

      onAudioGenerated?.(kind, language, filename);

    } catch (error) {
      console.error('TTS generation error:', error);
      toast({
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setGenerating(null);
    }
  };

  const AudioButton = ({ language, kind, label }: { language: 'en' | 'vi'; kind: AudioKind; label: string }) => {
    const key = `${kind}_${language}`;
    const isGenerating = generating === key;
    const isGenerated = generatedFiles.has(key);
    
    return (
      <Button
        size="sm"
        variant={isGenerated ? 'default' : 'outline'}
        onClick={() => generateAudio(language, kind)}
        disabled={!!generating}
        className="gap-2"
      >
        {isGenerating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isGenerated ? (
          <Check className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
        {label}
      </Button>
    );
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Generate Audio (OpenAI TTS)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Admin Token */}
        <div className="space-y-2">
          <Label htmlFor="admin-token">Admin Token (MB_ADMIN_TOKEN)</Label>
          <Input
            id="admin-token"
            type="password"
            value={adminToken}
            onChange={(e) => setAdminToken(e.target.value)}
            placeholder="Enter admin token..."
          />
        </div>

        {/* Audio Kind Selector */}
        <div className="space-y-2">
          <Label>Audio Type</Label>
          <Select value={selectedKind} onValueChange={(v) => setSelectedKind(v as AudioKind)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="content">Content / Intro</SelectItem>
              <SelectItem value="reflection">Reflection</SelectItem>
              <SelectItem value="dare">Dare / Challenge</SelectItem>
              <SelectItem value="welcome">Welcome (Vietnamese)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* English Text */}
        <div className="space-y-2">
          <Label htmlFor="text-en">English Text</Label>
          <Textarea
            id="text-en"
            value={textEn}
            onChange={(e) => setTextEn(e.target.value)}
            placeholder="Enter English text to convert to speech..."
            rows={4}
          />
          <div className="flex gap-2">
            <AudioButton language="en" kind={selectedKind} label={`Generate EN ${selectedKind}`} />
          </div>
        </div>

        {/* Vietnamese Text */}
        <div className="space-y-2">
          <Label htmlFor="text-vi">Vietnamese Text</Label>
          <Textarea
            id="text-vi"
            value={textVi}
            onChange={(e) => setTextVi(e.target.value)}
            placeholder="Nhập văn bản tiếng Việt để chuyển thành giọng nói..."
            rows={4}
          />
          <div className="flex gap-2">
            <AudioButton language="vi" kind={selectedKind} label={`Generate VI ${selectedKind}`} />
            <AudioButton language="vi" kind="welcome" label="Generate VI Welcome" />
          </div>
        </div>

        {/* Slug Info */}
        <div className="text-xs text-muted-foreground">
          Slug: <code className="bg-muted px-1 rounded">{slug}</code>
          <br />
          Files will be saved to: <code className="bg-muted px-1 rounded">/audio/paths/{slug}_*.mp3</code>
        </div>
      </CardContent>
    </Card>
  );
}
