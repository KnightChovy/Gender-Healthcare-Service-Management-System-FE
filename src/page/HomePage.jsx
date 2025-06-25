import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "../Layouts/LayoutHomePage/Navbar";
import { Footer } from "../Layouts/LayoutHomePage/Footer";

export const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  // Xử lý khi click vào dịch vụ cần đăng nhập
  const handleServiceClick = (servicePath) => {
    if (isLoggedIn) {
      navigate(servicePath);
    } else {
      setShowLoginModal(true);
    }
  };

  const services = [
    {
      id: 1,
      title: "Đặt lịch khám",
      description: "Đặt lịch tư vấn với các chuyên gia hàng đầu",
      icon: "🩺",
      path: "/appointment",
      requireLogin: true
    },
    {
      id: 2,
      title: "Đặt lịch xét nghiệm",
      description: "Đặt lịch xét nghiệm sức khỏe tổng quát",
      icon: "🔬",
      path: "/test-order",
      requireLogin: true
    },
    {
      id: 3,
      title: "Theo dõi chu kỳ kinh nguyệt",
      description: "Quản lý và theo dõi chu kỳ kinh nguyệt",
      icon: "📅",
      path: "/menstrual-cycle",
      requireLogin: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Chăm sóc sức khỏe
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600">
                {" "}giới tính{" "}
              </span>
              toàn diện
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              GenCare Center - Trung tâm chuyên khoa hàng đầu về chăm sóc sức khỏe và giáo dục giới tính, 
              mang đến dịch vụ chất lượng cao với đội ngũ chuyên gia giàu kinh nghiệm.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleServiceClick('/appointment')}
                className="bg-gradient-to-r from-blue-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Đặt lịch tư vấn ngay
              </button>
              <a
                href="#about"
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-blue-600 hover:text-blue-600 transition-colors duration-300"
              >
                Tìm hiểu thêm
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Dịch vụ chính
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Chúng tôi cung cấp đầy đủ các dịch vụ chăm sóc sức khỏe giới tính chuyên nghiệp
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => (
              <button
                key={service.id}
                className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group text-left w-full transform hover:scale-105"
                onClick={() => service.requireLogin ? handleServiceClick(service.path) : navigate(service.path)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    service.requireLogin ? handleServiceClick(service.path) : navigate(service.path);
                  }
                }}
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                {service.requireLogin && !isLoggedIn && (
                  <span className="inline-flex items-center text-sm text-orange-600 bg-orange-100 px-3 py-1 rounded-full mb-2">
                    🔒 Yêu cầu đăng nhập
                  </span>
                )}
                <div className="mt-4 text-blue-600 font-semibold group-hover:text-blue-700 transition-colors duration-300">
                  {service.requireLogin && !isLoggedIn ? 'Đăng nhập để sử dụng →' : 'Sử dụng ngay →'}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-r from-blue-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-8">
              Về GenCare Center
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <div className="text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl mb-4">👨‍⚕️</div>
                <h3 className="text-xl font-bold mb-2">Đội ngũ chuyên gia</h3>
                <p className="text-blue-100">Bác sĩ giàu kinh nghiệm, được đào tạo chuyên sâu</p>
              </div>
              <div className="text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl mb-4">🔬</div>
                <h3 className="text-xl font-bold mb-2">Công nghệ hiện đại</h3>
                <p className="text-blue-100">Trang thiết bị y tế tiên tiến, chính xác cao</p>
              </div>
              <div className="text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl mb-4">🏥</div>
                <h3 className="text-xl font-bold mb-2">Môi trường an toàn</h3>
                <p className="text-blue-100">Không gian riêng tư, thoải mái và thân thiện</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Liên hệ với chúng tôi
            </h2>
            <p className="text-xl text-gray-600">
              Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl mb-4">📍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Địa chỉ</h3>
              <p className="text-gray-600">
                Số 75 Nguyễn Thông, Phường 9<br />
                Quận 3, TP. Hồ Chí Minh
              </p>
            </div>
            <div className="text-center bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl mb-4">📞</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Hotline</h3>
              <p className="text-gray-600">
                <a href="tel:19001133" className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                  1900 1133
                </a>
              </p>
            </div>
            <div className="text-center bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl mb-4">✉️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">
                <a href="mailto:gencare@gmail.com" className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                  gencare@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Yêu cầu đăng nhập
              </h3>
              <p className="text-gray-600 mb-6">
                Bạn cần đăng nhập để sử dụng dịch vụ này. Vui lòng đăng nhập hoặc tạo tài khoản mới.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-300"
                >
                  Đăng ký
                </Link>
              </div>
              <button
                onClick={() => setShowLoginModal(false)}
                className="mt-4 text-gray-500 hover:text-gray-700 transition-colors duration-300 underline"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
