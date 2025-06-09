import React from "react";
import logo_gender from "../../../assets/gender_healthcare_logo.png";
export const Footer = () => {
  return (
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
            <span>gencare@gmail.com.vn</span>
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
            Trung tâm Xét nghiệm và Tư vấn Chăm sóc Sức khỏe Giới tính - GenCare
            Center,
            <br />
            Số 75 Nguyễn Thông, Phường 9, Quận 3, Thành phố Hồ Chí Minh, Việt
            Nam.
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
          <h3 className="font-semibold mb-2">Chính sách &amp; điều khoản</h3>
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
  );
};