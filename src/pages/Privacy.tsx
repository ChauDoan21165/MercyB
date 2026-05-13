// File: src/pages/Privacy.tsx

export default function Privacy() {
  return (
    <div style={{ padding: 24, maxWidth: 860, margin: "0 auto", lineHeight: 1.6 }}>
      <h1>Privacy Policy</h1>

      <p>
        <strong>Last updated:</strong> May 13, 2026
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

      <h2>2a. Anonymous Sessions</h2>
      <p>
        To let visitors try pronunciation scoring without signing up, we
        may create a temporary anonymous account on first load. These
        sessions store no personal information — no email, no name —
        and exist only to authenticate the practice request to our
        scoring service. Anonymous accounts are deleted automatically
        after 30 days of inactivity. If you sign up later, your prior
        practice history is linked to your new account.
      </p>
      <p>
        <strong>Tiếng Việt — Phiên ẩn danh:</strong> Để bạn có thể thử
        tính năng chấm phát âm mà không cần đăng ký, lần đầu vào trang
        chúng tôi có thể tạo một tài khoản ẩn danh tạm thời. Phiên này
        không lưu thông tin cá nhân — không có email, không có tên — và
        chỉ tồn tại để xác thực yêu cầu chấm phát âm. Tài khoản ẩn danh
        tự động bị xóa sau 30 ngày không hoạt động. Nếu sau này bạn đăng
        ký, lịch sử luyện tập trước đó sẽ được gắn vào tài khoản mới.
      </p>

      <h2>2b. AI Processing in Teacher Mercy</h2>
      <p>
        Teacher Mercy uses third-party artificial-intelligence services
        to generate responses to your chat messages. When you send a
        message to Teacher Mercy, the text of that message is transmitted
        to an AI provider so the provider can return a reply. Messages
        sent to the AI provider are processed for the purpose of
        generating a response and are not retained by us for long-term
        storage tied to your identity. We never share your messages
        with advertisers and do not use them to train external models.
      </p>
      <p>
        Before your first message in Teacher Mercy, the app shows a
        one-time disclosure notice describing this. By tapping
        <em> "I understand"</em> on that notice you acknowledge that
        chat messages will be processed by an AI service. You can
        avoid sending content to the AI by simply not sending messages
        to Teacher Mercy — the rest of the app (lessons, audio, exam
        prep) does not transmit your input to the AI provider.
      </p>
      <p>
        <strong>Tiếng Việt — AI trong Teacher Mercy:</strong> Khi bạn
        nhắn cho Teacher Mercy, nội dung tin nhắn được gửi tới dịch vụ
        trí tuệ nhân tạo (AI) của bên thứ ba để tạo phản hồi. Tin nhắn
        không được lưu trữ lâu dài, không chia sẻ với nhà quảng cáo,
        và không dùng để huấn luyện mô hình bên ngoài. Lần đầu mở
        Teacher Mercy, ứng dụng hiển thị một thông báo một lần để bạn
        xác nhận trước khi gửi tin nhắn đầu tiên. Bạn có thể tránh
        gửi nội dung tới AI bằng cách không nhắn cho Teacher Mercy —
        các phần còn lại của ứng dụng (bài học, audio, luyện thi) không
        truyền nội dung của bạn tới AI.
      </p>

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

      <h2>4b. Web Session Replay (Sentry)</h2>
      <p>
        When you use the web version of Mercy Blade, a small fraction of
        sessions — approximately 10% of all sessions, plus 100% of
        sessions in which an error occurs — are recorded as
        &ldquo;session replays&rdquo; and sent to{" "}
        <strong>Sentry</strong>, our error monitoring provider, so we
        can see what happened in the moments before a crash. We use
        these recordings only to diagnose and fix bugs.
      </p>
      <p>These recordings:</p>
      <ul>
        <li>
          <strong>Do not capture text you type.</strong> All text
          content is masked in your browser before any data leaves your
          device.
        </li>
        <li>
          <strong>Do not capture images, video, or files</strong> —
          only clicks, scrolls, and navigation are recorded.
        </li>
        <li>
          <strong>Have no audio and no camera.</strong>
        </li>
        <li>
          Are retained by Sentry for approximately 30 days under our
          current plan, then deleted automatically.
        </li>
      </ul>
      <p>
        Session replay runs only on the web version of Mercy Blade —
        the iOS and Android apps do not record session replays.
        Masking is enabled by default; no action is required on your
        part.
      </p>
      <p style={{ fontStyle: "italic", color: "#475569" }}>
        <strong>Tiếng Việt — Ghi lại phiên truy cập web (Sentry):</strong>{" "}
        Khi bạn dùng phiên bản web của Mercy Blade, một phần nhỏ phiên
        truy cập (khoảng 10%, và 100% các phiên có lỗi xảy ra) sẽ được
        ghi lại dưới dạng &ldquo;session replay&rdquo; và gửi tới{" "}
        <strong>Sentry</strong> — đối tác giám sát lỗi của chúng tôi —
        để chúng tôi xem được điều gì đã xảy ra trước khi gặp sự cố.
        Bản ghi này: không lưu chữ bạn nhập (toàn bộ nội dung văn bản
        đều được che ẩn ngay trên trình duyệt của bạn trước khi rời
        khỏi máy); không lưu hình ảnh, video, file (chỉ ghi lại các
        thao tác bấm/cuộn/điều hướng); không có âm thanh, không có
        camera; và được Sentry tự động xoá sau khoảng 30 ngày theo
        gói dịch vụ hiện tại. Tính năng này chỉ chạy trên phiên bản
        web — ứng dụng iOS và Android không ghi lại phiên truy cập.
        Chúng tôi dùng dữ liệu này chỉ để khắc phục lỗi. Bạn không
        cần làm gì để được bảo vệ — việc che ẩn được bật mặc định.
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