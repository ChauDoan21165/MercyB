import { ColorfulMercyBladeHeader } from '@/components/ColorfulMercyBladeHeader';

export default function Refund() {
  return (
    <div className="min-h-screen">
      <ColorfulMercyBladeHeader
        subtitle="Refund Policy / Chính sách hoàn tiền"
        showBackButton={true}
      />
      
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">Refund Policy / Chính sách hoàn tiền</h1>
        
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">1. General Policy / Chính sách chung</h2>
            <p className="mb-2">
              Due to the digital nature of our content and instant access upon payment, all sales are generally final. However, we evaluate refund requests on a case-by-case basis within 7 days of purchase.
            </p>
            <p className="text-gray-600">
              Do tính chất kỹ thuật số của nội dung và quyền truy cập ngay lập tức sau thanh toán, tất cả các giao dịch mua hàng thường là cuối cùng. Tuy nhiên, chúng tôi xem xét các yêu cầu hoàn tiền theo từng trường hợp trong vòng 7 ngày kể từ ngày mua.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">2. Eligible Refund Cases / Các trường hợp đủ điều kiện hoàn tiền</h2>
            <p className="mb-2">Refunds may be considered in the following situations:</p>
            <p className="text-gray-600 mb-2">Hoàn tiền có thể được xem xét trong các tình huống sau:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Technical issues preventing access to paid content / Sự cố kỹ thuật ngăn truy cập nội dung đã trả tiền</li>
              <li>Duplicate or erroneous charges / Phí trùng lặp hoặc sai</li>
              <li>Content significantly different from description / Nội dung khác biệt đáng kể so với mô tả</li>
              <li>Unauthorized charges / Phí không được ủy quyền</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">3. Non-Refundable Cases / Các trường hợp không được hoàn tiền</h2>
            <p className="mb-2">Refunds will not be provided for:</p>
            <p className="text-gray-600 mb-2">Hoàn tiền sẽ không được cung cấp cho:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Change of mind after accessing content / Thay đổi ý định sau khi truy cập nội dung</li>
              <li>Requests made after 7 days of purchase / Yêu cầu được thực hiện sau 7 ngày kể từ ngày mua</li>
              <li>Account violations or terms of service breaches / Vi phạm tài khoản hoặc vi phạm điều khoản dịch vụ</li>
              <li>Partial period refunds (monthly subscriptions) / Hoàn tiền một phần thời gian (đăng ký hàng tháng)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">4. How to Request a Refund / Cách yêu cầu hoàn tiền</h2>
            <p className="mb-2">
              To request a refund, contact us through the app's feedback system within 7 days of purchase. Include your order details and reason for the refund request.
            </p>
            <p className="text-gray-600">
              Để yêu cầu hoàn tiền, vui lòng liên hệ với chúng tôi qua hệ thống phản hồi của ứng dụng trong vòng 7 ngày kể từ ngày mua. Bao gồm chi tiết đơn hàng và lý do yêu cầu hoàn tiền.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">5. Processing Time / Thời gian xử lý</h2>
            <p className="mb-2">
              Approved refunds will be processed within 5-10 business days. The refund will be credited to your original payment method through PayPal.
            </p>
            <p className="text-gray-600">
              Hoàn tiền được chấp thuận sẽ được xử lý trong vòng 5-10 ngày làm việc. Hoàn tiền sẽ được ghi có vào phương thức thanh toán ban đầu của bạn thông qua PayPal.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">6. Subscription Cancellation / Hủy đăng ký</h2>
            <p className="mb-2">
              You can cancel your subscription at any time, but you will retain access until the end of your current billing period. No partial refunds are provided for cancelled subscriptions.
            </p>
            <p className="text-gray-600">
              Bạn có thể hủy đăng ký bất cứ lúc nào, nhưng bạn sẽ vẫn có quyền truy cập cho đến khi kết thúc thời gian thanh toán hiện tại. Không có hoàn tiền một phần cho các đăng ký bị hủy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">7. Contact / Liên hệ</h2>
            <p className="mb-2">
              For refund inquiries, contact us through the app's feedback system with "Refund Request" in the subject line.
            </p>
            <p className="text-gray-600">
              Đối với các câu hỏi về hoàn tiền, vui lòng liên hệ với chúng tôi qua hệ thống phản hồi của ứng dụng với dòng tiêu đề "Yêu cầu hoàn tiền".
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
