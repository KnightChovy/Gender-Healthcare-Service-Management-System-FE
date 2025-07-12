import React, { useState, useRef, useEffect } from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import DoctorNotificationBell from "../../ui/NotificationBell/DoctorNotificationBell";

// Sidebar Component
const Sidebar = () => {
  const navigate = useNavigate();

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <div className="bg-blue-800 text-blue-100 w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <div className="flex items-center space-x-2 px-4">
        <span className="text-white text-2xl font-semibold">
          Trang dành cho bác sĩ
        </span>
      </div>

      <nav className="mt-6">
        <NavLink
          to="/doctor/dashboard"
          className={({ isActive }) =>
            `flex items-center space-x-2 py-2.5 px-4 rounded transition duration-200 ${
              isActive ? "bg-blue-700 text-white" : "hover:bg-blue-700"
            }`
          }
        >
          <span className="text-xl">
            <i className="fas fa-columns"></i>
          </span>
          <span>Tổng quan</span>
        </NavLink>

        <NavLink
          to="/doctor/appointments"
          className={({ isActive }) =>
            `flex items-center space-x-2 py-2.5 px-4 rounded transition duration-200 ${
              isActive ? "bg-blue-700 text-white" : "hover:bg-blue-700"
            }`
          }
        >
          <span className="text-xl">
            <i className="fas fa-calendar-alt"></i>
          </span>
          <span>Lịch hẹn</span>
        </NavLink>

        <NavLink
          to="/doctor/schedule"
          className={({ isActive }) =>
            `flex items-center space-x-2 py-2.5 px-4 rounded transition duration-200 ${
              isActive ? "bg-blue-700 text-white" : "hover:bg-blue-700"
            }`
          }
        >
          <span className="text-xl">
            <i className="fas fa-clock"></i>
          </span>
          <span>Đăng ký lịch làm việc</span>
        </NavLink>

        <NavLink
          to="/doctor/patients"
          className={({ isActive }) =>
            `flex items-center space-x-2 py-2.5 px-4 rounded transition duration-200 ${
              isActive ? "bg-blue-700 text-white" : "hover:bg-blue-700"
            }`
          }
        >
          <span className="text-xl">
            <i className="fas fa-user-injured"></i>
          </span>
          <span>Bệnh nhân</span>
        </NavLink>

        <NavLink
          to="/doctor/profile"
          className={({ isActive }) =>
            `flex items-center space-x-2 py-2.5 px-4 rounded transition duration-200 ${
              isActive ? "bg-blue-700 text-white" : "hover:bg-blue-700"
            }`
          }
        >
          <span className="text-xl">
            <i className="fas fa-user-md"></i>
          </span>
          <span>Hồ sơ</span>
        </NavLink>

        <div className="border-t border-blue-700 my-4"></div>
      </nav>
    </div>
  );
};

// Header Component - thay đổi để thêm dropdown và thông báo
const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-md py-4 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link
            to="/"
            className="mr-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <i className="fas fa-home mr-1"></i>
            <span>Trang Chủ</span>
          </Link>

          <button className="text-gray-500 focus:outline-none md:hidden">
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6H20M4 12H20M4 18H11"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>
        </div>

        <div className="flex items-center">
          {/* Component thông báo */}
          <DoctorNotificationBell />

          {/* Avatar dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="cursor-pointer ml-4"
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "#3b82f6",
                  fontWeight: "bold",
                }}
              >
                {localStorage.getItem("user")
                  ? JSON.parse(localStorage.getItem("user")).first_name.charAt(
                      0
                    )
                  : null}
              </Avatar>
            </div>

            {/* Dropdown menu */}
            <div
              className={`absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20 ${
                isDropdownOpen ? "block" : "hidden"
              }`}
            >
              <Link
                to="/doctor/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white"
              >
                <i className="fas fa-user-md mr-2"></i>Hồ sơ của tôi
              </Link>

              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Main DoctorLayout Component
const DoctorLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          <div className="container mx-auto px-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;
