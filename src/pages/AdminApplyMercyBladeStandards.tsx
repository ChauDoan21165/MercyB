import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle, AlertTriangle, XCircle, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MERCY_BLADE_STANDARDS, validateMercyBladeStandards } from '@/lib/mercyBladeStandards';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * ADMIN TOOL: Apply Mercy Blade Standards
 * 
 * This page reminds the AI of ALL universal room standards and validates rooms.
 * Use this whenever you need to ensure consistency across ALL room tiers.
 */

const AdminApplyMercyBladeStandards = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [validationResults, setValidationResults] = useState<any[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  const validateAllKidsRooms = async () => {
    setIsValidating(true);
    const results: any[] = [];

    try {
      // Load all kids room files from public/data/
      const kidsRooms = [
        'alphabet_adventure_kids_l1',
        'level1-alphabet-adventure'
        // Add more room IDs as they're created
      ];

      for (const roomId of kidsRooms) {
        try {
          const response = await fetch(`/data/${roomId}.json`);
          if (!response.ok) {
            results.push({
              roomId,
              status: 'error',
              message: 'File not found'
            });
            continue;
          }

          const roomData = await response.json();
          const validation = validateMercyBladeStandards(roomData);

          results.push({
            roomId,
            status: validation.valid ? 'valid' : 'invalid',
            errors: validation.errors,
            warnings: validation.warnings,
            data: roomData
          });
        } catch (error) {
          results.push({
            roomId,
            status: 'error',
            message: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      setValidationResults(results);
      
      const validCount = results.filter(r => r.status === 'valid').length;
      const invalidCount = results.filter(r => r.status === 'invalid').length;
      const errorCount = results.filter(r => r.status === 'error').length;

      toast({
        title: 'Validation Complete',
        description: `Valid: ${validCount} | Issues: ${invalidCount} | Errors: ${errorCount}`,
      });
    } catch (error) {
      toast({
        title: 'Validation Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8">
      <div className="max-w-6xl mx-auto px-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/dashboard')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin
          </Button>
        </div>

        <div>
          <h1 className="text-4xl font-bold mb-2 bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent">
            Mercy Blade Universal Standards
          </h1>
          <p className="text-muted-foreground">
            Complete standards system used across ALL room tiers (VIP 1-6, Kids)
          </p>
        </div>

        {/* Standards Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5" />
              Universal Room Standards
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2 text-primary">Title Structure</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Rainbow gradient styling</li>
                  <li>✓ Bilingual format (EN / VI)</li>
                  <li>✓ Admin copy buttons (JSON, Room ID)</li>
                  <li>✓ Tier badge display</li>
                </ul>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2 text-primary">Welcome Message</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Instruction to click keywords</li>
                  <li>✓ Bilingual guidance text</li>
                  <li>✓ Centered, clear formatting</li>
                </ul>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2 text-primary">Room Essay</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ PairedHighlightedContentWithDictionary</li>
                  <li>✓ Colored keywords (customKeywordLoader)</li>
                  <li>✓ Hovering dictionary on words</li>
                  <li>✓ Click words to trigger audio</li>
                </ul>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2 text-primary">Audio System</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ AudioPlayer component</li>
                  <li>✓ Play/pause/seek controls</li>
                  <li>✓ Volume and speed controls</li>
                  <li>✓ EN and VI audio files</li>
                </ul>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2 text-primary">Navigation</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Back button with arrow</li>
                  <li>✓ Refresh button (admin only)</li>
                  <li>✓ Consistent positioning</li>
                </ul>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2 text-primary">Card Styling</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Border with room color</li>
                  <li>✓ Left accent (4px width)</li>
                  <li>✓ Muted background</li>
                  <li>✓ Consistent spacing</li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-3">Code Reference</h3>
              <code className="block p-3 bg-muted rounded text-xs overflow-x-auto">
                import {'{'} MERCY_BLADE_STANDARDS {'}'} from '@/lib/mercyBladeStandards';
                <br />
                import {'{'} validateMercyBladeStandards {'}'} from '@/lib/mercyBladeStandards';
                <br />
                <br />
                // Get complete pattern
                <br />
                const pattern = getMercyBladeRoomPattern();
                <br />
                <br />
                // Validate room data
                <br />
                const validation = validateMercyBladeStandards(roomData);
              </code>
            </div>
          </CardContent>
        </Card>

        {/* Validation Tool */}
        <Card>
          <CardHeader>
            <CardTitle>Validate Kids Rooms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={validateAllKidsRooms} 
              disabled={isValidating}
              className="w-full gap-2"
            >
              {isValidating ? (
                <>
                  <div className="w-4 h-4 border-2 border-background border-t-foreground rounded-full animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Validate All Kids Rooms
                </>
              )}
            </Button>

            {validationResults.length > 0 && (
              <ScrollArea className="h-[400px] w-full border rounded-lg p-4">
                <div className="space-y-4">
                  {validationResults.map((result, idx) => (
                    <Card key={idx}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-mono">
                            {result.roomId}
                          </CardTitle>
                          {result.status === 'valid' && (
                            <Badge className="bg-green-500 gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Valid
                            </Badge>
                          )}
                          {result.status === 'invalid' && (
                            <Badge variant="destructive" className="gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Issues
                            </Badge>
                          )}
                          {result.status === 'error' && (
                            <Badge variant="destructive" className="gap-1">
                              <XCircle className="w-3 h-3" />
                              Error
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="text-sm space-y-2">
                        {result.errors && result.errors.length > 0 && (
                          <div>
                            <p className="font-semibold text-destructive">Errors:</p>
                            <ul className="list-disc list-inside text-xs text-muted-foreground">
                              {result.errors.map((error: string, i: number) => (
                                <li key={i}>{error}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {result.warnings && result.warnings.length > 0 && (
                          <div>
                            <p className="font-semibold text-yellow-600">Warnings:</p>
                            <ul className="list-disc list-inside text-xs text-muted-foreground">
                              {result.warnings.map((warning: string, i: number) => (
                                <li key={i}>{warning}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {result.message && (
                          <p className="text-xs text-muted-foreground">{result.message}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* AI Instructions */}
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="text-primary">🤖 For AI: When to Use This</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <strong>Use this page whenever:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Building new room components (Kids, VIP, or any tier)</li>
              <li>User says you "forgot the standards"</li>
              <li>Applying consistent styling across rooms</li>
              <li>Need reminder of complete room patterns</li>
              <li>Validating room JSON structure</li>
            </ul>
            
            <div className="pt-3 border-t">
              <p className="font-semibold mb-2">Key Import:</p>
              <code className="block p-2 bg-muted rounded text-xs">
                import {'{'} MERCY_BLADE_STANDARDS, getMercyBladeRoomPattern {'}'} from '@/lib/mercyBladeStandards';
              </code>
            </div>

            <div className="pt-3 border-t">
              <p className="font-semibold mb-2">Required Components:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><code>PairedHighlightedContentWithDictionary</code> - For room essays</li>
                <li><code>AudioPlayer</code> - For all audio playback</li>
                <li><code>loadRoomKeywords()</code> - For keyword coloring</li>
                <li><code>setCustomKeywordMappings()</code> - Initialize colors</li>
                <li><code>clearCustomKeywordMappings()</code> - Cleanup</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminApplyMercyBladeStandards;
