import React, { useState, useEffect } from "react";
import axiosClient from "../../services/axiosClient";
import { Link } from "react-router-dom";

// Hàm hash đơn giản để mã hóa serviceId
const hashServiceId = (serviceId) => {
  return btoa(serviceId.toString()).replace(/=/g, "");
};

export const ServicePage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get("v1/services");
        console.log("Fetched services:", response.data);

        if (response.data && response.data.success) {
          // Sử dụng đúng cấu trúc API của bạn
          const testServices = (response.data.data || []).map((service) => ({
            ...service,
          }));
          setServices([...testServices]);
        } else {
          setError("Không thể tải dữ liệu dịch vụ");
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setError(`Đã xảy ra lỗi: ${err.message || "Unknown error"}`);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Lọc dịch vụ theo tên hoặc mô tả
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.description &&
        service.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      selectedCategory === "all" || service.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupServices = () => {
    const basicServices = filteredServices.filter((s) => s.price < 300000);
    const premiumServices = filteredServices.filter((s) => s.price >= 300000);
    return { basicServices, premiumServices };
  };

  const { basicServices, premiumServices } = groupServices();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 text-center">
            Dịch Vụ Sức Khỏe Giới Tính
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-center">
            Chúng tôi cung cấp các xét nghiệm và dịch vụ tư vấn y tế hiện đại,
            chất lượng cao với quy trình nhanh chóng, tiện lợi.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm dịch vụ..."
                  className="w-full py-3 px-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả dịch vụ</option>
                <option value="CAT001">Xét nghiệm</option>
                <option value="CAT002">Tư vấn</option>
                <option value="CAT003">Chu kỳ kinh nguyệt</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <div className="text-red-500 text-lg mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p className="text-xl">Không tìm thấy dịch vụ nào phù hợp</p>
          </div>
        ) : (
          <div>
            {selectedCategory === "all" || selectedCategory === "CAT001" ? (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                  Dịch vụ Xét nghiệm
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredServices
                    .filter((service) => service.category_id === "CAT001")
                    .map((service) => (
                      <div
                        key={service.service_id}
                        className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1"
                      >
                        <div className="h-36 bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
                          <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-10 w-10 text-blue-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                              />
                            </svg>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                  {service.result_wait_time} ngày có kết quả
                                </span>
                              </div>
                              <h3 className="text-xl font-bold">
                                {service.name}
                              </h3>
                            </div>
                            <div className="font-bold text-blue-600">
                              {service.price && (
                                <span>
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(service.price)}
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-gray-600 mt-3">
                            {service.description || "Không có mô tả chi tiết"}
                          </p>

                          <div className="mt-4 p-3 bg-gray-50 rounded-md">
                            <h4 className="font-medium text-gray-700">
                              Hướng dẫn chuẩn bị:
                            </h4>
                            <p className="text-gray-600 mt-1 text-sm">
                              {service.preparationGuidelines ||
                                "Không có hướng dẫn cụ thể."}
                            </p>
                          </div>

                          <div className="mt-6 flex justify-end">
                            <Link
                              to={{
                                pathname: "/services/test",
                                search: `?serviceId=${hashServiceId(
                                  service.service_id
                                )}`,
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                            >
                              Đặt lịch xét nghiệm
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ) : null}

            {selectedCategory === "all" ||
            selectedCategory === "CAT002" ? (
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    />
                  </svg>
                  Dịch vụ Tư vấn
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredServices
                    .filter((service) => service.category_id === "CAT002")
                    .map((service) => (
                      <div
                        key={service.service_id}
                        className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1"
                      >
                        <div className="h-36 bg-gradient-to-r from-indigo-500 to-indigo-700 flex items-center justify-center">
                          <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-10 w-10 text-indigo-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                              />
                            </svg>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                  Tư vấn trực tiếp
                                </span>
                              </div>
                              <h3 className="text-xl font-bold">
                                {service.name}
                              </h3>
                            </div>
                            <div className="font-bold text-indigo-600">
                              {service.price && (
                                <span>
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(service.price)}
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-gray-600 mt-3">
                            {service.description || "Không có mô tả chi tiết"}
                          </p>

                          <div className="mt-4 p-3 bg-gray-50 rounded-md">
                            <h4 className="font-medium text-gray-700">
                              Hướng dẫn chuẩn bị:
                            </h4>
                            <p className="text-gray-600 mt-1 text-sm">
                              {service.preparationGuidelines ||
                                "Không có hướng dẫn cụ thể."}
                            </p>
                          </div>

                          <div className="mt-6 flex justify-end">
                            <Link
                              to={{
                                pathname: "/services/consultation",
                                search: `?serviceId=${hashServiceId(
                                  service.service_id
                                )}`,
                              }}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors"
                            >
                              Đặt lịch tư vấn
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ) : null}

            {selectedCategory === "all" || selectedCategory === "CAT003" ? (
              <div className="mb-12 mt-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                  Theo dõi chu kỳ kinh nguyệt
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredServices
                    .filter((service) => service.category_id === "CAT003")
                    .map((service) => (
                      <div
                        key={service.service_id}
                        className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1"
                      >
                        <div className="h-36 bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
                          <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-10 w-10 text-blue-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                              />
                            </svg>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-bold">
                                {service.name}
                              </h3>
                            </div>
                            <div className="font-bold text-blue-600">
                              {service.price && (
                                <span>
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(service.price)}
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-gray-600 mt-3">
                            {service.description || "Không có mô tả chi tiết"}
                          </p>

                          <div className="mt-4 p-3 bg-gray-50 rounded-md">
                            <h4 className="font-medium text-gray-700">
                              Hướng dẫn chuẩn bị:
                            </h4>
                            <p className="text-gray-600 mt-1 text-sm">
                              {service.preparationGuidelines ||
                                "Không có hướng dẫn cụ thể."}
                            </p>
                          </div>

                          <div className="mt-6 flex justify-end">
                            <Link
                              to={{
                                pathname: "/services/menstrual-cycle",
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                            >
                              Bắt đầu theo dõi chu kỳ
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Cần hỗ trợ thêm về các dịch vụ?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc
            và tư vấn lựa chọn dịch vụ phù hợp với nhu cầu của bạn.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/appointment"
              className="bg-white text-blue-900 hover:bg-blue-100 px-6 py-3 rounded-md font-medium transition-colors"
            >
              Đặt lịch khám ngay
            </Link>
            <Link
              to="/contact"
              className="border border-white text-white hover:bg-white hover:text-blue-900 px-6 py-3 rounded-md font-medium transition-colors"
            >
              Liên hệ hỗ trợ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
