// File: src/pages/Support.tsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MessageCircle, MessageSquare } from "lucide-react";

import { SUPPORT_CHANNELS } from "@/config/product";

const SUPPORT_EMAIL = "support@mercyblade.com";
const ADMIN_EMAIL = "admin@mercyblade.com";

type FaqItem = {
  questionEn: string;
  questionVi: string;
  body: React.ReactNode;
};

const FAQS: FaqItem[] = [
  {
    questionEn: "How do I delete my account?",
    questionVi: "Làm sao để xóa tài khoản?",
    body: (
      <>
        <p>
          Sign in, open <Link to="/account">Account</Link>, scroll to the
          bottom and tap <strong>Delete my account</strong>. You will be asked
          to type <code>DELETE</code> to confirm. Deletion is immediate and
          removes your profile, learning history, and pronunciation scores. If
          you cannot sign in, email{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> from the
          address on your account and we will delete it for you.
        </p>
        <p style={{ color: "#475569" }}>
          Đăng nhập, mở trang <Link to="/account">Tài khoản</Link>, kéo xuống
          cuối trang và nhấn <strong>Xóa tài khoản</strong>. Bạn sẽ được yêu cầu
          nhập <code>DELETE</code> để xác nhận. Tài khoản sẽ bị xóa ngay lập
          tức cùng với lịch sử học và điểm phát âm. Nếu không đăng nhập được,
          gửi email tới <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>{" "}
          từ địa chỉ đã đăng ký, chúng tôi sẽ xóa giúp bạn.
        </p>
      </>
    ),
  },
  {
    questionEn: "I was charged unexpectedly",
    questionVi: "Tôi bị tính phí ngoài ý muốn",
    body: (
      <>
        <p>
          Subscriptions on iOS are billed through your Apple ID and managed in
          Settings → Apple ID → Subscriptions. On Android they are managed in
          Google Play → Payments &amp; subscriptions. On the web open{" "}
          <Link to="/billing">Billing</Link> and use{" "}
          <strong>Manage subscription</strong> to open the Stripe portal where
          you can cancel or request a refund. If you cannot find the charge,
          forward the receipt to{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> and we will
          investigate.
        </p>
        <p style={{ color: "#475569" }}>
          Trên iOS, gói đăng ký được tính phí qua Apple ID và được quản lý trong Cài
          đặt → Apple ID → Đăng ký. Trên Android, mở Google Play → Thanh toán
          &amp; gói đăng ký. Trên web, mở <Link to="/billing">Thanh toán</Link>{" "}
          và nhấn <strong>Quản lý gói đăng ký</strong> để mở cổng Stripe,
          rồi hủy hoặc yêu cầu hoàn tiền. Nếu không tìm thấy giao dịch, hãy
          chuyển tiếp biên lai đến{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
        </p>
      </>
    ),
  },
  {
    questionEn: "Pronunciation scoring isn't working",
    questionVi: "Chấm điểm phát âm không hoạt động",
    body: (
      <>
        <p>
          Pronunciation scoring needs microphone permission and a stable
          connection. Try these steps in order:
        </p>
        <ol>
          <li>Reload the room and tap the mic again.</li>
          <li>
            Check microphone permission for MercyBlade in your browser or
            phone settings.
          </li>
          <li>Move closer to your microphone and reduce background noise.</li>
          <li>
            If cloud scoring is unavailable, MercyBlade falls back to local
            scoring in your browser — you will still see a score, but it may
            be less detailed.
          </li>
        </ol>
        <p>
          Still stuck? Email{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> with the
          room name and the device you are using.
        </p>
        <p style={{ color: "#475569" }}>
          Tính năng chấm phát âm cần quyền truy cập micro và kết nối ổn định.
          Hãy thử lần lượt: tải lại phòng và nhấn mic lại; kiểm tra quyền micro
          trong cài đặt trình duyệt hoặc điện thoại; nói gần micro hơn và giảm
          tiếng ồn xung quanh. Nếu chấm điểm trên cloud không khả dụng, MercyBlade
          sẽ tự chuyển sang chấm cục bộ trong trình duyệt — bạn vẫn có điểm,
          nhưng có thể ít chi tiết hơn. Nếu vẫn lỗi, gửi email tới{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> kèm tên
          phòng và thiết bị đang dùng.
        </p>
      </>
    ),
  },
  {
    questionEn: "How do I change my password?",
    questionVi: "Làm sao để đổi mật khẩu?",
    body: (
      <>
        <p>
          On the sign-in screen, tap <strong>Forgot password?</strong> and
          enter your account email. You will receive a reset link from
          MercyBlade — open it on the same device and choose a new password.
          The reset link expires after a short window for security; if it
          expires, request another one.
        </p>
        <p style={{ color: "#475569" }}>
          Ở màn hình đăng nhập, nhấn <strong>Quên mật khẩu?</strong> và nhập
          email tài khoản. Bạn sẽ nhận được liên kết đặt lại mật khẩu từ
          MercyBlade — mở trên cùng thiết bị và chọn mật khẩu mới. Liên kết
          có hiệu lực trong thời gian ngắn vì lý do bảo mật; nếu hết hạn, hãy
          gửi yêu cầu lại.
        </p>
      </>
    ),
  },
  {
    questionEn: "I want a refund",
    questionVi: "Tôi muốn hoàn tiền",
    body: (
      <>
        <p>
          Refund policy depends on the store you purchased through:
        </p>
        <ul>
          <li>
            <strong>Apple App Store</strong> — request a refund at{" "}
            <a
              href="https://reportaproblem.apple.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              reportaproblem.apple.com
            </a>
            . Apple decides refund eligibility, not MercyBlade.
          </li>
          <li>
            <strong>Google Play</strong> — open Google Play → Payments &amp;
            subscriptions → MercyBlade → Refund. Google decides eligibility.
          </li>
          <li>
            <strong>Stripe (web)</strong> — email{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> within 14
            days of purchase. We refund unused subscription periods if you
            haven't used the service substantially.
          </li>
        </ul>
        <p style={{ color: "#475569" }}>
          Chính sách hoàn tiền tùy thuộc vào kênh mua: Apple App Store — yêu
          cầu tại reportaproblem.apple.com (Apple quyết định, không phải
          MercyBlade); Google Play — mở Google Play → Thanh toán &amp; gói
          đăng ký → MercyBlade → Hoàn tiền (Google quyết định); Stripe (web)
          — gửi email tới <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>{" "}
          trong vòng 14 ngày sau khi mua; chúng tôi hoàn lại phần chưa sử
          dụng nếu bạn chưa sử dụng dịch vụ nhiều.
        </p>
      </>
    ),
  },
];

function FaqRow({ item, defaultOpen }: { item: FaqItem; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);

  const summaryStyle: React.CSSProperties = {
    cursor: "pointer",
    listStyle: "none",
    padding: "14px 16px",
    borderRadius: 12,
    border: "1px solid rgba(15,23,42,0.10)",
    background: open ? "#f8fafc" : "#ffffff",
    fontWeight: 700,
    color: "#0f172a",
    display: "flex",
    flexDirection: "column",
    gap: 2,
  };

  const subStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 500,
    color: "#64748b",
  };

  const bodyStyle: React.CSSProperties = {
    padding: "12px 16px 4px",
    color: "#334155",
    lineHeight: 1.65,
    fontSize: 15,
  };

  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
      style={{ marginBottom: 10 }}
    >
      <summary style={summaryStyle}>
        <span>{item.questionEn}</span>
        <span style={subStyle}>{item.questionVi}</span>
      </summary>
      <div style={bodyStyle}>{item.body}</div>
    </details>
  );
}

type ContactChannelCardProps = {
  href: string;
  external?: boolean;
  accent: string;
  icon: React.ReactNode;
  title_vi: string;
  title_en: string;
};

function ContactChannelCard({
  href,
  external,
  accent,
  icon,
  title_vi,
  title_en,
}: ContactChannelCardProps) {
  return (
    <a
      href={href}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : null)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        borderRadius: 14,
        border: "1px solid rgba(0,0,0,0.10)",
        background: "white",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <span
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: accent,
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 14, fontWeight: 800, color: "#0F172A" }}>
          {title_vi}
        </span>
        <span style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748B", marginTop: 1 }}>
          {title_en}
        </span>
      </span>
    </a>
  );
}

export default function Support() {
  return (
    <div
      style={{
        padding: 24,
        maxWidth: 860,
        margin: "0 auto",
        lineHeight: 1.6,
      }}
    >
      <h1 style={{ marginBottom: 4 }}>Support</h1>
      <p style={{ marginTop: 0, color: "#64748b", fontSize: 14 }}>Hỗ trợ</p>

      <section
        aria-label="Chat with us / Nhắn tin với Mercy"
        style={{ marginTop: 18, marginBottom: 28 }}
      >
        <h2 style={{ marginBottom: 4, fontSize: 22, fontWeight: 800 }}>
          Nhắn tin với Mercy
        </h2>
        <p style={{ marginTop: 0, color: "#64748b", fontSize: 14 }}>
          Chat with us
        </p>
        <p style={{ marginTop: 6, marginBottom: 12, color: "#475569", fontSize: 14 }}>
          Người Việt thường được phản hồi nhanh nhất qua Zalo và Messenger. Email cũng được. ·
          <span style={{ color: "#64748b" }}> Vietnamese learners reach us fastest via Zalo or Messenger. Email works too.</span>
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
          }}
        >
          <ContactChannelCard
            href={SUPPORT_CHANNELS.zalo_url}
            external
            accent="#0068FF"
            icon={<MessageSquare size={20} color="white" aria-hidden />}
            title_vi="Zalo"
            title_en="Phản hồi nhanh nhất / Fastest reply"
          />
          <ContactChannelCard
            href={SUPPORT_CHANNELS.messenger_url}
            external
            accent="#0084FF"
            icon={<MessageCircle size={20} color="white" aria-hidden />}
            title_vi="Facebook Messenger"
            title_en="Nhắn qua Messenger"
          />
          <ContactChannelCard
            href={`mailto:${SUPPORT_CHANNELS.email}`}
            accent="#7C3AED"
            icon={<Mail size={20} color="white" aria-hidden />}
            title_vi={SUPPORT_CHANNELS.email}
            title_en="Gửi email / Send email"
          />
        </div>
      </section>

      <p>
        We are a small team and we read every email. The fastest way to get
        help is to skim the questions below — most issues are answered there.
        If you don't see your question, write to us at{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>
          <strong>{SUPPORT_EMAIL}</strong>
        </a>{" "}
        and tell us your account email and the device you are using.
      </p>
      <p style={{ color: "#475569" }}>
        Chúng tôi là một đội nhỏ và đọc mọi email. Cách nhanh nhất để được hỗ
        trợ là xem qua các câu hỏi bên dưới — phần lớn vấn đề đã có hướng xử lý
        ở đó. Nếu chưa thấy câu hỏi của bạn, hãy gửi email tới{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>
          <strong>{SUPPORT_EMAIL}</strong>
        </a>{" "}
        kèm email tài khoản và thiết bị đang dùng.
      </p>

      <h2 style={{ marginTop: 28 }}>
        Frequently asked questions
        <span
          style={{
            display: "block",
            fontSize: 14,
            fontWeight: 500,
            color: "#64748b",
            marginTop: 2,
          }}
        >
          Câu hỏi thường gặp
        </span>
      </h2>

      <div style={{ marginTop: 16 }}>
        {FAQS.map((item, idx) => (
          <FaqRow key={item.questionEn} item={item} defaultOpen={idx === 0} />
        ))}
      </div>

      <h2 style={{ marginTop: 32 }}>
        Contact
        <span
          style={{
            display: "block",
            fontSize: 14,
            fontWeight: 500,
            color: "#64748b",
            marginTop: 2,
          }}
        >
          Liên hệ
        </span>
      </h2>
      <p>
        Support email:{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>
          <strong>{SUPPORT_EMAIL}</strong>
        </a>
        <br />
        Privacy / data requests:{" "}
        <a href={`mailto:${ADMIN_EMAIL}`}>
          <strong>{ADMIN_EMAIL}</strong>
        </a>
      </p>
      <p style={{ color: "#475569" }}>
        Email hỗ trợ: <strong>{SUPPORT_EMAIL}</strong>. Yêu cầu liên quan đến
        quyền riêng tư / dữ liệu: <strong>{ADMIN_EMAIL}</strong>.
      </p>

      <p style={{ marginTop: 28, fontSize: 14, color: "#64748b" }}>
        See also: <Link to="/privacy">Privacy Policy</Link> ·{" "}
        <Link to="/terms">Terms of Use</Link> ·{" "}
        <Link to="/account">Account</Link>
      </p>
    </div>
  );
}
