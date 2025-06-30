import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NotificationBell from "../../components/ui/NotificationBell";
import api from "../../utils/api";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    const authTokens = localStorage.getItem('authTokens');
    const userData = localStorage.getItem('userData');
    
    if (authTokens && userData) {
      setIsLoggedIn(true);
      try {
        const user = JSON.parse(userData);
        setUserRole(user.role || user.user_type || 'user');
        
        // Lấy tên từ first_name và last_name
        const firstName = user.first_name || user.firstName || '';
        const lastName = user.last_name || user.lastName || '';
        const fullName = `${lastName} ${firstName}`.trim();
        
        setUserName(fullName || user.fullName || user.full_name || user.name || 'Người dùng');
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUserRole('user');
        setUserName('Người dùng');
      }
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
      setUserName('');
    }
  }, []);

  // Determine home path based on user role
  const getHomePath = () => {
    if (isLoggedIn && userRole === 'doctor') return '/doctor-dashboard';
    if (isLoggedIn && userRole === 'manager') return '/manager-dashboard';
    return '/';
  };

  // Get role display name
  const getRoleDisplayName = () => {
    if (userRole === 'doctor') return 'Bác sĩ';
    if (userRole === 'manager') return 'Quản lý';
    return 'Người dùng';
  };

  return (
    <div>
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo - Click to go to appropriate home */}
            <Link 
              to={getHomePath()} 
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900">GenCare Center</span>
            </Link>

            {/* Navigation Menu */}
            <nav className="hidden md:flex space-x-8">
              {/* Chỉ hiển thị navigation links cho user bình thường */}
              {(!isLoggedIn || userRole === 'user') && (
                <>
                  <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">Về chúng tôi</a>
                  <a href="#services" className="text-gray-700 hover:text-blue-600 transition-colors">Dịch vụ</a>
                  <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Liên hệ</a>
                </>
              )}
              
              {/* Dashboard Links for staff */}
              {isLoggedIn && userRole === 'doctor' && (
                <span className="text-gray-700 font-medium">
                  Bảng điều khiển Bác sĩ
                </span>
              )}
              {isLoggedIn && userRole === 'manager' && (
                <span className="text-gray-700 font-medium">
                  Bảng điều khiển Quản lý
                </span>
              )}
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <NotificationBell />
                  
                  {/* Avatar Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none"
                    >
                      {/* Avatar */}
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-pink-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-gray-700 font-medium hidden md:block">{userName}</span>
                      <svg 
                        className={`w-4 h-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{userName}</p>
                          <p className="text-xs text-gray-500">
                            {getRoleDisplayName()}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => {
                            navigate('/profile');
                            setShowDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>Hồ sơ cá nhân</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            localStorage.removeItem('authTokens');
                            localStorage.removeItem('userData');
                            localStorage.removeItem('userType');
                            localStorage.removeItem('authToken');
                            setIsLoggedIn(false);
                            setUserRole(null);
                            setUserName('');
                            setShowDropdown(false);
                            window.location.href = '/';
                            const logoutUser = async () => {
                              try {
                                await api.logoutUser();
                              } catch (error) {
                                console.error('Logout failed:', error);
                              }
                            };
                            logoutUser();
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    )}
                  </div>
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
export default Navbar;