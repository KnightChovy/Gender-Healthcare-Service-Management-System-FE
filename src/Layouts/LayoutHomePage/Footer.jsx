import React from "react";
export const Footer = () => {
  return (
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
              <p className="text-sm text-gray-500">
                © 2025 GenCare Center. Tất cả quyền được bảo lưu.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Dịch vụ</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white transition-colors text-left">Tư vấn sức khỏe</button></li>
                <li><button className="hover:text-white transition-colors text-left">Xét nghiệm</button></li>
                <li><button className="hover:text-white transition-colors text-left">Theo dõi chu kỳ</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white transition-colors text-left">Trung tâm trợ giúp</button></li>
                <li><button className="hover:text-white transition-colors text-left">Chính sách bảo mật</button></li>
                <li><button className="hover:text-white transition-colors text-left">Điều khoản sử dụng</button></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
