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
            <h2 className="text-xl font-semibold mb-3 text-gray-900">3. Payments & Subscriptions / Thanh toán & Đăng ký</h2>
            <p className="mb-2">
              Subscription fees are charged upfront for the selected period (monthly or yearly). All payments are processed securely through PayPal. We do not store your payment card details.
            </p>
            <p className="text-gray-600">
              Phí đăng ký được thu trước cho thời gian đã chọn (hàng tháng hoặc hàng năm). Tất cả thanh toán được xử lý an toàn qua PayPal. Chúng tôi không lưu trữ thông tin thẻ thanh toán của bạn.
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
            <h2 className="text-xl font-semibold mb-3 text-gray-900">6. Termination / Chấm dứt</h2>
            <p className="mb-2">
              We reserve the right to suspend or terminate accounts that violate these terms or engage in prohibited activities.
            </p>
            <p className="text-gray-600">
              Chúng tôi có quyền tạm ngưng hoặc chấm dứt tài khoản vi phạm các điều khoản này hoặc tham gia vào các hoạt động bị cấm.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">7. Contact / Liên hệ</h2>
            <p className="mb-2">
              For questions about these terms, please contact us through the app's feedback system.
            </p>
            <p className="text-gray-600">
              Nếu có câu hỏi về các điều khoản này, vui lòng liên hệ với chúng tôi qua hệ thống phản hồi của ứng dụng.
            </p>
          </section>

          <p className="text-sm text-gray-500 mt-8">
            Last updated: {new Date().toLocaleDateString()} / Cập nhật lần cuối: {new Date().toLocaleDateString()}
          </p>
        </div>
      </main>
    </div>
  );
}
