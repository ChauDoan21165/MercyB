#!/usr/bin/env node
import fs from "fs";

const FILE = "src/components/room/roomRenderer/useCommunityChatInline.ts";
if (!fs.existsSync(FILE)) {
  console.error("[fix] File not found:", FILE);
  process.exit(1);
}

const src = fs.readFileSync(FILE, "utf8");
const bak = FILE + ".BAK.REACT_COMPILER_V2";
if (!fs.existsSync(bak)) fs.writeFileSync(bak, src, "utf8");

let out = src;

// --- Sanity markers (from your error output) ---
if (!out.includes("const sendChatInline = useCallback(async () => {")) {
  console.error("[fix] Could not find sendChatInline block start.");
  process.exit(2);
}
if (!out.includes("}, [authUser?.id, canonicalChatRoomId, chatText, loadChatInline, supabase]);")) {
  console.error("[fix] Could not find the exact dependency array to replace.");
  process.exit(3);
}
if (!out.includes('const msg = String(chatText || "").trim();')) {
  console.error("[fix] Could not find msg line to refactor.");
  process.exit(4);
}

// --- 0) Ensure we have a stable anchor "args" in scope (this hook seems to be useCommunityChatInline(args))
// We'll only rely on args.limit because the linter infers it.
if (!out.includes("args.limit")) {
  console.error("[fix] args.limit not found anywhere; this patch assumes args.limit exists in this hook.");
  process.exit(5);
}

// --- 1) Insert compiler-safe refs if missing ---
if (!out.includes("const authUserIdRef")) {
  const insertAfterRef = out.match(/const\s+stickToBottomRef\s*=\s*useRef\([^)]+\);\s*/m);
  if (!insertAfterRef) {
    console.error("[fix] Could not find stickToBottomRef to insert refs after.");
    process.exit(6);
  }

  out = out.replace(
    insertAfterRef[0],
    insertAfterRef[0] +
      `
  // ---- React Compiler safe refs (avoid capturing changing values in callbacks) ----
  const authUserIdRef = useRef<string>("");
  const chatTextRef = useRef<string>("");

  useEffect(() => {
    authUserIdRef.current = String(authUser?.id || "");
  }, [authUser?.id]);

  useEffect(() => {
    chatTextRef.current = String(chatText || "");
  }, [chatText]);
`
  );
}

// --- 2) Rewrite msg source to refs (so callback can depend only on args.limit) ---
out = out.replace(
  'const msg = String(chatText || "").trim();',
  'const msg = String(chatTextRef.current || "").trim();'
);

// --- 3) Rewrite dependency array to match compiler inferred dependency ---
out = out.replace(
  "}, [authUser?.id, canonicalChatRoomId, chatText, loadChatInline, supabase]);",
  "}, [args.limit]);"
);

// --- 4) Remove authUser capture in formatWho line (your error points here) ---
out = out.replace(
  /const\s+isMe\s*=\s*authUser\s*\?\s*String\(m\?\.\s*user_id\s*\|\|\s*""\)\s*===\s*String\(authUser\?\.\s*id\s*\|\|\s*""\)\s*:\s*false\s*;/g,
  'const isMe = String(m?.user_id || "") === String(authUserIdRef.current || "");'
);

// --- 5) Final check: ensure old deps are gone ---
if (out.includes("[authUser?.id, canonicalChatRoomId, chatText, loadChatInline, supabase]")) {
  console.error("[fix] Old dependency array still present. Aborting.");
  process.exit(7);
}

fs.writeFileSync(FILE, out, "utf8");
console.log("[fix] Patched:", FILE);
console.log("[fix] Backup:", bak);
