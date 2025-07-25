import { useEffect, useState } from "react";
import axiosClient from "../../services/axiosClient";
import { Link } from "react-router-dom";
import { ServiceSection } from "./components/ServiceSection";
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

        if (response.data && response.data.success) {
          const servicesData = response.data.data || [];

          const categorizedServices = servicesData.map((service) => {
            let category;
            if (service.category_id === "CAT001") category = "test";
            else if (service.category_id === "CAT002")
              category = "consultation";
            else if (service.category_id === "CAT003") category = "cycle";

            return { ...service, category };
          });

          setServices(categorizedServices);
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

  // Lọc dịch vụ theo tên hoặc mô tả và category
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.description &&
        service.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      selectedCategory === "all" || service.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const testServices = filteredServices.filter(
    (service) => service.category === "test"
  );
  const consultationServices = filteredServices.filter(
    (service) => service.category === "consultation"
  );
  const cycleServices = filteredServices.filter(
    (service) => service.category === "cycle"
  );

  const icons = {
    test: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
      />
    ),
    consultation: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
      />
    ),
    cycle: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    ),
  };

  return (
    <div className="bg-gray-50 min-h-screen">
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
        {/* Search and Filter */}
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
            {(selectedCategory === "all" || selectedCategory === "test") && (
              <ServiceSection
                title="Dịch vụ Xét nghiệm"
                icon={icons.test}
                services={testServices}
                category="test"
              />
            )}

            {(selectedCategory === "all" ||
              selectedCategory === "consultation") && (
              <ServiceSection
                title="Dịch vụ Tư vấn"
                icon={icons.consultation}
                services={consultationServices}
                category="consultation"
              />
            )}

            {/* Cycle Services */}
            {(selectedCategory === "all" || selectedCategory === "cycle") && (
              <ServiceSection
                title="Theo dõi chu kỳ kinh nguyệt"
                icon={icons.cycle}
                services={cycleServices}
                category="cycle"
              />
            )}
          </div>
        )}
      </div>

      {/* CTA Section */}
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
