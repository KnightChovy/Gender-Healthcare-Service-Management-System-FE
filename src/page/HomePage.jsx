import React from "react";
import logo_gender from "../assets/gender_healthcare_logo.png";
import icon_search from "../assets/ico_search.png";
import { Link } from "react-router-dom";
export const HomePage = () => {
  return (
    <div className="wrap">
      <header className="py-2 lg:py-3 sticky top-0 z-10 bg-white shadow-lg">
        <div className="container flex items-center">
          <h1 className="flex-shrink-0 mr-3">
            <Link className="block max-w-[80px]" to="/">
              <img className="max-w-full" src={logo_gender} alt="logo_gender" />
            </Link>
          </h1>
          <nav className="mr-28 hidden lg:block ml-auto">
            <ul className="flex items-center gap-10 font-medium">
              <li className="relative after:absolute text-[15px] after:h-[1.5px] after:bg-blue-800 after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:-scale-x-100  hover:text-blue-900 transition-colors duration-200">
                <Link to="/">Trang chủ</Link>
              </li>
              <li className="relative after:absolute text-[15px] after:h-[1.5px] after:bg-blue-800 after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:-scale-x-100  hover:text-blue-900 transition-colors duration-200">
                <a href="#">Các loại dịch vụ</a>
              </li>
              <li className="relative after:absolute text-[15px] after:h-[1.5px] after:bg-blue-800 after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:-scale-x-100  hover:text-blue-900 transition-colors duration-200">
                <a href="#">Về chúng tôi</a>
              </li>
              <li className="relative after:absolute text-[15px] after:h-[1.5px] after:bg-blue-800 after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:-scale-x-100  hover:text-blue-900 transition-colors duration-200">
                <a href="#">Blog</a>
              </li>
            </ul>
          </nav>
          <div className="relative ml-auto lg:mr-20 max-w-[500px] w-full hidden xl:block">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span>
                <img className="size-5" src={icon_search} alt="" />
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 ml-4">
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
        <section className="bg-[#3b82f6] py-8 lg:py-0">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row items-center">
              {/* Phần nội dung bên trái */}
              <div className="w-full lg:w-1/2 px-4 lg:px-6 py-6 lg:py-16">
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-6">
                  Phòng khám và xét nghiệm GenCare
                </h1>

                {/* Ô tìm kiếm */}
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

                {/* Các nút chức năng dạng nút tròn */}
                <div className="flex flex-wrap gap-3">
                  {/* Nút đặt lịch hẹn */}
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

                  {/* Nút khám phá gói xét nghiệm */}
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

                  {/* Nút tra cứu triệu chứng */}
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
              {/* Phần hình ảnh bên phải - Carousel tự động */}
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
