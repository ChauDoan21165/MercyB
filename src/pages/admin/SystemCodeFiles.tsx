import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Eye, FileCode, ChevronDown, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CodeFile {
  path: string;
  description: string;
}

interface CodeCategory {
  id: string;
  title: string;
  description: string;
  files: CodeFile[];
}

const codeCategories: CodeCategory[] = [
  {
    id: "core-runtime",
    title: "A. CORE ROOM RUNTIME",
    description: "Top priority - main room page and loaders",
    files: [
      { path: "src/pages/RoomPage.tsx", description: "Main room page" },
      { path: "src/App.tsx", description: "Global layout + providers" },
      { path: "src/pages/Index.tsx", description: "Landing/home page" },
      { path: "src/lib/roomLoader.ts", description: "Read JSON, map to types, handle errors" },
      { path: "src/lib/roomSchema.ts", description: "Zod/type schema for rooms" },
      { path: "src/lib/roomRegistry.ts", description: "Mapping slug/id → JSON file path" },
      { path: "src/lib/getRoomBySlug.ts", description: "Helper used by page" },
      { path: "src/lib/tierUtils.ts", description: "Free/VIP logic" },
      { path: "src/lib/i18n.ts", description: "Language selection for EN/VI" },
      { path: "src/config/featureFlags.ts", description: "Flags that might hide features" },
    ],
  },
  {
    id: "safe-shield",
    title: "B. SAFE-SHIELD + FULL SYSTEM SYNC",
    description: "Audit system - bug factory or life saver",
    files: [
      { path: "src/lib/audit/safe-shield-v5.ts", description: "Main auditor rules" },
      { path: "src/lib/audit/room-health.ts", description: "Compute health scores" },
      { path: "src/lib/audit/json-audit.ts", description: "Scans /public/data/*.json" },
      { path: "src/lib/audit/audio-audit.ts", description: "Scans /public/audio/*.mp3" },
      { path: "src/lib/audit/db-audit.ts", description: "Checks Supabase tables" },
      { path: "src/components/admin/AuditSafeShield.tsx", description: "UI for audits" },
      { path: "supabase/functions/audit-v4-safe-shield/index.ts", description: "Master audit edge function" },
      { path: "scripts/audit-v4-safe-shield.ts", description: "Local CLI audit script" },
    ],
  },
  {
    id: "audio-system",
    title: "C. AUDIO SYSTEM",
    description: "Where 'silence' bugs come from",
    files: [
      { path: "src/lib/audioMap.ts", description: "Maps room/entry → mp3 filename" },
      { path: "src/lib/audioUtils.ts", description: "Helpers: build filename, language, tier" },
      { path: "src/components/audio/EntryAudioButton.tsx", description: "Play button per entry" },
      { path: "src/components/audio/RoomIntroPlayer.tsx", description: "Intro voice for room" },
      { path: "src/components/AudioPlayer.tsx", description: "Main audio player component" },
      { path: "scripts/find-missing-audio.ts", description: "Script to list missing mp3s" },
    ],
  },
  {
    id: "mercy-companion",
    title: "D. MERCY COMPANION / ENGLISH TEACHER",
    description: "The part you don't see - AI companion system",
    files: [
      { path: "src/components/mercy/RoomCompanion.tsx", description: "Floating 'Ask Mercy' UI" },
      { path: "src/components/mercy/MercyChatPanel.tsx", description: "Chat window itself" },
      { path: "src/components/MercyGuide.tsx", description: "Mercy Guide component" },
      { path: "src/hooks/useMercyGuide.ts", description: "Mercy Guide hook" },
      { path: "src/lib/ai/mercy-system-prompt.ts", description: "System prompt for Mercy" },
      { path: "src/context/MercyContext.tsx", description: "Global chat state" },
    ],
  },
  {
    id: "data-layer",
    title: "E. DATA LAYER: JSON ↔ DB ↔ REGISTRY",
    description: "Data synchronization and storage",
    files: [
      { path: "src/integrations/supabase/client.ts", description: "Supabase initialization" },
      { path: "src/lib/db/rooms-repository.ts", description: "Load/save room metadata from DB" },
      { path: "src/lib/db/user-progress-repository.ts", description: "Tracks room completion" },
      { path: "supabase/functions/room-sync/index.ts", description: "Room sync edge function" },
      { path: "supabase/functions/audio-sync/index.ts", description: "Audio sync checks" },
    ],
  },
  {
    id: "auth-tier",
    title: "F. AUTH, PROFILE, TIER ACCESS",
    description: "Authentication and access control",
    files: [
      { path: "src/lib/auth.ts", description: "Session + user helper" },
      { path: "src/hooks/useAuth.tsx", description: "Auth hook" },
      { path: "src/components/user/ProfileMenu.tsx", description: "Shows tier, language, logout" },
      { path: "src/lib/tier-access-control.ts", description: "Gate: Free vs VIP1–VIP9" },
      { path: "src/hooks/useUserAccess.ts", description: "User access hook" },
    ],
  },
  {
    id: "design-system",
    title: "G. DESIGN SYSTEM & LAYOUT",
    description: "Why things look the way they do",
    files: [
      { path: "src/components/layout/AppShell.tsx", description: "Header/sidebar/base grid" },
      { path: "src/components/layout/RoomLayout.tsx", description: "Layout for a single room" },
      { path: "src/components/room/EntryCard.tsx", description: "How each dare/entry looks" },
      { path: "src/components/room/RoomHeader.tsx", description: "Title, tier, tags, progress" },
      { path: "tailwind.config.ts", description: "All gradient tokens, VIP colors" },
      { path: "src/index.css", description: "Global styles and design tokens" },
    ],
  },
  {
    id: "dev-tools",
    title: "H. DEV TOOLS & PIPELINE",
    description: "To keep everything sane",
    files: [
      { path: ".github/workflows/ci.yml", description: "Tests + lint + build" },
      { path: "scripts/validate-room-json.ts", description: "CLI to run schemas + checks" },
      { path: "scripts/check-audio-storage-sync.ts", description: "Storage sync script" },
      { path: "scripts/fix-audit-issues.ts", description: "Auto-fix script" },
      { path: "vite.config.ts", description: "Vite configuration" },
      { path: "tsconfig.json", description: "TypeScript configuration" },
    ],
  },
];

const SystemCodeFiles = () => {
  const navigate = useNavigate();
  const [openCategories, setOpenCategories] = useState<string[]>(["core-runtime"]);
  const [viewingFile, setViewingFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const viewFile = async (path: string) => {
    setIsLoading(true);
    setViewingFile(path);
    try {
      const response = await fetch(`/${path}`);
      if (response.ok) {
        const content = await response.text();
        setFileContent(content);
      } else {
        setFileContent(`// File not found or not accessible: ${path}`);
      }
    } catch (error) {
      setFileContent(`// Error loading file: ${path}\n// ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadFile = (path: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = path.split("/").pop() || "file.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllInCategory = (category: CodeCategory) => {
    const content = category.files
      .map((f) => `// ========== ${f.path} ==========\n// ${f.description}\n`)
      .join("\n\n");
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${category.id}-file-list.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b-2 border-black bg-white p-4">
        <div className="container mx-auto flex items-center gap-4">
          <Button
            onClick={() => navigate("/admin")}
            variant="outline"
            size="sm"
            className="border-black text-black hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-black">Mercy Blade System Codes</h1>
        </div>
      </div>

      <div className="container mx-auto p-6 max-w-6xl">
        <div className="grid gap-4">
          {codeCategories.map((category) => (
            <Collapsible
              key={category.id}
              open={openCategories.includes(category.id)}
              onOpenChange={() => toggleCategory(category.id)}
            >
              <Card className="border-2 border-black bg-white">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {openCategories.includes(category.id) ? (
                          <ChevronDown className="h-5 w-5 text-black" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-black" />
                        )}
                        <div>
                          <CardTitle className="text-lg font-bold text-black">
                            {category.title}
                          </CardTitle>
                          <p className="text-sm text-gray-600">{category.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {category.files.length} files
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-black text-black"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadAllInCategory(category);
                          }}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          List
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {category.files.map((file) => (
                        <div
                          key={file.path}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <FileCode className="h-4 w-4 text-black flex-shrink-0" />
                            <div className="min-w-0">
                              <code className="text-sm font-mono text-black block truncate">
                                {file.path}
                              </code>
                              <span className="text-xs text-gray-500">
                                {file.description}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-black hover:bg-gray-200"
                              onClick={() => viewFile(file.path)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>

        {/* File Viewer Modal */}
        {viewingFile && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[80vh] flex flex-col border-2 border-black">
              <CardHeader className="flex-shrink-0 border-b border-black">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-black font-mono text-sm truncate">
                    {viewingFile}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-black text-black"
                      onClick={() => downloadFile(viewingFile, fileContent)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-black text-black"
                      onClick={() => {
                        setViewingFile(null);
                        setFileContent("");
                      }}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-0">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">Loading...</div>
                ) : (
                  <pre className="p-4 text-sm font-mono bg-gray-50 overflow-x-auto whitespace-pre-wrap">
                    {fileContent}
                  </pre>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemCodeFiles;
