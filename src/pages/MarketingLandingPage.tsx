// src/pages/MarketingLandingPage.tsx
//
// The public marketing landing at `/` for first-time anonymous
// visitors (signed-in users and returning anonymous visitors who
// already picked a pair still get Home — see AnonymousOnboardingGate).
//
// Doctrine note: this supersedes the "picker IS the anonymous entry
// point" reading of locked #14. Chau-directed 2026-05-18 (marketing
// landing audit, strategic ask #1 — answered "yes, build it"). The
// picker is unchanged and still the entry to learning; it is now
// reached via this page's CTA and still directly at /onboarding.
//
// Vietnamese-first (non-negotiable #1): VI is the visual primary in
// every block; English is the smaller, readable secondary. No Google
// Font is loaded — the landing path keeps its zero-font-network main
// paint (see index.html). No on-page images → fastest possible mobile
// Lighthouse. Critical CSS is inlined below; the page chunk itself is
// lazy-loaded via lazyWithRetry (AppRouter).

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { writeAnonymousPair } from "@/lib/languagePair/anonymousPair";

function ValueCol({
  titleVi,
  bodyVi,
  bodyEn,
}: {
  titleVi: string;
  bodyVi: string;
  bodyEn: string;
}) {
  return (
    <div className="mb-ml-col">
      <h3 lang="vi" className="mb-ml-col-h">
        {titleVi}
      </h3>
      <p lang="vi" className="mb-ml-col-vi">
        {bodyVi}
      </p>
      <p lang="en" className="mb-ml-col-en">
        {bodyEn}
      </p>
    </div>
  );
}

function Faq({
  q,
  a,
}: {
  q: string;
  a: React.ReactNode;
}) {
  return (
    <div className="mb-ml-faq-item">
      <h3 lang="vi" className="mb-ml-faq-q">
        {q}
      </h3>
      <p lang="vi" className="mb-ml-faq-a">
        {a}
      </p>
    </div>
  );
}

export default function MarketingLandingPage() {
  const nav = useNavigate();

  // "Nói thử ngay" — see it work before committing.
  //
  // The pronunciation trial is coupled to Home's MercyGuide bubble (it
  // is not a standalone route/component — see Home.tsx
  // focusAndOpenMercyBubble + the openRequestId prop on MercyGuide).
  // To reach it in ONE click without touching that central component:
  //   1. write the default vi→en pair — the exact pair the onboarding
  //      "Bỏ qua" (Skip) writes (RECOMMENDED_TARGET.vi). This lets the
  //      `/` gate render Home for this now-"returning" anonymous
  //      visitor instead of bouncing back here.
  //   2. ?trypron=1 → Home seeds tryOneWordRequestId so MercyGuide
  //      opens its pronunciation tab reactively on mount (prop-driven,
  //      no DOM-timing race). If anything fails, Home still renders
  //      with its prominent "Thử phát âm" card one tap away — the core
  //      path survives the optional trigger.
  const tryPronunciation = () => {
    writeAnonymousPair("vi", ["en"]);
    nav("/?trypron=1");
  };

  return (
    <main className="mb-ml">
      <style>{CSS}</style>

      {/* 1 — HERO */}
      <section className="mb-ml-hero" aria-labelledby="mb-ml-h1">
        <h1 id="mb-ml-h1" lang="vi" className="mb-ml-h1-vi">
          Ngoại ngữ cho người Việt và Tiếng Việt cho thế giới nói tiếng Anh
        </h1>
        <p lang="en" className="mb-ml-h1-en">
          Foreign languages for Vietnamese learners and Vietnamese for the
          English-speaking world
        </p>
        <p lang="vi" className="mb-ml-sub">
          Sửa lỗi tiếng Anh của người Việt, giải thích bằng tiếng Việt. AI
          thầy giáo hiểu cách người Việt học.
        </p>
        <div className="mb-ml-cta-row">
          <Link
            to="/onboarding"
            lang="vi"
            className="mb-ml-btn mb-ml-btn-primary"
          >
            Tôi học ngoại ngữ
          </Link>
          <Link
            to="/onboarding?direction=vn"
            lang="en"
            className="mb-ml-btn mb-ml-btn-outline"
            aria-label="I'm learning Vietnamese — pick English as your language and Vietnamese as your target in the next step"
          >
            I&apos;m learning Vietnamese
          </Link>
        </div>
      </section>

      {/* 2 — INSTANT TRIAL */}
      <section className="mb-ml-trial" aria-labelledby="mb-ml-trial-h">
        <h2 id="mb-ml-trial-h" lang="vi" className="mb-ml-h2">
          Thử phát âm — không cần đăng nhập
        </h2>
        <p lang="en" className="mb-ml-h2-en">
          Try pronunciation — no signup needed
        </p>
        <p lang="vi" className="mb-ml-trial-copy">
          Nói một câu, nhận điểm phát âm trong 12 giây.
        </p>
        <button
          type="button"
          lang="vi"
          className="mb-ml-btn mb-ml-btn-trial"
          onClick={tryPronunciation}
        >
          Nói thử ngay →
        </button>
      </section>

      {/* 3 — WHY MERCYBLADE */}
      <section className="mb-ml-why" aria-labelledby="mb-ml-why-h">
        <h2 id="mb-ml-why-h" lang="vi" className="mb-ml-h2 mb-ml-center">
          Vì sao MercyBlade
        </h2>
        <div className="mb-ml-cols">
          <ValueCol
            titleVi="Học bằng tiếng Việt"
            bodyVi="AI thầy giáo của bạn nói tiếng Việt như thầy giáo thật. Sửa lỗi tiếng Anh của người Việt, không phải lỗi chung chung."
            bodyEn="Your AI teacher speaks Vietnamese like a real teacher — fixing the mistakes Vietnamese learners actually make, not generic ones."
          />
          <ValueCol
            titleVi="Điểm phát âm tức thì"
            bodyVi="Nói một câu, biết điểm trong 12 giây. Sửa từng âm, không phải sửa cả câu."
            bodyEn="Say a sentence, see your score in 12 seconds. Fix each sound, not the whole sentence."
          />
          <ValueCol
            titleVi="Cầu nối ngôn ngữ"
            bodyVi="Người Việt học ngoại ngữ. Người nước ngoài học tiếng Việt. Cùng một nền tảng — vì ngôn ngữ không có ranh giới một chiều."
            bodyEn="Vietnamese learners study foreign languages. The world learns Vietnamese. One platform — language has no one-way border."
          />
        </div>
      </section>

      {/* 4 — FOUNDER (no unverified metrics; see PR notes) */}
      <section className="mb-ml-founder" aria-label="Người tạo MercyBlade">
        <p lang="vi" className="mb-ml-founder-line">
          Được tạo bởi <strong>Chau Doan</strong> — kỹ sư phần mềm người
          Việt.
        </p>
      </section>

      {/* 5 — FAQ */}
      <section className="mb-ml-faq" aria-labelledby="mb-ml-faq-h">
        <h2 id="mb-ml-faq-h" lang="vi" className="mb-ml-h2 mb-ml-center">
          Câu hỏi thường gặp
        </h2>
        <Faq
          q="Tại sao không dùng Duolingo?"
          a="Duolingo dạy chung cho mọi người. MercyBlade sửa đúng những lỗi tiếng Anh mà người Việt hay mắc — và giải thích bằng tiếng Việt, như một người thầy thật sự ngồi cạnh bạn."
        />
        <Faq
          q="Có phí không?"
          a={
            <>
              Có gói miễn phí để bắt đầu. Gói trả phí (theo tháng hoặc theo
              năm) mở toàn bộ phòng học. Xem chi tiết tại{" "}
              <Link to="/pricing">trang Giá</Link>.
            </>
          }
        />
        <Faq
          q="Làm sao bắt đầu?"
          a={
            <>
              Chọn “Tôi học ngoại ngữ” và trả lời vài câu hỏi ngắn trong 60
              giây. <Link to="/onboarding">Bắt đầu ngay →</Link>
            </>
          }
        />
      </section>

      {/* 6 — FOOTER CTA */}
      <footer className="mb-ml-footer">
        <div className="mb-ml-cta-row">
          <Link
            to="/onboarding"
            lang="vi"
            className="mb-ml-btn mb-ml-btn-primary"
          >
            Tôi học ngoại ngữ
          </Link>
          <Link
            to="/onboarding?direction=vn"
            lang="en"
            className="mb-ml-btn mb-ml-btn-outline"
            aria-label="I'm learning Vietnamese — pick English as your language and Vietnamese as your target in the next step"
          >
            I&apos;m learning Vietnamese
          </Link>
        </div>
        <p className="mb-ml-legal">
          <Link to="/privacy">Quyền riêng tư</Link>
          <span aria-hidden="true"> · </span>
          <Link to="/terms">Điều khoản</Link>
        </p>
      </footer>
    </main>
  );
}

// Inlined critical CSS. Scoped under .mb-ml so it cannot leak into the
// rest of the SPA. System font stack only (no network) — every face
// here renders Vietnamese diacritics. Mobile-first: base rules target
// 360 px; the single min-width:760px block upgrades to desktop.
const CSS = `
.mb-ml{box-sizing:border-box;width:100%;max-width:880px;margin:0 auto;
 padding:24px 18px 56px;
 font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,
 "Helvetica Neue",Arial,sans-serif;
 color:#1e293b;line-height:1.55;-webkit-font-smoothing:antialiased;}
.mb-ml *{box-sizing:border-box;}
.mb-ml section,.mb-ml footer{margin-top:44px;}

.mb-ml-hero{margin-top:18px;text-align:center;}
.mb-ml-h1-vi{margin:0;font-weight:800;letter-spacing:-0.01em;
 font-size:clamp(1.7rem,6vw,3rem);line-height:1.18;
 color:#B45309;
 background:linear-gradient(135deg,#B45309 0%,#D97706 26%,
  #14B8A6 72%,#0F766E 100%);
 -webkit-background-clip:text;background-clip:text;
 -webkit-text-fill-color:transparent;}
@supports not ((-webkit-background-clip:text) or (background-clip:text)){
 .mb-ml-h1-vi{color:#B45309;-webkit-text-fill-color:currentColor;}}
.mb-ml-h1-en{margin:14px 0 0;font-size:clamp(.98rem,2.6vw,1.35rem);
 font-weight:600;color:#64748b;line-height:1.4;}
.mb-ml-sub{margin:18px auto 0;max-width:34em;
 font-size:clamp(1rem,2.6vw,1.18rem);color:#334155;font-weight:500;}

.mb-ml-cta-row{display:flex;flex-direction:column;gap:12px;
 align-items:stretch;margin-top:26px;}
.mb-ml-btn{display:inline-flex;align-items:center;justify-content:center;
 min-height:52px;padding:14px 26px;border-radius:9999px;
 font-size:1.05rem;font-weight:800;text-decoration:none;cursor:pointer;
 border:1.5px solid transparent;line-height:1.2;text-align:center;
 transition:transform .04s ease,filter .15s ease;}
.mb-ml-btn:active{transform:translateY(1px);}
.mb-ml-btn:focus-visible{outline:3px solid #0F766E;outline-offset:3px;}
.mb-ml-btn-primary{background:#14B8A6;color:#fff;}
.mb-ml-btn-primary:hover{filter:brightness(1.05);}
.mb-ml-btn-outline{background:#fff;color:#0F766E;
 border-color:#0F766E;font-weight:700;}
.mb-ml-btn-outline:hover{background:#f0fdfa;}

.mb-ml-trial{background:linear-gradient(180deg,#FFF7ED,#FEF3E2);
 border:1px solid rgba(180,83,9,.18);border-radius:20px;
 padding:28px 22px;text-align:center;}
.mb-ml-btn-trial{background:#D97706;color:#fff;margin-top:18px;
 min-width:min(100%,260px);}
.mb-ml-btn-trial:hover{filter:brightness(1.05);}

.mb-ml-h2{margin:0;font-size:clamp(1.25rem,4vw,1.7rem);font-weight:800;
 color:#0f172a;line-height:1.25;}
.mb-ml-h2-en{margin:6px 0 0;font-size:.95rem;font-weight:600;
 color:#94a3b8;}
.mb-ml-trial-copy{margin:14px 0 0;color:#475569;
 font-size:clamp(.98rem,2.5vw,1.1rem);}
.mb-ml-center{text-align:center;}

.mb-ml-cols{display:flex;flex-direction:column;gap:16px;margin-top:24px;}
.mb-ml-col{background:#fff;border:1px solid rgba(0,0,0,.08);
 border-radius:16px;padding:22px 20px;
 box-shadow:0 1px 2px rgba(0,0,0,.04);}
.mb-ml-col-h{margin:0;font-size:1.18rem;font-weight:800;color:#0F766E;}
.mb-ml-col-vi{margin:10px 0 0;color:#334155;font-size:1rem;}
.mb-ml-col-en{margin:8px 0 0;color:#94a3b8;font-size:.9rem;
 line-height:1.45;}

.mb-ml-founder{text-align:center;}
.mb-ml-founder-line{margin:0;font-size:1.02rem;color:#475569;}
.mb-ml-founder-line strong{color:#0f172a;}

.mb-ml-faq-item{padding:18px 0;border-top:1px solid rgba(0,0,0,.08);}
.mb-ml-faq-item:first-of-type{margin-top:22px;}
.mb-ml-faq-q{margin:0;font-size:1.08rem;font-weight:800;color:#0f172a;}
.mb-ml-faq-a{margin:8px 0 0;color:#475569;font-size:1rem;}
.mb-ml-faq-a a,.mb-ml-legal a{color:#0F766E;font-weight:700;}

.mb-ml-footer{text-align:center;border-top:1px solid rgba(0,0,0,.08);
 padding-top:34px;}
.mb-ml-legal{margin:20px 0 0;font-size:.9rem;color:#94a3b8;}

@media (min-width:760px){
 .mb-ml-hero{margin-top:34px;}
 .mb-ml-cta-row{flex-direction:row;justify-content:center;}
 .mb-ml-btn{min-width:230px;}
 .mb-ml-btn-trial{min-width:260px;}
 .mb-ml-cols{flex-direction:row;align-items:stretch;}
 .mb-ml-col{flex:1 1 0;}
}
@media (prefers-reduced-motion:reduce){
 .mb-ml-btn{transition:none;}
}
`;
