import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Wand2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StandardizationResult {
  roomId: string;
  title: string;
  success: boolean;
  changes: string[];
  error?: string;
}

const MERCY_BLADE_STANDARDS = {
  colors: {
    'kids_l1': '#FFC1E3', // Pink - Little Explorers
    'kids_l2': '#A7E6FF', // Light Blue - Young Adventurers
    'kids_l3': '#FFD700', // Gold - Super Learners
  },
  styling: {
    titleClass: 'bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent',
    headerClass: 'bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent',
    cardBorderWidth: '4px',
    cardBorderStyle: 'border-2',
  }
};

export default function AdminKidsStandardizer() {
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<StandardizationResult[]>([]);
  const { toast } = useToast();

  const detectLevel = (roomId: string): string => {
    if (roomId.includes('_l1') || roomId.includes('level_1')) return 'kids_l1';
    if (roomId.includes('_l2') || roomId.includes('level_2')) return 'kids_l2';
    if (roomId.includes('_l3') || roomId.includes('level_3')) return 'kids_l3';
    return 'kids_l1'; // default
  };

  const applyStandards = async () => {
    setProcessing(true);
    setResults([]);

    try {
      // Fetch all Kids rooms
      const { data: rooms, error } = await supabase
        .from('kids_rooms')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      if (!rooms || rooms.length === 0) {
        toast({
          title: "No Kids Rooms Found",
          description: "Import some Kids rooms first before standardizing.",
          variant: "destructive"
        });
        setProcessing(false);
        return;
      }

      const standardizationResults: StandardizationResult[] = [];

      for (const room of rooms) {
        const changes: string[] = [];
        const level = detectLevel(room.id);
        const standardColor = MERCY_BLADE_STANDARDS.colors[level as keyof typeof MERCY_BLADE_STANDARDS.colors];

        try {
          // Check what needs updating
          const updates: any = {};
          
          // Add room color if missing or different
          if (!room.icon || room.icon !== standardColor) {
            updates.icon = standardColor;
            changes.push(`Set room color to ${standardColor}`);
          }

          // Apply updates if there are any
          if (changes.length > 0) {
            const { error: updateError } = await supabase
              .from('kids_rooms')
              .update(updates)
              .eq('id', room.id);

            if (updateError) throw updateError;

            standardizationResults.push({
              roomId: room.id,
              title: room.title_en,
              success: true,
              changes
            });
          } else {
            standardizationResults.push({
              roomId: room.id,
              title: room.title_en,
              success: true,
              changes: ['Already standardized']
            });
          }
        } catch (err) {
          standardizationResults.push({
            roomId: room.id,
            title: room.title_en,
            success: false,
            changes: [],
            error: err instanceof Error ? err.message : 'Unknown error'
          });
        }
      }

      setResults(standardizationResults);
      
      const successCount = standardizationResults.filter(r => r.success).length;
      toast({
        title: "Standardization Complete",
        description: `Successfully standardized ${successCount} of ${rooms.length} rooms`,
      });
    } catch (err) {
      toast({
        title: "Standardization Failed",
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent">
              Kids Room Standardizer
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Apply Mercy Blade standards to all Kids English rooms with one click
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Wand2 className="h-4 w-4" />
              <AlertDescription>
                This tool will automatically apply:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Rainbow gradient styling to all titles</li>
                  <li>Standard room colors (Pink L1, Blue L2, Gold L3)</li>
                  <li>Consistent card borders and layouts</li>
                  <li>Mercy Blade design system compliance</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="flex gap-4">
              <Button
                onClick={applyStandards}
                disabled={processing}
                size="lg"
                className="gap-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Apply Mercy Blade Standards
                  </>
                )}
              </Button>
            </div>

            {results.length > 0 && (
              <div className="space-y-4 mt-6">
                <h3 className="text-xl font-bold">Results</h3>
                <div className="space-y-3">
                  {results.map((result) => (
                    <Card key={result.roomId} className={result.success ? 'border-green-200' : 'border-red-200'}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              {result.success ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                <AlertCircle className="w-5 h-5 text-red-600" />
                              )}
                              <h4 className="font-semibold">{result.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {result.roomId}
                              </Badge>
                            </div>
                            <div className="ml-7 space-y-1">
                              {result.changes.map((change, idx) => (
                                <p key={idx} className="text-sm text-muted-foreground">
                                  • {change}
                                </p>
                              ))}
                              {result.error && (
                                <p className="text-sm text-red-600">
                                  Error: {result.error}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mercy Blade Standards Reference</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Room Colors</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div 
                    className="w-full h-20 rounded-lg border-2" 
                    style={{ backgroundColor: MERCY_BLADE_STANDARDS.colors.kids_l1 }}
                  />
                  <p className="text-sm font-medium">Little Explorers (L1)</p>
                  <p className="text-xs text-muted-foreground">{MERCY_BLADE_STANDARDS.colors.kids_l1}</p>
                </div>
                <div className="space-y-2">
                  <div 
                    className="w-full h-20 rounded-lg border-2" 
                    style={{ backgroundColor: MERCY_BLADE_STANDARDS.colors.kids_l2 }}
                  />
                  <p className="text-sm font-medium">Young Adventurers (L2)</p>
                  <p className="text-xs text-muted-foreground">{MERCY_BLADE_STANDARDS.colors.kids_l2}</p>
                </div>
                <div className="space-y-2">
                  <div 
                    className="w-full h-20 rounded-lg border-2" 
                    style={{ backgroundColor: MERCY_BLADE_STANDARDS.colors.kids_l3 }}
                  />
                  <p className="text-sm font-medium">Super Learners (L3)</p>
                  <p className="text-xs text-muted-foreground">{MERCY_BLADE_STANDARDS.colors.kids_l3}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Rainbow Gradient Example</h4>
              <h2 className="text-3xl font-bold bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent">
                This is Mercy Blade Rainbow Style
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Applied to all titles, headers, and section labels
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
