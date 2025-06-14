import React from "react";
import { Outlet, NavLink, Link } from "react-router-dom";

// Sidebar Component
const Sidebar = () => {
  return (
    <div className="bg-blue-800 text-blue-100 w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <div className="flex items-center space-x-2 px-4">
        <span className="text-white text-2xl font-semibold">Doctor Portal</span>
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
          <span>Dashboard</span>
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

        {/* Nút đăng ký lịch làm việc mới */}
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

        <button className="flex items-center space-x-2 py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700 w-full text-left">
          <span className="text-xl">
            <i className="fas fa-sign-out-alt"></i>
          </span>
          <span>Đăng xuất</span>
        </button>
      </nav>
    </div>
  );
};

// Header Component - thêm nút Back Home
const Header = () => {
  return (
    <header className="bg-white shadow-md py-4 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Thêm nút Back Home */}
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

          <div className="relative mx-4 lg:mx-0">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <svg
                className="h-5 w-5 text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </span>
            <input
              className="form-input w-32 sm:w-64 rounded-md pl-10 pr-4 focus:border-blue-600"
              type="text"
              placeholder="Tìm kiếm"
            />
          </div>
        </div>

        <div className="flex items-center">
          <div className="flex items-center">
            <button className="flex mx-4 text-gray-600 focus:outline-none">
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </button>

            <div className="relative">
              <button className="relative z-10 block h-8 w-8 rounded-full overflow-hidden border-2 border-gray-600 focus:outline-none focus:border-blue-500">
                <img
                  className="h-full w-full object-cover"
                  src="https://via.placeholder.com/150"
                  alt="Avatar"
                />
              </button>

              <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20 hidden">
              {/* Nhớ đổi thẻ a thành Link của React router dom tao không rảnh đổi giúp đâu*/}
                <a
                  href="/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white"
                >
                  Hồ sơ
                </a>
                <a
                  href="/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white"
                >
                  Cài đặt
                </a>
                <a
                  href="/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white"
                >
                  Đăng xuất
                </a>
              </div>
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
