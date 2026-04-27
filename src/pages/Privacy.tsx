// File: src/pages/Privacy.tsx

export default function Privacy() {
  return (
    <div style={{ padding: 24, maxWidth: 860, margin: "0 auto", lineHeight: 1.6 }}>
      <h1>Privacy Policy</h1>

      <p>
        <strong>Last updated:</strong> April 26, 2026
      </p>

      <p>
        Mercy Blade respects your privacy. This Privacy Policy explains how we
        collect, use, store, and protect information when you use the Mercy
        Blade website, mobile app, and related services.
      </p>

      <h2>1. Information We Collect</h2>
      <p>We may collect the following categories of information:</p>
      <ul>
        <li>
          <strong>Account information</strong>, such as your email address,
          profile details, and authentication data when you create or use an
          account.
        </li>
        <li>
          <strong>Subscription and billing information</strong>, such as
          purchase status, subscription status, and entitlement information
          needed to manage premium access.
        </li>
        <li>
          <strong>Usage information</strong>, such as app activity, feature
          usage, interactions, diagnostics, crash data, and device/browser
          information.
        </li>
        <li>
          <strong>Support communications</strong>, such as messages or emails
          you send to us.
        </li>
      </ul>

      <h2>2. How We Use Information</h2>
      <p>We use information to:</p>
      <ul>
        <li>Provide, operate, maintain, and improve Mercy Blade.</li>
        <li>Authenticate users and manage accounts.</li>
        <li>Process subscriptions, purchases, and premium entitlements.</li>
        <li>Provide customer support and respond to requests.</li>
        <li>Maintain security, detect abuse, and prevent fraud.</li>
        <li>Analyze performance and improve product quality.</li>
        <li>Comply with legal obligations and enforce our terms.</li>
      </ul>

      <h2>3. Payments and Subscriptions</h2>
      <p>
        Payments and subscriptions may be processed by third-party providers
        such as Stripe, Apple, and Google Play. We do not store full payment
        card details on our own servers.
      </p>

      <h2>4. Data Sharing</h2>
      <p>
        We may share information with trusted service providers that help us
        operate the service, including providers for hosting, analytics,
        authentication, customer support, and payments. We may also disclose
        information if required by law, to protect users, or to protect our
        rights and systems.
      </p>

      <h2>4a. Pronunciation Audio Processing (Azure)</h2>
      <p>
        When you use our pronunciation practice feature, we send a short
        recording of your spoken practice line — together with the reference
        text you were asked to read — to Microsoft Azure Cognitive Services
        (Speech) so Azure can return phoneme-level pronunciation scores.
        Recordings are typically five seconds or less, in standard
        16&nbsp;kHz mono WAV format. Audio is processed in Microsoft’s
        Southeast Asia region (Singapore datacenter). Per Microsoft’s
        published Speech Services policy, audio sent to this API is not
        retained by Microsoft and is not used to train Microsoft’s models.
      </p>
      <p>
        Mercy Blade stores the resulting pronunciation scores (numeric
        phoneme-level results) in our database so we can show you your
        progress over time. <strong>We do not store the audio recording
        itself.</strong> The recording exists only long enough to be sent to
        Azure and scored.
      </p>
      <p>
        This feature is controlled by a per-cohort feature flag. When it is
        disabled — for your account, your cohort, or globally — pronunciation
        is scored locally in your browser instead of being sent to Azure.
        You can also opt out at any time by emailing{" "}
        <strong>admin@mercyblade.com</strong>; we will disable cloud scoring
        for your account and you will continue to receive local-only scoring.
        Our legal basis for processing this audio is our legitimate interest
        in providing accurate, useful pronunciation feedback to learners.
      </p>

      <p style={{ fontStyle: "italic", color: "#475569" }}>
        <strong>Tiếng Việt — Xử lý âm thanh phát âm (Azure):</strong> Khi
        bạn dùng tính năng luyện phát âm, chúng tôi gửi một đoạn ghi âm
        ngắn câu bạn vừa đọc — kèm theo nội dung câu mẫu được yêu cầu đọc
        — đến Microsoft Azure Cognitive Services (Speech) để nhận điểm
        phát âm chi tiết theo từng âm vị. Đoạn ghi âm thường dưới 5 giây,
        ở định dạng WAV chuẩn 16 kHz mono, và được xử lý tại trung tâm dữ
        liệu của Microsoft ở khu vực Đông Nam Á (Singapore). Theo chính
        sách công khai của Microsoft, âm thanh gửi đến API này không được
        Microsoft giữ lại và không được dùng để huấn luyện mô hình của họ.
        Mercy Blade chỉ lưu lại kết quả điểm phát âm trong cơ sở dữ liệu
        để bạn theo dõi tiến bộ — <strong>chúng tôi không lưu đoạn ghi âm
        của bạn</strong>. Tính năng này được kiểm soát bằng cờ tính năng
        theo nhóm; khi tắt, việc chấm điểm sẽ chạy ngay trong trình duyệt
        thay vì gửi lên Azure. Bạn có thể yêu cầu tắt cho tài khoản của
        mình bằng cách gửi email cho{" "}
        <strong>admin@mercyblade.com</strong>. Cơ sở pháp lý cho việc xử
        lý này là lợi ích chính đáng trong việc giúp người học cải thiện
        phát âm.
      </p>

      <h2>5. Data Retention</h2>
      <p>
        We retain information for as long as necessary to provide the service,
        comply with legal obligations, resolve disputes, enforce agreements, and
        maintain business records.
      </p>

      <h2>6. Your Rights</h2>
      <p>
        Depending on your location, you may have rights to access, correct,
        delete, or request a copy of certain personal information. You may also
        have rights to object to or restrict certain processing.
      </p>
      <p>
        You can delete your account at any time from{" "}
        <strong>Account → Delete my account</strong>. Deletion is immediate and
        permanent — financial and security records are anonymized rather than
        deleted, as required by law.
      </p>
      <p style={{ fontStyle: "italic", color: "#475569" }}>
        <strong>Tiếng Việt — Quyền của bạn:</strong> Tùy theo nơi bạn sinh
        sống, bạn có thể có các quyền truy cập, chỉnh sửa, xóa, hoặc yêu cầu
        bản sao thông tin cá nhân của mình, cũng như quyền phản đối hoặc
        hạn chế một số hoạt động xử lý dữ liệu. Bạn có thể xóa tài khoản
        bất cứ lúc nào trong ứng dụng tại{" "}
        <strong>Tài khoản → Xóa tài khoản của tôi</strong>. Việc xóa diễn
        ra ngay lập tức và không thể hoàn tác — hồ sơ tài chính và an ninh
        sẽ được ẩn danh thay vì xóa, theo yêu cầu của pháp luật.
      </p>

      <h2>7. Children’s Privacy</h2>
      <p>
        Mercy Blade is not intended for children under 13, and we do not
        knowingly collect personal information from children under 13.
      </p>

      <h2>8. Security</h2>
      <p>
        We use reasonable administrative, technical, and organizational
        safeguards to protect information. However, no method of transmission or
        storage is completely secure.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. When we do, we will
        post the updated version on this page and update the effective date.
      </p>

      <h2>10. Contact</h2>
      <p>
        If you have questions about this Privacy Policy, you can contact us at:
      </p>
      <p>
        <strong>admin@mercyblade.com</strong>
      </p>
    </div>
  );
}