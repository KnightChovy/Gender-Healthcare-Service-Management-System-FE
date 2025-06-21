import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TestServicePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Lấy thông tin dịch vụ từ state và thêm debug để kiểm tra
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Set page title
    document.title = "Đặt lịch xét nghiệm | Healthcare Service";
    
    // Xử lý dữ liệu từ state
    try {
      const serviceData = location.state?.selectedService;
      console.log("Received service data:", serviceData);
      
      if (serviceData) {
        setSelectedService(serviceData);
      } else {
        setError("Không nhận được thông tin dịch vụ");
      }
    } catch (err) {
      console.error("Error processing service data:", err);
      setError(err.message || "Đã xảy ra lỗi khi xử lý dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [location]);

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };
  
  // Loading screen
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error screen
  if (error || !selectedService) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <div className="text-center">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="mt-2 text-lg font-medium text-gray-900">
            {error || "Không tìm thấy dịch vụ"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Vui lòng quay lại trang dịch vụ để chọn dịch vụ xét nghiệm.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate("/services")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Quay lại trang dịch vụ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
        Đặt lịch xét nghiệm
      </h1>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 bg-blue-50">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <span className="mr-2 text-3xl">{selectedService.icon}</span>
            {selectedService.label}
          </h2>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">
                Mô tả dịch vụ
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {selectedService.description}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Giá dịch vụ</dt>
              <dd className="mt-1 text-sm font-semibold text-gray-900">
                {formatPrice(selectedService.price)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Thời gian có kết quả
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {selectedService.resultWaitTime > 0
                  ? `${selectedService.resultWaitTime} ngày`
                  : "Có ngay"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">
                Hướng dẫn chuẩn bị
              </dt>
              <dd className="mt-1 text-sm text-gray-900 bg-yellow-50 p-3 rounded">
                {selectedService.preparationGuidelines}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Placeholder for test service booking form */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">
            Form đặt lịch xét nghiệm đang được phát triển
          </h3>
          <div className="mt-5">
            <p className="text-sm text-gray-500">
              Chúng tôi đang xây dựng form đặt lịch xét nghiệm. Vui lòng liên hệ
              với chúng tôi qua số điện thoại hoặc email để được hỗ trợ.
            </p>
          </div>
          <div className="mt-5">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => navigate("/services")}
            >
              Quay lại danh sách dịch vụ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestServicePage;
