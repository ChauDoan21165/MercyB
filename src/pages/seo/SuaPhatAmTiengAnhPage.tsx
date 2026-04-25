/**
 * SEO landing page: "sửa phát âm tiếng Anh".
 *
 * Target: learners who know they have a pronunciation problem and want
 * specific feedback rather than generic listening practice.
 */

import React from "react";

import SeoMeta from "@/components/seo/SeoMeta";
import { SeoLayout } from "@/pages/seo/SeoLayout";

const SLUG = "sua-phat-am-tieng-anh";
const CANONICAL = `https://mercyblade.com/seo/${SLUG}`;
const OG_IMAGE = "https://mercyblade.com/og/seo-default.png";

const TITLE = "Sửa phát âm tiếng Anh cho người Việt — MercyBlade";
const DESCRIPTION =
  "Sửa phát âm tiếng Anh theo đúng các lỗi người Việt hay mắc — âm cuối, /th/, /r/, trọng âm. Giáo viên Mercy chấm điểm và chỉ chỗ sai trong từng câu.";

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

export default function SuaPhatAmTiengAnhPage() {
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
        h1="Sửa phát âm tiếng Anh"
        subheader="MercyBlade chấm điểm phát âm từng câu của bạn và chỉ ra đúng âm bạn đang mắc lỗi — không phải điểm chung chung. Bạn nghe lại giọng mình so với giọng giáo viên trong cùng một màn hình."
        utmCampaign={SLUG}
      >
        {/* CHAU TODO: replace with real content */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Người Việt thường sai ở đâu khi phát âm tiếng Anh?
          </h2>
          <p>
            {/* CHAU TODO: top 5 errors — final consonants dropped, /th/ replaced with
                /t/ or /d/, /r/ rolled, vowel length, stress placement. Each item
                should have a real example. */}
            Top lỗi phổ biến: bỏ âm cuối ("cat" → "ca"), thay /th/ bằng /t/ hoặc /d/,
            không phân biệt /r/ và /l/, không đánh trọng âm đúng chỗ.
          </p>
        </section>

        {/* CHAU TODO: replace with real content */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            MercyBlade chấm phát âm như thế nào?
          </h2>
          <p>
            {/* CHAU TODO: explain pronunciation scoring pipeline — record, get
                phoneme-level feedback, compare with teacher voice. Mention this
                is feature-flag gated currently if relevant. */}
            Bạn ghi âm một câu, MercyBlade phân tích từng âm và so sánh với mẫu
            giáo viên — chỉ chính xác chỗ bạn sai, không chỉ đưa điểm tổng.
          </p>
        </section>

        {/* CHAU TODO: replace with real content */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Cần luyện bao nhiêu lâu để thấy kết quả?
          </h2>
          <p>
            {/* CHAU TODO: realistic expectation setting — 15 minutes/day,
                first improvement noticeable in 2 weeks for committed learners. */}
            Học 15 phút mỗi ngày, hầu hết học viên thấy phát âm tốt hơn rõ rệt
            sau 2 tuần luyện đều.
          </p>
        </section>
      </SeoLayout>
    </>
  );
}
