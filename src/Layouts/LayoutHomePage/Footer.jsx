import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Footer = () => {
  const navigate = useNavigate();
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleServiceClick = (service) => {
    switch (service) {
      case 'consultation':
        navigate('/appointment');
        break;
      case 'testing':
        navigate('/test-order');
        break;
      case 'menstrual':
        navigate('/menstrual-cycle');
        break;
      default:
        break;
    }
  };

  const handleSupportClick = (support) => {
    let content = null;
    
    switch (support) {
      case 'help':
        content = {
          title: 'Trung tâm trợ giúp',
          body: (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-3">Thông tin liên hệ</h4>
                <div className="space-y-2 text-blue-800">
                  <p>🔥 <strong>Hotline:</strong> 1900-1234</p>
                  <p>📧 <strong>Email:</strong> support@gencare.vn</p>
                  <p>🕒 <strong>Giờ hoạt động:</strong> 8:00 - 22:00 (Thứ 2 - Chủ nhật)</p>
                </div>
              </div>
              <p className="text-gray-600">
                Đội ngũ hỗ trợ của chúng tôi sẵn sàng giúp đỡ bạn 24/7!
              </p>
            </div>
          )
        };
        break;
      case 'privacy':
        content = {
          title: 'Chính sách bảo mật',
          body: (
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-3">Cam kết bảo mật</h4>
                <div className="space-y-3 text-green-800">
                  <p>• GenCare Center cam kết bảo vệ thông tin cá nhân của bạn</p>
                  <p>• Chúng tôi không chia sẻ thông tin với bên thứ ba mà không có sự đồng ý</p>
                  <p>• Mọi thông tin y tế được mã hóa theo tiêu chuẩn quốc tế</p>
                  <p>• Hệ thống bảo mật SSL 256-bit</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
              </p>
            </div>
          )
        };
        break;
      case 'terms':
        content = {
          title: 'Điều khoản sử dụng',
          body: (
            <div className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-3">Quy định sử dụng</h4>
                <div className="space-y-2 text-yellow-800">
                  <p>1. Dịch vụ chỉ dành cho mục đích tham khảo và hỗ trợ</p>
                  <p>2. Không thay thế cho việc khám bệnh trực tiếp</p>
                  <p>3. Tuân thủ các quy định từ đội ngũ y tế</p>
                  <p>4. Thông tin cá nhân được bảo mật tuyệt đối</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Bằng việc sử dụng dịch vụ, bạn đồng ý với các điều khoản này.
              </p>
            </div>
          )
        };
        break;
      default:
        return;
    }
    
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="col-span-2">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-pink-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">G</span>
                  </div>
                  <span className="ml-3 text-xl font-bold">GenCare Center</span>
                </div>
                <p className="text-gray-400 mb-4">
                  Trung tâm chăm sóc sức khỏe và giáo dục giới tính hàng đầu,
                  cam kết mang đến dịch vụ chất lượng cao với sự tận tâm và chuyên nghiệp.
                </p>
                <div className="mb-4">
                  <p className="text-gray-400 text-sm mb-1">📍 456 Nguyễn Thị Minh Khai, Quận 1, TP. HCM</p>
                  <p className="text-gray-400 text-sm mb-1">📞 Hotline: 1900-1234</p>
                  <p className="text-gray-400 text-sm mb-1">📧 Email: info@gencare.vn</p>
                  <p className="text-gray-400 text-sm">🕒 Giờ hoạt động: 8:00 - 22:00 (Thứ 2 - Chủ nhật)</p>
                </div>
                <p className="text-sm text-gray-500">
                  © 2025 GenCare Center. Tất cả quyền được bảo lưu.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-4">Dịch vụ</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><button onClick={() => handleServiceClick('consultation')} className="hover:text-white transition-colors text-left cursor-pointer">Tư vấn sức khỏe</button></li>
                  <li><button onClick={() => handleServiceClick('testing')} className="hover:text-white transition-colors text-left cursor-pointer">Xét nghiệm</button></li>
                  <li><button onClick={() => handleServiceClick('menstrual')} className="hover:text-white transition-colors text-left cursor-pointer">Theo dõi chu kỳ</button></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Hỗ trợ</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><button onClick={() => handleSupportClick('help')} className="hover:text-white transition-colors text-left cursor-pointer">Trung tâm trợ giúp</button></li>
                  <li><button onClick={() => handleSupportClick('privacy')} className="hover:text-white transition-colors text-left cursor-pointer">Chính sách bảo mật</button></li>
                  <li><button onClick={() => handleSupportClick('terms')} className="hover:text-white transition-colors text-left cursor-pointer">Điều khoản sử dụng</button></li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Modal */}
      {isModalOpen && modalContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {modalContent.title}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              {modalContent.body}
            </div>
            
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
