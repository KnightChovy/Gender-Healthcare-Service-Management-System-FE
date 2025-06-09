import React, { useEffect, useState } from "react";
import logo_gender from "../../assets/gender_healthcare_logo.png";
import { Link, useLocation } from "react-router-dom";
import ico_bell from "../../assets/ico_bell.png";
import ico_user from "../../assets/ico_user.png";
export const Navbar = () => {
  const [isUser, setIsUser] = useState(false);
  const [showService, setShowService] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkLoginStatus = () => {
      const isDashboardPage = location.pathname.includes("dashboardcustomer");
      setIsUser(isDashboardPage);
    };
    checkLoginStatus();
  }, [location]);

  return (
    <div>
      <div className="container flex items-center justify-center">
        <div className="flex-shrink-0">
          <Link className="block max-w-[70px]" to="/">
            <img className="max-w-full" src={logo_gender} alt="logo_gender" />
          </Link>
        </div>
        <nav className="hidden lg:flex flex-1 justify-center">
          <ul className="flex items-center gap-10 font-medium text-[18px]">
            <li className="relative after:absolute after:h-[1.5px] after:bg-blue-800 after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:scale-x-100 hover:text-blue-900 transition-colors duration-200">
              <Link to="/">Trang chủ</Link>
            </li>
            <li
              className="relative"
              onMouseEnter={() => setShowService(true)}
              onMouseLeave={() => setShowService(false)}
            >
              <button className="flex items-center cursor-pointer gap-1 relative after:absolute after:h-[1.5px] after:bg-blue-800 after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:scale-x-100 hover:text-blue-900 transition-colors duration-200">
                Các loại dịch vụ
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>

              {showService && (
                <div className="absolute top-[120%] -left-8 mt-1 bg-ghostwhite hover:bg-white shadow-lg rounded-md py-2 min-w-[220px] z-50">
                  <Link
                    to="/services/test"
                    className="block px-4 py-2 hover:bg-blue-50 transition-colors text-[16px]"
                  >
                    Đặt lịch xét nghiệm
                  </Link>
                  <Link
                    to="/services/consultation"
                    className="block px-4 py-2 hover:bg-blue-50 transition-colors text-[16px]"
                  >
                    Đặt lịch tư vấn
                  </Link>
                  <Link
                    to="/services/cycle-tracking"
                    className="block px-4 py-2 hover:bg-blue-50 transition-colors text-[16px]"
                  >
                    Theo dõi chu kì sinh sản
                  </Link>
                </div>
              )}
            </li>
            <li
              className="relative"
              onMouseEnter={() => setShowAbout(true)}
              onMouseLeave={() => setShowAbout(false)}
            >
              <button className="flex items-center cursor-pointer gap-1 relative after:absolute after:h-[1.5px] after:bg-blue-800 after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:scale-x-100 hover:text-blue-900 transition-colors duration-200">
                Về chúng tôi
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>

              {showAbout && (
                <div className="absolute top-[120%] -left-8 mt-1 bg-ghostwhite hover:bg-white shadow-lg rounded-md py-2 min-w-[220px] z-50">
                  <Link
                    to="/about?tab=vision"
                    className="block px-4 py-2 hover:bg-blue-50 transition-colors text-[16px]"
                  >
                    Tầm nhìn - Sứ mệnh
                  </Link>
                  <Link
                    to="/about?tab=organization"
                    className="block px-4 py-2 hover:bg-blue-50 transition-colors text-[16px]"
                  >
                    Sơ đồ tổ chức
                  </Link>
                  <Link
                    to="/about?tab=recruitment"
                    className="block px-4 py-2 hover:bg-blue-50 transition-colors text-[16px]"
                  >
                    Thông tin tuyển dụng
                  </Link>
                </div>
              )}
            </li>
            <li className="relative after:absolute after:h-[1.5px] after:bg-blue-800 after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:scale-x-100 hover:text-blue-900 transition-colors duration-200">
              <Link to={"/blog"}>Blog</Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          {isUser ? (
            <>
              <div className="relative cursor-pointer">
                <div className="w-6 h-6 flex items-center justify-center hover:opacity-80 transition-opacity">
                  <img
                    src={ico_bell}
                    alt="icon_bell"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="cursor-pointer flex items-center gap-2 group hover:text-blue-600 transition-colors">
                <div className="w-7 h-7 flex items-center justify-center">
                  <img
                    src={ico_user}
                    alt="icon user"
                    className="max-w-full max-h-full object-contain rounded-full"
                  />
                </div>
                <span className="text-[16px] font-medium group-hover:text-blue-600 transition-colors">
                  Hello user
                </span>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="text-[16px] font-medium hover:text-blue-600 transition-colors duration-200"
              >
                Đăng Ký
              </Link>
              <div className="h-4 w-px bg-gray-300"></div>
              <Link
                to="/login"
                className="text-[16px] font-medium hover:text-blue-600 transition-colors duration-200"
              >
                Đăng Nhập
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
