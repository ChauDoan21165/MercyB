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
 * So useMakeReply MUST return a function.
 *
 * NOTE:
 * - We return a STRING (not HostReply) because MercyAIHost’s current UI renders a single text bubble.
 * - To make the host bilingual, we embed both EN + VI in that single string.
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

  const getRoomId = (opts: any) =>
    norm(opts?.ctx?.roomId) || norm(opts?.roomIdFromUrl);
  const getRoomTitle = (opts: any) => norm(opts?.ctx?.roomTitle);
  const getKw = (opts: any) =>
    norm(opts?.ctx?.keyword) || norm(opts?.repeatTarget?.keyword);
  const getEntryId = (opts: any) => norm(opts?.ctx?.entryId);

  const hasRepeat = (opts: any) => !!opts?.repeatTarget;
  const repeatStep = (opts: any) => norm(opts?.repeatStep) || "idle";

  const lines = (...xs: Array<string | null | undefined>) =>
    xs.filter(Boolean).join("\n");

  // Bilingual rendering helper: always returns EN + VI inside one string bubble.
  const bi = (
    enBlock: string | null | undefined,
    viBlock: string | null | undefined
  ) => {
    const en = norm(enBlock);
    const vi = norm(viBlock);
    if (en && vi) return `EN:\n${en}\n\nVI:\n${vi}`;
    if (en) return `EN:\n${en}`;
    if (vi) return `VI:\n${vi}`;
    return "…";
  };

  // bilingual micro-copy (curated pairs; deterministic)
  const T = {
    en: {
      // greetings
      hello1: "Hello! 👋",
      hello2: "Nice to see you.",
      hello3: "Do you want to start with a room, or tell me your goal?",

      ask: "What do you need right now?",
      empty:
        "Type a short question, or use a command: /help /tiers /repeat /bug /reset",
      howUseRoom1: "You’re in a room.",
      howUseRoom2: "Tap a keyword pill to begin.",
      howUseRoom3: "Then: EN → tap the face to play → read VI.",
      howUseRoomStuck:
        "If you don’t see keywords, refresh (Cmd+R) or try another room.",
      howUseHome1: "Start with a room, then pick a keyword.",
      howUseHome2: "Use /tiers to see VIP options (even if you’re already VIP).",
      howUseHome3: "Come back here anytime for next steps.",
      vipPaid1: "If you already paid:",
      vipPaid2: "Go back to your room and try opening a VIP room again.",
      vipPaid3: "If still locked: sign out/in once, then check /tiers to verify.",
      vipCheckout1: "To subscribe:",
      vipCheckout2:
        "Open /tiers → choose VIP1/VIP3/VIP9 → complete checkout.",
      vipCheckout3: "After payment, return to your room.",
      repeat1: "Repeat mode:",
      repeat2: "Tap Play → listen once → then press “My turn” and speak.",
      repeat3:
        "If you want a new repeat target, pick a keyword/entry in the room.",
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
      gotIt: "Got it.",
      fastStart: "Fast start: open a room and pick a keyword.",
      vipHint: "If you need VIP: open /tiers.",
      ctxSignin: "You’re on the sign-in page.",
      ctxPrefix: "Context:",
      selectedKw: "Selected keyword:",
      currentKw: "Current keyword:",
      youAreOn: "You’re on:",
      nowPlay: "Right now: Play step.",
      nowYourTurn: "Right now: Your turn.",
    },
    vi: {
      // greetings
      hello1: "Chào bạn! 👋",
      hello2: "Rất vui gặp bạn.",
      hello3: "Bạn muốn bắt đầu bằng một room, hay nói mục tiêu của bạn?",

      ask: "Bạn cần gì ngay bây giờ?",
      empty: "Gõ câu hỏi ngắn, hoặc dùng lệnh: /help /tiers /repeat /bug /reset",
      howUseRoom1: "Bạn đang ở trong một room.",
      howUseRoom2: "Chạm vào keyword để bắt đầu.",
      howUseRoom3: "Sau đó: EN → bấm mặt để nghe → đọc VI.",
      howUseRoomStuck:
        "Nếu không thấy keyword, refresh (Cmd+R) hoặc thử room khác.",
      howUseHome1: "Bắt đầu bằng một room, rồi chọn keyword.",
      howUseHome2:
        "Dùng /tiers để xem các gói VIP (kể cả khi bạn đã là VIP).",
      howUseHome3:
        "Bạn có thể quay lại đây bất kỳ lúc nào để hỏi bước tiếp theo.",
      vipPaid1: "Nếu bạn đã thanh toán:",
      vipPaid2: "Quay lại room và thử mở lại một room VIP.",
      vipPaid3:
        "Nếu vẫn bị khóa: đăng xuất/đăng nhập lại 1 lần, rồi vào /tiers để kiểm tra.",
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
      gotIt: "Mình hiểu.",
      fastStart: "Bắt đầu nhanh: vào một room và chọn keyword.",
      vipHint: "Nếu cần VIP: mở /tiers.",
      ctxSignin: "Bạn đang ở trang đăng nhập.",
      ctxPrefix: "Ngữ cảnh:",
      selectedKw: "Keyword đã chọn:",
      currentKw: "Keyword hiện tại:",
      youAreOn: "Bạn đang ở:",
      nowPlay: "Hiện tại: bước Play.",
      nowYourTurn: "Hiện tại: đến lượt bạn.",
    },
  } as const;

  type Intent =
    | "greeting"
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

  const isGreeting = (u: string) => {
    const s = lower(u);
    // English
    if (
      s === "hi" ||
      s === "hello" ||
      s === "hey" ||
      s === "yo" ||
      s.startsWith("hi ") ||
      s.startsWith("hello ") ||
      s.startsWith("hey ") ||
      s.includes("good morning") ||
      s.includes("good afternoon") ||
      s.includes("good evening")
    )
      return true;

    // Vietnamese
    if (
      s === "chào" ||
      s === "xin chào" ||
      s === "chao" ||
      s === "xin chao" ||
      s.startsWith("chào ") ||
      s.startsWith("xin chào ") ||
      s.startsWith("chao ") ||
      s.startsWith("xin chao ") ||
      s.includes("chào bạn") ||
      s.includes("xin chào bạn")
    )
      return true;

    // common emoji-only greeting
    if (s === "👋" || s === "🙏" || s === "❤️") return true;

    return false;
  };

  const detectIntent = (u: string, opts: any): Intent => {
    const uL = lower(u);

    // greeting first (so "hello" doesn't fall through to unknown)
    if (isGreeting(uL)) return "greeting";

    // commands first
    if (uL === "/help") return "help";
    if (uL === "/reset") return "reset";
    if (uL === "/tiers") return "tiers";
    if (uL === "/repeat") return "repeat";
    if (uL === "/bug") return "bug";

    // keywords
    const wantsHow =
      uL.includes("how do i") ||
      uL.includes("how to") ||
      uL.includes("use this app") ||
      uL.includes("start") ||
      uL.includes("làm sao") ||
      uL.includes("cách") ||
      uL.includes("bắt đầu");

    const talksVip =
      uL.includes("vip") ||
      uL.includes("subscribe") ||
      uL.includes("checkout") ||
      uL.includes("payment") ||
      uL.includes("thanh toán") ||
      uL.includes("đăng ký") ||
      uL.includes("dang ky");

    const claimsPaid =
      uL.includes("i'm vip") ||
      uL.includes("i am vip") ||
      uL.includes("already paid") ||
      uL.includes("subscribed") ||
      uL.includes("completed checkout") ||
      uL.includes("mình đã trả") ||
      uL.includes("toi da tra") ||
      uL.includes("đã thanh toán") ||
      uL.includes("da thanh toan");

    const repeatWords =
      uL.includes("repeat") ||
      uL.includes("my turn") ||
      uL.includes("play") ||
      uL.includes("lặp") ||
      uL.includes("lap") ||
      uL.includes("đến lượt") ||
      uL.includes("den luot");

    const bugWords =
      uL.includes("bug") ||
      uL.includes("error") ||
      uL.includes("crash") ||
      uL.includes("audio") ||
      uL.includes("ui") ||
      uL.includes("lỗi") ||
      uL.includes("loi") ||
      uL.includes("đơ") ||
      uL.includes("do");

    const roomWords =
      uL.includes("keyword") ||
      uL.includes("entry") ||
      uL.includes("room") ||
      uL.includes("stuck") ||
      uL.includes("can't") ||
      uL.includes("không thấy") ||
      uL.includes("khong thay") ||
      uL.includes("kẹt") ||
      uL.includes("ket");

    if (claimsPaid && talksVip) return "vip_paid";
    if (talksVip) return "vip_checkout";
    if (repeatWords || hasRepeat(opts)) return "repeat";
    if (bugWords) return "bug";
    if (wantsHow) return "how_to_use";
    if (roomWords) return "room_help";

    return "unknown";
  };

  // Build a bilingual context header (kept small, calm)
  const buildWhere = (opts: any) => {
    const rid = getRoomId(opts);
    const title = getRoomTitle(opts);
    const kw = getKw(opts);
    const eid = getEntryId(opts);

    const whereEn = (() => {
      if (isSigninPath(opts)) return T.en.ctxSignin;
      if (isRoomPath(opts)) {
        const label = title || rid || "room";
        const bits: string[] = [];
        bits.push(label);
        if (eid) bits.push(`entry:${eid}`);
        if (kw) bits.push(`kw:${kw}`);
        return bits.length ? `${T.en.ctxPrefix} ${bits.join(" • ")}` : null;
      }
      return null;
    })();

    const whereVi = (() => {
      if (isSigninPath(opts)) return T.vi.ctxSignin;
      if (isRoomPath(opts)) {
        const label = title || rid || "room";
        const bits: string[] = [];
        bits.push(label);
        if (eid) bits.push(`entry:${eid}`);
        if (kw) bits.push(`kw:${kw}`);
        return bits.length ? `${T.vi.ctxPrefix} ${bits.join(" • ")}` : null;
      }
      return null;
    })();

    return { whereEn, whereVi, rid, title, kw, eid };
  };

  const three = (
    whereEn: string | null | undefined,
    whereVi: string | null | undefined,
    en1: string,
    en2: string,
    en3: string,
    vi1: string,
    vi2: string,
    vi3: string,
    enExtra?: string | null,
    viExtra?: string | null
  ) => {
    const enBlock = lines(whereEn, en1, en2, en3, enExtra || undefined);
    const viBlock = lines(whereVi, vi1, vi2, vi3, viExtra || undefined);
    return bi(enBlock, viBlock);
  };

  // ---- returned function (what MercyAIHost calls) ----
  return (userText: string, opts: any): string => {
    const clean = norm(userText);
    const { whereEn, whereVi, kw } = buildWhere(opts);

    if (!clean) {
      const enBlock = lines(whereEn, T.en.ask, T.en.empty);
      const viBlock = lines(whereVi, T.vi.ask, T.vi.empty);
      return bi(enBlock, viBlock);
    }

    const intent = detectIntent(clean, opts);

    if (intent === "greeting") {
      // Warm, polite, short. No upsell.
      const enBlock = lines(whereEn, T.en.hello1, T.en.hello2, T.en.hello3);
      const viBlock = lines(whereVi, T.vi.hello1, T.vi.hello2, T.vi.hello3);
      return bi(enBlock, viBlock);
    }

    if (intent === "reset") {
      const enBlock = lines(whereEn, T.en.reset);
      const viBlock = lines(whereVi, T.vi.reset);
      return bi(enBlock, viBlock);
    }

    if (intent === "help") {
      return three(
        whereEn,
        whereVi,
        T.en.help1,
        T.en.help2,
        T.en.help3,
        T.vi.help1,
        T.vi.help2,
        T.vi.help3
      );
    }

    if (intent === "tiers" || intent === "vip_checkout") {
      return three(
        whereEn,
        whereVi,
        T.en.vipCheckout1,
        T.en.vipCheckout2,
        T.en.vipCheckout3,
        T.vi.vipCheckout1,
        T.vi.vipCheckout2,
        T.vi.vipCheckout3
      );
    }

    if (intent === "vip_paid") {
      return three(
        whereEn,
        whereVi,
        T.en.vipPaid1,
        T.en.vipPaid2,
        T.en.vipPaid3,
        T.vi.vipPaid1,
        T.vi.vipPaid2,
        T.vi.vipPaid3
      );
    }

    if (intent === "repeat") {
      const step = repeatStep(opts);
      const enStepLine =
        step === "play"
          ? T.en.nowPlay
          : step === "your_turn"
            ? T.en.nowYourTurn
            : null;
      const viStepLine =
        step === "play"
          ? T.vi.nowPlay
          : step === "your_turn"
            ? T.vi.nowYourTurn
            : null;

      return three(
        whereEn,
        whereVi,
        T.en.repeat1,
        T.en.repeat2,
        T.en.repeat3,
        T.vi.repeat1,
        T.vi.repeat2,
        T.vi.repeat3,
        enStepLine,
        viStepLine
      );
    }

    if (intent === "bug") {
      return three(
        whereEn,
        whereVi,
        T.en.bug1,
        T.en.bug2,
        T.en.bug3,
        T.vi.bug1,
        T.vi.bug2,
        T.vi.bug3
      );
    }

    if (intent === "how_to_use") {
      if (isSigninPath(opts)) {
        return three(
          whereEn,
          whereVi,
          T.en.signin1,
          T.en.signin2,
          T.en.signin3,
          T.vi.signin1,
          T.vi.signin2,
          T.vi.signin3
        );
      }

      if (isRoomPath(opts)) {
        const enExtra = kw ? `${T.en.selectedKw} ${kw}.` : T.en.howUseRoomStuck;
        const viExtra = kw ? `${T.vi.selectedKw} ${kw}.` : T.vi.howUseRoomStuck;

        return three(
          whereEn,
          whereVi,
          T.en.howUseRoom1,
          T.en.howUseRoom2,
          T.en.howUseRoom3,
          T.vi.howUseRoom1,
          T.vi.howUseRoom2,
          T.vi.howUseRoom3,
          enExtra,
          viExtra
        );
      }

      return three(
        whereEn,
        whereVi,
        T.en.howUseHome1,
        T.en.howUseHome2,
        T.en.howUseHome3,
        T.vi.howUseHome1,
        T.vi.howUseHome2,
        T.vi.howUseHome3
      );
    }

    if (intent === "room_help") {
      if (isRoomPath(opts)) {
        const enExtra = kw ? `${T.en.currentKw} ${kw}.` : T.en.howUseRoomStuck;
        const viExtra = kw ? `${T.vi.currentKw} ${kw}.` : T.vi.howUseRoomStuck;

        return three(
          whereEn,
          whereVi,
          T.en.howUseRoom1,
          T.en.howUseRoom2,
          T.en.howUseRoom3,
          T.vi.howUseRoom1,
          T.vi.howUseRoom2,
          T.vi.howUseRoom3,
          enExtra,
          viExtra
        );
      }

      return three(
        whereEn,
        whereVi,
        T.en.howUseHome1,
        T.en.howUseHome2,
        T.en.howUseHome3,
        T.vi.howUseHome1,
        T.vi.howUseHome2,
        T.vi.howUseHome3
      );
    }

    // unknown: gentle routing + 1 best next action based on page
    if (isRoomPath(opts)) {
      const enExtra = kw ? `${T.en.youAreOn} ${kw}.` : T.en.howUseRoomStuck;
      const viExtra = kw ? `${T.vi.youAreOn} ${kw}.` : T.vi.howUseRoomStuck;

      return three(
        whereEn,
        whereVi,
        T.en.gotIt,
        T.en.howUseRoom2,
        T.en.howUseRoom3,
        T.vi.gotIt,
        T.vi.howUseRoom2,
        T.vi.howUseRoom3,
        enExtra,
        viExtra
      );
    }

    // home/other pages
    return three(
      whereEn,
      whereVi,
      T.en.gotIt,
      T.en.fastStart,
      T.en.vipHint,
      T.vi.gotIt,
      T.vi.fastStart,
      T.vi.vipHint
    );
  };
}