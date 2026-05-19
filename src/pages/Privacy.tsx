// File: src/pages/Privacy.tsx

export default function Privacy() {
  return (
    <div style={{ padding: 24, maxWidth: 860, margin: "0 auto", lineHeight: 1.6 }}>
      <h1>Privacy Policy</h1>

      <p>
        <strong>Last updated:</strong> May 18, 2026
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

      <h2>4b. Giám sát lỗi và ghi lại phiên khi có lỗi (Sentry)</h2>
      <p>
        <strong>Sentry</strong> là nhà cung cấp giám sát lỗi (bên thứ
        ba) của chúng tôi. Khi ứng dụng gặp lỗi hoặc sự cố, Sentry
        nhận thông tin kỹ thuật về lỗi đó: loại lỗi, trang/route đang
        mở, phiên bản ứng dụng, và một mã người dùng không định danh.
        Chúng tôi loại bỏ email, địa chỉ IP và nội dung bạn gõ trước
        khi dữ liệu rời thiết bị. Chúng tôi dùng thông tin này chỉ để
        chẩn đoán và sửa lỗi.
      </p>
      <p>
        Trên phiên bản web, một phần nhỏ phiên truy cập — khoảng 10%,
        cộng 100% các phiên có lỗi xảy ra — được ghi lại dưới dạng
        &ldquo;session replay&rdquo; và gửi tới Sentry. Bản ghi của
        Sentry: <strong>che ẩn toàn bộ chữ bạn nhập</strong> ngay trên
        trình duyệt trước khi rời thiết bị; không lưu hình ảnh, video
        hay file; không có âm thanh, không có camera; chỉ ghi lại thao
        tác bấm, cuộn và điều hướng; được Sentry tự động xoá sau
        khoảng 30 ngày theo gói dịch vụ hiện tại. Tính năng này chỉ
        chạy trên web — ứng dụng iOS và Android không ghi lại phiên.
      </p>
      <p>
        <strong>Lưu ý:</strong> Sentry không phải công cụ ghi phiên
        duy nhất. Xem Mục 4c (Microsoft Clarity) — công cụ đó phục vụ
        phân tích sản phẩm và che ẩn ít hơn Sentry (chỉ che một số
        trường nhất định, không che toàn bộ chữ).
      </p>
      <p style={{ fontStyle: "italic", color: "#475569" }}>
        <strong>English — Error monitoring &amp; error-session replay
        (Sentry):</strong> Sentry is our third-party error-monitoring
        provider. When the app hits an error or crash, Sentry receives
        technical details about it — the error type, the page/route,
        the app version, and a non-identifying user id. We strip your
        email, IP address, and any text you typed before data leaves
        your device, and we use this only to diagnose and fix bugs. On
        the web, approximately 10% of sessions plus 100% of sessions
        with an error are recorded as &ldquo;session replays&rdquo;
        sent to Sentry; these mask <strong>all</strong> typed text in
        your browser before anything leaves your device, capture no
        images/video/files, have no audio or camera, record only
        clicks/scrolls/navigation, and are auto-deleted by Sentry
        after roughly 30 days. Replay runs only on the web — the iOS
        and Android apps do not record sessions. Note: Sentry is not
        the only session-recording tool — see Section 4c (Microsoft
        Clarity), which is for product analytics and masks less than
        Sentry (only certain fields, not all text).
      </p>

      <h2>4c. Phân tích sản phẩm — Microsoft Clarity</h2>
      <p>
        Trên phiên bản web, chúng tôi dùng <strong>Microsoft
        Clarity</strong> — công cụ phân tích sản phẩm của bên thứ ba
        (Microsoft) — để hiểu cách sản phẩm được sử dụng nhằm cải
        thiện nó. Clarity tạo <strong>session replay</strong> (ghi lại
        phiên), <strong>heatmap</strong> (bản đồ nhiệt) và{" "}
        <strong>click map</strong> (bản đồ lượt bấm): ghi lại các thao
        tác như bấm, cuộn, di chuyển chuột và điều hướng.
      </p>
      <p>
        Khác với Sentry, <strong>Clarity không che ẩn toàn bộ
        chữ</strong>. Clarity chỉ che ẩn một số trường nhạy cảm nhất
        định (ô nhập chat với Teacher Mercy, bài kiểm tra xếp loại, ô
        email và mật khẩu); các nội dung văn bản khác trên màn hình có
        thể được ghi lại. Dữ liệu được Microsoft xử lý trên hạ tầng
        của họ, ở ngoài Việt Nam. Clarity chỉ chạy trên web — ứng
        dụng iOS và Android không dùng Clarity. Hiện chưa có nút tắt
        ngay trong ứng dụng; một tuỳ chọn từ chối phân tích đang được
        phát triển và chúng tôi sẽ cập nhật chính sách này khi hoàn
        tất.
      </p>
      <p style={{ fontStyle: "italic", color: "#475569" }}>
        <strong>English — Product analytics (Microsoft
        Clarity):</strong> On the web we use Microsoft Clarity, a
        third-party product-analytics tool (Microsoft), to understand
        how the product is used so we can improve it. Clarity produces
        session replays, heatmaps, and click maps — it records
        interactions such as clicks, scrolls, mouse movement, and
        navigation. Unlike Sentry,{" "}
        <strong>Clarity does not mask all text</strong>; it masks only
        certain sensitive fields (the Teacher Mercy chat input, the
        placement test, and email/password fields), and other on-screen
        text may be recorded. Data is processed by Microsoft on their
        infrastructure outside Vietnam. Clarity runs only on the web —
        the iOS and Android apps do not use Clarity. There is currently
        no in-app off switch; an opt-out control for product analytics
        is in development and we will update this policy when it ships.
      </p>

      <h2>4d. Đo lường tiếp thị và phân tích (Google Analytics, Meta Pixel)</h2>
      <p>
        Khi được kích hoạt, chúng tôi có thể dùng <strong>Google
        Analytics 4</strong> để đo lượt xem trang và các sự kiện chính
        (đăng ký, bắt đầu dùng thử, mua gói). Google Analytics do
        Google (bên thứ ba) vận hành; địa chỉ IP của bạn được ẩn
        danh và công cụ này đặt cookie trên thiết bị của bạn.
      </p>
      <p>
        Chúng tôi cũng đã chuẩn bị tích hợp <strong>Meta (Facebook)
        Pixel</strong> để đo hiệu quả tiếp thị (xem trang, đăng ký,
        bắt đầu dùng thử, mua gói). <strong>Hiện tại Meta Pixel chưa
        được bật.</strong> Nếu sau này được bật, các sự kiện đó sẽ
        được gửi tới Meta Platforms, Inc. và chúng tôi sẽ cập nhật
        chính sách này trước khi kích hoạt. Chúng tôi không gửi bài
        học, tin nhắn chat với Teacher Mercy hay dữ liệu phát âm của
        bạn cho Google hoặc Meta.
      </p>
      <p style={{ fontStyle: "italic", color: "#475569" }}>
        <strong>English — Marketing measurement &amp; analytics (Google
        Analytics, Meta Pixel):</strong> When enabled, we may use
        Google Analytics 4 to measure page views and key events
        (sign-up, trial start, purchase). Google Analytics is operated
        by Google (a third party); your IP address is anonymized and it
        sets cookies on your device. We have also prepared a Meta
        (Facebook) Pixel integration to measure marketing effectiveness
        (page view, registration, trial start, purchase).{" "}
        <strong>The Meta Pixel is currently not enabled.</strong> If it
        is enabled later, those events would be sent to Meta Platforms,
        Inc., and we will update this policy before activating it. We do
        not send your lessons, Teacher Mercy chat messages, or
        pronunciation data to Google or Meta.
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
      <p>
        <strong>Về chế độ Trẻ em:</strong> Mercy Blade có một chế độ
        Trẻ em. Hiện tại, hoạt động trong chế độ Trẻ em được ghi nhận
        và phân tích <strong>giống như người dùng thường</strong> — các
        công cụ phân tích nêu ở Mục 4b–4d <strong>không loại trừ</strong>
        {" "}chế độ Trẻ em. Chúng tôi nói rõ điều này một cách trung
        thực thay vì tuyên bố là có sự khác biệt. Chúng tôi đang xây
        dựng cơ chế loại trừ theo dõi (tracking carve-out) cho chế độ
        Trẻ em và sẽ cập nhật chính sách này khi hoàn tất.
      </p>
      <p style={{ fontStyle: "italic", color: "#475569" }}>
        <strong>English — Kids mode:</strong> Mercy Blade has a Kids
        mode. At this time, activity in Kids mode is recorded and
        analyzed <strong>the same way as for adult users</strong> — the
        analytics tools described in Sections 4b–4d{" "}
        <strong>do not exclude</strong> Kids mode. We state this
        honestly rather than claiming a difference that does not yet
        exist. We are building a tracking carve-out for Kids mode and
        will update this policy when it is in place.
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