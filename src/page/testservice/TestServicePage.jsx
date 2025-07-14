import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import axiosClient from "../../services/axiosClient";
import { Buffer } from "buffer";

// Components
import { BookingStepIndicator } from "./components/BookingStep";
import { PersonalInfoStep } from "./components/PersonalInfo";
import AppointmentDateStep from "./components/AppointmentDate";
import ConfirmationStep from "./components/Confirmation";
import CompletionStep from "./components/CompletionStep";
import PaymentStatus from "./components/PaymentStatus";
import AppointmentPDF from "./components/AppointmentPDF";
import { ServiceCard } from "./components/ServiceCard";

import usePaymentProcessing from "./hook/usePaymentProcessing";
import { API_BOOKING_SERVICE_SUCCESS } from "../../constants/Apis";

window.Buffer = Buffer;

const unhashServiceId = (hashedId) => {
  try {
    return atob(hashedId);
  } catch (error) {
    console.error("Error unhashing serviceId:", error);
    return hashedId;
  }
};

const unhashAppointmentId = (hashedId) => {
  try {
    return atob(hashedId);
  } catch (error) {
    console.error("Error unhashing appointmentId: ", error);
    return hashedId;
  }
};

const TestAppointmentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // State quản lý các bước đặt lịch
  const [currentStep, setCurrentStep] = useState(1);

  // Dữ liệu đặt lịch
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
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [appointmentId, setAppointmentId] = useState("");

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

  const {
    paymentError,
    paymentErrorMessage,
    paymentProcessing,
    processPayment,
    setPaymentError,
  } = usePaymentProcessing({
    userInfo,
    selectedServices,
    selectedDate,
    selectedTimeSlot,
    medicalHistory,
    calculateTotalAmount,
    appointmentId,
    completeBookingProcess,
  });

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

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Đặt lịch xét nghiệm | Healthcare Service";

    const queryParams = new URLSearchParams(location.search);

    const hashedServiceId = queryParams.get("serviceId");
    const serviceId = hashedServiceId ? unhashServiceId(hashedServiceId) : null;
    const hashedAppointmentId = queryParams.get("appointmentId");
    const appointmentId = hashedAppointmentId
      ? unhashAppointmentId(hashedAppointmentId)
      : null;

    setAppointmentId(appointmentId);

    const fetchUserInfo = () => {
      const userJson = localStorage.getItem("userProfile");
      if (userJson) {
        try {
          const user = JSON.parse(userJson);
          setUserInfo({
            user_id: user.user_id,
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
          const data = response.data.data;

          const testService = data.filter(
            (ser) => ser.category_id === "CAT001"
          );
          setAllServices(testService);
          if (serviceId && testService.length > 0) {
            const selectedService = testService.find(
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

  // Helper functions
  const createNewNotification = (appointmentData) => {
    const notificationId = `test_success_${Date.now()}`;

    const newNotification = {
      id: notificationId,
      type: "appointment_success",
      title: "Đặt lịch xét nghiệm thành công",
      message: `Lịch xét nghiệm của bạn đã được đặt thành công.`,
      timeStamp: new Date().toISOString(),
      isRead: false,
      appointmentId: appointmentData.appointment_id || null,
      appointmentData: {
        ...appointmentData,
        consultant_type: "Xét nghiệm",
        price_apm: calculateTotalAmount(),
        appointment_date: format(selectedDate, "yyyy-MM-dd"),
        appointment_time: selectedTimeSlot,
        created_at: new Date().toISOString(),
        status: "success",
      },
    };

    const savedNotifications = JSON.parse(
      localStorage.getItem("notificationReadStatus") || "{}"
    );
    savedNotifications[notificationId] = false;
    localStorage.setItem(
      "notificationReadStatus",
      JSON.stringify(savedNotifications)
    );

    const tempNotifications = JSON.parse(
      localStorage.getItem("tempNotifications") || "[]"
    );
    tempNotifications.push(newNotification);
    localStorage.setItem(
      "tempNotifications",
      JSON.stringify(tempNotifications)
    );

    return newNotification;
  };

  function calculateTotalAmount() {
    return selectedServices.reduce((total, service) => {
      const price =
        typeof service.price === "string"
          ? parseInt(service.price.replace(/,/g, ""))
          : service.price;
      return total + price;
    }, 0);
  }

  function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  }

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

  const handleUserInfoChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleMedicalHistoryChange = (e) => {
    setMedicalHistory(e.target.value);
  };

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleNextStep = () => {
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

  function completeBookingProcess(responseData) {
    // Tạo thông tin lịch hẹn
    const appointmentDetails = {
      services: selectedServices,
      medicalHistory: medicalHistory,
      exam_date: format(selectedDate, "dd-MM-yyyy"),
      exam_time: selectedTimeSlot,
      totalAmount: calculateTotalAmount(),
      payment_method: paymentMethod,
      userInfo: userInfo,
      payment_status: "confirmed",
      createdAt: new Date().toLocaleDateString("vi-VN"),
      appointment_id: responseData.data?.appointment_id || null,
    };

    const newNotification = createNewNotification(appointmentDetails);

    setAppointmentDetails(appointmentDetails);
    setIsPaymentComplete(true);
    setCurrentStep(4);
    axiosClient
      .post(API_BOOKING_SERVICE_SUCCESS, {
        user_id: userInfo.user_id,
        order_id: responseData.data.order.order_id,
      })
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
    if (window.dispatchEvent) {
      const event = new CustomEvent("newNotification", {
        detail: newNotification,
      });
      window.dispatchEvent(event);
    }
  }

  if (loading && currentStep === 1) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Đặt lịch xét nghiệm
          </h1>
          <p className="mt-2 text-gray-600">
            Vui lòng hoàn thành các bước để đặt lịch xét nghiệm
          </p>
        </div>

        <BookingStepIndicator currentStep={currentStep} />

        {/* Render component theo bước hiện tại */}
        {currentStep === 1 && (
          <PersonalInfoStep
            userInfo={userInfo}
            handleUserInfoChange={handleUserInfoChange}
            medicalHistory={medicalHistory}
            handleMedicalHistoryChange={handleMedicalHistoryChange}
            allServices={allServices}
            selectedServices={selectedServices}
            handleServiceChange={handleServiceChange}
            calculateTotalAmount={calculateTotalAmount}
            formatPrice={formatPrice}
            handleNextStep={handleNextStep}
          />
        )}

        {currentStep === 2 && (
          <AppointmentDateStep
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            timeSlots={timeSlots}
            selectedTimeSlot={selectedTimeSlot}
            handleTimeSlotSelect={handleTimeSlotSelect}
            selectedServices={selectedServices}
            formatPrice={formatPrice}
            calculateTotalAmount={calculateTotalAmount}
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
          />
        )}

        {currentStep === 3 && (
          <ConfirmationStep
            userInfo={userInfo}
            selectedDate={selectedDate}
            selectedTimeSlot={selectedTimeSlot}
            selectedServices={selectedServices}
            medicalHistory={medicalHistory}
            formatPrice={formatPrice}
            calculateTotalAmount={calculateTotalAmount}
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
            loading={loading}
            paymentProcessing={paymentProcessing}
          />
        )}

        {currentStep === 4 && isPaymentComplete && appointmentDetails && (
          <CompletionStep
            appointmentDetails={appointmentDetails}
            formatPrice={formatPrice}
            navigate={navigate}
          />
        )}

        <PaymentStatus
          paymentError={paymentError}
          paymentErrorMessage={paymentErrorMessage}
          setPaymentError={setPaymentError}
          paymentMethod={paymentMethod}
          paymentProcessing={paymentProcessing}
          isPaymentComplete={isPaymentComplete}
        />
      </div>
    </div>
  );
};

export default TestAppointmentPage;
