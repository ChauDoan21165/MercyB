#!/usr/bin/env node
import fs from "fs";

const FILE = "src/components/room/roomRenderer/useCommunityChatInline.ts";
if (!fs.existsSync(FILE)) {
  console.error("[fix] File not found:", FILE);
  process.exit(1);
}

const src = fs.readFileSync(FILE, "utf8");

// backup once
const bak = FILE + ".BAK.AUTO";
if (!fs.existsSync(bak)) fs.writeFileSync(bak, src, "utf8");

// helper
function mustInclude(s, needle, msg) {
  if (!s.includes(needle)) {
    console.error("[fix] Expected marker missing:", needle);
    console.error("[fix] " + msg);
    process.exit(2);
  }
}

let out = src;

// --- Ensure useRef imported (usually already)
mustInclude(out, "useCallback", "Hook file looks unexpected.");
mustInclude(out, "useRef", "Hook file looks unexpected.");

// --- 1) Insert refs + syncing effects exactly once.
// Place right after stickToBottomRef or near other refs.
if (!out.includes("authUserIdRef")) {
  const anchorRegex = /(const\s+stickToBottomRef\s*=\s*useRef\([^)]+\);\s*)/m;
  if (!anchorRegex.test(out)) {
    console.error("[fix] Could not find stickToBottomRef anchor to insert refs.");
    process.exit(3);
  }

  out = out.replace(
    anchorRegex,
    `$1
  // ---- React Compiler safe refs ----
  const authUserIdRef = useRef<string>("");
  const chatTextRef = useRef<string>("");
  const roomIdRef = useRef<string>("");
  const loadChatRef = useRef(loadChatInline);

  useEffect(() => {
    authUserIdRef.current = String(authUser?.id || "");
  }, [authUser?.id]);

  useEffect(() => {
    chatTextRef.current = String(chatText || "");
  }, [chatText]);

  useEffect(() => {
    roomIdRef.current = String(canonicalChatRoomId || "");
  }, [canonicalChatRoomId]);

  useEffect(() => {
    loadChatRef.current = loadChatInline;
  }, [loadChatInline]);
`
  );
}

// --- 2) Replace sendChatInline deps to [args.limit] (minimum fix).
// This is the compiler rule trigger. We'll also rewrite body to use refs if we can find it.
const sendCbRegex =
  /const\s+sendChatInline\s*=\s*useCallback\(\s*async\s*\(\)\s*=>\s*\{[\s\S]*?\}\s*,\s*\[[\s\S]*?\]\s*\)\s*;/m;

if (!sendCbRegex.test(out)) {
  console.error("[fix] Could not locate sendChatInline useCallback block.");
  process.exit(4);
}

// Replace the whole block with a ref-based version (safe + stable)
out = out.replace(
  sendCbRegex,
  `const sendChatInline = useCallback(async () => {
    const msg = String(chatTextRef.current || "").trim();
    if (!msg) return;

    const userId = String(authUserIdRef.current || "");
    if (!userId) {
      setChatError("Please sign in to post messages.");
      return;
    }

    const roomId = String(roomIdRef.current || "").trim();
    if (!roomId) {
      setChatError("Chat room key missing.");
      return;
    }

    setChatSending(true);
    setChatError(null);

    try {
      // Prefer insert WITHOUT user_id (some schemas fill it via trigger/auth)
      let res = await supabase
        .from("community_messages")
        .insert({ room_id: roomId, message: msg })
        .select("id, room_id, user_id, message, created_at")
        .single();

      // Fallback: if schema requires explicit user_id
      if (res?.error) {
        const em = String(res.error?.message || "").toLowerCase();
        if (em.includes("user_id")) {
          res = await supabase
            .from("community_messages")
            .insert({ room_id: roomId, message: msg, user_id: userId })
            .select("id, room_id, user_id, message, created_at")
            .single();
        }
      }

      if (res?.error) {
        setChatError(\`Send failed: \${String(res.error?.message || res.error)}\`);
        setChatSending(false);
        return;
      }

      const data = res?.data as any;
      if (data) {
        setChatRows((cur) => {
          const id = String(data?.id ?? "");
          if (id && cur.some((r) => String((r as any)?.id ?? "") === id)) return cur;
          return [...cur, data];
        });
      } else {
        await loadChatRef.current(args.limit);
      }

      setChatText("");
      setChatSending(false);

      stickToBottomRef.current = true;
      setTimeout(() => scrollToBottomIfSticky(), 0);
    } catch (e: any) {
      setChatError(\`Send exception: \${e?.message || String(e)}\`);
      setChatSending(false);
    }
  }, [args.limit]);`
);

// --- 3) Fix formatWho isMe line to use ref (removes authUser capture)
out = out.replace(
  /const\s+isMe\s*=\s*authUser\s*\?\s*String\(m\?\.\s*user_id\s*\|\|\s*""\)\s*===\s*String\(authUser\?\.\s*id\s*\|\|\s*""\)\s*:\s*false\s*;/g,
  `const isMe = String(m?.user_id || "") === String(authUserIdRef.current || "");`
);

// --- sanity: ensure deps fixed
if (out.includes("}, [authUser?.id, canonicalChatRoomId, chatText, loadChatInline, supabase])")) {
  console.error("[fix] sendChatInline deps still old. Aborting.");
  process.exit(5);
}

fs.writeFileSync(FILE, out, "utf8");
console.log("[fix] Patched:", FILE);
console.log("[fix] Backup:", bak);
