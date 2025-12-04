import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Eye, FileCode, ChevronDown, ChevronRight, Copy, Check, ExternalLink } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";

interface CodeFile {
  path: string;
  description: string;
  githubUrl?: string;
}

interface CodeCategory {
  id: string;
  title: string;
  description: string;
  files: CodeFile[];
}

// GitHub raw content base URL - update with your actual repo
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/user/mercy-blade/main";
const GITHUB_REPO_BASE = "https://github.com/user/mercy-blade/blob/main";

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
  const { toast } = useToast();
  const [openCategories, setOpenCategories] = useState<string[]>(["core-runtime"]);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const copyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    toast({
      title: "Path copied!",
      description: "Paste this path in chat to view the full code",
    });
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const copyForChat = (path: string) => {
    const chatPrompt = `Show me the full code of: ${path}`;
    navigator.clipboard.writeText(chatPrompt);
    toast({
      title: "Ready to paste in chat!",
      description: "Paste in Lovable chat to view the full code",
    });
  };

  const copyAllPaths = (category: CodeCategory) => {
    const paths = category.files.map(f => f.path).join("\n");
    navigator.clipboard.writeText(paths);
    toast({
      title: "All paths copied",
      description: `Copied ${category.files.length} file paths`,
    });
  };

  const copyAllForChat = () => {
    const allPaths = codeCategories.flatMap(c => c.files.map(f => f.path)).join("\n");
    const chatPrompt = `Here are the key system files I want to review:\n\n${allPaths}`;
    navigator.clipboard.writeText(chatPrompt);
    toast({ 
      title: "All paths ready for chat!",
      description: "Paste in Lovable chat to request code review"
    });
  };

  const generateCategoryReport = (category: CodeCategory) => {
    const content = `# ${category.title}
# ${category.description}
# Generated: ${new Date().toISOString()}

${category.files.map((f, i) => `${i + 1}. ${f.path}
   Description: ${f.description}
`).join("\n")}

# Total files: ${category.files.length}
`;
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${category.id}-files.txt`;
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
          <div>
            <h1 className="text-2xl font-bold text-black">Mercy Blade System Codes</h1>
            <p className="text-sm text-gray-600">Click any file to copy its path, then paste in chat to view full code</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 max-w-6xl">
        {/* Instructions */}
        <Card className="mb-6 border-2 border-black bg-gray-50">
          <CardContent className="p-4">
            <p className="text-sm text-black">
              <strong>How to view full code:</strong> Click any file row to copy its path. 
              Then paste in Lovable chat with "Show me the full code of:" to see the complete source.
            </p>
          </CardContent>
        </Card>

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
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {category.files.length} files
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-black text-black"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyAllPaths(category);
                          }}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy All
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-black text-black"
                          onClick={(e) => {
                            e.stopPropagation();
                            generateCategoryReport(category);
                          }}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {category.files.map((file, index) => (
                        <div
                          key={file.path}
                          className={`flex items-center justify-between p-3 rounded border cursor-pointer transition-colors ${
                            copiedPath === file.path 
                              ? "bg-green-50 border-green-300" 
                              : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                          }`}
                          onClick={() => copyPath(file.path)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === "Enter" && copyPath(file.path)}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="text-xs text-gray-400 w-6">{index + 1}.</span>
                            {copiedPath === file.path ? (
                              <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                            ) : (
                              <FileCode className="h-4 w-4 text-black flex-shrink-0" />
                            )}
                            <div className="min-w-0">
                              <code className="text-sm font-mono text-black block truncate">
                                {file.path}
                              </code>
                              <span className="text-xs text-gray-500">
                                {file.description}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {copiedPath === file.path ? (
                              <span className="text-xs text-green-600 font-medium px-2">Copied!</span>
                            ) : (
                              <span className="text-xs text-gray-400">Click to copy</span>
                            )}
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

        {/* Quick Stats */}
        <Card className="mt-6 border-2 border-black">
          <CardContent className="p-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <span className="text-sm text-black font-medium">
                Total: {codeCategories.reduce((acc, c) => acc + c.files.length, 0)} files across {codeCategories.length} categories
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-black text-black"
                  onClick={() => {
                    const allPaths = codeCategories.flatMap(c => c.files.map(f => f.path)).join("\n");
                    navigator.clipboard.writeText(allPaths);
                    toast({ title: "All file paths copied!" });
                  }}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy All Paths
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  className="bg-black text-white hover:bg-gray-800"
                  onClick={copyAllForChat}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Copy for Chat
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemCodeFiles;
