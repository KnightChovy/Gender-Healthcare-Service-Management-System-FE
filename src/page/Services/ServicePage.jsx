import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../services/axiosClient";
import ScrollToTop from "../../components/ui/ScrollToTop";

const ServicePage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Danh sách dịch vụ tư vấn (lấy từ ConsultationSection.jsx)
  const consultationTypes = [
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
    },
    {
      id: "c5",
      value: "Tư vấn sinh sản",
      label: "Tư vấn sinh sản",
      icon: "👶",
      description:
        "Tư vấn về các vấn đề liên quan đến khả năng sinh sản, vô sinh, hiếm muộn.",
      price: 25000,
      preparationGuidelines: "Cả hai vợ chồng nên cùng tham gia buổi tư vấn.",
    },
    {
      id: "c6",
      value: "Tư vấn chung",
      label: "Tư vấn chung",
      icon: "💬",
      description: "Tư vấn về các vấn đề sức khỏe sinh sản nói chung.",
      price: 250000,
      preparationGuidelines: "Chuẩn bị sẵn câu hỏi cần tư vấn.",
    },
  ];

  // Danh sách dịch vụ xét nghiệm
  const testServices = [
    {
      id: "t1",
      value: "Xét nghiệm HIV",
      label: "Xét nghiệm HIV",
      icon: "🧪",
      description: "Phát hiện kháng thể HIV trong máu để chẩn đoán sớm.",
      price: 250000,
      preparationGuidelines: "Không cần chuẩn bị đặc biệt.",
      resultWaitTime: 2,
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
    },
  ];

  // Fetch dịch vụ từ API (nếu có)
  useEffect(() => {
    // Set page title
    document.title = "Dịch vụ y tế | Healthcare Service";

    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get("/v1/services");
        if (response.data && response.data.success) {
          // Nếu có API, sử dụng dữ liệu từ API
          setServices(response.data.data);
        } else {
          // Nếu không có API, sử dụng dữ liệu mẫu
          setServices([...consultationTypes, ...testServices]);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        // Sử dụng dữ liệu mẫu nếu API lỗi
        setServices([...consultationTypes, ...testServices]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Lọc dịch vụ theo tab
  const filteredServices = services
    .filter((service) => {
      // Filter by tab
      if (activeTab === "all") return true;

      const isConsultation = consultationTypes.some((c) => c.id === service.id);
      if (activeTab === "consultation") return isConsultation;
      if (activeTab === "test") return !isConsultation;
      return true;
    })
    .filter((service) => {
      // Filter by search term
      if (!searchTerm) return true;

      const searchLower = searchTerm.toLowerCase();
      return (
        service.label.toLowerCase().includes(searchLower) ||
        service.description.toLowerCase().includes(searchLower)
      );
    });
  // Xử lý click đặt lịch
  const handleBookService = (service, serviceType) => {
    if (serviceType === "consultation") {
      navigate("/appointment", {
        state: { selectedService: service, serviceType: "consultation" },
      });
    } else {
      // Đảm bảo thông tin dịch vụ được truyền qua route
      const serviceWithInfo = { ...service };
      console.log("Booking test service:", serviceWithInfo);
      navigate("/service", {
        state: { selectedService: serviceWithInfo, serviceType: "test" },
      });
    }
  };

  // Xác định loại dịch vụ
  const getServiceType = (serviceId) => {
    return consultationTypes.some((c) => c.id === serviceId)
      ? "consultation"
      : "test";
  };

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

      {/* Section hiển thị dịch vụ tư vấn */}
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
          {consultationTypes.map((service) => (
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
                  onClick={() => handleBookService(service, "consultation")}
                >
                  Đặt lịch tư vấn
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section hiển thị dịch vụ xét nghiệm */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Dịch vụ xét nghiệm
          </h2>
          <p className="text-gray-600">
            Xét nghiệm chính xác với trang thiết bị hiện đại và đội ngũ kỹ thuật
            viên chuyên nghiệp
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
                <button
                  className="w-full py-3 px-4 rounded-md font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
                  onClick={() => handleBookService(service, "test")}
                >
                  Đặt lịch xét nghiệm
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      

      {/* Add Scroll to Top button */}
      <ScrollToTop />
    </div>
  );
};

export default ServicePage;
