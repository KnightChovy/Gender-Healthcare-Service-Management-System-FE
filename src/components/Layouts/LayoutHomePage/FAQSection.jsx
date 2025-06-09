
import React from "react";
import { Link } from "react-router-dom";

export const FAQSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Câu hỏi thường gặp
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Giải đáp những thắc mắc phổ biến về dịch vụ chăm sóc sức khỏe giới
            tính tại GenCare
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* FAQ Item 1 */}
          <div className="mb-4">
            <details className="group rounded-lg bg-gray-50 p-4">
              <summary className="flex cursor-pointer items-center justify-between font-medium">
                <span>
                  Các xét nghiệm và dịch vụ tư vấn tại GenCare có bảo mật không?
                </span>
                <span className="transition group-open:rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Tất cả thông tin cá nhân và kết quả xét nghiệm của khách hàng
                tại GenCare đều được bảo mật tuyệt đối. Chúng tôi tuân thủ
                nghiêm ngặt các quy định về bảo mật thông tin y tế. Kết quả xét
                nghiệm chỉ được cung cấp cho khách hàng hoặc người được ủy quyền
                hợp pháp.
              </p>
            </details>
          </div>

          {/* FAQ Item 2 */}
          <div className="mb-4">
            <details className="group rounded-lg bg-gray-50 p-4">
              <summary className="flex cursor-pointer items-center justify-between font-medium">
                <span>Làm cách nào để đặt lịch xét nghiệm hoặc tư vấn?</span>
                <span className="transition group-open:rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Bạn có thể đặt lịch thông qua website của chúng tôi, gọi điện
                đến số hotline 1900 1133 hoặc trực tiếp đến trung tâm để đăng
                ký. Chúng tôi khuyến khích đặt lịch trước để đảm bảo được phục
                vụ vào thời gian phù hợp với bạn và giảm thời gian chờ đợi.
              </p>
            </details>
          </div>

          {/* FAQ Item 3 */}
          <div className="mb-4">
            <details className="group rounded-lg bg-gray-50 p-4">
              <summary className="flex cursor-pointer items-center justify-between font-medium">
                <span>Tôi có thể nhận kết quả xét nghiệm như thế nào?</span>
                <span className="transition group-open:rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Kết quả xét nghiệm có thể được nhận qua email (được mã hóa),
                trên tài khoản cá nhân tại website của chúng tôi, hoặc trực tiếp
                tại trung tâm. Thời gian trả kết quả tùy thuộc vào loại xét
                nghiệm, từ vài giờ đến vài ngày làm việc.
              </p>
            </details>
          </div>

          {/* FAQ Item 4 */}
          <div className="mb-4">
            <details className="group rounded-lg bg-gray-50 p-4">
              <summary className="flex cursor-pointer items-center justify-between font-medium">
                <span>GenCare có chấp nhận thanh toán bảo hiểm không?</span>
                <span className="transition group-open:rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Chúng tôi chấp nhận thanh toán từ nhiều công ty bảo hiểm y tế.
                Trước khi đến khám, bạn có thể liên hệ với chúng tôi để kiểm tra
                bảo hiểm của mình có được chấp nhận không và mức độ bao phủ chi
                phí.
              </p>
            </details>
          </div>

          {/* FAQ Item 5 */}
          <div className="mb-4">
            <details className="group rounded-lg bg-gray-50 p-4">
              <summary className="flex cursor-pointer items-center justify-between font-medium">
                <span>Có cần chuẩn bị gì trước khi đến xét nghiệm không?</span>
                <span className="transition group-open:rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Tùy thuộc vào loại xét nghiệm, có thể có các yêu cầu chuẩn bị
                khác nhau. Đối với xét nghiệm máu thông thường, bạn có thể được
                yêu cầu nhịn ăn 8-12 giờ trước khi lấy mẫu. Khi đặt lịch, nhân
                viên tư vấn sẽ hướng dẫn cụ thể cho bạn.
              </p>
            </details>
          </div>

          {/* FAQ Item 6 */}
          <div className="mb-4">
            <details className="group rounded-lg bg-gray-50 p-4">
              <summary className="flex cursor-pointer items-center justify-between font-medium">
                <span>
                  Dịch vụ tư vấn tâm lý tại GenCare hoạt động như thế nào?
                </span>
                <span className="transition group-open:rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Dịch vụ tư vấn tâm lý tại GenCare được thực hiện bởi các chuyên
                gia tâm lý có chuyên môn về sức khỏe giới tính. Buổi tư vấn có
                thể diễn ra trực tiếp hoặc online, kéo dài khoảng 45-60 phút.
                Nội dung tư vấn hoàn toàn riêng tư và được điều chỉnh theo nhu
                cầu cụ thể của từng cá nhân.
              </p>
            </details>
          </div>

          <div className="text-center mt-8">
            <Link
              to="/faq"
              className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
            >
              Xem thêm câu hỏi khác
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
