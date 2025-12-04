import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Whitelist of allowed file paths for security
const ALLOWED_PATHS = [
  // A. CORE ROOM RUNTIME
  "src/pages/RoomPage.tsx",
  "src/App.tsx",
  "src/pages/Index.tsx",
  "src/lib/roomLoader.ts",
  "src/lib/roomSchema.ts",
  "src/lib/roomRegistry.ts",
  "src/lib/getRoomBySlug.ts",
  "src/lib/tierUtils.ts",
  "src/lib/i18n.ts",
  "src/config/featureFlags.ts",
  // B. SAFE-SHIELD
  "src/lib/audit/safe-shield-v5.ts",
  "src/lib/audit/room-health.ts",
  "src/lib/audit/json-audit.ts",
  "src/lib/audit/audio-audit.ts",
  "src/lib/audit/db-audit.ts",
  "src/components/admin/AuditSafeShield.tsx",
  "supabase/functions/audit-v4-safe-shield/index.ts",
  "scripts/audit-v4-safe-shield.ts",
  // C. AUDIO SYSTEM
  "src/lib/audioMap.ts",
  "src/lib/audioUtils.ts",
  "src/components/audio/EntryAudioButton.tsx",
  "src/components/audio/RoomIntroPlayer.tsx",
  "src/components/AudioPlayer.tsx",
  "scripts/find-missing-audio.ts",
  // D. MERCY COMPANION
  "src/components/mercy/RoomCompanion.tsx",
  "src/components/mercy/MercyChatPanel.tsx",
  "src/components/MercyGuide.tsx",
  "src/hooks/useMercyGuide.ts",
  "src/lib/ai/mercy-system-prompt.ts",
  "src/context/MercyContext.tsx",
  // E. DATA LAYER
  "src/integrations/supabase/client.ts",
  "src/lib/db/rooms-repository.ts",
  "src/lib/db/user-progress-repository.ts",
  "supabase/functions/room-sync/index.ts",
  "supabase/functions/audio-sync/index.ts",
  // F. AUTH
  "src/lib/auth.ts",
  "src/hooks/useAuth.tsx",
  "src/components/user/ProfileMenu.tsx",
  "src/lib/tier-access-control.ts",
  "src/hooks/useUserAccess.ts",
  // G. DESIGN SYSTEM
  "src/components/layout/AppShell.tsx",
  "src/components/layout/RoomLayout.tsx",
  "src/components/room/EntryCard.tsx",
  "src/components/room/RoomHeader.tsx",
  "tailwind.config.ts",
  "src/index.css",
  // H. DEV TOOLS
  ".github/workflows/ci.yml",
  "scripts/validate-room-json.ts",
  "scripts/check-audio-storage-sync.ts",
  "scripts/fix-audit-issues.ts",
  "vite.config.ts",
  "tsconfig.json",
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const filePath = url.searchParams.get("path");

    if (!filePath) {
      return new Response(
        JSON.stringify({ error: "Missing path parameter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Security check - only allow whitelisted paths
    if (!ALLOWED_PATHS.includes(filePath)) {
      return new Response(
        JSON.stringify({ error: "File path not allowed", path: filePath }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // For edge functions, we can't read local files directly
    // Return a message indicating this limitation
    return new Response(
      JSON.stringify({ 
        error: "File reading not available in edge function",
        suggestion: "Use GitHub raw content or local development tools",
        path: filePath 
      }),
      { status: 501, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
