import React from "react";
import logo_gender from "../assets/gender_healthcare_logo.png";
import icon_search from "../assets/ico_search.png";
import banner_page from "../assets/banner_gender.jpg";
import { Link } from "react-router-dom";
export const HomePage = () => {
  return (
    <div className="wrap">
      <header className="py-2 lg:py-3 sticky top-0 z-10 bg-white shadow-lg">
        <div className="container flex items-center justify-center">
          <div className="flex-shrink-0">
            <Link className="block max-w-[80px]" to="/">
              <img className="max-w-full" src={logo_gender} alt="logo_gender" />
            </Link>
          </div>
          <nav className="hidden lg:flex flex-1 justify-center">
            <ul className="flex items-center gap-10 font-medium">
              <li className="relative after:absolute text-[15px] after:h-[1.5px] after:bg-blue-800 after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:scale-x-100 hover:text-blue-900 transition-colors duration-200">
                <Link to="/">Trang chủ</Link>
              </li>
              <li className="relative after:absolute text-[15px] after:h-[1.5px] after:bg-blue-800 after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:scale-x-100 hover:text-blue-900 transition-colors duration-200">
                <a href="#">Các loại dịch vụ</a>
              </li>
              <li className="relative after:absolute text-[15px] after:h-[1.5px] after:bg-blue-800 after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:scale-x-100 hover:text-blue-900 transition-colors duration-200">
                <a href="#">Về chúng tôi</a>
              </li>
              <li className="relative after:absolute text-[15px] after:h-[1.5px] after:bg-blue-800 after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:scale-x-100 hover:text-blue-900 transition-colors duration-200">
                <a href="#">Blog</a>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex items-center pl-3">
              <span>
                <img
                  className="size-5 cursor-pointer"
                  src={icon_search}
                  alt=""
                />
              </span>
            </div>

            <Link
              to="/register"
              className="text-sm font-medium hover:text-blue-600 transition-colors duration-200"
            >
              Đăng Ký
            </Link>
            <div className="h-4 w-px bg-gray-300"></div>
            <Link
              to="/Login"
              className="text-sm font-medium hover:text-blue-600 transition-colors duration-200"
            >
              Đăng Nhập
            </Link>
          </div>
        </div>
      </header>
      <main>
        <section className="relative">
          <img
            className="w-full h-auto object-cover"
            src={banner_page}
            alt="Gender Healthcare Banner"
          />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto">
              <div className="flex flex-col lg:flex-row items-center">
                <div className="w-full lg:w-1/2 px-4 lg:px-6 py-6 lg:py-16">
                  <h1 className="text-2xl md:text-4xl font-bold text-blue-800 mb-6">
                    Phòng khám và xét nghiệm GenCare
                  </h1>

                  <div className="relative w-full mb-6">
                    <input
                      type="text"
                      placeholder="Tìm kiếm..."
                      className="w-full px-5 py-3 pl-12 text-gray-700 bg-white border-0 rounded-lg shadow-md focus:outline-none"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/booking"
                      className="flex items-center bg-white rounded-lg py-2 px-5 hover:shadow-md transition-shadow"
                    >
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-800 text-sm font-medium">
                        Đặt lịch xét nghiệm
                      </span>
                    </Link>

                    <Link
                      to="/packages"
                      className="flex items-center bg-white rounded-lg py-2 px-5 hover:shadow-md transition-shadow max-w-[235px]"
                    >
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-800 text-sm font-medium">
                        Khám phá gói xét nghiệm
                      </span>
                    </Link>

                    <Link
                      to="/symptoms"
                      className="flex items-center bg-white rounded-lg py-2 px-5 hover:shadow-md transition-shadow"
                    >
                      <div className="bg-red-100 p-2 rounded-full mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-red-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-800 text-sm font-medium">
                        Đặt lịch tư vấn
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Dịch vụ chính */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Dịch vụ của chúng tôi
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Cung cấp các dịch vụ chăm sóc sức khỏe giới tính toàn diện,
                chuyên nghiệp và riêng tư
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Dịch vụ 1 */}
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Tư vấn sức khỏe
                </h3>
                <p className="text-gray-600 mb-4">
                  Dịch vụ tư vấn với các chuyên gia y tế về mọi vấn đề sức khỏe
                  giới tính.
                </p>
                <Link
                  to="/services/consulting"
                  className="text-blue-600 font-medium hover:text-blue-800 flex items-center"
                >
                  Tìm hiểu thêm
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

              {/* Dịch vụ 2 */}
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Xét nghiệm STI/STD
                </h3>
                <p className="text-gray-600 mb-4">
                  Các xét nghiệm phát hiện sớm các bệnh lây truyền qua đường
                  tình dục.
                </p>
                <Link
                  to="/services/testing"
                  className="text-green-600 font-medium hover:text-green-800 flex items-center"
                >
                  Tìm hiểu thêm
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

              {/* Dịch vụ 3 */}
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-purple-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Khám chuyên khoa
                </h3>
                <p className="text-gray-600 mb-4">
                  Dịch vụ khám và điều trị chuyên sâu với các bác sĩ chuyên
                  khoa.
                </p>
                <Link
                  to="/services/specialist"
                  className="text-purple-600 font-medium hover:text-purple-800 flex items-center"
                >
                  Tìm hiểu thêm
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

              {/* Dịch vụ 4 */}
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-red-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Tư vấn tâm lý
                </h3>
                <p className="text-gray-600 mb-4">
                  Hỗ trợ tâm lý và giải quyết các lo lắng về vấn đề giới tính.
                </p>
                <Link
                  to="/services/counseling"
                  className="text-red-600 font-medium hover:text-red-800 flex items-center"
                >
                  Tìm hiểu thêm
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

        {/* Section: Giá trị cốt lõi */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Tại sao chọn GenCare?
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Chúng tôi cam kết mang lại dịch vụ chăm sóc sức khỏe giới tính
                chất lượng cao với những giá trị cốt lõi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Giá trị 1 */}
              <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
                <div className="bg-blue-50 p-4 rounded-full mb-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Bảo mật tuyệt đối</h3>
                <p className="text-gray-600">
                  Chúng tôi đảm bảo thông tin cá nhân và kết quả xét nghiệm của
                  bạn luôn được bảo mật tuyệt đối.
                </p>
              </div>

              {/* Giá trị 2 */}
              <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
                <div className="bg-green-50 p-4 rounded-full mb-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Công nghệ hiện đại</h3>
                <p className="text-gray-600">
                  Hệ thống máy móc và quy trình xét nghiệm tiên tiến, mang lại
                  kết quả chính xác cao.
                </p>
              </div>

              {/* Giá trị 3 */}
              <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
                <div className="bg-purple-50 p-4 rounded-full mb-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">
                  Đội ngũ chuyên nghiệp
                </h3>
                <p className="text-gray-600">
                  Đội ngũ y bác sĩ được đào tạo chuyên sâu, giàu kinh nghiệm về
                  sức khỏe giới tính.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Gói dịch vụ nổi bật */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Gói dịch vụ nổi bật
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Các gói xét nghiệm và tư vấn toàn diện, được thiết kế phù hợp
                với từng nhu cầu
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
                  <p className="text-3xl font-bold text-center mb-6">
                    950.000 đ
                  </p>
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
                  <p className="text-3xl font-bold text-center mb-6">
                    1.950.000 đ
                  </p>
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
                  <p className="text-3xl font-bold text-center mb-6">
                    2.950.000 đ
                  </p>
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

        {/* Section: Đội ngũ chuyên gia */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Đội ngũ chuyên gia
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Đội ngũ y bác sĩ giàu kinh nghiệm, được đào tạo chuyên sâu về
                sức khỏe giới tính
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Chuyên gia 1 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1622902046580-2b47f47f5471"
                  alt="Bác sĩ Nguyễn Văn A"
                  className="w-full h-64 object-cover"
                />
                <div className="p-5">
                  <h3 className="text-xl font-bold mb-1">BS. Nguyễn Văn A</h3>
                  <p className="text-blue-600 mb-3">Trưởng khoa Nam học</p>
                  <p className="text-gray-600 text-sm">
                    Hơn 15 năm kinh nghiệm trong lĩnh vực nam khoa và sức khỏe
                    sinh sản nam giới.
                  </p>
                </div>
              </div>

              {/* Chuyên gia 2 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1594824476967-48c8b964273f"
                  alt="Bác sĩ Trần Thị B"
                  className="w-full h-64 object-cover"
                />
                <div className="p-5">
                  <h3 className="text-xl font-bold mb-1">BS. Trần Thị B</h3>
                  <p className="text-blue-600 mb-3">Chuyên khoa Phụ sản</p>
                  <p className="text-gray-600 text-sm">
                    Chuyên gia về sức khỏe sinh sản nữ với chứng chỉ quốc tế về
                    tư vấn SKSS.
                  </p>
                </div>
              </div>

              {/* Chuyên gia 3 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d"
                  alt="ThS. Lê Văn C"
                  className="w-full h-64 object-cover"
                />
                <div className="p-5">
                  <h3 className="text-xl font-bold mb-1">ThS. Lê Văn C</h3>
                  <p className="text-blue-600 mb-3">Chuyên gia tâm lý</p>
                  <p className="text-gray-600 text-sm">
                    Thạc sĩ Tâm lý học lâm sàng, chuyên tư vấn các vấn đề tâm lý
                    về giới tính.
                  </p>
                </div>
              </div>

              {/* Chuyên gia 4 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2"
                  alt="PGS.TS Hoàng Thị D"
                  className="w-full h-64 object-cover"
                />
                <div className="p-5">
                  <h3 className="text-xl font-bold mb-1">PGS.TS Hoàng Thị D</h3>
                  <p className="text-blue-600 mb-3">Giám đốc chuyên môn</p>
                  <p className="text-gray-600 text-sm">
                    Phó Giáo sư, Tiến sĩ Y khoa với 25 năm kinh nghiệm trong
                    lĩnh vực y tế công cộng.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-10">
              <Link
                to="/team"
                className="inline-flex items-center bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg shadow-sm transition-colors"
              >
                Xem tất cả chuyên gia
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

        {/* Section: Đánh giá khách hàng */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Khách hàng nói gì về chúng tôi
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Những phản hồi chân thực từ khách hàng đã sử dụng dịch vụ tại
                GenCare
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Đánh giá 1 */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex text-yellow-400 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <p className="text-gray-600 italic mb-5">
                  "Tôi rất hài lòng với dịch vụ tại GenCare. Các bác sĩ rất
                  chuyên nghiệp và thân thiện, tôi cảm thấy thoải mái khi trao
                  đổi về các vấn đề nhạy cảm."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="font-medium text-blue-700">MH</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Minh Hương</h4>
                    <p className="text-sm text-gray-500">Khách hàng từ 2022</p>
                  </div>
                </div>
              </div>

              {/* Đánh giá 2 */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex text-yellow-400 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <p className="text-gray-600 italic mb-5">
                  "Gói xét nghiệm toàn diện của GenCare thực sự rất chi tiết và
                  chuyên nghiệp. Tôi đánh giá cao sự riêng tư và bảo mật thông
                  tin mà trung tâm mang lại."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="font-medium text-blue-700">ĐT</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Đức Thắng</h4>
                    <p className="text-sm text-gray-500">Khách hàng từ 2023</p>
                  </div>
                </div>
              </div>

              {/* Đánh giá 3 */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex text-yellow-400 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <p className="text-gray-600 italic mb-5">
                  "Dịch vụ tư vấn tâm lý tại GenCare đã giúp tôi hiểu rõ hơn về
                  bản thân và vượt qua những lo lắng về sức khỏe giới tính. Rất
                  chuyên nghiệp!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="font-medium text-blue-700">TL</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Thu Lan</h4>
                    <p className="text-sm text-gray-500">Khách hàng từ 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Blog & Tin tức */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Tin tức & Kiến thức
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Cập nhật thông tin mới nhất về sức khỏe giới tính và các kiến
                thức bổ ích
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
                    Khám phá những kiến thức cơ bản giúp bạn hiểu rõ và chăm sóc
                    tốt hơn sức khỏe sinh sản...
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
                    Hướng dẫn cha mẹ cách trò chuyện tự nhiên và hiệu quả về các
                    vấn đề giới tính với con...
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
                    Những yếu tố then chốt giúp xây dựng và duy trì mối quan hệ
                    tình cảm lành mạnh, bền vững...
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

        {/* Section: FAQ */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Câu hỏi thường gặp
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Giải đáp những thắc mắc phổ biến về dịch vụ chăm sóc sức khỏe
                giới tính tại GenCare
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              {/* FAQ Item 1 */}
              <div className="mb-4">
                <details className="group rounded-lg bg-gray-50 p-4">
                  <summary className="flex cursor-pointer items-center justify-between font-medium">
                    <span>
                      Các xét nghiệm và dịch vụ tư vấn tại GenCare có bảo mật
                      không?
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
                    Tất cả thông tin cá nhân và kết quả xét nghiệm của khách
                    hàng tại GenCare đều được bảo mật tuyệt đối. Chúng tôi tuân
                    thủ nghiêm ngặt các quy định về bảo mật thông tin y tế. Kết
                    quả xét nghiệm chỉ được cung cấp cho khách hàng hoặc người
                    được ủy quyền hợp pháp.
                  </p>
                </details>
              </div>

              {/* FAQ Item 2 */}
              <div className="mb-4">
                <details className="group rounded-lg bg-gray-50 p-4">
                  <summary className="flex cursor-pointer items-center justify-between font-medium">
                    <span>
                      Làm cách nào để đặt lịch xét nghiệm hoặc tư vấn?
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
                    Bạn có thể đặt lịch thông qua website của chúng tôi, gọi
                    điện đến số hotline 1900 1133 hoặc trực tiếp đến trung tâm
                    để đăng ký. Chúng tôi khuyến khích đặt lịch trước để đảm bảo
                    được phục vụ vào thời gian phù hợp với bạn và giảm thời gian
                    chờ đợi.
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
                    trên tài khoản cá nhân tại website của chúng tôi, hoặc trực
                    tiếp tại trung tâm. Thời gian trả kết quả tùy thuộc vào loại
                    xét nghiệm, từ vài giờ đến vài ngày làm việc.
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
                    Chúng tôi chấp nhận thanh toán từ nhiều công ty bảo hiểm y
                    tế. Trước khi đến khám, bạn có thể liên hệ với chúng tôi để
                    kiểm tra bảo hiểm của mình có được chấp nhận không và mức độ
                    bao phủ chi phí.
                  </p>
                </details>
              </div>

              {/* FAQ Item 5 */}
              <div className="mb-4">
                <details className="group rounded-lg bg-gray-50 p-4">
                  <summary className="flex cursor-pointer items-center justify-between font-medium">
                    <span>
                      Có cần chuẩn bị gì trước khi đến xét nghiệm không?
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
                    Tùy thuộc vào loại xét nghiệm, có thể có các yêu cầu chuẩn
                    bị khác nhau. Đối với xét nghiệm máu thông thường, bạn có
                    thể được yêu cầu nhịn ăn 8-12 giờ trước khi lấy mẫu. Khi đặt
                    lịch, nhân viên tư vấn sẽ hướng dẫn cụ thể cho bạn.
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
                    Dịch vụ tư vấn tâm lý tại GenCare được thực hiện bởi các
                    chuyên gia tâm lý có chuyên môn về sức khỏe giới tính. Buổi
                    tư vấn có thể diễn ra trực tiếp hoặc online, kéo dài khoảng
                    45-60 phút. Nội dung tư vấn hoàn toàn riêng tư và được điều
                    chỉnh theo nhu cầu cụ thể của từng cá nhân.
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
      </main>
      <footer className="bg-gray-100 text-gray-700 text-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Logo và hotline */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex-shrink-0">
              <img src={logo_gender} alt="Logo" className="h-20 w-auto" />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="tel:19001133"
                className="flex items-center gap-2 text-[#2a3e64] hover:underline text-lg font-medium"
              >
                <img
                  src="https://diag.vn/wp-content/themes/diag-v2/assets/img/phone.svg"
                  alt=""
                  className="w-auto h-9"
                />
                <span className="text-lg font-medium">1900 1133</span>
              </a>
              <a
                href="mailto:info@gencare.com.vn"
                className="flex items-center gap-2 text-[#2a3e64] hover:underline text-lg font-medium sm:ml-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                </svg>
                <span>info@gencare.com.vn</span>
              </a>
            </div>
          </div>

          <div className="border-t border-gray-300 my-6"></div>

          {/* Thông tin công ty và các menu */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Thông tin công ty */}
            <div className="col-span-1 md:col-span-2">
              <p className="font-semibold">
                TRUNG TÂM CHĂM SÓC SỨC KHỎE VÀ GIÁO DỤC GIỚI TÍNH GENCARE CENTER
              </p>
              <p className="mt-2">
                Giấy chứng nhận đăng ký doanh nghiệp số: 0123456789
                <br />
                cấp bởi Sở Y tế TP. Hồ Chí Minh ngày 10/04/2022.
                <br />
                <br />
                Giấy phép chuyên môn: 0909/HCM-GCSDGT
                <br />
                cấp bởi Sở Y tế TP. HCM.
                <br />
                <br />
                <strong>Địa chỉ:</strong>
                <br />
                Trung tâm Xét nghiệm và Tư vấn Y khoa – GenCare Center,
                <br />
                Số 75 Nguyễn Thông, Phường 9, Quận 3, Thành phố Hồ Chí Minh,
                Việt Nam.
              </p>
              <div className="mt-4">
                <p>
                  <strong>Giờ làm việc:</strong>
                </p>
                <p>Thứ 2 - Thứ 6: 7:30 - 17:00</p>
                <p>Thứ 7: 7:30 - 12:00</p>
                <p>Chủ nhật: Đóng cửa</p>
              </div>
            </div>

            {/* Menu: Chính sách */}
            <div>
              <h3 className="font-semibold mb-2">
                Chính sách &amp; điều khoản
              </h3>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="hover:underline">
                    Chính sách bảo mật
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Điều khoản sử dụng
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Chính sách dịch vụ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Quy trình giải quyết khiếu nại
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Câu hỏi thường gặp
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Dịch vụ</h3>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="hover:underline">
                    Xem kết quả xét nghiệm
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Tìm điểm lấy mẫu
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Đặt lịch tư vấn
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Đặt lịch xét nghiệm
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Tư vấn trực tuyến
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Chăm sóc khách hàng
                  </a>
                </li>
              </ul>
            </div>

            {/* Menu: Social & Newsletter */}
            <div>
              <h3 className="font-semibold mb-2">Theo dõi GenCare Center</h3>
              <div className="flex space-x-4 mt-2">
                <a href="#" className="text-[#2a3e64] hover:text-blue-700">
                  <img
                    src="https://cdn.diag.vn/2022/04/Icon-awesome-facebook-f.svg"
                    alt="Facebook"
                    className="w-5 h-5"
                  />
                </a>
                <a href="#" className="text-[#2a3e64] hover:text-blue-700">
                  <img
                    src="https://cdn.diag.vn/2022/04/Icon-awesome-instagram.svg"
                    alt="Instagram"
                    className="w-5 h-5"
                  />
                </a>
                <a href="#" className="text-[#2a3e64] hover:text-blue-700">
                  <img
                    src="https://cdn.diag.vn/2022/04/Icon-awesome-linkedin-in.svg"
                    alt="LinkedIn"
                    className="w-5 h-5"
                  />
                </a>
                <a href="#" className="text-[#2a3e64] hover:text-blue-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-300 my-6"></div>

          {/* Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-gray-500">
              © 2025 GenCare Center. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <a href="#" className="text-xs text-gray-500 hover:underline">
                Sơ đồ website
              </a>
              <a href="#" className="text-xs text-gray-500 hover:underline">
                Liên hệ
              </a>
              <a href="#" className="text-xs text-gray-500 hover:underline">
                Trợ giúp
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
