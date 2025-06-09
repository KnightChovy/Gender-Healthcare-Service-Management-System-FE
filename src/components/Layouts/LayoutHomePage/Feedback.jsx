import React from "react";
import { Link } from "react-router-dom";

export const Feedback = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Tin tức & Kiến thức
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Cập nhật thông tin mới nhất về sức khỏe giới tính và các kiến thức
            bổ ích
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Bài viết 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef"
              alt="Blog post"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <span className="text-sm text-blue-600 font-medium">
                Sức khỏe sinh sản
              </span>
              <h3 className="text-xl font-bold mt-2 mb-3">
                5 điều cần biết về sức khỏe sinh sản nữ
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-2">
                Khám phá những kiến thức cơ bản giúp bạn hiểu rõ và chăm sóc tốt
                hơn sức khỏe sinh sản...
              </p>
              <Link
                to="/blog/reproductive-health"
                className="text-blue-600 font-medium hover:text-blue-800 flex items-center"
              >
                Đọc thêm
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

          {/* Bài viết 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1579154204601-01588f351e67"
              alt="Blog post"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <span className="text-sm text-blue-600 font-medium">
                Giáo dục giới tính
              </span>
              <h3 className="text-xl font-bold mt-2 mb-3">
                Trò chuyện với con về giáo dục giới tính
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-2">
                Hướng dẫn cha mẹ cách trò chuyện tự nhiên và hiệu quả về các vấn
                đề giới tính với con...
              </p>
              <Link
                to="/blog/sex-education"
                className="text-blue-600 font-medium hover:text-blue-800 flex items-center"
              >
                Đọc thêm
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

          {/* Bài viết 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d"
              alt="Blog post"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <span className="text-sm text-blue-600 font-medium">
                Sức khỏe tâm lý
              </span>
              <h3 className="text-xl font-bold mt-2 mb-3">
                Xây dựng mối quan hệ tình cảm lành mạnh
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-2">
                Những yếu tố then chốt giúp xây dựng và duy trì mối quan hệ tình
                cảm lành mạnh, bền vững...
              </p>
              <Link
                to="/blog/healthy-relationships"
                className="text-blue-600 font-medium hover:text-blue-800 flex items-center"
              >
                Đọc thêm
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

        <div className="text-center mt-10">
          <Link
            to="/blog"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow-sm transition-colors"
          >
            Xem tất cả bài viết
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
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
    </section>
  );
};