import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import vnpay_ico from "../../assets/VNpay_ico.png";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import { Buffer } from "buffer";
import logo from "../../assets/gender_healthcare_logo.png";
import RobotoRegular from "../../assets/fonts/Roboto-Regular.ttf";
import axiosClient from "../../services/axiosClient";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
window.Buffer = Buffer;
const unhashServiceId = (hashedId) => {
  try {
    return atob(hashedId);
  } catch (error) {
    console.error("Error unhashing serviceId:", error);
    return hashedId;
  }
};
Font.register({
  family: "Roboto",
  src: RobotoRegular,
});
const TestAppointmentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // State quản lý các bước đặt lịch
  const [currentStep, setCurrentStep] = useState(1);

  // Dữ liệu đặt lịch
  const [selectedService, setSelectedService] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "male",
  });
  const [medicalHistory, setMedicalHistory] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState(null);

  const timeSlots = [
    "08:00 - 08:30",
    "08:30 - 09:00",
    "09:00 - 09:30",
    "09:30 - 10:00",
    "10:00 - 10:30",
    "10:30 - 11:00",
    "13:00 - 13:30",
    "13:30 - 14:00",
    "14:00 - 14:30",
    "14:30 - 15:00",
    "15:00 - 15:30",
    "15:30 - 16:00",
  ];
  useEffect(() => {
    const storedData = localStorage.getItem("user");
    if (storedData) {
      const data = JSON.parse(storedData);
      setUserInfo({
        ...data,
        fullName: data.last_name + " " + data.first_name,
      });
    }
  }, []);
  console.log(userInfo);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Đặt lịch xét nghiệm | Healthcare Service";

    const queryParams = new URLSearchParams(location.search);
    const hashedServiceId = queryParams.get("serviceId");
    const serviceId = hashedServiceId ? unhashServiceId(hashedServiceId) : null;

    const fetchUserInfo = () => {
      const userJson = localStorage.getItem("userProfile");
      if (userJson) {
        try {
          const user = JSON.parse(userJson);
          setUserInfo({
            fullName: `${user.lastname || ""} ${user.firstname || ""}`.trim(),
            email: user.email || "",
            phone: user.phoneNumber || "",
            dateOfBirth: user.dateOfBirth || "",
            gender: user.gender || "male",
          });
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    };

    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get("v1/services");
        if (response.data && response.data.success) {
          const services = response.data.data || [];
          setAllServices(services);

          if (serviceId) {
            const selectedService = services.find(
              (s) => s.service_id.toString() === serviceId.toString()
            );
            if (selectedService) {
              setSelectedServices([selectedService]);
            }
          }
        } else {
          setError("Không thể tải danh sách dịch vụ");
        }
      } catch (err) {
        setError(`Đã xảy ra lỗi: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
    fetchServices();
  }, [location.search]);

  const calculateTotalAmount = () => {
    return selectedServices.reduce((total, service) => {
      const price =
        typeof service.price === "string"
          ? parseInt(service.price.replace(/,/g, ""))
          : service.price;
      return total + price;
    }, 0);
  };
  console.log(selectedServices.price);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Xử lý khi thay đổi dịch vụ
  const handleServiceChange = (service) => {
    const isSelected = selectedServices.some(
      (s) => s.service_id === service.service_id
    );
    if (isSelected) {
      setSelectedServices(
        selectedServices.filter((s) => s.service_id !== service.service_id)
      );
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  // Xử lý khi thay đổi thông tin cá nhân
  const handleUserInfoChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  // Xử lý khi thay đổi lịch sử bệnh
  const handleMedicalHistoryChange = (e) => {
    setMedicalHistory(e.target.value);
  };

  // Xử lý chọn khung giờ
  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  // Xử lý chọn phương thức thanh toán
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  // Xử lý khi nhấn nút tiếp theo
  const handleNextStep = () => {
    // Validate input trước khi chuyển bước tiếp theo
    if (currentStep === 1) {
      if (selectedServices.length === 0) {
        alert("Vui lòng chọn ít nhất một dịch vụ xét nghiệm");
        return;
      }
      if (!userInfo.fullName || !userInfo.email || !userInfo.phone) {
        alert("Vui lòng điền đầy đủ thông tin cá nhân");
        return;
      }
    } else if (currentStep === 2) {
      if (!selectedDate) {
        alert("Vui lòng chọn ngày xét nghiệm");
        return;
      }
      if (!selectedTimeSlot) {
        alert("Vui lòng chọn khung giờ xét nghiệm");
        return;
      }
    } else if (currentStep === 3) {
      // Xử lý thanh toán
      processPayment();
      return;
    }

    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };

  // Xử lý khi nhấn nút quay lại
  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  // Xử lý thanh toán
  const processPayment = async () => {
    setLoading(true);
    const serviceIds = selectedServices.map((ser) => ser.service_id);
    try {
      const appointmentData = {
        user_id: userInfo.user_id,
        services: selectedServices,
        medicalHistory: medicalHistory,
        appointmentDate: format(selectedDate, "dd-MM-yyyy"),
        appointmentTime: selectedTimeSlot,
        totalAmount: calculateTotalAmount(),
        paymentMethod: paymentMethod,
        userInfo: userInfo,
      };

      console.log("Dữ liệu đặt lịch:", appointmentData);

      const mockResponse = {
        success: true,
        data: {
          ...appointmentData,
          service_id: serviceIds,
          appointmentId: "AP" + Date.now().toString().slice(-6),
          status: "completed",
          createdAt: new Date().toLocaleDateString("vi-VN"),
        },
      };

      if (mockResponse.success) {
        setAppointmentDetails(mockResponse.data);
        setIsPaymentComplete(true);
        setCurrentStep(4);
      } else {
        setError("Không thể hoàn tất thanh toán");
      }
    } catch (err) {
      setError(`Lỗi khi thanh toán: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const AppointmentPDF = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <View style={styles.headerContainer}>
            <Image style={styles.logo} src={logo} />
            <Text style={styles.header}>CHI TIẾT LỊCH HẸN XÉT NGHIỆM</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Họ tên:</Text>
              <Text style={styles.value}>
                {appointmentDetails.userInfo.fullName}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>
                {appointmentDetails.userInfo.email}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Số điện thoại:</Text>
              <Text style={styles.value}>
                {appointmentDetails.userInfo.phone}
              </Text>
            </View>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Chi tiết lịch hẹn</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Mã lịch hẹn:</Text>
              <Text style={styles.value}>
                {appointmentDetails.appointmentId}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Ngày xét nghiệm:</Text>
              <Text style={styles.value}>
                {appointmentDetails.appointmentDate}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Giờ xét nghiệm:</Text>
              <Text style={styles.value}>
                {appointmentDetails.appointmentTime}
              </Text>
            </View>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Dịch vụ đã đặt</Text>
            {appointmentDetails.services.map((service, index) => (
              <View key={index} style={styles.serviceItem}>
                <Text>
                  {index + 1}. {service.name}
                </Text>
                <Text>{formatPrice(service.price)}</Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tổng cộng:</Text>
              <Text style={styles.totalValue}>
                {formatPrice(appointmentDetails.totalAmount)}
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text>Vui lòng đến đúng giờ và mang theo giấy tờ tùy thân.</Text>
            <Text>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</Text>
            <Text>Ngày đặt lịch: {appointmentDetails.createdAt}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
  const styles = StyleSheet.create({
    page: {
      padding: 30,
      backgroundColor: "#ffffff",
      fontFamily: "Roboto",
      fontSize: 14,
    },
    section: {
      margin: 10,
      padding: 10,
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },
    logo: {
      width: 60,
      height: 60,
      position: "absolute",
      left: 0,
      bottom: 3,
    },
    header: {
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center",
      flex: 1,
    },
    infoSection: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "bold",
      marginBottom: 10,
      backgroundColor: "#f0f0f0",
      padding: 5,
    },
    infoRow: {
      flexDirection: "row",
      marginBottom: 5,
    },
    label: {
      width: "30%",
      fontWeight: "bold",
    },
    value: {
      width: "70%",
    },
    serviceItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 5,
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10,
      borderTopWidth: 1,
      borderTopColor: "#cccccc",
      paddingTop: 5,
    },
    totalLabel: {
      fontWeight: "bold",
    },
    totalValue: {
      fontWeight: "bold",
    },
    footer: {
      marginTop: 30,
      borderTopWidth: 1,
      borderTopColor: "#cccccc",
      paddingTop: 10,
      fontSize: 10,
      textAlign: "center",
    },
  });
  console.log(styles.page);

  // Loading screen
  if (loading && currentStep === 1) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error screen
  if (error && currentStep === 1) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <div className="text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="mt-2 text-lg font-medium text-gray-900">{error}</h2>
          <p className="mt-1 text-sm text-gray-500">
            Vui lòng thử lại sau hoặc liên hệ hỗ trợ.
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
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề trang */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Đặt lịch xét nghiệm
          </h1>
          <p className="mt-2 text-gray-600">
            Vui lòng hoàn thành các bước để đặt lịch xét nghiệm
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div
              className={`flex flex-col items-center ${
                currentStep >= 1 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= 1
                    ? "border-blue-600 bg-blue-100"
                    : "border-gray-300"
                }`}
              >
                <span className="font-medium">1</span>
              </div>
              <span className="text-xs mt-1">Thông tin</span>
            </div>
            <div
              className={`flex-1 h-1 mx-2 ${
                currentStep >= 2 ? "bg-blue-600" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`flex flex-col items-center ${
                currentStep >= 2 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= 2
                    ? "border-blue-600 bg-blue-100"
                    : "border-gray-300"
                }`}
              >
                <span className="font-medium">2</span>
              </div>
              <span className="text-xs mt-1">Lịch hẹn</span>
            </div>
            <div
              className={`flex-1 h-1 mx-2 ${
                currentStep >= 3 ? "bg-blue-600" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`flex flex-col items-center ${
                currentStep >= 3 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= 3
                    ? "border-blue-600 bg-blue-100"
                    : "border-gray-300"
                }`}
              >
                <span className="font-medium">3</span>
              </div>
              <span className="text-xs mt-1">Xác nhận</span>
            </div>
            <div
              className={`flex-1 h-1 mx-2 ${
                currentStep >= 4 ? "bg-blue-600" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`flex flex-col items-center ${
                currentStep >= 4 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= 4
                    ? "border-blue-600 bg-blue-100"
                    : "border-gray-300"
                }`}
              >
                <span className="font-medium">4</span>
              </div>
              <span className="text-xs mt-1">Hoàn tất</span>
            </div>
          </div>
        </div>

        {/* Step 1: Thông tin cá nhân và chọn dịch vụ */}
        {currentStep === 1 && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-blue-50">
              <h2 className="text-lg font-medium text-gray-900">
                Bước 1: Thông tin cá nhân & dịch vụ
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Vui lòng điền thông tin cá nhân và chọn dịch vụ xét nghiệm
              </p>
            </div>

            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Thông tin cá nhân
              </h3>

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    value={userInfo.fullName}
                    onChange={handleUserInfoChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full h-7 p-2 shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={userInfo.email}
                    onChange={handleUserInfoChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full h-7 p-2 shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={userInfo.phone}
                    onChange={handleUserInfoChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full h-7 p-2 shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="dateOfBirth"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    id="dateOfBirth"
                    value={userInfo.birthday}
                    onChange={handleUserInfoChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full h-7 p-2 shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Giới tính
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={userInfo.gender}
                    onChange={handleUserInfoChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="medicalHistory"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Lịch sử bệnh (nếu có)
                  </label>
                  <textarea
                    id="medicalHistory"
                    name="medicalHistory"
                    rows={3}
                    placeholder="Vui lòng liệt kê các bệnh lý, tiền sử dị ứng, thông tin thuốc đang sử dụng hoặc các vấn đề sức khỏe khác mà bạn nghĩ rằng chúng tôi nên biết."
                    value={medicalHistory}
                    onChange={handleMedicalHistoryChange}
                    className="mt-1 p-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <h3 className="text-lg font-medium text-gray-900 mt-8 mb-4">
                Dịch vụ xét nghiệm
              </h3>

              <div className="space-y-4">
                {allServices.map((service) => (
                  <div key={service.service_id} className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id={`service-${service.service_id}`}
                        name={`service-${service.service_id}`}
                        type="checkbox"
                        checked={selectedServices.some(
                          (s) => s.service_id === service.service_id
                        )}
                        onChange={() => handleServiceChange(service)}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm flex-1">
                      <label
                        htmlFor={`service-${service.service_id}`}
                        className="font-medium text-gray-700 flex justify-between"
                      >
                        <span>{service.name}</span>
                        <span className="font-semibold text-blue-600">
                          {formatPrice(service.price)}
                        </span>
                      </label>
                      <p className="text-gray-500">{service.description}</p>
                      {selectedServices.some(
                        (s) => s.service_id === service.service_id
                      ) && (
                        <div className="mt-2 text-xs bg-blue-50 border border-blue-100 p-2 rounded">
                          <p className="font-medium text-gray-700">
                            Hướng dẫn chuẩn bị:
                          </p>
                          <p className="text-gray-600">
                            {service.preparation_guidelines}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {selectedServices.length > 0 && (
                <div className="mt-6 bg-gray-50 p-4 rounded-md border border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">
                      Tổng chi phí:
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      {formatPrice(calculateTotalAmount())}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                onClick={handleNextStep}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-blue-50">
              <h2 className="text-lg font-medium text-gray-900">
                Bước 2: Chọn lịch xét nghiệm
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Vui lòng chọn ngày và khung giờ phù hợp với bạn
              </p>
            </div>

            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Chọn ngày xét nghiệm
              </h3>

              <div className="flex justify-center mb-8">
                <div className="border border-gray-200 rounded-lg shadow-sm p-4">
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    locale={vi}
                    disabled={[{ before: new Date() }, { dayOfWeek: [0] }]}
                    modifiersStyles={{
                      selected: { backgroundColor: "#3b82f6", color: "white" },
                    }}
                  />
                </div>
              </div>

              {selectedDate && (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Chọn khung giờ xét nghiệm cho ngày{" "}
                    {format(selectedDate, "dd/MM/yyyy")}
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {timeSlots.map((timeSlot) => (
                      <button
                        key={timeSlot}
                        type="button"
                        onClick={() => handleTimeSlotSelect(timeSlot)}
                        className={`py-2 px-4 border rounded-md text-center ${
                          selectedTimeSlot === timeSlot
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {timeSlot}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <div className="mt-8 bg-blue-50 p-4 rounded-md border border-blue-100">
                <h4 className="font-medium text-gray-700 mb-2">
                  Dịch vụ đã chọn:
                </h4>
                <ul className="space-y-1">
                  {selectedServices.map((service) => (
                    <li
                      key={service.service_id}
                      className="flex justify-between"
                    >
                      <span>{service.name}</span>
                      <span>{formatPrice(service.price)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 pt-2 border-t border-blue-100 flex justify-between font-medium">
                  <span>Tổng chi phí:</span>
                  <span>{formatPrice(calculateTotalAmount())}</span>
                </div>
              </div>
            </div>

            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-between">
              <button
                onClick={handlePreviousStep}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Quay lại
              </button>
              <button
                onClick={handleNextStep}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Xác nhận và thanh toán */}
        {currentStep === 3 && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-blue-50">
              <h2 className="text-lg font-medium text-gray-900">
                Bước 3: Xác nhận và thanh toán
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Vui lòng xác nhận thông tin và tiến hành thanh toán
              </p>
            </div>

            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Thông tin cá nhân
                </h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Họ tên
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {userInfo.fullName}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Email
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {userInfo.email}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Số điện thoại
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {userInfo.phone}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Giới tính
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {userInfo.gender === "male"
                          ? "Nam"
                          : userInfo.gender === "female"
                          ? "Nữ"
                          : "Khác"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Thông tin lịch hẹn
                </h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Ngày xét nghiệm
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {format(selectedDate, "dd/MM/yyyy")}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Giờ xét nghiệm
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {selectedTimeSlot}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Dịch vụ đã chọn
                </h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Tên dịch vụ
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Giá tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedServices.map((service) => (
                        <tr key={service.service_id}>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            {service.name}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                            {formatPrice(service.price)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50">
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          Tổng cộng
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-blue-600 text-right">
                          {formatPrice(calculateTotalAmount())}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {medicalHistory && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Lịch sử bệnh
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-900">{medicalHistory}</p>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Phương thức thanh toán
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="vnpay"
                      name="paymentMethod"
                      type="radio"
                      value="vnpay"
                      checked={paymentMethod === "vnpay"}
                      onChange={handlePaymentMethodChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <label
                      htmlFor="vnpay"
                      className="ml-3  text-sm font-medium text-gray-700 flex items-center"
                    >
                      <img
                        src={vnpay_ico}
                        alt="VNPAY"
                        className="h-5 w-auto mr-2"
                      />
                      VNPAY
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="cash"
                      name="paymentMethod"
                      type="radio"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={handlePaymentMethodChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <label
                      htmlFor="cash"
                      className="ml-3  text-sm font-medium text-gray-700 flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mr-2 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                        />
                      </svg>
                      Thanh toán khi đến khám
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-between">
              <button
                onClick={handlePreviousStep}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                Quay lại
              </button>
              <button
                onClick={handleNextStep}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  "Xác nhận và thanh toán"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Hoàn tất */}
        {currentStep === 4 && isPaymentComplete && appointmentDetails && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-green-50">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                  <svg
                    className="h-8 w-8 text-green-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="ml-3 text-lg font-medium text-gray-900">
                  Đặt lịch thành công!
                </h2>
              </div>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Cảm ơn bạn đã đặt lịch xét nghiệm. Vui lòng đến đúng giờ và mang
                theo giấy tờ tùy thân.
              </p>
            </div>

            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Chi tiết lịch hẹn
                </h3>
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Mã lịch hẹn
                      </dt>
                      <dd className="mt-1 text-sm font-bold text-gray-900">
                        {appointmentDetails.appointmentId}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Trạng thái thanh toán
                      </dt>
                      <dd className="mt-1 text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Đã thanh toán
                        </span>
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Ngày xét nghiệm
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {appointmentDetails.appointmentDate}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Giờ xét nghiệm
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {appointmentDetails.appointmentTime}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">
                        Phương thức thanh toán
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {appointmentDetails.paymentMethod === "momo" &&
                          "Ví MoMo"}
                        {appointmentDetails.paymentMethod === "vnpay" &&
                          "VNPAY"}
                        {appointmentDetails.paymentMethod === "cash" &&
                          "Thanh toán khi đến khám"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Thông tin cá nhân
                </h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Họ tên
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {appointmentDetails.userInfo.fullName}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Email
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {appointmentDetails.userInfo.email}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Số điện thoại
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {appointmentDetails.userInfo.phone}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Giới tính
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {appointmentDetails.userInfo.gender === "male"
                          ? "Nam"
                          : appointmentDetails.userInfo.gender === "female"
                          ? "Nữ"
                          : "Khác"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Dịch vụ đã đặt
                </h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Tên dịch vụ
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Giá tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {appointmentDetails.services.map((service) => (
                        <tr key={service.service_id}>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            {service.name}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                            {formatPrice(service.price)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50">
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          Tổng cộng
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-blue-600 text-right">
                          {formatPrice(appointmentDetails.totalAmount)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-8">
                <div className="text-center">
                  <PDFDownloadLink
                    document={<AppointmentPDF />}
                    fileName={`lich-hen-xet-nghiem-${appointmentDetails.appointmentId}.pdf`}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-4"
                  >
                    {({ blob, url, loading, error }) =>
                      loading ? (
                        "Đang tạo PDF..."
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                          Tải xuống PDF
                        </>
                      )
                    }
                  </PDFDownloadLink>

                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                      />
                    </svg>
                    In lịch hẹn
                  </button>
                </div>
              </div>
            </div>

            <div className="px-4 py-3 bg-gray-50 sm:px-6 text-center">
              <button
                onClick={() => navigate("/")}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestAppointmentPage;
