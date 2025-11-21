import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, CheckCircle, XCircle, AlertTriangle, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { validateKidsRoomJson, formatValidationErrors } from '@/lib/kidsDataValidation';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export default function AdminKidsImport() {
  const [jsonInput, setJsonInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    success: boolean;
    errors?: string[];
    data?: any;
  } | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleValidate = () => {
    setIsValidating(true);
    setValidationResult(null);

    try {
      const parsed = JSON.parse(jsonInput);
      const result = validateKidsRoomJson(parsed);

      if (result.success) {
        setValidationResult({
          success: true,
          data: result.data
        });
        toast({
          title: "✅ Validation Passed",
          description: `Room "${result.data.title_en}" is valid and ready to import.`,
        });
      } else {
        const errors = formatValidationErrors(result.error);
        setValidationResult({
          success: false,
          errors
        });
        toast({
          title: "❌ Validation Failed",
          description: `Found ${errors.length} error(s). Please fix them.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      setValidationResult({
        success: false,
        errors: ['Invalid JSON format. Please check your syntax.']
      });
      toast({
        title: "❌ Invalid JSON",
        description: "Could not parse JSON. Check for syntax errors.",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleImport = async () => {
    if (!validationResult?.success || !validationResult.data) {
      toast({
        title: "Cannot Import",
        description: "Please validate the JSON first.",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);

    try {
      const roomData = validationResult.data;

      // Call edge function to process the room
      const { data, error } = await supabase.functions.invoke('process-kids-room', {
        body: {
          roomData,
          mode: 'upsert'
        }
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Unknown error');
      }

      toast({
        title: "✅ Import Successful",
        description: `Room "${roomData.title.en}" with ${data.entries_count} entries has been imported.`,
      });

      setJsonInput('');
      setValidationResult(null);

    } catch (error: any) {
      console.error('Import error:', error);
      toast({
        title: "❌ Import Failed",
        description: error.message || "An error occurred during import.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setJsonInput(content);
      setValidationResult(null);
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Kids English Room Import
              </h1>
              <p className="text-muted-foreground">
                Upload and validate Kids room JSON files following the unified content rules:
                5 entries per room, ~120 words EN + full VI translation, audio mapping.
              </p>
            </div>
            <Button
              onClick={() => navigate('/admin/kids-standardizer')}
              variant="outline"
              className="gap-2 border-2 border-primary/20 hover:border-primary/40"
            >
              <Wand2 className="w-4 h-4" />
              Apply Standards
            </Button>
          </div>
        </Card>

        {/* Upload Section */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Import Room JSON</h2>
            <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </Button>
            <input
              id="file-upload"
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          <Textarea
            value={jsonInput}
            onChange={(e) => {
              setJsonInput(e.target.value);
              setValidationResult(null);
            }}
            placeholder='Paste or upload your Kids room JSON here...'
            className="min-h-[300px] font-mono text-sm"
          />

          <div className="flex gap-3">
            <Button
              onClick={handleValidate}
              disabled={!jsonInput.trim() || isValidating}
              variant="outline"
            >
              {isValidating ? "Validating..." : "Validate JSON"}
            </Button>

            <Button
              onClick={handleImport}
              disabled={!validationResult?.success || isImporting}
            >
              {isImporting ? "Importing..." : "Import to Database"}
            </Button>
          </div>
        </Card>

        {/* Validation Results */}
        {validationResult && (
          <Card className={`p-6 ${validationResult.success ? 'border-green-500' : 'border-destructive'}`}>
            <div className="flex items-start gap-3">
              {validationResult.success ? (
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              ) : (
                <XCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
              )}
              
              <div className="flex-1 space-y-3">
                <h3 className="text-lg font-semibold">
                  {validationResult.success ? 'Validation Passed ✓' : 'Validation Failed ✗'}
                </h3>

                {validationResult.success && validationResult.data && (
                  <div className="space-y-2 text-sm">
                    <p><strong>Room ID:</strong> {validationResult.data.id}</p>
                    <p><strong>Title EN:</strong> {validationResult.data.title.en}</p>
                    <p><strong>Title VI:</strong> {validationResult.data.title.vi}</p>
                    <p><strong>Tier:</strong> {validationResult.data.tier}</p>
                    <p><strong>Entries:</strong> {validationResult.data.entries.length}</p>
                  </div>
                )}

                {!validationResult.success && validationResult.errors && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {validationResult.errors.length} error(s) found:
                    </p>
                    <ul className="space-y-1">
                      {validationResult.errors.map((error, idx) => (
                        <li key={idx} className="text-sm text-destructive flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span>{error}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Validation Rules Reference */}
        <Card className="p-6 space-y-3">
          <h3 className="text-lg font-semibold">Validation Rules</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Room ID format: <code>room_name_kids_l[1-3]</code></li>
            <li>✓ Tier must include "Kids Level 1/2/3"</li>
            <li>✓ Exactly 5 entries required</li>
            <li>✓ Bilingual title object: <code>{`{en, vi}`}</code></li>
            <li>✓ Bilingual content object with optional audio</li>
            <li>✓ Each entry needs: slug, copy (en/vi), audio filename</li>
            <li>✓ Meta must include: age_range, level, entry_count, room_color</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
