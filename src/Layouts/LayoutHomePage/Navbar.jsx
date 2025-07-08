import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NotificationBell from "../../components/ui/NotificationBell";
import api from "../../utils/api";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState('');
  const [userType, setUserType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = api.authUtils.isAuthenticated();
    const userData = api.authUtils.getUserData();
    const userTypeFromStorage = api.authUtils.getUserType();
    
    if (isAuthenticated && userData) {
      setIsLoggedIn(true);
      setUserRole(userData.role || userData.user_type || 'user');
      setUserType(userTypeFromStorage || '');

      const firstName = userData.first_name || userData.firstName || '';
      const lastName = userData.last_name || userData.lastName || '';
      const fullName = `${lastName} ${firstName}`.trim();
      
      setUserName(fullName || userData.fullName || userData.full_name || userData.name || 'Người dùng');
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
      setUserName('');
      setUserType('');
    }
  }, []);

  const getHomePath = () => {
    if (isLoggedIn && userRole === 'doctor') return '/doctor-dashboard';
    if (isLoggedIn && userRole === 'manager') return '/manager-dashboard';
    return '/';
  };

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
              {/* Navigation links cho tất cả người dùng */}
              <Link to="/blog" className="text-gray-700 hover:text-blue-600 transition-colors">Blog</Link>
              
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
                  {/* Only show NotificationBell for regular users, not doctors or managers */}
                  {(!userRole || userRole === 'user') && <NotificationBell />}
                  
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
                        
                        {userType === 'customer' && (
                          <>
                            <button
                              onClick={() => {
                                navigate('/my-appointments');
                                setShowDropdown(false);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
                              </svg>
                              <span>Lịch hẹn của tôi</span>
                            </button>
                            <button
                              onClick={() => {
                                navigate('/prescriptions');
                                setShowDropdown(false);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                              </svg>
                              <span>Đơn thuốc của tôi</span>
                            </button>
                          </>
                        )}

                        <button
                          onClick={async () => {
                            try {
                              // Use authUtils to clear all data consistently
                              api.authUtils.logout();
                              setIsLoggedIn(false);
                              setUserRole(null);
                              setUserName('');
                              setUserType('');
                              setShowDropdown(false);
                              
                              // Call logout API
                              await api.logoutUser();
                              
                              // Redirect to home
                              window.location.href = '/';
                            } catch (error) {
                              console.error('Logout failed:', error);
                              // Still logout locally even if API fails
                              window.location.href = '/';
                            }
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