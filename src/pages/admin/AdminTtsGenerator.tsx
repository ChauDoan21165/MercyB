import { useState } from 'react';
import { TtsAudioGenerator } from '@/components/admin/TtsAudioGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminTtsGenerator() {
  const [slug, setSlug] = useState('calm_mind_7_day1');

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">TTS Audio Generator</h1>
          <p className="text-muted-foreground">Generate MP3 audio files using OpenAI TTS</p>
        </div>

        {/* Slug Input */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Room / Path Slug</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (used for filename)</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g., calm_mind_7_day1"
              />
              <p className="text-xs text-muted-foreground">
                This determines the filename pattern: {slug}_content_en.mp3, {slug}_reflection_vi.mp3, etc.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* TTS Generator */}
        <TtsAudioGenerator
          slug={slug}
          onAudioGenerated={(kind, language, filename) => {
            console.log(`Generated: ${filename}`);
          }}
        />

        {/* Instructions */}
        <Card className="border-border bg-muted/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p><strong>1.</strong> Set the slug for the room/path you want to generate audio for</p>
            <p><strong>2.</strong> Enter your MB_ADMIN_TOKEN (from environment variables)</p>
            <p><strong>3.</strong> Select the audio type (content, reflection, dare, welcome)</p>
            <p><strong>4.</strong> Paste the English and/or Vietnamese text</p>
            <p><strong>5.</strong> Click the generate button for each language</p>
            <p className="pt-2 border-t border-border">
              <strong>Note:</strong> Generated files are saved to Supabase Storage in the <code>audio</code> bucket.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
