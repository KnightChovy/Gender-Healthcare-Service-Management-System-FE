import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div>
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo - Click to go home */}
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900">GenCare Center</span>
            </Link>

            {/* Navigation Menu */}
            <nav className="hidden md:flex space-x-8">
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">Về chúng tôi</a>
              <a href="#services" className="text-gray-700 hover:text-blue-600 transition-colors">Dịch vụ</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Liên hệ</a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Chào mừng!</span>
                  <button
                    onClick={() => {
                      localStorage.removeItem('authToken');
                      localStorage.removeItem('userType');
                      setIsLoggedIn(false);
                      window.location.href = '/'; // Redirect to home after logout
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link
                    to="/login"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};
