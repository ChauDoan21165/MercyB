// src/components/guide/host/makeReply.ts
// SAFE STUB — required by MercyAIHost import.
// Returns a simple host reply object/string without side effects.

export type HostReply = {
  text_en: string;
  text_vi?: string;
  tone?: "neutral" | "warm" | "firm";
};

/**
 * Legacy-safe helper: takes a string/object and returns a HostReply object.
 * (Kept for any older callers that used makeReply directly.)
 */
export function makeReply(input: any): HostReply {
  // If caller already passes a string, echo it.
  if (typeof input === "string") return { text_en: input, tone: "neutral" };

  // If caller passes an object with text_en, preserve it.
  const text_en =
    typeof input?.text_en === "string"
      ? input.text_en
      : typeof input?.en === "string"
        ? input.en
        : "…";

  const text_vi =
    typeof input?.text_vi === "string"
      ? input.text_vi
      : typeof input?.vi === "string"
        ? input.vi
        : undefined;

  const tone =
    input?.tone === "warm" || input?.tone === "firm" ? input.tone : "neutral";

  return { text_en, text_vi, tone };
}

/**
 * ✅ MercyAIHost expects:
 *   const makeReplyFn = useMakeReply();
 *   const reply = makeReplyFn(userText, opts);
 *
 * So useMakeReply MUST return a function, not a HostReply object.
 */
export function useMakeReply() {
  // ---- tiny helpers (all local, deterministic, no side effects) ----
  const norm = (s: any) => (typeof s === "string" ? s.trim() : "");
  const lower = (s: any) => norm(s).toLowerCase();

  const getPath = (opts: any) => norm(opts?.locationPath);
  const isRoomPath = (opts: any) => {
    const p = getPath(opts);
    return !!opts?.isRoom || p.startsWith("/room/");
  };
  const isSigninPath = (opts: any) => {
    const p = getPath(opts);
    return p.startsWith("/signin");
  };

  const getRoomId = (opts: any) => norm(opts?.ctx?.roomId) || norm(opts?.roomIdFromUrl);
  const getRoomTitle = (opts: any) => norm(opts?.ctx?.roomTitle);
  const getKw = (opts: any) => norm(opts?.ctx?.keyword) || norm(opts?.repeatTarget?.keyword);
  const getEntryId = (opts: any) => norm(opts?.ctx?.entryId);

  const hasRepeat = (opts: any) => !!opts?.repeatTarget;
  const repeatStep = (opts: any) => norm(opts?.repeatStep) || "idle";

  const lines = (...xs: Array<string | null | undefined>) => xs.filter(Boolean).join("\n");

  // bilingual micro-copy (NO translation attempt; just curated pairs)
  const T = {
    en: {
      ask: "What do you need right now?",
      empty: "Type a short question, or use a command: /help /tiers /repeat /bug /reset",
      howUseRoom1: "You’re in a room.",
      howUseRoom2: "Tap a keyword pill to begin.",
      howUseRoom3: "Then: EN → tap the face to play → read VI.",
      howUseRoomStuck: "If you don’t see keywords, refresh (Cmd+R) or try another room.",
      howUseHome1: "Start with a room, then pick a keyword.",
      howUseHome2: "Use /tiers to see VIP options (even if you’re already VIP).",
      howUseHome3: "Come back here anytime for next steps.",
      vipPaid1: "If you already paid:",
      vipPaid2: "Go back to your room and try opening a VIP room again.",
      vipPaid3: "If still locked: sign out/in once, then check /tiers to verify.",
      vipCheckout1: "To subscribe:",
      vipCheckout2: "Open /tiers → choose VIP1/VIP3/VIP9 → complete checkout.",
      vipCheckout3: "After payment, return to your room.",
      repeat1: "Repeat mode:",
      repeat2: "Tap Play → listen once → then press “My turn” and speak.",
      repeat3: "If you want a new repeat target, pick a keyword/entry in the room.",
      bug1: "Report a bug:",
      bug2: "Send: roomId + keyword + what happened (audio/UI) + screenshot.",
      bug3: "If the page is stuck, refresh (Cmd+R).",
      help1: "Quick commands:",
      help2: "/tiers  /repeat  /bug  /reset",
      help3: "Tip: On /room, keyword → EN → audio → VI.",
      reset: "Okay — chat cleared. What do you need now?",
      signin1: "Login help:",
      signin2: "If buttons don’t respond, close Host and try again.",
      signin3: "If still stuck, refresh (Cmd+R).",
    },
    vi: {
      ask: "Bạn cần gì ngay bây giờ?",
      empty: "Gõ câu hỏi ngắn, hoặc dùng lệnh: /help /tiers /repeat /bug /reset",
      howUseRoom1: "Bạn đang ở trong một room.",
      howUseRoom2: "Chạm vào keyword để bắt đầu.",
      howUseRoom3: "Sau đó: EN → bấm mặt để nghe → đọc VI.",
      howUseRoomStuck: "Nếu không thấy keyword, refresh (Cmd+R) hoặc thử room khác.",
      howUseHome1: "Bắt đầu bằng một room, rồi chọn keyword.",
      howUseHome2: "Dùng /tiers để xem các gói VIP (kể cả khi bạn đã là VIP).",
      howUseHome3: "Bạn có thể quay lại đây bất kỳ lúc nào để hỏi bước tiếp theo.",
      vipPaid1: "Nếu bạn đã thanh toán:",
      vipPaid2: "Quay lại room và thử mở lại một room VIP.",
      vipPaid3: "Nếu vẫn bị khóa: đăng xuất/đăng nhập lại 1 lần, rồi vào /tiers để kiểm tra.",
      vipCheckout1: "Để đăng ký VIP:",
      vipCheckout2: "Mở /tiers → chọn VIP1/VIP3/VIP9 → thanh toán.",
      vipCheckout3: "Xong thì quay lại room.",
      repeat1: "Repeat mode:",
      repeat2: "Bấm Play → nghe 1 lần → bấm “My turn” rồi nói.",
      repeat3: "Muốn có câu mới để lặp: chọn keyword/entry trong room.",
      bug1: "Báo lỗi:",
      bug2: "Gửi: roomId + keyword + mô tả lỗi (audio/UI) + ảnh chụp màn hình.",
      bug3: "Nếu bị kẹt, refresh (Cmd+R).",
      help1: "Lệnh nhanh:",
      help2: "/tiers  /repeat  /bug  /reset",
      help3: "Gợi ý: Trong /room, keyword → EN → audio → VI.",
      reset: "OK — đã xóa chat. Bạn cần gì bây giờ?",
      signin1: "Hỗ trợ đăng nhập:",
      signin2: "Nếu nút không bấm được, đóng Host rồi thử lại.",
      signin3: "Nếu vẫn kẹt, refresh (Cmd+R).",
    },
  } as const;

  type Intent =
    | "help"
    | "reset"
    | "tiers"
    | "vip_paid"
    | "vip_checkout"
    | "repeat"
    | "bug"
    | "how_to_use"
    | "room_help"
    | "unknown";

  const detectIntent = (u: string, opts: any): Intent => {
    const uL = u.toLowerCase();

    // commands first
    if (uL === "/help") return "help";
    if (uL === "/reset") return "reset";
    if (uL === "/tiers") return "tiers";
    if (uL === "/repeat") return "repeat";
    if (uL === "/bug") return "bug";

    // keywords
    const wantsHow = uL.includes("how do i") || uL.includes("how to") || uL.includes("use this app") || uL.includes("start");
    const talksVip = uL.includes("vip") || uL.includes("subscribe") || uL.includes("checkout") || uL.includes("payment");
    const claimsPaid =
      uL.includes("i'm vip") ||
      uL.includes("i am vip") ||
      uL.includes("already paid") ||
      uL.includes("subscribed") ||
      uL.includes("completed checkout");

    const repeatWords = uL.includes("repeat") || uL.includes("my turn") || uL.includes("play");
    const bugWords = uL.includes("bug") || uL.includes("error") || uL.includes("crash") || uL.includes("audio") || uL.includes("ui");
    const roomWords = uL.includes("keyword") || uL.includes("entry") || uL.includes("room") || uL.includes("stuck") || uL.includes("can't");

    if (claimsPaid && talksVip) return "vip_paid";
    if (talksVip) return "vip_checkout";
    if (repeatWords || hasRepeat(opts)) return "repeat";
    if (bugWords) return "bug";
    if (wantsHow) return "how_to_use";
    if (roomWords) return "room_help";

    return "unknown";
  };

  // ---- returned function (what MercyAIHost calls) ----
  return (userText: string, opts: any): string => {
    const clean = norm(userText);
    const lang: "en" | "vi" = opts?.lang === "vi" ? "vi" : "en";
    const t = T[lang];

    if (!clean) return lines(t.ask, t.empty);

    const intent = detectIntent(clean, opts);

    // context header line (small, calm, useful)
    const rid = getRoomId(opts);
    const title = getRoomTitle(opts);
    const kw = getKw(opts);
    const eid = getEntryId(opts);

    const where = (() => {
      if (isSigninPath(opts)) return lang === "vi" ? "Bạn đang ở trang đăng nhập." : "You’re on the sign-in page.";
      if (isRoomPath(opts)) {
        const label = title || rid || "room";
        const bits: string[] = [];
        bits.push(label);
        if (eid) bits.push(`entry:${eid}`);
        if (kw) bits.push(`kw:${kw}`);
        return bits.length ? (lang === "vi" ? `Ngữ cảnh: ${bits.join(" • ")}` : `Context: ${bits.join(" • ")}`) : null;
      }
      return null;
    })();

    // strict 3-line “next-step” style
    const three = (l1: string, l2: string, l3: string, extra?: string | null) =>
      lines(where, l1, l2, l3, extra ? extra : undefined);

    if (intent === "reset") {
      // Caller may actually clear chat elsewhere; keep reply simple.
      return lines(where, t.reset);
    }

    if (intent === "help") {
      return three(t.help1, t.help2, t.help3, null);
    }

    if (intent === "tiers" || intent === "vip_checkout") {
      return three(t.vipCheckout1, t.vipCheckout2, t.vipCheckout3, null);
    }

    if (intent === "vip_paid") {
      return three(t.vipPaid1, t.vipPaid2, t.vipPaid3, null);
    }

    if (intent === "repeat") {
      const step = repeatStep(opts);
      const stepLine =
        step === "play"
          ? lang === "vi"
            ? "Hiện tại: bước Play."
            : "Right now: Play step."
          : step === "your_turn"
            ? lang === "vi"
              ? "Hiện tại: đến lượt bạn."
              : "Right now: Your turn."
            : null;

      return three(t.repeat1, t.repeat2, t.repeat3, stepLine);
    }

    if (intent === "bug") {
      return three(t.bug1, t.bug2, t.bug3, null);
    }

    if (intent === "how_to_use") {
      if (isSigninPath(opts)) {
        return three(t.signin1, t.signin2, t.signin3, null);
      }
      if (isRoomPath(opts)) {
        const extra = kw
          ? lang === "vi"
            ? `Bạn đang chọn: ${kw}.`
            : `Selected keyword: ${kw}.`
          : null;
        return three(t.howUseRoom1, t.howUseRoom2, t.howUseRoom3, extra || t.howUseRoomStuck);
      }
      return three(t.howUseHome1, t.howUseHome2, t.howUseHome3, null);
    }

    if (intent === "room_help") {
      if (isRoomPath(opts)) {
        const extra = kw
          ? lang === "vi"
            ? `Keyword hiện tại: ${kw}.`
            : `Current keyword: ${kw}.`
          : null;
        return three(t.howUseRoom1, t.howUseRoom2, t.howUseRoom3, extra || t.howUseRoomStuck);
      }
      return three(t.howUseHome1, t.howUseHome2, t.howUseHome3, null);
    }

    // unknown: gentle routing + give 1 best next action based on page
    if (isRoomPath(opts)) {
      return three(
        lang === "vi" ? "Mình hiểu." : "Got it.",
        t.howUseRoom2,
        t.howUseRoom3,
        kw
          ? lang === "vi"
            ? `Bạn đang xem: ${kw}.`
            : `You’re on: ${kw}.`
          : t.howUseRoomStuck
      );
    }

    return three(
      lang === "vi" ? "Mình hiểu." : "Got it.",
      lang === "vi" ? "Muốn bắt đầu nhanh: vào một room và chọn keyword." : "Fast start: open a room and pick a keyword.",
      lang === "vi" ? "Nếu cần VIP: mở /tiers." : "If you need VIP: open /tiers.",
      null
    );
  };
}
