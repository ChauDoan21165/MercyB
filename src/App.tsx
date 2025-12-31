// src/pages/Home.tsx
// MB-BLUE-98.4 — 2025-12-29 (+0700)
/**
 * Home (PUBLIC LANDING — BEAUTIFUL)
 *
 * Goal:
 * - Show the real Mercy Blade vibe immediately:
 *   hero band + bilingual essays + (optional) audio-first.
 *
 * Rules:
 * - No extra assets required (CSS gradients only).
 * - Clean, calm, premium “glass” layout.
 * - Audio uses the AUTHORITATIVE TalkingFacePlayButton when src exists.
 */

import React, { useMemo } from "react";
import { Link } from "react-router-dom";

// ✅ AUTHORITATIVE audio UI motif
import TalkingFacePlayButton from "@/components/audio/TalkingFacePlayButton";

type HomeBlock = {
  id: string;
  title_en: string;
  title_vi: string;
  body_en: string;
  body_vi: string;
  audio?: string; // optional, e.g. "/audio/home/quiet_hour_en.mp3"
};

function normalizeAudioSrc(src?: string): string {
  const s = String(src || "").trim();
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  const p = s.replace(/^\/+/, "");
  if (p.startsWith("audio/")) return `/${p}`;
  return `/${p}`; // allow caller to pass "/audio/..." already
}

function audioLabelFromSrc(src: string): string {
  const s = String(src || "").trim();
  if (!s) return "";
  return s.split("/").pop() || s;
}

export default function Home() {
  const blocks: HomeBlock[] = useMemo(
    () => [
      {
        id: "gentle_companion",
        title_en: "A Gentle Companion for Your Whole Life",
        title_vi: "Người Đồng Hành Nhẹ Nhàng Cho Cả Cuộc Đời Bạn",
        body_en:
          "Mercy Blade is a bilingual (English–Vietnamese) companion for the real world: health, emotions, money, relationships, career, and meaning. Each topic is broken into calm, simple cards with audio you can listen to anywhere—on the bus, in bed, or between classes. No pressure. No judgment. Just clarity, compassion, and steps you can take today.\n\nAnd whenever life feels loud, there is something special inside the app: the Quiet Hour—a one-minute ritual where you read one bilingual card, breathe, and come back to yourself. Over time, these small moments become steady habits: clearer thinking, kinder inner talk, and English that grows naturally with your emotional understanding.",
        body_vi:
          "Mercy Blade là ứng dụng song ngữ (Anh–Việt) đồng hành cùng bạn trong đời sống thật: sức khỏe, cảm xúc, tiền bạc, mối quan hệ, công việc và ý nghĩa sống. Mỗi chủ đề được chia thành các thẻ nhỏ, nhẹ nhàng, kèm audio để bạn có thể nghe ở bất cứ đâu—trên xe buýt, trước khi ngủ, hay giữa giờ học. Không áp lực. Không phán xét. Chỉ là sự rõ ràng, dịu dàng và những bước bạn có thể làm ngay.\n\nVà khi cuộc sống trở nên quá ồn, ứng dụng có một điều đặc biệt: Giờ Lặng—nghi thức một phút, nơi bạn đọc một thẻ song ngữ, hít thở và trở về với chính mình. Theo thời gian, những khoảnh khắc nhỏ này trở thành thói quen vững vàng: suy nghĩ sáng hơn, cách tự nói với mình tử tế hơn và tiếng Anh phát triển tự nhiên cùng hiểu biết cảm xúc.",
        // audio: "/audio/home/gentle_companion.mp3",
      },
      {
        id: "quiet_song",
        title_en: "A Quiet Song for Your Journey",
        title_vi: "Một Khúc Ca Cho Hành Trình Của Bạn",
        body_en:
          "And for moments when words are not enough, Mercy Blade has a quiet song—a theme written to support your breathing, grounding, and emotional steadiness.",
        body_vi:
          "Và trong những khoảnh khắc khi lời nói thôi chưa đủ, Mercy Blade có một khúc ca riêng—bài nhạc được viết để nâng nhịp thở, tiếp đất và làm dịu cảm xúc của bạn.",
        // audio: "/audio/home/song_of_mercy_blade.mp3",
      },
      {
        id: "learn_while_heal",
        title_en: "Learn English While You Heal and Grow",
        title_vi: "Học Tiếng Anh Trong Khi Chữa Lành Và Phát Triển",
        body_en:
          "Every piece of content in Mercy Blade is both English and Vietnamese. You can: read English, check Vietnamese when you get stuck, tap to play audio, and repeat sentences out loud.\n\nInstead of memorizing random phrases, you learn the language of stress, health, relationships, work, and money—the topics you truly care about. This way, every minute you invest helps two things at once: your life becomes lighter and your English becomes stronger.",
        body_vi:
          "Mọi nội dung trong Mercy Blade đều có cả tiếng Anh và tiếng Việt. Bạn có thể: đọc tiếng Anh, xem tiếng Việt khi bí, bấm nghe audio và lặp lại thành tiếng.\n\nThay vì học vẹt các câu rời rạc, bạn học ngôn ngữ của căng thẳng, sức khỏe, mối quan hệ, công việc và tiền bạc—những điều bạn thật sự quan tâm. Nhờ đó, mỗi phút bỏ ra đều nuôi dưỡng hai thứ cùng lúc: cuộc sống nhẹ hơn và tiếng Anh vững hơn.",
        // audio: "/audio/home/learn_while_heal.mp3",
      },
      {
        id: "calmer_mind",
        title_en: "Calmer Mind, Kinder Inner Voice",
        title_vi: "Tâm Trí Bình Hơn, Tiếng Nói Bên Trong Dịu Hơn",
        body_en:
          "Stress, anxiety, burnout, overthinking—these are not 'weaknesses', they are signals. Mercy Blade gives you small, science-informed practices: breathing, grounding, CBT-style thought reframes, emotional regulation, and self-compassion micro-exercises.\n\nEach card explains the idea in simple English, with clear Vietnamese beside it, so you can understand deeply instead of guessing. Over time, you learn vocabulary for your inner world and build the skill to stay steady when life gets loud.",
        body_vi:
          "Căng thẳng, lo âu, kiệt sức, suy nghĩ quá mức—không phải là 'yếu đuối', mà là tín hiệu. Mercy Blade mang đến những thực hành nhỏ, dựa trên khoa học: bài tập thở, tiếp đất, nhìn lại suy nghĩ kiểu CBT, điều hòa cảm xúc và các bài luyện tự trắc ẩn rất ngắn.\n\nMỗi thẻ giải thích ý tưởng bằng tiếng Anh đơn giản, kèm tiếng Việt rõ ràng, giúp bạn hiểu sâu thay vì đoán. Theo thời gian, bạn học được ngôn ngữ cho thế giới bên trong của mình và xây kỹ năng đứng vững khi cuộc đời ồn ào.",
        // audio: "/audio/home/calmer_mind.mp3",
      },
      {
        id: "start_small",
        title_en: "Start Small, Grow Deeply—At Your Own Pace",
        title_vi: "Bắt Đầu Nhỏ, Lớn Lên Sâu—Theo Nhịp Của Riêng Bạn",
        body_en:
          "You can begin with free rooms to feel the tone, try the bilingual cards, and get used to listening to short audios. When you're ready, VIP rooms open deeper paths: more topics, multi-layer guidance, and richer practice for both life and language.\n\nNo algorithms shouting at you—just a quiet library of support you can visit whenever you need. Your life is complex and colorful; your app can be, too—gently.",
        body_vi:
          "Bạn có thể bắt đầu với các phòng miễn phí để cảm nhận giọng điệu, thử các thẻ song ngữ và làm quen với những đoạn audio ngắn. Khi sẵn sàng, các phòng VIP mở ra con đường sâu hơn: nhiều chủ đề hơn, hướng dẫn nhiều lớp và thực hành phong phú cho cả cuộc sống lẫn ngôn ngữ.\n\nKhông có thuật toán la hét—chỉ là một thư viện lặng, luôn mở khi bạn cần. Cuộc đời bạn phức tạp và nhiều màu sắc; ứng dụng của bạn cũng có thể như vậy—một cách nhẹ nhàng.",
        // audio: "/audio/home/start_small.mp3",
      },
    ],
    []
  );

  return (
    <div className="w-full">
      <style>{`
        .mb-home-wrap{
          min-height: 100vh;
          background:
            radial-gradient(1200px 700px at 20% 10%, rgba(255, 105, 180, 0.10), transparent 60%),
            radial-gradient(1100px 650px at 85% 15%, rgba(0, 200, 255, 0.10), transparent 60%),
            radial-gradient(1000px 650px at 25% 90%, rgba(140, 255, 120, 0.10), transparent 60%),
            linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.88));
        }

        .mb-hero{
          border-radius: 28px;
          padding: 28px 22px;
          background:
            linear-gradient(180deg, rgba(15,23,42,0.72), rgba(15,23,42,0.64));
          box-shadow: 0 22px 60px rgba(0,0,0,0.18);
          position: relative;
          overflow: hidden;
        }
        .mb-hero:before{
          content: "";
          position: absolute;
          inset: -80px;
          background:
            radial-gradient(700px 380px at 15% 10%, rgba(255, 105, 180, 0.34), transparent 60%),
            radial-gradient(650px 360px at 90% 20%, rgba(0, 200, 255, 0.30), transparent 60%),
            radial-gradient(600px 360px at 35% 95%, rgba(140, 255, 120, 0.26), transparent 60%);
          filter: blur(22px);
          opacity: 0.55;
          pointer-events: none;
        }
        .mb-hero > *{ position: relative; z-index: 1; }

        .mb-pill{
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 999px;
          padding: 6px 12px;
          font-size: 12px;
          color: rgba(255,255,255,0.85);
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.08);
        }

        .mb-logo{
          font-weight: 800;
          letter-spacing: -0.02em;
          font-size: 34px;
          line-height: 1.05;
          background: linear-gradient(90deg, #ff3ea5, #ffcc00, #22c55e, #38bdf8, #a78bfa);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .mb-hero-sub{
          color: rgba(255,255,255,0.88);
          max-width: 62ch;
          margin-top: 10px;
          font-size: 15px;
          line-height: 1.6;
        }

        .mb-cta{
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          padding: 10px 14px;
          font-weight: 700;
          border: 1px solid rgba(255,255,255,0.16);
          transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease;
        }
        .mb-cta:hover{ transform: translateY(-1px); }

        .mb-cta-primary{
          background: linear-gradient(90deg, rgba(255,62,165,0.95), rgba(255,204,0,0.92));
          color: rgba(0,0,0,0.85);
          box-shadow: 0 14px 28px rgba(0,0,0,0.22);
        }
        .mb-cta-ghost{
          background: rgba(255,255,255,0.10);
          color: rgba(255,255,255,0.90);
        }

        .mb-card{
          border-radius: 26px;
          border: 1px solid rgba(0,0,0,0.10);
          background: rgba(255,255,255,0.74);
          backdrop-filter: blur(10px);
          box-shadow: 0 12px 34px rgba(0,0,0,0.07);
        }

        .mb-divider{
          height: 1px;
          background: rgba(0,0,0,0.08);
          margin: 14px 0;
        }
      `}</style>

      <div className="mb-home-wrap">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-10">
          {/* HERO BAND */}
          <section className="mb-hero">
            <div className="mb-pill">Mercy Blade • Colors of Life</div>

            <div className="mt-3 mb-logo">Mercy Blade</div>

            <div className="mb-hero-sub">
              English & Knowledge — room-based learning + guidance.
              <br />
              Audio-first. Bilingual. Built for memory, not scrolling.
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/tiers" className="mb-cta mb-cta-primary">
                Explore tiers map
              </Link>

              {/* “Try a room” should point to a known-good room */}
              <Link
                to="/room/burnout_recovery_free"
                className="mb-cta mb-cta-ghost"
              >
                Try a room
              </Link>

              <Link to="/signin" className="mb-cta mb-cta-ghost">
                Sign in
              </Link>
            </div>

            <div className="mt-4 text-xs text-white/70">
              Tip: This hero band is CSS-only (no external assets) but matches the
              “Colors of Life” vibe.
            </div>
          </section>

          {/* ESSAYS (BILINGUAL) */}
          <div className="mt-8 grid gap-6">
            {blocks.map((b) => (
              <section key={b.id} className="mb-card p-5 md:p-7">
                <div className="text-xs text-muted-foreground">
                  Home essay • Song ngữ
                </div>

                <h2 className="mt-2 text-2xl md:text-3xl font-serif font-bold">
                  {b.title_en}
                </h2>
                <div className="mt-1 text-base md:text-lg text-muted-foreground">
                  {b.title_vi}
                </div>

                <div className="mb-divider" />

                <div className="grid gap-4">
                  <div className="text-[15px] md:text-base whitespace-pre-line leading-relaxed">
                    {b.body_en}
                  </div>

                  {b.audio ? (
                    <div className="pt-1">
                      <TalkingFacePlayButton
                        src={normalizeAudioSrc(b.audio)}
                        label={audioLabelFromSrc(normalizeAudioSrc(b.audio))}
                        className="w-full max-w-none"
                        fullWidthBar
                      />
                    </div>
                  ) : null}

                  <div className="text-[15px] md:text-base whitespace-pre-line leading-relaxed">
                    {b.body_vi}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    to="/tiers"
                    className="rounded-xl border px-4 py-2 text-sm hover:bg-accent transition"
                  >
                    View Tier Map
                  </Link>
                  <Link
                    to="/room/burnout_recovery_free"
                    className="rounded-xl border px-4 py-2 text-sm hover:bg-accent transition"
                  >
                    Open a Room
                  </Link>
                </div>
              </section>
            ))}
          </div>

          {/* FOOTER CTA */}
          <section className="mt-10 mb-card p-5 md:p-7">
            <h3 className="text-xl md:text-2xl font-serif font-bold">
              Ready to begin your journey?
            </h3>
            <p className="mt-2 text-muted-foreground">
              Start with a free room, listen to a short audio, and build a calm habit.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link to="/tiers" className="rounded-xl border px-4 py-2 hover:bg-accent transition">
                Explore tiers
              </Link>
              <Link to="/signin" className="rounded-xl border px-4 py-2 hover:bg-accent transition">
                Get started
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/** New thing to learn:
 * For landing pages, “one strong hero + stacked bilingual cards” beats complex layouts—users instantly understand the product. */
