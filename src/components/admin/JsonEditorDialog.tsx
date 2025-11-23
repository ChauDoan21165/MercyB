import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Download, CheckCircle2, AlertCircle } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useToast } from "@/hooks/use-toast";

interface JsonEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filePath: string;
  roomTitle: string;
}

export function JsonEditorDialog({ open, onOpenChange, filePath, roomTitle }: JsonEditorDialogProps) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (open && filePath) {
      loadFile();
    }
  }, [open, filePath]);

  const loadFile = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/${filePath}`);
      
      if (!response.ok) {
        throw new Error("File not found");
      }

      const text = await response.text();
      
      // Validate it's JSON
      try {
        JSON.parse(text);
        setContent(text);
        setIsValid(true);
      } catch {
        setContent(text);
        setIsValid(false);
      }
    } catch (err: any) {
      setError(err.message);
      setContent("");
    } finally {
      setLoading(false);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setContent(value);
      
      // Validate JSON
      try {
        JSON.parse(value);
        setIsValid(true);
      } catch {
        setIsValid(false);
      }
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filePath.split("/").pop() || "room.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "File downloaded",
      description: "Replace the file in public/data/ with your edited version.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit JSON: {roomTitle}</DialogTitle>
          <DialogDescription>
            File: {filePath}
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center flex-1">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!loading && !error && (
          <>
            <div className="flex-1 border rounded-md overflow-hidden">
              <Editor
                height="100%"
                defaultLanguage="json"
                theme="vs-dark"
                value={content}
                onChange={handleEditorChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  formatOnPaste: true,
                  formatOnType: true,
                }}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                {isValid ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">Valid JSON</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm text-destructive">Invalid JSON syntax</span>
                  </>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button onClick={handleDownload} disabled={!isValid}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Fixed File
                </Button>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                💡 After downloading, replace the file in <code className="bg-muted px-1 py-0.5 rounded">public/{filePath}</code> with your edited version.
              </AlertDescription>
            </Alert>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
