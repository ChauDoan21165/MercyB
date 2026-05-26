/**
 * SEO landing page: "học tiếng Anh miễn phí".
 *
 * Target: high-volume, lower-intent searches. Page positioning: 7-day
 * free trial is genuinely useful, then explain what's free vs paid.
 * Honesty here protects retention — we don't lie about "100% free".
 */

import React from "react";

import SeoMeta from "@/components/seo/SeoMeta";
import { SeoLayout } from "@/pages/seo/SeoLayout";

const SLUG = "hoc-tieng-anh-mien-phi";
const CANONICAL = `https://mercyblade.com/seo/${SLUG}`;
const OG_IMAGE = "https://mercyblade.com/og/seo-default.png";

const TITLE = "Học tiếng Anh miễn phí 7 ngày — MercyBlade";
const DESCRIPTION =
  "Dùng thử MercyBlade miễn phí 7 ngày: chấm phát âm, sửa lỗi ngữ pháp, học theo bài thật. Không cần thẻ, đăng ký bằng email là dùng được ngay.";

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": TITLE,
  "description": DESCRIPTION,
  "url": CANONICAL,
  "inLanguage": "vi-VN",
  "isPartOf": {
    "@type": "WebSite",
    "name": "MercyBlade",
    "url": "https://mercyblade.com",
  },
};

export default function HocTiengAnhMienPhiPage() {
  return (
    <>
      <SeoMeta
        title={TITLE}
        description={DESCRIPTION}
        canonical={CANONICAL}
        ogImage={OG_IMAGE}
        lang="vi"
        structuredData={STRUCTURED_DATA}
      />
      <SeoLayout
        h1="Học tiếng Anh miễn phí 7 ngày"
        subheader="MercyBlade cho bạn 7 ngày dùng thử miễn phí — đủ để bạn cảm nhận xem app có hợp với mình không. Không yêu cầu thẻ tín dụng, đăng ký bằng email là vào học ngay."
        utmCampaign={SLUG}
      >
        {/* CHAU TODO: replace with real content */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            7 ngày miễn phí gồm những gì?
          </h2>
          <p>
            {/* CHAU TODO: list features available during trial — full room access,
                pronunciation scoring, error explanations. Be specific about
                what's NOT included if anything. */}
            Trong 7 ngày dùng thử, bạn truy cập đầy đủ các phòng học, chấm phát âm,
            và lời giải thích lỗi bằng tiếng Việt. Sau 7 ngày, bạn quyết định có
            tiếp tục hay không — không tự động trừ tiền.
          </p>
        </section>

        {/* CHAU TODO: replace with real content */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Phòng học miễn phí cho trẻ em
          </h2>
          <p>
            {/* CHAU TODO: emphasize kids mode is genuinely free + offline. This
                is one of the five non-negotiables in CLAUDE.md — call it out. */}
            Tất cả phòng dành cho trẻ em (Kids Mode) miễn phí vĩnh viễn, không cần
            đăng nhập, hoạt động cả khi không có mạng. MercyBlade tin rằng cha mẹ
            xứng đáng có một app tiếng Anh không quảng cáo cho con mình.
          </p>
        </section>

        {/* CHAU TODO: replace with real content */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Sau 7 ngày thì sao?
          </h2>
          <p>
            {/* CHAU TODO: pricing transparency — link to /pricing, mention the
                tiers honestly. No dark-pattern surprise charges. */}
            Sau 7 ngày, bạn có thể tiếp tục với gói trả phí (xem chi tiết tại
            trang giá), hoặc chỉ dùng phần Kids Mode miễn phí. Không tự động
            trừ tiền nếu bạn chưa chủ động đăng ký gói.
          </p>
        </section>
      </SeoLayout>
    </>
  );
}
