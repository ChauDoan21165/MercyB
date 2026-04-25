/**
 * SEO landing page: "phỏng vấn tiếng Anh chuẩn bị".
 *
 * Target: candidates preparing for English-language job interviews
 * (immigration, abroad employment). High commercial intent — people
 * searching this typically have a deadline.
 */

import React from "react";

import SeoMeta from "@/components/seo/SeoMeta";
import { SeoLayout } from "@/pages/seo/SeoLayout";

const SLUG = "phong-van-tieng-anh";
const CANONICAL = `https://mercyblade.com/seo/${SLUG}`;
const OG_IMAGE = "https://mercyblade.com/og/seo-default.png";

const TITLE = "Phỏng vấn tiếng Anh — Cách chuẩn bị bài bản | MercyBlade";
const DESCRIPTION =
  "Chuẩn bị phỏng vấn tiếng Anh xin việc, du học, định cư. MercyBlade luyện cho bạn các câu hỏi thực tế, sửa phát âm và sửa cách trả lời theo từng câu.";

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

export default function PhongVanTiengAnhPage() {
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
        h1="Chuẩn bị phỏng vấn tiếng Anh"
        subheader="Phỏng vấn xin việc, du học, hay định cư đều cần tiếng Anh thực tế — không phải bài học sách giáo khoa. MercyBlade luyện đúng các câu hỏi bạn sẽ gặp và sửa từng câu trả lời của bạn."
        utmCampaign={SLUG}
      >
        {/* CHAU TODO: replace with real content */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Câu hỏi phỏng vấn tiếng Anh hay gặp
          </h2>
          <p>
            {/* CHAU TODO: list 5-10 common interview questions ("Tell me about yourself",
                "Why this company", "Strengths/weaknesses") with model VN→EN answers. */}
            "Tell me about yourself", "Why do you want this job?", "What are your
            strengths?" — đây là những câu gần như chắc chắn xuất hiện. Cách trả
            lời người Việt thường vướng là dịch thẳng từ tiếng Việt.
          </p>
        </section>

        {/* CHAU TODO: replace with real content */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Lỗi người Việt hay mắc trong phỏng vấn
          </h2>
          <p>
            {/* CHAU TODO: top mistakes — too humble, no eye contact talk, run-on answers,
                using overly formal Vietnamese-style honorifics in English. */}
            Quá khiêm tốn (làm nhà tuyển dụng nghĩ bạn không tự tin), trả lời quá
            dài, dùng từ trang trọng kiểu Việt (vd. "I would humbly say...") khi
            cuộc phỏng vấn đang ở mức thoải mái.
          </p>
        </section>

        {/* CHAU TODO: replace with real content */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Luyện phỏng vấn với MercyBlade
          </h2>
          <p>
            {/* CHAU TODO: walk through the practice flow — pick a question, record
                your answer, get scoring + specific edit suggestions, redo. */}
            Chọn câu hỏi, ghi âm câu trả lời của bạn, MercyBlade chấm phát âm và
            đưa gợi ý sửa từng câu. Bạn luyện đến khi tự tin với câu trả lời đó.
          </p>
        </section>
      </SeoLayout>
    </>
  );
}
