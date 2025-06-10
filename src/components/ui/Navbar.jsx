import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo_gender from "../../assets/gender_healthcare_logo.png";
import ico_bell from "../../assets/ico_bell.png";
import ico_user from "../../assets/ico_user.png";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/feature/auth/authenSlice";

export const Navbar = () => {
  const [showService, setShowService] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const user = useSelector((state) => state.auth.user);

  console.log("user", user);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userMenuRef = useRef();
  const serviceMenuRef = useRef();
  useEffect(() => {
    const handleClickOutSide = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (
        serviceMenuRef.current &&
        !serviceMenuRef.current.contains(e.target)
      ) {
        setShowService(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutSide);
    return () => document.removeEventListener("mousedown", handleClickOutSide);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setShowUserMenu(false);

    navigate("/");
  };
  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between">
        <div className="flex-shrink-0">
          <Link to="/" className="block max-w-[70px]">
            <img
              className="max-w-full"
              src={logo_gender}
              alt="Gender Healthcare Logo"
            />
          </Link>
        </div>

        <nav className="hidden lg:flex flex-1 justify-center">
          <ul className="flex items-center gap-8 font-medium text-[16px]">
            <li className="relative after:absolute after:h-[1.5px] after:bg-blue-800 after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:scale-x-100 hover:text-blue-900 transition-colors duration-200">
              <Link to="/">Trang chủ</Link>
            </li>
            <li className="relative" ref={serviceMenuRef}>
              {/* Thay đổi button này để kiểm tra user và điều hướng */}
              <button
                onClick={() => {
                  if (user) {
                    // Nếu đã đăng nhập: Hiển thị dropdown
                    setShowService(!showService);
                  } else {
                    // Nếu chưa đăng nhập: Chuyển đến trang đăng nhập
                    navigate("/login");
                  }
                }}
                className="flex items-center cursor-pointer gap-1 relative after:absolute after:h-[1.5px] after:bg-blue-800 after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:scale-x-100 hover:text-blue-900 transition-colors duration-200"
              >
                Các loại dịch vụ
                {user && ( // Chỉ hiện mũi tên khi đã đăng nhập
                  <svg
                    className={`w-4 h-4 ml-1 transition-transform ${
                      showService ? "rotate-180" : ""
                    }`}
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
                )}
              </button>

              {user && showService && (
                <div className="absolute top-[120%] -left-8 mt-1 bg-white shadow-lg rounded-md py-2 min-w-[220px] z-50">
                  <Link
                    to="/services/test"
                    className="block px-4 py-2 hover:bg-blue-50 transition-colors text-[16px]"
                    onClick={() => setShowService(false)}
                  >
                    Đặt lịch xét nghiệm
                  </Link>
                  <Link
                    to="/services/consultation"
                    className="block px-4 py-2 hover:bg-blue-50 transition-colors text-[16px]"
                    onClick={() => setShowService(false)}
                  >
                    Đặt lịch tư vấn
                  </Link>
                  <Link
                    to="/services/cycle-tracking"
                    className="block px-4 py-2 hover:bg-blue-50 transition-colors text-[16px]"
                    onClick={() => setShowService(false)}
                  >
                    Theo dõi chu kì sinh sản
                  </Link>
                </div>
              )}
            </li>

            <li className="relative after:absolute after:h-[1.5px] after:bg-blue-800 after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:scale-x-100 hover:text-blue-900 transition-colors duration-200">
              <Link to="/about">Về chúng tôi</Link>
            </li>

            <li className="relative after:absolute after:h-[1.5px] after:bg-blue-800 after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:scale-x-100 hover:text-blue-900 transition-colors duration-200">
              <Link to="/blog">Blog</Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          {!user ? (
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
          ) : (
            <>
              <div className="relative cursor-pointer">
                <div className="w-6 h-6 flex items-center justify-center hover:opacity-80 transition-opacity">
                  <img
                    src={ico_bell}
                    alt="Thông báo"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </div>

              <div className="h-4 w-px bg-gray-300"></div>
              <div className="relative" ref={userMenuRef}>
                <div
                  className="w-6 h-6 flex items-center justify-center hover:opacity-80 transition-opacity"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <img
                    src={ico_user}
                    alt="User icon"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-blue-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Thông tin cá nhân
                    </Link>
                    <Link
                      to="/appointments"
                      className="block px-4 py-2 hover:bg-blue-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Lịch hẹn của tôi
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-blue-50 text-red-600"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
