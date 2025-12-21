import { ColorfulMercyBladeHeader } from '@/components/ColorfulMercyBladeHeader';

export default function Terms() {
  return (
    <div className="min-h-screen">
      <ColorfulMercyBladeHeader
        subtitle="Terms of Service / Điều khoản sử dụng"
        showBackButton={true}
      />
      
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">Terms of Service / Điều khoản sử dụng</h1>
        
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">1. Service Description / Mô tả dịch vụ</h2>
            <p className="mb-2">
              Mercy Blade ("the App") provides educational and self-development content through interactive rooms and audio-guided experiences.
            </p>
            <p className="text-gray-600">
              Mercy Blade ("Ứng dụng") cung cấp nội dung giáo dục và phát triển bản thân thông qua các phòng tương tác và trải nghiệm hướng dẫn bằng âm thanh.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">2. User Accounts / Tài khoản người dùng</h2>
            <p className="mb-2">
              Users must create an account and provide accurate information. You are responsible for maintaining the security of your account credentials.
            </p>
            <p className="text-gray-600">
              Người dùng phải tạo tài khoản và cung cấp thông tin chính xác. Bạn chịu trách nhiệm bảo mật thông tin đăng nhập của mình.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">3. Payments & Tier Access / Thanh toán & Quyền truy cập cấp độ</h2>
            <p className="mb-2">
              Payment is required upfront to access premium tiers (VIP1-VIP9). Once purchased, you gain immediate access to all content in that tier for the purchased period. All payments are processed securely through PayPal. We do not store your payment card details.
            </p>
            <p className="text-gray-600">
              Thanh toán được yêu cầu trả trước để truy cập các cấp cao cấp (VIP1-VIP9). Sau khi mua, bạn có quyền truy cập ngay lập tức vào tất cả nội dung trong cấp đó trong khoảng thời gian đã mua. Tất cả thanh toán được xử lý an toàn qua PayPal. Chúng tôi không lưu trữ thông tin thẻ thanh toán của bạn.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">4. Content Usage / Sử dụng nội dung</h2>
            <p className="mb-2">
              All content is provided for personal, non-commercial use only. Reproduction, distribution, or sharing of content without permission is prohibited.
            </p>
            <p className="text-gray-600">
              Tất cả nội dung chỉ được cung cấp cho mục đích cá nhân, phi thương mại. Nghiêm cấm sao chép, phân phối hoặc chia sẻ nội dung mà không có sự cho phép.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">5. No Medical or Professional Advice / Không phải lời khuyên y tế hoặc chuyên môn</h2>
            <p className="mb-2">
              The App provides educational content only and does not constitute medical, psychological, or professional advice. Consult qualified professionals for specific concerns.
            </p>
            <p className="text-gray-600">
              Ứng dụng chỉ cung cấp nội dung giáo dục và không phải là lời khuyên y tế, tâm lý hay chuyên môn. Vui lòng tham khảo các chuyên gia có trình độ cho các vấn đề cụ thể.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">6. Rate Limits & Fair Use / Giới hạn tốc độ & Sử dụng hợp lý</h2>
            <p className="mb-2">
              To ensure quality service for all users, we implement rate limits on certain features. Excessive or abusive usage may result in temporary restrictions. Content moderation systems automatically detect and act on violations.
            </p>
            <p className="text-gray-600">
              Để đảm bảo dịch vụ chất lượng cho tất cả người dùng, chúng tôi thực hiện giới hạn tốc độ trên một số tính năng. Việc sử dụng quá mức hoặc lạm dụng có thể dẫn đến hạn chế tạm thời. Hệ thống kiểm duyệt nội dung tự động phát hiện và xử lý các vi phạm.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">7. Account Suspension & Termination / Tạm ngưng & Chấm dứt tài khoản</h2>
            <p className="mb-2">
              We reserve the right to suspend or terminate accounts that violate these terms, engage in prohibited activities, or abuse the service. Suspended accounts may lose access without refund.
            </p>
            <p className="text-gray-600">
              Chúng tôi có quyền tạm ngưng hoặc chấm dứt tài khoản vi phạm các điều khoản này, tham gia vào các hoạt động bị cấm, hoặc lạm dụng dịch vụ. Tài khoản bị tạm ngưng có thể mất quyền truy cập mà không được hoàn tiền.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">8. Contact / Liên hệ</h2>
            <p className="mb-2">
              For questions about these terms, please contact us through the app's feedback system.
            </p>
            <p className="text-gray-600">
              Nếu có câu hỏi về các điều khoản này, vui lòng liên hệ với chúng tôi qua hệ thống phản hồi của ứng dụng.
            </p>
          </section>

          <p className="text-sm text-gray-500 mt-8">
            See also: <a href="/privacy" className="underline hover:text-gray-900">Privacy Policy / Chính sách bảo mật</a>, <a href="/refund" className="underline hover:text-gray-900">Refund Policy / Chính sách hoàn tiền</a>
          </p>

          <p className="text-sm text-gray-500 mt-4">
            Last updated: 2025-11-29 / Cập nhật lần cuối: 2025-11-29
          </p>
        </div>
      </main>
    </div>
  );
}
