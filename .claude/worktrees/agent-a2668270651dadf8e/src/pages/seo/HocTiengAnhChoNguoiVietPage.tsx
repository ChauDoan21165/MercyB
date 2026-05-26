/**
 * SEO landing page: "học tiếng anh cho người Việt".
 *
 * Target: Vietnamese learners searching for an English app built around
 * their L1. Differentiator: every error fix references the Vietnamese
 * habit it came from.
 */

import React from "react";

import SeoMeta from "@/components/seo/SeoMeta";
import { SeoLayout } from "@/pages/seo/SeoLayout";
import { PRODUCT_CONFIG } from "@/config/product";

const SLUG = "hoc-tieng-anh-cho-nguoi-viet";
const CANONICAL = `https://${PRODUCT_CONFIG.domain}/seo/${SLUG}`;
const OG_IMAGE = `https://${PRODUCT_CONFIG.domain}/og/seo-default.png`;

const TITLE = `Học tiếng Anh cho người Việt — ${PRODUCT_CONFIG.name}`;
const DESCRIPTION = `${PRODUCT_CONFIG.name} là ứng dụng học tiếng Anh được thiết kế riêng cho người Việt. Sửa lỗi phát âm, ngữ pháp theo đúng thói quen tiếng Việt, không phải app dịch lại.`;

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": TITLE,
  "description": DESCRIPTION,
  "url": CANONICAL,
  "inLanguage": "vi-VN",
  "isPartOf": {
    "@type": "WebSite",
    "name": PRODUCT_CONFIG.name,
    "url": `https://${PRODUCT_CONFIG.domain}`,
  },
};

export default function HocTiengAnhChoNguoiVietPage() {
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
        h1="Học tiếng Anh cho người Việt"
        subheader={`${PRODUCT_CONFIG.name} là ứng dụng học tiếng Anh đầu tiên thiết kế riêng cho người Việt — không phải bản dịch lại của Duolingo. Mọi lỗi phát âm, mọi lỗi ngữ pháp đều được giải thích bằng đúng thói quen của người Việt.`}
        utmCampaign={SLUG}
      >
        {/* CHAU TODO: replace with real content */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Tại sao học tiếng Anh khó với người Việt?
          </h2>
          <p>
            {/* CHAU TODO: 2-3 paragraphs about phonetic differences (final consonants,
                tone interference), grammar habits (article omission, tense markers),
                and cultural context (formality levels). */}
            Tiếng Việt và tiếng Anh khác nhau ở rất nhiều điểm — từ phát âm cuối từ,
            cách dùng "the/a", đến cách diễn đạt thì quá khứ. {PRODUCT_CONFIG.name} đi sâu vào
            từng điểm khác biệt đó.
          </p>
        </section>

        {/* CHAU TODO: replace with real content */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            {PRODUCT_CONFIG.name} khác gì với các app khác?
          </h2>
          <p>
            {/* CHAU TODO: list 3-5 concrete differentiators — Vietnamese-first
                explanations, real teacher voice (Mercy + Josh), pronunciation
                feedback tied to specific Vietnamese habits. Avoid claiming user
                counts or testimonials until Chau provides real numbers. */}
            Mỗi bài học đều có giải thích bằng tiếng Việt, không chỉ dịch từ.
            Giáo viên Mercy chỉ cho bạn vì sao bạn phát âm sai — không chỉ nói
            "sai" rồi cho điểm.
          </p>
        </section>

        {/* CHAU TODO: replace with real content */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Bắt đầu như thế nào?
          </h2>
          <p>
            {/* CHAU TODO: walkthrough — sign up, take placement test, get
                first error fix in under 5 minutes. */}
            Đăng ký miễn phí 7 ngày, làm bài kiểm tra trình độ ngắn (5 phút),
            và bắt đầu sửa lỗi đầu tiên ngay trong cùng phiên học.
          </p>
        </section>
      </SeoLayout>
    </>
  );
}
