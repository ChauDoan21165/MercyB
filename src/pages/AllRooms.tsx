// FILE: AllRooms.tsx
// PATH: src/pages/AllRooms.tsx
// VERSION: v2.0
//
// Rooms hub
// Fixes:
// 1) Replace old utility-only page with a real Rooms landing page.
// 2) Add "Continue your journey" from localStorage.mb.lastRoomId.
// 3) Add Recommended Paths.
// 4) Add Explore by Topic.
// 5) Keep bilingual EN / VI copy.
// 6) Keep a working Refresh /rooms action.

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

type RoomLite = {
  id: string;
  titleEN?: string;
  titleVI?: string;
  subtitleEN?: string;
  subtitleVI?: string;
};

type PathLite = {
  id: string;
  emoji: string;
  titleEN: string;
  titleVI: string;
  bodyEN: string;
  bodyVI: string;
  roomIds: string[];
};

type TopicLite = {
  id: string;
  titleEN: string;
  titleVI: string;
  roomIds: string[];
};

const LS_LAST_ROOM = "mb.lastRoomId";

const ROOM_LIBRARY: RoomLite[] = [
  { id: "sleep_basics", titleEN: "Sleep Basics", titleVI: "Nền tảng giấc ngủ" },
  { id: "slow_breathing", titleEN: "Slow Breathing", titleVI: "Thở chậm" },
  { id: "letting_go", titleEN: "Letting Go", titleVI: "Buông bỏ" },
  { id: "quiet_morning", titleEN: "Quiet Morning", titleVI: "Buổi sáng yên tĩnh" },
  { id: "rest_after_work", titleEN: "Rest After Work", titleVI: "Nghỉ ngơi sau giờ làm" },

  { id: "speaking_clearly", titleEN: "Speaking Clearly", titleVI: "Nói rõ ràng" },
  { id: "expressing_needs", titleEN: "Expressing Needs", titleVI: "Bày tỏ nhu cầu" },
  { id: "asking_gently", titleEN: "Asking Gently", titleVI: "Hỏi nhẹ nhàng" },
  { id: "hard_conversations", titleEN: "Hard Conversations", titleVI: "Những cuộc trò chuyện khó" },

  { id: "life_direction", titleEN: "Life Direction", titleVI: "Định hướng cuộc sống" },
  { id: "small_next_step", titleEN: "Small Next Step", titleVI: "Bước tiếp theo nhỏ" },
  { id: "clarity_at_work", titleEN: "Clarity at Work", titleVI: "Sự rõ ràng trong công việc" },
  { id: "money_and_peace", titleEN: "Money and Peace", titleVI: "Tiền bạc và sự bình an" },
  { id: "purpose_and_patience", titleEN: "Purpose and Patience", titleVI: "Mục đích và sự kiên nhẫn" },

  { id: "gratitude", titleEN: "Gratitude", titleVI: "Biết ơn" },
  { id: "self_kindness", titleEN: "Self-Kindness", titleVI: "Tử tế với chính mình" },
  { id: "boundaries", titleEN: "Boundaries", titleVI: "Ranh giới" },
  { id: "starting_again", titleEN: "Starting Again", titleVI: "Bắt đầu lại" },
];

const ROOM_PATHS: PathLite[] = [
  {
    id: "calm_mind",
    emoji: "🌿",
    titleEN: "Calm Mind",
    titleVI: "Tâm trí an yên",
    bodyEN: "Start here if life feels heavy.",
    bodyVI: "Bắt đầu từ đây nếu cuộc sống đang nặng nề.",
    roomIds: ["sleep_basics", "slow_breathing", "letting_go", "quiet_morning"],
  },
  {
    id: "confidence",
    emoji: "💬",
    titleEN: "Speak with Confidence",
    titleVI: "Nói với sự tự tin",
    bodyEN: "Practice expressing real thoughts in English.",
    bodyVI: "Luyện diễn đạt suy nghĩ thật bằng tiếng Anh.",
    roomIds: ["speaking_clearly", "expressing_needs", "asking_gently", "hard_conversations"],
  },
  {
    id: "life_direction",
    emoji: "🧭",
    titleEN: "Life Direction",
    titleVI: "Định hướng cuộc sống",
    bodyEN: "Reflect on work, purpose, and next decisions.",
    bodyVI: "Suy ngẫm về công việc, mục đích và quyết định tiếp theo.",
    roomIds: ["life_direction", "small_next_step", "clarity_at_work", "purpose_and_patience"],
  },
];

const ROOM_TOPICS: TopicLite[] = [
  {
    id: "sleep_rest",
    titleEN: "Sleep & Rest",
    titleVI: "Giấc ngủ & nghỉ ngơi",
    roomIds: ["sleep_basics", "quiet_morning", "rest_after_work", "slow_breathing"],
  },
  {
    id: "mind_calm",
    titleEN: "Mind & Calm",
    titleVI: "Tâm trí & bình an",
    roomIds: ["slow_breathing", "letting_go", "gratitude", "self_kindness", "starting_again"],
  },
  {
    id: "communication",
    titleEN: "Communication",
    titleVI: "Giao tiếp",
    roomIds: ["speaking_clearly", "expressing_needs", "asking_gently", "hard_conversations"],
  },
  {
    id: "work_money",
    titleEN: "Work & Money",
    titleVI: "Công việc & tiền bạc",
    roomIds: ["clarity_at_work", "money_and_peace", "small_next_step"],
  },
  {
    id: "relationships",
    titleEN: "Relationships",
    titleVI: "Các mối quan hệ",
    roomIds: ["asking_gently", "boundaries", "hard_conversations", "self_kindness"],
  },
  {
    id: "life_path",
    titleEN: "Life Direction",
    titleVI: "Định hướng cuộc sống",
    roomIds: ["life_direction", "purpose_and_patience", "starting_again", "small_next_step"],
  },
];

function prettifyRoomTitle(id: string) {
  return String(id || "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function getRoomById(id: string): RoomLite {
  const found = ROOM_LIBRARY.find((r) => r.id === id);
  if (found) return found;
  return {
    id,
    titleEN: prettifyRoomTitle(id),
    titleVI: prettifyRoomTitle(id),
  };
}

function DualText({
  en,
  vi,
  muted = false,
  strong = false,
}: {
  en: string;
  vi: string;
  muted?: boolean;
  strong?: boolean;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        flexDirection: "column",
        gap: 2,
        lineHeight: 1.15,
        color: muted ? "rgba(0,0,0,0.60)" : "rgba(0,0,0,0.86)",
        fontWeight: strong ? 900 : 700,
      }}
    >
      <span>{en}</span>
      <span style={{ fontWeight: strong ? 850 : 650 }}>{vi}</span>
    </span>
  );
}

function SectionTitle({
  en,
  vi,
  right,
}: {
  en: string;
  vi: string;
  right?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      <DualText en={en} vi={vi} strong />
      {right}
    </div>
  );
}

function PillButton({
  children,
  onClick,
  asLinkTo,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  asLinkTo?: string;
}) {
  const style: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: "10px 14px",
    borderRadius: 9999,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(255,255,255,0.92)",
    color: "rgba(0,0,0,0.84)",
    textDecoration: "none",
    fontWeight: 950,
    letterSpacing: -0.2,
    boxShadow: "0 10px 22px rgba(0,0,0,0.06)",
    cursor: "pointer",
  };

  if (asLinkTo) {
    return (
      <Link to={asLinkTo} style={style}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} style={style}>
      {children}
    </button>
  );
}

function RoomTile({ room, onOpen }: { room: RoomLite; onOpen: (roomId: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(room.id)}
      style={{
        width: "100%",
        textAlign: "left",
        borderRadius: 16,
        border: "1px solid rgba(0,0,0,0.10)",
        background: "rgba(255,255,255,0.84)",
        padding: 14,
        boxShadow: "0 12px 28px rgba(0,0,0,0.05)",
        cursor: "pointer",
      }}
      aria-label={`${room.titleEN || prettifyRoomTitle(room.id)} / ${room.titleVI || prettifyRoomTitle(room.id)}`}
    >
      <div
        style={{
          fontSize: 15,
          fontWeight: 900,
          letterSpacing: -0.2,
          color: "rgba(0,0,0,0.88)",
          lineHeight: 1.2,
        }}
      >
        <div>{room.titleEN || prettifyRoomTitle(room.id)}</div>
        <div style={{ fontWeight: 750, color: "rgba(0,0,0,0.66)", marginTop: 3 }}>
          {room.titleVI || prettifyRoomTitle(room.id)}
        </div>
      </div>
    </button>
  );
}

function PathCard({
  path,
  onOpenRoom,
}: {
  path: PathLite;
  onOpenRoom: (roomId: string) => void;
}) {
  const firstRoomId = path.roomIds[0];

  return (
    <div
      style={{
        borderRadius: 18,
        border: "1px solid rgba(0,0,0,0.10)",
        background: "rgba(255,255,255,0.84)",
        padding: 18,
        boxShadow: "0 18px 40px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontWeight: 950,
          letterSpacing: -0.4,
          color: "rgba(0,0,0,0.88)",
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
        }}
      >
        <span style={{ fontSize: 22, lineHeight: 1 }}>{path.emoji}</span>
        <div>
          <div>{path.titleEN}</div>
          <div style={{ fontSize: 14, fontWeight: 750, color: "rgba(0,0,0,0.64)", marginTop: 2 }}>
            {path.titleVI}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 10,
          fontSize: 14,
          lineHeight: 1.55,
          color: "rgba(0,0,0,0.68)",
        }}
      >
        <div>{path.bodyEN}</div>
        <div>{path.bodyVI}</div>
      </div>

      <div style={{ marginTop: 12 }}>
        <PillButton onClick={() => onOpenRoom(firstRoomId)}>
          <DualText en="Start here" vi="Bắt đầu tại đây" strong />
        </PillButton>
      </div>
    </div>
  );
}

function ContinueCard({
  room,
  onOpen,
}: {
  room: RoomLite;
  onOpen: (roomId: string) => void;
}) {
  return (
    <div
      style={{
        borderRadius: 20,
        border: "1px solid rgba(0,0,0,0.10)",
        background: "rgba(255,255,255,0.86)",
        padding: 20,
        boxShadow: "0 18px 44px rgba(0,0,0,0.07)",
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 900, color: "rgba(0,0,0,0.62)", letterSpacing: 0.1 }}>
        Continue your journey
      </div>
      <div style={{ fontSize: 13, fontWeight: 750, color: "rgba(0,0,0,0.50)", marginTop: 2 }}>
        Tiếp tục hành trình của bạn
      </div>

      <div style={{ marginTop: 12, fontSize: 26, fontWeight: 950, letterSpacing: -0.6, color: "rgba(0,0,0,0.9)" }}>
        {room.titleEN || prettifyRoomTitle(room.id)}
      </div>
      <div style={{ marginTop: 4, fontSize: 16, fontWeight: 750, color: "rgba(0,0,0,0.62)" }}>
        {room.titleVI || prettifyRoomTitle(room.id)}
      </div>

      <div style={{ marginTop: 10, color: "rgba(0,0,0,0.68)", lineHeight: 1.55, fontSize: 14 }}>
        <div>Pick up where you left off.</div>
        <div>Tiếp tục từ nơi bạn đã dừng lại.</div>
      </div>

      <div style={{ marginTop: 14 }}>
        <PillButton onClick={() => onOpen(room.id)}>
          <DualText en="Continue" vi="Tiếp tục" strong />
        </PillButton>
      </div>
    </div>
  );
}

export default function AllRooms() {
  const navigate = useNavigate();
  const loc = useLocation();

  const [lastRoomId, setLastRoomId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_LAST_ROOM);
      setLastRoomId(saved ? String(saved).trim() : null);
    } catch {
      setLastRoomId(null);
    }
  }, []);

  const rainbow =
    "linear-gradient(90deg,#ff4d4d 0%,#ffb84d 18%,#b6ff4d 36%,#4dffb8 54%,#4db8ff 72%,#b84dff 90%,#ff4dff 100%)";

  const isNarrow =
    typeof window !== "undefined" ? window.matchMedia("(max-width: 860px)").matches : false;

  const goRoom = useCallback(
    (roomId: string) => {
      if (!roomId) return;
      navigate(`/room/${roomId}`);
    },
    [navigate],
  );

  const onRefreshRooms = useCallback(() => {
    try {
      (navigate as unknown as (to: number) => void)(0);
      return;
    } catch {
      try {
        const qs = new URLSearchParams(loc.search || "");
        qs.set("ts", String(Date.now()));
        navigate(`${loc.pathname}?${qs.toString()}`, { replace: true });
        return;
      } catch {
        try {
          window.location.reload();
        } catch {
          // ignore
        }
      }
    }
  }, [navigate, loc.pathname, loc.search]);

  const lastRoom = useMemo(() => {
    if (!lastRoomId) return null;
    return getRoomById(lastRoomId);
  }, [lastRoomId]);

  const resolvedTopics = useMemo(
    () =>
      ROOM_TOPICS.map((topic) => ({
        ...topic,
        rooms: topic.roomIds.map(getRoomById).slice(0, 6),
      })),
    [],
  );

  const wrap: React.CSSProperties = {
    width: "100%",
    minHeight: "calc(100vh - 60px)",
    padding: "18px 16px 64px",
  };

  const shell: React.CSSProperties = {
    maxWidth: 980,
    margin: "0 auto",
  };

  const headRow: React.CSSProperties = {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  };

  const title: React.CSSProperties = {
    margin: 0,
    fontSize: 44,
    fontWeight: 950,
    letterSpacing: -1.1,
    background: rainbow,
    WebkitBackgroundClip: "text",
    color: "transparent",
    lineHeight: 1.02,
  };

  const kicker: React.CSSProperties = {
    marginTop: 8,
    marginBottom: 0,
    color: "rgba(0,0,0,0.70)",
    fontSize: 14,
    lineHeight: 1.55,
    fontWeight: 800,
  };

  const topButtons: React.CSSProperties = {
    display: "flex",
    gap: 10,
    alignItems: "center",
    flexWrap: "wrap",
  };

  const surface: React.CSSProperties = {
    marginTop: 16,
    borderRadius: 22,
    border: "1px solid rgba(0,0,0,0.10)",
    padding: isNarrow ? 16 : 18,
    background:
      "radial-gradient(800px 300px at 15% 10%, rgba(255,77,77,0.10), transparent 60%), radial-gradient(800px 300px at 70% 15%, rgba(77,184,255,0.10), transparent 60%), rgba(255,255,255,0.80)",
    boxShadow: "0 24px 60px rgba(0,0,0,0.08)",
  };

  const pathGrid: React.CSSProperties = {
    marginTop: 14,
    display: "grid",
    gridTemplateColumns: isNarrow ? "1fr" : "repeat(3, minmax(0, 1fr))",
    gap: 14,
  };

  const topicGrid: React.CSSProperties = {
    marginTop: 12,
    display: "grid",
    gridTemplateColumns: isNarrow ? "1fr" : "repeat(2, minmax(0, 1fr))",
    gap: 14,
  };

  const roomGrid: React.CSSProperties = {
    marginTop: 12,
    display: "grid",
    gridTemplateColumns: isNarrow ? "1fr" : "repeat(2, minmax(0, 1fr))",
    gap: 10,
  };

  return (
    <div style={wrap}>
      <div style={shell}>
        <div style={headRow}>
          <div>
            <div style={{ color: "rgba(0,0,0,0.65)", fontWeight: 900, fontSize: 14 }}>
              Mercy Blade • Rooms
              <span style={{ marginLeft: 10, opacity: 0.6 }}>•</span>
              <span style={{ marginLeft: 10, opacity: 0.85 }}>Thư viện reflection</span>
            </div>

            <h1 style={title}>Rooms</h1>

            <p style={kicker}>
              <span style={{ display: "block" }}>Find a calm place to continue, begin, or explore.</span>
              <span style={{ display: "block" }}>Tìm một nơi yên tĩnh để tiếp tục, bắt đầu hoặc khám phá.</span>
            </p>
          </div>

          <div style={topButtons} aria-label="Top quick buttons">
            <PillButton asLinkTo="/">
              <DualText en="Home" vi="Trang chủ" strong />
            </PillButton>
            <PillButton asLinkTo="/pricing">
              <DualText en="Pricing" vi="Bảng giá" strong />
            </PillButton>
            <PillButton onClick={onRefreshRooms}>
              <DualText en="Refresh /rooms" vi="Tải lại /rooms" strong />
            </PillButton>
          </div>
        </div>

        {lastRoom ? (
          <div style={surface}>
            <ContinueCard room={lastRoom} onOpen={goRoom} />
          </div>
        ) : null}

        <div style={surface}>
          <SectionTitle
            en="Recommended for you"
            vi="Gợi ý cho bạn"
            right={<DualText en="Start with one path" vi="Bắt đầu với một lộ trình" muted />}
          />

          <div style={pathGrid}>
            {ROOM_PATHS.map((path) => (
              <PathCard key={path.id} path={path} onOpenRoom={goRoom} />
            ))}
          </div>
        </div>

        <div style={surface}>
          <SectionTitle
            en="Explore the library"
            vi="Khám phá thư viện"
            right={<DualText en="A gentle way to browse" vi="Một cách duyệt nhẹ nhàng" muted />}
          />

          <div style={topicGrid}>
            {resolvedTopics.map((topic) => (
              <div
                key={topic.id}
                style={{
                  borderRadius: 18,
                  border: "1px solid rgba(0,0,0,0.10)",
                  background: "rgba(255,255,255,0.84)",
                  padding: 16,
                  boxShadow: "0 16px 36px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 950, letterSpacing: -0.3, color: "rgba(0,0,0,0.88)" }}>
                  {topic.titleEN}
                </div>
                <div style={{ marginTop: 3, fontSize: 14, fontWeight: 750, color: "rgba(0,0,0,0.62)" }}>
                  {topic.titleVI}
                </div>

                <div style={roomGrid}>
                  {topic.rooms.map((room) => (
                    <RoomTile key={room.id} room={room} onOpen={goRoom} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={surface}>
          <SectionTitle
            en="Quick links"
            vi="Liên kết nhanh"
            right={
              <Link
                to="/signin"
                style={{
                  textDecoration: "underline",
                  fontWeight: 900,
                  color: "rgba(0,0,0,0.72)",
                }}
                aria-label="Sign in / Đăng nhập"
              >
                <DualText en="Sign in" vi="Đăng nhập" strong />
              </Link>
            }
          />

          <div style={{ marginTop: 8 }}>
            <DualText
              en="This page is still using a lightweight local config for paths and topics."
              vi="Trang này hiện vẫn dùng cấu hình cục bộ nhẹ cho lộ trình và chủ đề."
              muted
            />
          </div>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: isNarrow ? "1fr" : "repeat(3, minmax(0, 1fr))",
              gap: 12,
            }}
          >
            <PillButton asLinkTo="/">
              <DualText en="Home" vi="Trang chủ" strong />
            </PillButton>
            <PillButton asLinkTo="/pricing">
              <DualText en="Pricing" vi="Bảng giá" strong />
            </PillButton>
            <PillButton asLinkTo="/tiers">
              <DualText en="Tier Map" vi="Bản đồ Tier" strong />
            </PillButton>
          </div>
        </div>
      </div>
    </div>
  );
}