import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ScrollToTop from "../../components/ui/ScrollToTop";
import axiosClient from "../../services/axiosClient";
import { API_SERVICES } from "../../constants/Apis";

const ServicePage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Danh sách dịch vụ tư vấn mặc định (sẽ được sử dụng nếu API không hoạt động)
  const defaultConsultationTypes = [
    {
      id: "c1",
      value: "Khám phụ khoa",
      label: "Khám phụ khoa",
      icon: "🩺",
      description:
        "Khám tổng quát các vấn đề phụ khoa, phát hiện sớm các bệnh lý liên quan đến hệ sinh sản nữ.",
      price: 250000,
      preparationGuidelines:
        "Không nên quan hệ tình dục, không thụt rửa âm đạo trong 24 giờ trước khi khám.",
      serviceType: "consultation",
    },
    {
      id: "c2",
      value: "Tư vấn chu kỳ kinh nguyệt",
      label: "Tư vấn chu kỳ kinh nguyệt",
      icon: "📅",
      description:
        "Tư vấn về các vấn đề liên quan đến chu kỳ kinh nguyệt, rối loạn kinh nguyệt.",
      price: 250000,
      preparationGuidelines: "Mang theo sổ ghi chép chu kỳ kinh nguyệt nếu có.",
      serviceType: "consultation",
    },
    {
      id: "c3",
      value: "Tư vấn tránh thai",
      label: "Tư vấn tránh thai",
      icon: "💊",
      description: "Tư vấn các biện pháp tránh thai phù hợp với từng cá nhân.",
      price: 250000,
      preparationGuidelines:
        "Chuẩn bị thông tin về các biện pháp tránh thai đã sử dụng (nếu có).",
      serviceType: "consultation",
    },
    {
      id: "c4",
      value: "Tư vấn thai kỳ",
      label: "Tư vấn thai kỳ",
      icon: "🤱",
      description:
        "Tư vấn theo dõi thai kỳ, chế độ dinh dưỡng và chăm sóc trong thời gian mang thai.",
      price: 250000,
      preparationGuidelines:
        "Mang theo sổ khám thai và các kết quả xét nghiệm gần nhất (nếu có).",
      serviceType: "consultation",
    },
    {
      id: "c5",
      value: "Tư vấn sinh sản",
      label: "Tư vấn sinh sản",
      icon: "👶",
      description:
        "Tư vấn về các vấn đề liên quan đến khả năng sinh sản, vô sinh, hiếm muộn.",
      price: 250000,
      preparationGuidelines: "Cả hai vợ chồng nên cùng tham gia buổi tư vấn.",
      serviceType: "consultation",
    },
    {
      id: "c6",
      value: "Tư vấn chung",
      label: "Tư vấn chung",
      icon: "💬",
      description: "Tư vấn về các vấn đề sức khỏe sinh sản nói chung.",
      price: 250000,
      preparationGuidelines: "Chuẩn bị sẵn câu hỏi cần tư vấn.",
      serviceType: "consultation",
    },
  ];

  // Danh sách dịch vụ xét nghiệm mặc định
  const defaultTestServices = [
    {
      id: "t1",
      value: "Xét nghiệm HIV",
      label: "Xét nghiệm HIV",
      icon: "🧪",
      description: "Phát hiện kháng thể HIV trong máu để chẩn đoán sớm.",
      price: 250000,
      preparationGuidelines: "Không cần chuẩn bị đặc biệt.",
      resultWaitTime: 2,
      serviceType: "test",
    },
    {
      id: "t2",
      value: "Tổng phân tích tế bào máu",
      label: "Tổng phân tích tế bào máu",
      icon: "🩸",
      description:
        "Kiểm tra các chỉ số của máu, phát hiện thiếu máu, nhiễm trùng.",
      price: 180000,
      preparationGuidelines: "Nhịn ăn 8 giờ trước khi xét nghiệm.",
      resultWaitTime: 1,
      serviceType: "test",
    },
    {
      id: "t3",
      value: "Xét nghiệm nước tiểu",
      label: "Xét nghiệm nước tiểu",
      icon: "💧",
      description:
        "Kiểm tra các chỉ số trong nước tiểu, phát hiện các bệnh lý.",
      price: 150000,
      preparationGuidelines: "Thu thập mẫu nước tiểu buổi sáng đầu tiên.",
      resultWaitTime: 1,
      serviceType: "test",
    },
    {
      id: "t4",
      value: "Xét nghiệm chức năng gan, thận",
      label: "Xét nghiệm chức năng gan, thận",
      icon: "🫁",
      description:
        "Kiểm tra hoạt động của gan và thận thông qua các chỉ số sinh hóa.",
      price: 350000,
      preparationGuidelines: "Nhịn ăn 8 giờ trước khi xét nghiệm.",
      resultWaitTime: 2,
      serviceType: "test",
    },
    {
      id: "t5",
      value: "Siêu âm phụ khoa",
      label: "Siêu âm phụ khoa",
      icon: "📡",
      description:
        "Kiểm tra tình trạng của tử cung, buồng trứng và các cơ quan khác trong vùng chậu.",
      price: 300000,
      preparationGuidelines:
        "Uống đầy bàng quang trước khi siêu âm (uống 3-4 cốc nước 1 giờ trước).",
      resultWaitTime: 0,
      serviceType: "test",
    },
    {
      id: "t6",
      value: "Tầm soát ung thư cổ tử cung (Pap smear)",
      label: "Tầm soát ung thư cổ tử cung",
      icon: "🔬",
      description:
        "Phát hiện sớm các tế bào bất thường và nguy cơ ung thư cổ tử cung.",
      price: 450000,
      preparationGuidelines:
        "Không quan hệ tình dục, không đặt thuốc âm đạo trong 48 giờ trước khi xét nghiệm.",
      resultWaitTime: 7,
      serviceType: "test",
    },
  ];

  // Map icons dựa vào loại dịch vụ
  const getServiceIcon = (serviceType, name) => {
    // Default icons based on service type
    const defaultIcons = {
      consultation: "💬",
      test: "🧪",
    };

    // Specific icons based on keywords in the service name
    const iconMap = {
      "phụ khoa": "🩺",
      "kinh nguyệt": "📅",
      "tránh thai": "💊",
      "thai kỳ": "🤱",
      "sinh sản": "👶",
      hiv: "🧪",
      máu: "🩸",
      "nước tiểu": "💧",
      gan: "🫁",
      thận: "🫁",
      "siêu âm": "📡",
      "ung thư": "🔬",
    };

    // Check if service name contains any of the keywords
    for (const [keyword, icon] of Object.entries(iconMap)) {
      if (name.toLowerCase().includes(keyword.toLowerCase())) {
        return icon;
      }
    }

    // Return default icon based on service type
    return defaultIcons[serviceType] || "⚕️";
  };

  // Lấy dữ liệu dịch vụ từ API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(API_SERVICES);

        if (response.data && Array.isArray(response.data)) {
          // Map API data to our format
          const mappedServices = response.data.map((service) => ({
            id: service.service_id || service.id,
            value: service.name,
            label: service.name,
            icon: getServiceIcon(service.serviceType, service.name),
            description: service.description || "Không có mô tả",
            price: service.price || 0,
            preparationGuidelines:
              service.preparationGuidelines || "Không có hướng dẫn cụ thể",
            resultWaitTime: service.resultWaitTime || 0,
            serviceType: service.serviceType || "consultation",
          }));

          setServices(mappedServices);
        } else {
          // Sử dụng dữ liệu mặc định nếu API không trả về đúng định dạng
          setServices([...defaultConsultationTypes, ...defaultTestServices]);
          console.log(
            "API không trả về đúng định dạng dữ liệu, sử dụng dữ liệu mặc định"
          );
        }
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu dịch vụ:", err);
        setError(
          "Không thể lấy dữ liệu dịch vụ. Đang hiển thị dữ liệu mặc định."
        );
        setServices([...defaultConsultationTypes, ...defaultTestServices]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Phân loại dịch vụ
  const consultationServices = services.filter(
    (service) => service.serviceType === "consultation"
  );

  const testServices = services.filter(
    (service) => service.serviceType === "test"
  );

  // Các hàm xử lý đặt lịch
  const handleBookConsultation = (service) => {
    navigate("/appointment", {
      state: { selectedService: service, serviceType: "consultation" },
    });
  };

  const handleBookTest = (service) => {
    navigate("/service", {
      state: { selectedService: service, serviceType: "test" },
    });
  };
  // Set tiêu đề trang và cuộn lên đầu trang
  useEffect(() => {
    document.title = "Dịch vụ y tế | Healthcare Service";
    window.scrollTo(0, 0);
  }, []);

  // Format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="font-sans">
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 bg-opacity-80 text-white text-center py-20 px-4 mb-10 rounded-lg">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">
            Dịch vụ y tế chuyên nghiệp
          </h1>
          <p className="text-xl opacity-90">
            Chăm sóc sức khỏe toàn diện với các dịch vụ tư vấn và xét nghiệm
            chất lượng cao
          </p>
        </div>
      </div>
      {/* Loading state */}
      {loading && (
        <div className="max-w-7xl mx-auto px-4 text-center py-16">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu dịch vụ...</p>
        </div>
      )}
      {/* Error message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 text-center py-4">
          <p className="text-yellow-600 bg-yellow-50 p-3 rounded-md">{error}</p>
        </div>
      )}
      {/* Section hiển thị dịch vụ tư vấn */}
      {!loading && consultationServices.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Dịch vụ tư vấn
            </h2>
            <p className="text-gray-600">
              Đội ngũ bác sĩ chuyên nghiệp, tận tâm với nhiều năm kinh nghiệm
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {consultationServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full border border-gray-100"
              >
                <div className="bg-green-50 p-4 flex items-center">
                  <div className="text-4xl mr-3">{service.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {service.label}
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="py-3 border-t border-b border-gray-100 mb-4">
                    <p className="mb-1">
                      <span className="font-semibold text-gray-700">Giá:</span>{" "}
                      {formatPrice(service.price)}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-md p-4 mb-4">
                    <span className="font-semibold text-gray-700">
                      Hướng dẫn chuẩn bị:
                    </span>
                    <p className="mt-1 text-gray-600 text-sm">
                      {service.preparationGuidelines}
                    </p>
                  </div>
                </div>
                <div className="mt-auto p-4 pt-0">
                  <button
                    className="w-full py-3 px-4 rounded-md font-medium bg-green-600 hover:bg-green-700 text-white transition-colors duration-200"
                    onClick={() => handleBookConsultation(service)}
                  >
                    Đặt lịch tư vấn
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Section hiển thị dịch vụ xét nghiệm */}
      {!loading && testServices.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Dịch vụ xét nghiệm
            </h2>
            <p className="text-gray-600">
              Xét nghiệm chính xác với trang thiết bị hiện đại và đội ngũ kỹ
              thuật viên chuyên nghiệp
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full border border-gray-100"
              >
                <div className="bg-blue-50 p-4 flex items-center">
                  <div className="text-4xl mr-3">{service.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {service.label}
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="py-3 border-t border-b border-gray-100 mb-4">
                    <p className="mb-1">
                      <span className="font-semibold text-gray-700">Giá:</span>{" "}
                      {formatPrice(service.price)}
                    </p>
                    {service.resultWaitTime > 0 && (
                      <p>
                        <span className="font-semibold text-gray-700">
                          Thời gian có kết quả:
                        </span>{" "}
                        {service.resultWaitTime}{" "}
                        {service.resultWaitTime > 1 ? "ngày" : "ngày"}
                      </p>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded-md p-4 mb-4">
                    <span className="font-semibold text-gray-700">
                      Hướng dẫn chuẩn bị:
                    </span>
                    <p className="mt-1 text-gray-600 text-sm">
                      {service.preparationGuidelines}
                    </p>
                  </div>
                </div>
                <div className="mt-auto p-4 pt-0">
                  {" "}
                  <button
                    className="w-full py-3 px-4 rounded-md font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
                    onClick={() => handleBookTest(service)}
                  >
                    Đặt lịch xét nghiệm
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}{" "}
      {/* Hiển thị thông báo khi không có dịch vụ */}
      {!loading &&
        consultationServices.length === 0 &&
        testServices.length === 0 && (
          <div className="max-w-7xl mx-auto px-4 text-center py-16">
            <p className="text-gray-600">
              Không tìm thấy dịch vụ nào. Vui lòng thử lại sau.
            </p>
          </div>
        )}
      {/* Kết thúc phần các dịch vụ */}
      {/* Thông tin thêm về dịch vụ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-blue-50 rounded-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Tại sao chọn dịch vụ của chúng tôi?
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Trung tâm Y tế của chúng tôi cung cấp dịch vụ chăm sóc sức khỏe
              toàn diện với đội ngũ bác sĩ giàu kinh nghiệm và trang thiết bị
              hiện đại
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-4">
              <div className="text-4xl mb-4 text-blue-600 flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Chất lượng cao</h3>
              <p className="text-gray-600">
                Các dịch vụ y tế được thực hiện bởi đội ngũ bác sĩ chuyên khoa
                hàng đầu và trang thiết bị hiện đại
              </p>
            </div>

            <div className="text-center p-4">
              <div className="text-4xl mb-4 text-green-600 flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Tiết kiệm thời gian</h3>
              <p className="text-gray-600">
                Quy trình đặt lịch nhanh chóng, thuận tiện và kết quả xét nghiệm
                được trả trong thời gian sớm nhất
              </p>
            </div>

            <div className="text-center p-4">
              <div className="text-4xl mb-4 text-purple-600 flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Tư vấn chuyên sâu</h3>
              <p className="text-gray-600">
                Nhận tư vấn cá nhân hóa từ các chuyên gia sức khỏe giúp bạn hiểu
                rõ hơn về tình trạng sức khỏe
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Phần liên hệ và đặt lịch */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl text-white py-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-4">
            Bạn muốn đặt lịch tư vấn hoặc xét nghiệm?
          </h2>
          <p className="opacity-90 max-w-2xl mx-auto">
            Liên hệ ngay với chúng tôi để được tư vấn và đặt lịch phù hợp với
            nhu cầu của bạn
          </p>
        </div>{" "}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate("/appointment")}
            className="bg-white text-blue-700 hover:bg-blue-50 font-medium px-6 py-3 rounded-md transition-colors duration-200"
          >
            Đặt lịch ngay
          </button>
          <button
            onClick={() => (window.location.href = "tel:1900000123")}
            className="bg-transparent hover:bg-blue-800 border border-white font-medium px-6 py-3 rounded-md transition-colors duration-200"
          >
            Gọi điện tư vấn
          </button>
        </div>
      </div>
      {/* Add Scroll to Top button */}
      <ScrollToTop />

    </div>
  );
};

export default ServicePage;
