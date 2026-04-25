// src/pages/about/AboutChauPage.tsx
//
// Step 11 — public /about/chau identity page. Free tier; no gating.
//
// Structure (top → bottom):
//   1. Hero — name, role, location, one-line tagline.
//   2. Why I built MercyBlade — the 'I am go' moment, framed as the
//      hinge from journalist-in-exile to teacher-by-necessity.
//   3. Article 117 brief — short, factual, with a clear pointer that
//      the term itself is a public matter (no invented details).
//   4. The path to MercyBlade — the milestones timeline.
//   5. Promises to the community — the five non-negotiables, in
//      first-person bilingual voice.
//   6. Connect — supportEmail link.
//
// All content sourced from PRODUCT_CONFIG + founderContent.ts. No new
// biographical claims are introduced here.

import { Link } from "react-router-dom";

import { PRODUCT_CONFIG } from "@/config/product";
import FounderJourneyTimeline from "@/components/founder/FounderJourneyTimeline";
import { FOUNDER_STRUGGLES } from "@/lib/founder/founderContent";

const PROMISES: ReadonlyArray<{ vi: string; en: string }> = [
  {
    vi: "Vietnamese-first ở mọi nơi — mọi giải thích bắt đầu từ tiếng Việt, không phải tiếng Anh dịch lại.",
    en: "Vietnamese-first everywhere — every explanation starts in Vietnamese, not as a translation from English.",
  },
  {
    vi: "Kids mode thiêng liêng — không quảng cáo, không CTA bán hàng, không cần đăng nhập. Phụ huynh tin chúng tôi.",
    en: "Kids mode is sacred — no ads, no sales CTAs, no login. Parents trust us.",
  },
  {
    vi: "Mobile-first — học viên Việt học trên điện thoại, không trên iPad ở phòng học.",
    en: "Mobile-first — Vietnamese learners study on phones, not iPads in classrooms.",
  },
  {
    vi: "Outcomes hơn engagement — không có dark gamification, không có streak-shaming. Nếu một tính năng giữ chân nhưng không dạy, chúng tôi cắt.",
    en: "Outcomes over engagement — no dark gamification, no streak-shaming. If a feature boosts retention but doesn't teach, we cut it.",
  },
  {
    vi: "Không có VIP tier — không có hệ thống đẳng cấp giả tạo. Chỉ có miễn phí và Premium, đơn giản.",
    en: "No VIP tier — no fake status games. Just free and Premium, plainly.",
  },
];

export default function AboutChauPage() {
  const struggle = FOUNDER_STRUGGLES.find((s) => s.id === "i-am-go") ?? FOUNDER_STRUGGLES[0];

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      {/* Hero */}
      <header className="mb-10">
        <p className="text-xs uppercase tracking-wide font-bold text-emerald-700">
          About
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-black/90 mt-2 leading-tight">
          Tôi là {PRODUCT_CONFIG.founder.name} — nhà báo lưu vong ở Grande Prairie
        </h1>
        <p className="text-base text-black/60 italic mt-2">
          I am {PRODUCT_CONFIG.founder.name} — a Vietnamese journalist in exile, settled in Grande Prairie.
        </p>

        <div className="flex flex-wrap gap-2 mt-5">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            {PRODUCT_CONFIG.founder.story}
          </span>
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
            Article 117
          </span>
          <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold">
            Grande Prairie
          </span>
        </div>
      </header>

      {/* Why I built MercyBlade */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-black/90 mb-3">
          Vì sao tôi xây MercyBlade
        </h2>
        <p className="text-[15px] text-black/85 leading-relaxed">
          {struggle.vi}
        </p>
        <p className="text-sm text-black/55 italic mt-3 leading-relaxed">
          {struggle.en}
        </p>
        <p className="text-[15px] text-black/85 leading-relaxed mt-4">
          MercyBlade không sinh ra trong văn phòng coworking. Nó sinh ra từ một câu hỏi của một đứa trẻ tám tuổi — và quyết định rằng những đứa trẻ Việt khác đáng được câu trả lời tốt hơn câu tôi đã có lúc đó.
        </p>
        <p className="text-sm text-black/55 italic mt-2 leading-relaxed">
          MercyBlade wasn't born in a coworking space. It was born from an eight-year-old's question — and the decision that other Vietnamese children deserved a better answer than the one I had at that moment.
        </p>
      </section>

      {/* Article 117 brief */}
      <section className="mb-10 rounded-xl border border-amber-200 bg-amber-50 p-5">
        <h2 className="text-base font-bold text-amber-900 mb-2 uppercase tracking-wide">
          Article 117 — vì sao 'lưu vong'
        </h2>
        <p className="text-sm text-black/85 leading-relaxed">
          Điều 117 Bộ luật Hình sự Việt Nam quy định tội "tuyên truyền chống Nhà nước". Đây là điều khoản nhiều nhà báo Việt phải đối mặt khi viết về xã hội, tham nhũng, hoặc các đề tài chính quyền không muốn công khai. Đó là lý do tôi rời đất nước.
        </p>
        <p className="text-xs text-black/55 italic mt-3 leading-relaxed">
          Article 117 of Vietnam's penal code criminalises "anti-state propaganda" — the provision many Vietnamese journalists run into when reporting on society, corruption, or topics the government prefers to keep quiet. It's why I had to leave.
        </p>
        <p className="text-xs text-black/55 mt-3">
          Tôi không kể chi tiết vụ việc của riêng mình ở đây — đó là chuyện của tôi, không phải nội dung của trang này. Trang này nói về vì sao MercyBlade tồn tại.
        </p>
      </section>

      {/* Timeline */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-black/90 mb-5">
          Hành trình đến MercyBlade
        </h2>
        <p className="text-sm text-black/65 italic mb-6">
          The path to MercyBlade
        </p>
        <FounderJourneyTimeline />
      </section>

      {/* Promises */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-black/90 mb-2">
          Hứa với cộng đồng
        </h2>
        <p className="text-sm text-black/60 italic mb-5">
          Promises to the community — five non-negotiables we live by.
        </p>
        <ol className="space-y-4">
          {PROMISES.map((p, i) => (
            <li
              key={i}
              className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4"
            >
              <div className="text-xs font-bold text-emerald-700 mb-1">
                #{i + 1}
              </div>
              <p className="text-sm text-black/85 leading-relaxed">{p.vi}</p>
              <p className="text-xs text-black/55 italic mt-1 leading-relaxed">
                {p.en}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Contact */}
      <section className="mb-12 rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="text-xl font-bold text-black/90 mb-2">
          Kết nối với tôi
        </h2>
        <p className="text-sm text-black/65 leading-relaxed">
          Có ý kiến, đề xuất, hay chỉ muốn nói lời cảm ơn — gửi email cho tôi tại{" "}
          <a
            href={`mailto:${PRODUCT_CONFIG.supportEmail}`}
            className="text-emerald-700 underline font-semibold"
          >
            {PRODUCT_CONFIG.supportEmail}
          </a>
          . Tôi đọc từng email.
        </p>
        <p className="text-xs text-black/55 italic mt-2 leading-relaxed">
          Reach me at{" "}
          <a
            href={`mailto:${PRODUCT_CONFIG.supportEmail}`}
            className="text-emerald-700 underline"
          >
            {PRODUCT_CONFIG.supportEmail}
          </a>
          . I read every message.
        </p>
      </section>

      <footer className="mb-12">
        <Link
          to="/"
          className="text-sm text-emerald-700 hover:text-emerald-900 no-underline"
        >
          ← Về trang chủ
        </Link>
      </footer>
    </article>
  );
}
