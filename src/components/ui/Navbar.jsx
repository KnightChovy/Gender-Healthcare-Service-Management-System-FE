import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo_gender from "../../assets/gender_healthcare_logo.png";
import ico_bell from "../../assets/ico_bell.png";
import ico_user from "../../assets/ico_user.png";

export const Navbar = () => {
  const [isUser, setIsUser] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showService, setShowService] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [role, setRole] = useState("guest"); // guest, user, admin, manager
  const location = useLocation();
  const navigate = useNavigate();

  const checkLoginStatus = () => {
    try {
      const token = localStorage.getItem("token");
      const storedUserData = localStorage.getItem("userData");

      if (token && storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        setIsUser(true);
        setUserData(parsedUserData);
        // Lấy role từ userData nếu có
        setRole(parsedUserData.role || "user");
      } else {
        setIsUser(false);
        setUserData(null);
        setRole("guest");
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra đăng nhập:", error);
      setIsUser(false);
      setUserData(null);
      setRole("guest");
    }
  };

  useEffect(() => {
    checkLoginStatus();

    // Lắng nghe sự kiện đăng nhập/đăng xuất
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setIsUser(false);
    setUserData(null);
    setRole("guest");
    setShowUserMenu(false);
    navigate("/");
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="block max-w-[70px]">
            <img
              className="max-w-full"
              src={logo_gender}
              alt="Gender Healthcare Logo"
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex flex-1 justify-center">
          <ul className="flex items-center gap-8 font-medium text-[16px]">
            <li className="relative after:absolute after:h-[1.5px] after:bg-blue-800 after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:scale-x-100 hover:text-blue-900 transition-colors duration-200">
              <Link to="/">Trang chủ</Link>
            </li>

            <li
              className="relative"
              onMouseEnter={() => setShowService(true)}
              onMouseLeave={() => setShowService(false)}
            >
              <button className="flex items-center cursor-pointer gap-1 relative after:absolute after:h-[1.5px] after:bg-blue-800 after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:scale-x-100 hover:text-blue-900 transition-colors duration-200">
                <Link to="/service">Các loại dịch vụ</Link>
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
                <div className="absolute top-[120%] -left-8 mt-1 bg-white shadow-lg rounded-md py-2 min-w-[220px] z-50">
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

            <li className="relative after:absolute after:h-[1.5px] after:bg-blue-800 after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:scale-x-100 hover:text-blue-900 transition-colors duration-200">
              <Link to="/about">Về chúng tôi</Link>
            </li>

            <li className="relative after:absolute after:h-[1.5px] after:bg-blue-800 after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:scale-x-100 hover:text-blue-900 transition-colors duration-200">
              <Link to="/blog">Blog</Link>
            </li>
          </ul>
        </nav>

        {/* User Authentication Area */}
        <div className="flex items-center gap-4">
          {isUser ? (
            <>
              {/* Notification Bell */}
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

              {/* User Menu */}
              <div className="relative">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="w-7 h-7 flex items-center justify-center">
                    <img
                      src={ico_user}
                      alt="User profile"
                      className="max-w-full max-h-full object-contain rounded-full"
                    />
                  </div>
                  <span className="text-[16px] font-medium hover:text-blue-600 transition-colors">
                    {userData?.fullName || "Người dùng"}
                    <span className="text-xs text-gray-500 ml-1">
                      (
                      {role === "admin"
                        ? "Admin"
                        : role === "manager"
                        ? "Manager"
                        : "User"}
                      )
                    </span>
                  </span>
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

                    {/* Hiển thị menu quản lý chỉ khi là Admin hoặc Manager */}
                    {(role === "admin" || role === "manager") && (
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 hover:bg-blue-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Quản lý hệ thống
                      </Link>
                    )}

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
          ) : (
            <>
              {/* Authentication Links */}
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
