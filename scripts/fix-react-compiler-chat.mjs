#!/usr/bin/env node
import fs from "fs";

const FILE = "src/components/room/roomRenderer/useCommunityChatInline.ts";

if (!fs.existsSync(FILE)) {
  console.error("[fix-react-compiler-chat] File not found:", FILE);
  process.exit(1);
}

const src = fs.readFileSync(FILE, "utf8");

// Backup (once)
const bak = FILE + ".BAK.AUTO";
if (!fs.existsSync(bak)) {
  fs.writeFileSync(bak, src, "utf8");
  console.log("[fix-react-compiler-chat] Backup created:", bak);
}

// 1) Inject refs + effects (after last useRef declaration)
let out = src;
if (!out.includes("authUserIdRef")) {
  out = out.replace(
    /(const\s+stickToBottomRef\s*=\s*useRef\(true\);)/,
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

// 2) Rewrite sendChatInline body + deps
out = out.replace(
  /const sendChatInline = useCallback\(\s*async\s*\(\)\s*=>\s*\{[\s\S]*?\}\s*,\s*\[[^\]]*\]\s*\);/m,
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
      let res = await supabase
        .from("community_messages")
        .insert({ room_id: roomId, message: msg })
        .select("id, room_id, user_id, message, created_at")
        .single();

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
        await loadChatRef.current(60);
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

// 3) Rewrite isMe comparison
out = out.replace(
  /const isMe\s*=\s*authUser\s*\?\s*String\(m\?\.\s*user_id\s*\|\|\s*""\)\s*===\s*String\(authUser\?\.\s*id\s*\|\|\s*""\)\s*:\s*false\s*;/g,
  `const isMe = String(m?.user_id || "") === String(authUserIdRef.current || "");`
);

fs.writeFileSync(FILE, out, "utf8");
console.log("[fix-react-compiler-chat] Patch applied successfully.");
