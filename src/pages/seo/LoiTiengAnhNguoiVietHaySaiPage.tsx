/**
 * SEO landing page: "lỗi tiếng Anh người Việt hay sai".
 *
 * Target: high-intent learners diagnosing their own mistakes. Lists
 * top errors specific to Vietnamese L1 interference.
 */

import React from "react";

import SeoMeta from "@/components/seo/SeoMeta";
import { SeoLayout } from "@/pages/seo/SeoLayout";

const SLUG = "loi-tieng-anh-nguoi-viet-hay-sai";
const CANONICAL = `https://mercyblade.com/seo/${SLUG}`;
const OG_IMAGE = "https://mercyblade.com/og/seo-default.png";

const TITLE = "Lỗi tiếng Anh người Việt hay sai — Tổng hợp & cách sửa | MercyBlade";
const DESCRIPTION =
  "Tổng hợp các lỗi tiếng Anh phổ biến nhất ở người Việt: bỏ âm cuối, sai thì, dùng sai mạo từ. MercyBlade chỉ rõ vì sao bạn sai và cách sửa.";

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

export default function LoiTiengAnhNguoiVietHaySaiPage() {
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
        h1="Lỗi tiếng Anh người Việt hay sai"
        subheader="Đa số lỗi tiếng Anh của người Việt không phải vì bạn dở — mà vì tiếng Việt và tiếng Anh khác nhau ở một vài điểm cốt lõi. MercyBlade nhận diện đúng lỗi đó và đưa cách sửa cụ thể."
        utmCampaign={SLUG}
      >
        {/* CHAU TODO: replace with real content */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Lỗi phát âm hay gặp nhất
          </h2>
          <p>
            {/* CHAU TODO: list of pronunciation errors with examples — final consonants,
                /th/ swap, /r/ vs /l/, vowel length. Each one a real sample sentence. */}
            Bỏ âm cuối ("book" → "boo"), nhầm /th/ với /t/ ("think" → "tink"),
            không phân biệt /r/ và /l/ ("right" và "light"), không đánh trọng âm đúng.
          </p>
        </section>

        {/* CHAU TODO: replace with real content */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Lỗi ngữ pháp hay gặp nhất
          </h2>
          <p>
            {/* CHAU TODO: list of grammar errors — article omission ("I am student"),
                tense markers ("yesterday I go"), pluralization, word order in questions. */}
            Quên mạo từ "a/the", quên thêm "-s" số nhiều, dùng sai thì quá khứ
            (vì tiếng Việt không chia thì), đặt câu hỏi sai trật tự từ.
          </p>
        </section>

        {/* CHAU TODO: replace with real content */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Lỗi giao tiếp & văn hóa
          </h2>
          <p>
            {/* CHAU TODO: politeness register, direct vs indirect speech,
                idiomatic expressions Vietnamese learners commonly mistranslate. */}
            Dịch thẳng từ tiếng Việt sang ("How old are you?" thay vì "May I ask
            your age?" trong ngữ cảnh trang trọng), nhầm mức độ lịch sự.
          </p>
        </section>
      </SeoLayout>
    </>
  );
}
