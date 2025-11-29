import { ColorfulMercyBladeHeader } from '@/components/ColorfulMercyBladeHeader';

export default function Privacy() {
  return (
    <div className="min-h-screen">
      <ColorfulMercyBladeHeader
        subtitle="Privacy Policy / Chính sách bảo mật"
        showBackButton={true}
      />
      
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy / Chính sách bảo mật</h1>
        
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">1. Information We Collect / Thông tin chúng tôi thu thập</h2>
            <p className="mb-2">
              We collect account information (email, name), usage data (rooms accessed, progress), and payment information processed through PayPal.
            </p>
            <p className="text-gray-600">
              Chúng tôi thu thập thông tin tài khoản (email, tên), dữ liệu sử dụng (các phòng đã truy cập, tiến độ), và thông tin thanh toán được xử lý qua PayPal.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">2. How We Use Your Information / Cách chúng tôi sử dụng thông tin của bạn</h2>
            <p className="mb-2">
              Your information is used to provide and improve our services, process payments, communicate with you, and personalize your experience.
            </p>
            <p className="text-gray-600">
              Thông tin của bạn được sử dụng để cung cấp và cải thiện dịch vụ, xử lý thanh toán, giao tiếp với bạn và cá nhân hóa trải nghiệm của bạn.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">3. Data Storage & Security / Lưu trữ và bảo mật dữ liệu</h2>
            <p className="mb-2">
              Your data is securely stored using Supabase infrastructure with industry-standard encryption. We implement security measures to protect against unauthorized access.
            </p>
            <p className="text-gray-600">
              Dữ liệu của bạn được lưu trữ an toàn bằng cơ sở hạ tầng Supabase với mã hóa tiêu chuẩn ngành. Chúng tôi thực hiện các biện pháp bảo mật để bảo vệ chống truy cập trái phép.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">4. Payment Information / Thông tin thanh toán</h2>
            <p className="mb-2">
              All payments are processed by PayPal. We do not store your credit card details or payment card information on our servers.
            </p>
            <p className="text-gray-600">
              Tất cả thanh toán được xử lý bởi PayPal. Chúng tôi không lưu trữ thông tin thẻ tín dụng hoặc thông tin thẻ thanh toán của bạn trên máy chủ của chúng tôi.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">5. Data Sharing / Chia sẻ dữ liệu</h2>
            <p className="mb-2">
              We do not sell or share your personal information with third parties except as required for service operation (payment processing) or as required by law.
            </p>
            <p className="text-gray-600">
              Chúng tôi không bán hoặc chia sẻ thông tin cá nhân của bạn với bên thứ ba trừ khi cần thiết cho hoạt động dịch vụ (xử lý thanh toán) hoặc theo yêu cầu của pháp luật.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">6. Your Rights / Quyền của bạn</h2>
            <p className="mb-2">
              You can access, update, or delete your personal information through your account settings. You may also request a copy of your data.
            </p>
            <p className="text-gray-600">
              Bạn có thể truy cập, cập nhật hoặc xóa thông tin cá nhân của mình thông qua cài đặt tài khoản. Bạn cũng có thể yêu cầu một bản sao dữ liệu của mình.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">7. Cookies & Analytics / Cookies & Phân tích</h2>
            <p className="mb-2">
              We use essential cookies for authentication and session management. Usage analytics help us improve the app experience.
            </p>
            <p className="text-gray-600">
              Chúng tôi sử dụng cookies cần thiết cho xác thực và quản lý phiên. Phân tích sử dụng giúp chúng tôi cải thiện trải nghiệm ứng dụng.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">8. Contact / Liên hệ</h2>
            <p className="mb-2">
              For privacy-related questions or requests, contact us through the app's feedback system.
            </p>
            <p className="text-gray-600">
              Đối với các câu hỏi hoặc yêu cầu liên quan đến quyền riêng tư, vui lòng liên hệ với chúng tôi qua hệ thống phản hồi của ứng dụng.
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
