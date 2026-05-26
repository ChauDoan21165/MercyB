import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Code, FileCode, Eye, Copy, Check, FolderOpen } from "lucide-react";
import { toast } from "sonner";

interface CodeFile {
  name: string;
  path: string;
  category: "edge-function" | "react-component" | "hook" | "helper" | "types" | "script";
  description: string;
}

const AUDIT_CODE_FILES: CodeFile[] = [
  {
    name: "audit-v4-safe-shield",
    path: "supabase/functions/audit-v4-safe-shield/index.ts",
    category: "edge-function",
    description: "Master Full System Sync Auditor edge function"
  },
  {
    name: "safety-audit",
    path: "supabase/functions/safety-audit/index.ts",
    category: "edge-function",
    description: "Safety content audit edge function"
  },
  {
    name: "AuditSafeShield",
    path: "src/components/admin/AuditSafeShield.tsx",
    category: "react-component",
    description: "Main admin UI panel for audit"
  },
  {
    name: "FullAuditPanel",
    path: "src/components/admin/FullAuditPanel.tsx",
    category: "react-component",
    description: "Full audit panel component"
  },
  {
    name: "UiUxAuditPanel",
    path: "src/components/admin/UiUxAuditPanel.tsx",
    category: "react-component",
    description: "UI/UX audit panel component"
  },
  {
    name: "audit-v4-types",
    path: "src/lib/audit-v4-types.ts",
    category: "types",
    description: "TypeScript types for audit system"
  },
  {
    name: "audit-v4-safe-shield (script)",
    path: "scripts/audit-v4-safe-shield.ts",
    category: "script",
    description: "Local CLI audit script"
  },
  {
    name: "auditLogger",
    path: "src/lib/security/auditLogger.ts",
    category: "helper",
    description: "Audit logging utilities"
  },
  {
    name: "audit (shared)",
    path: "supabase/functions/_shared/audit.ts",
    category: "helper",
    description: "Shared audit helper for edge functions"
  },
  {
    name: "auditLogger (edge)",
    path: "supabase/functions/_shared/auditLogger.ts",
    category: "helper",
    description: "Edge function audit logger"
  }
];

const categoryColors: Record<string, string> = {
  "edge-function": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "react-component": "bg-green-500/20 text-green-400 border-green-500/30",
  "hook": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "helper": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "types": "bg-pink-500/20 text-pink-400 border-pink-500/30",
  "script": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
};

export default function AuditCodeViewer() {
  const [selectedFile, setSelectedFile] = useState<CodeFile | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadFileContent = async (file: CodeFile) => {
    setIsLoading(true);
    setSelectedFile(file);
    
    try {
      // For public files, fetch directly
      const response = await fetch(`/${file.path}`);
      if (response.ok) {
        const content = await response.text();
        setFileContent(content);
      } else {
        // If not found as public, show the path info
        setFileContent(`// File: ${file.path}\n// This file cannot be loaded directly in browser.\n// Check your code editor or GitHub for the full content.\n\n// Path: ${file.path}\n// Category: ${file.category}\n// Description: ${file.description}`);
      }
    } catch (error) {
      setFileContent(`// Error loading file: ${file.path}\n// ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fileContent);
      setCopied(true);
      toast.success("Code copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <FileCode className="h-5 w-5" />
          Audit System Code Files
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          View source code for all audit/sync related files
        </p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="text-foreground font-bold">Name</TableHead>
              <TableHead className="text-foreground font-bold">Category</TableHead>
              <TableHead className="text-foreground font-bold">Path</TableHead>
              <TableHead className="text-foreground font-bold">Description</TableHead>
              <TableHead className="text-foreground font-bold w-[100px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {AUDIT_CODE_FILES.map((file) => (
              <TableRow key={file.path} className="border-border hover:bg-muted/50">
                <TableCell className="font-medium text-foreground">
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-muted-foreground" />
                    {file.name}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={categoryColors[file.category]}>
                    {file.category}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground max-w-[300px] truncate">
                  {file.path}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {file.description}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadFileContent(file)}
                    className="gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] bg-card border-border">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between text-foreground">
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  {selectedFile?.name}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="gap-1"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </DialogTitle>
              <p className="text-xs font-mono text-muted-foreground">
                {selectedFile?.path}
              </p>
            </DialogHeader>
            <ScrollArea className="h-[60vh] w-full rounded border border-border bg-muted/30">
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
                </div>
              ) : (
                <pre className="p-4 text-xs font-mono text-foreground whitespace-pre-wrap overflow-x-auto">
                  {fileContent}
                </pre>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
