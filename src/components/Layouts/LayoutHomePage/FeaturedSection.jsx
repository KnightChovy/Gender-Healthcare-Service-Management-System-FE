import React from "react";
import { Link } from "react-router-dom";

export const FeaturedSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Dịch vụ xét nghiệm
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Các gói xét nghiệm và tư vấn toàn diện, được thiết kế phù hợp với
            từng nhu cầu
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Gói 1 */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden transition-transform hover:-translate-y-1">
            <div className="bg-blue-50 p-4">
              <h3 className="text-xl font-bold text-center text-blue-800">
                Gói kiểm tra cơ bản
              </h3>
            </div>
            <div className="p-6">
              <p className="text-3xl font-bold text-center mb-6">950.000 đ</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>Xét nghiệm HIV</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>Xét nghiệm giang mai</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>Tư vấn kết quả</span>
                </li>
              </ul>
              <Link
                to="/packages/basic"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-center py-3 rounded-lg transition-colors"
              >
                Đặt lịch ngay
              </Link>
            </div>
          </div>

          {/* Gói 2 */}
          <div className="bg-white border-2 border-blue-500 rounded-xl shadow-lg overflow-hidden transform scale-105 relative">
            <div className="absolute top-0 right-0">
              <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                PHỔ BIẾN NHẤT
              </div>
            </div>
            <div className="bg-blue-600 p-4">
              <h3 className="text-xl font-bold text-center text-white">
                Gói kiểm tra toàn diện
              </h3>
            </div>
            <div className="p-6">
              <p className="text-3xl font-bold text-center mb-6">1.950.000 đ</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>Xét nghiệm HIV</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>Xét nghiệm STI toàn diện (8 loại)</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>Tư vấn tâm lý</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>Tư vấn giáo dục giới tính</span>
                </li>
              </ul>
              <Link
                to="/packages/comprehensive"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-center py-3 rounded-lg transition-colors"
              >
                Đặt lịch ngay
              </Link>
            </div>
          </div>

          {/* Gói 3 */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden transition-transform hover:-translate-y-1">
            <div className="bg-blue-50 p-4">
              <h3 className="text-xl font-bold text-center text-blue-800">
                Gói Premium
              </h3>
            </div>
            <div className="p-6">
              <p className="text-3xl font-bold text-center mb-6">2.950.000 đ</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>Tất cả dịch vụ gói toàn diện</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>Khám tổng quát</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>Tư vấn định kỳ (3 tháng)</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>Hỗ trợ tâm lý không giới hạn</span>
                </li>
              </ul>
              <Link
                to="/packages/premium"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-center py-3 rounded-lg transition-colors"
              >
                Đặt lịch ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
