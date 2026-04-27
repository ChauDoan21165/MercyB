/**
 * /legal/content-advisory — bilingual (VI primary) content notice.
 *
 * Why this page exists: parts of MercyBlade's content reference American
 * workplace norms, US-centric examples (small talk, tipping, Thanksgiving),
 * and English-as-spoken-in-US/UK conventions. This page makes that
 * cultural framing explicit so learners are never confused about whether
 * a "rule" applies in Vietnam vs abroad. It also satisfies App Store and
 * Play Store reviewers who look for cultural / educational disclosures
 * on language-learning apps.
 */

import React from "react";

const wrap: React.CSSProperties = {
  padding: 24,
  maxWidth: 860,
  margin: "0 auto",
  lineHeight: 1.6,
  color: "#0f172a",
};
const h1: React.CSSProperties = { fontSize: 26, fontWeight: 900, marginBottom: 8 };
const h2: React.CSSProperties = { fontSize: 18, fontWeight: 800, marginTop: 28, marginBottom: 8 };
const muted: React.CSSProperties = { fontSize: 13, color: "rgba(0,0,0,0.55)", marginBottom: 12 };
const lang: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 0.4,
  color: "rgba(0,0,0,0.5)",
  textTransform: "uppercase",
  marginTop: 12,
};

export default function ContentAdvisory(): React.ReactElement {
  return (
    <div style={wrap}>
      <h1 style={h1}>Lưu ý nội dung / Content Advisory</h1>
      <p style={muted}>
        Cập nhật / Last updated: 2026-04-27
      </p>

      <div style={lang}>Tiếng Việt</div>
      <h2 style={h2}>1. Tính chất giáo dục</h2>
      <p>
        MercyBlade là sản phẩm giáo dục dùng để học tiếng Anh. Nội dung các phòng
        học, ví dụ ngữ pháp và hội thoại được biên soạn cho mục đích học ngôn ngữ.
        Chúng không nhằm thay thế tư vấn pháp lý, y tế, tài chính hay nghề nghiệp.
      </p>

      <h2 style={h2}>2. Bối cảnh văn hoá</h2>
      <p>
        Một phần nội dung MercyBlade phản ánh chuẩn mực giao tiếp công sở Mỹ /
        Anh — ví dụ small talk, gửi email, đàm phán lương, ngày lễ — vì người học
        Việt Nam thường cần dùng tiếng Anh trong các tình huống ấy khi du học hoặc
        làm việc ở nước ngoài. Các chuẩn này <strong>không</strong> phải là chuẩn
        chung toàn thế giới và <strong>không nhất thiết</strong> phù hợp ở Việt Nam.
        Khi một bài học đề cập một quy ước "phương Tây", MercyBlade luôn nêu rõ
        bối cảnh.
      </p>

      <h2 style={h2}>3. Ngôn ngữ</h2>
      <p>
        Tiếng Anh trong app chủ yếu là tiếng Anh Mỹ chuẩn (General American) và
        tiếng Anh Anh chuẩn (Received Pronunciation) cho mục đích chấm điểm phát
        âm. Cách nói địa phương (Singapore, Ấn Độ, Úc) không bị xem là sai —
        chúng tôi chỉ chưa hỗ trợ chấm điểm cho các phương ngữ ấy ở phiên bản này.
      </p>

      <h2 style={h2}>4. Người học dưới 13 tuổi</h2>
      <p>
        MercyBlade <strong>không</strong> nhắm tới trẻ em dưới 13 tuổi. Có một
        chế độ "Kids" thân thiện với trẻ em, nhưng cha mẹ phải tự chọn bật và
        đồng hành. Xem Chính sách Riêng tư mục 7 để biết chi tiết.
      </p>

      <h2 style={h2}>5. Phản hồi của AI</h2>
      <p>
        Cô Mercy là tính năng phản hồi tự động dựa trên mô hình ngôn ngữ. Cô
        Mercy <strong>không phải</strong> giáo viên thật và <strong>không</strong>
        thay thế việc học có người hướng dẫn. Phản hồi có thể có sai sót; với
        kỳ thi quan trọng (IELTS, TOEIC, VSTEP), bạn nên kiểm chứng lại với giáo
        viên hoặc tài liệu chính thức.
      </p>

      <h2 style={h2}>6. Báo cáo nội dung</h2>
      <p>
        Nếu bạn thấy nội dung sai, không phù hợp, hoặc xúc phạm văn hoá Việt Nam,
        gửi email tới <strong>admin@mercyblade.com</strong>. Chúng tôi xem xét
        trong vòng 7 ngày.
      </p>

      <hr style={{ margin: "32px 0", border: "none", borderTop: "1px solid rgba(0,0,0,0.1)" }} />

      <div style={lang}>English</div>
      <h2 style={h2}>1. Educational nature</h2>
      <p>
        MercyBlade is an educational product for learning English. Room content,
        grammar examples, and dialogues are written for language-learning
        purposes. They are not intended to replace legal, medical, financial,
        or career advice.
      </p>

      <h2 style={h2}>2. Cultural context</h2>
      <p>
        Some MercyBlade content reflects US / UK workplace conversation norms —
        small talk, email etiquette, salary negotiation, public holidays — because
        Vietnamese learners commonly need English in those situations when
        studying or working abroad. These norms are <strong>not universal</strong>
        and may not match Vietnamese conventions. When a lesson references a
        "Western" convention, MercyBlade flags the context explicitly.
      </p>

      <h2 style={h2}>3. Language</h2>
      <p>
        The English used in the app is primarily General American and Received
        Pronunciation for the purpose of pronunciation scoring. Other regional
        Englishes (Singaporean, Indian, Australian) are not "wrong"; we simply
        do not score against those models in this version.
      </p>

      <h2 style={h2}>4. Learners under 13</h2>
      <p>
        MercyBlade is <strong>not directed at children under 13</strong>. A
        kid-friendly "Kids" mode exists, but parents must opt in and accompany.
        See Privacy Policy §7 for details.
      </p>

      <h2 style={h2}>5. AI feedback</h2>
      <p>
        Mercy is an AI-powered feedback feature based on a language model. Mercy
        is <strong>not a real teacher</strong> and <strong>does not</strong>
        replace human-led learning. Feedback can contain errors; for high-stakes
        exams (IELTS, TOEIC, VSTEP), verify with a teacher or official materials.
      </p>

      <h2 style={h2}>6. Reporting content</h2>
      <p>
        If you find content that is wrong, inappropriate, or culturally
        disrespectful toward Vietnam, email <strong>admin@mercyblade.com</strong>.
        We review within 7 days.
      </p>
    </div>
  );
}
