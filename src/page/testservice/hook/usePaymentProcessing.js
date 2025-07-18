import { useState } from "react";
import { format } from "date-fns";
import axiosClient from "../../../services/axiosClient";

export const usePaymentProcessing = ({
  userInfo,
  selectedServices,
  selectedDate,
  selectedTimeSlot,
  medicalHistory,
  calculateTotalAmount,
  appointmentId,
  completeBookingProcess,
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(false);
  const [paymentErrorMessage, setPaymentErrorMessage] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState(null);

  // Hàm format thời gian từ "13:30 - 14:00" thành "13:30:00"
  const formatExamTime = (timeSlot) => {
    if (!timeSlot) return "";
    
    // Tách lấy phần thời gian bắt đầu (trước dấu " - ")
    const startTime = timeSlot.split(" - ")[0];
    
    // Thêm :00 nếu chưa có giây
    if (startTime.split(":").length === 2) {
      return `${startTime}:00`;
    }
    
    return startTime;
  };

  // Hàm xử lý thanh toán
  const processPayment = async () => {
    setLoading(true);
    setPaymentError(false);
    setPaymentProcessing(true);

    try {
      // Kiểm tra dữ liệu
      if (!userInfo.user_id) {
        throw new Error("Thiếu thông tin user ID - Vui lòng đăng nhập lại");
      }

      if (selectedServices.length === 0) {
        throw new Error("Chưa chọn dịch vụ");
      }

      if (!selectedDate || !selectedTimeSlot) {
        throw new Error("Chưa chọn ngày hoặc giờ hẹn");
      }

      // Format dữ liệu
      const serviceId = selectedServices.map((ser) => ({
        service_id: ser.service_id,
      }));

      const totalAmount = calculateTotalAmount();
      const paymentMethod = "cash";
      const formattedExamTime = formatExamTime(selectedTimeSlot);

      localStorage.setItem(
        "currentPaymentSession",
        JSON.stringify({
          sessionId: `session_${Date.now()}`,
          appointmentId: appointmentId || null,
          amount: Math.floor(totalAmount),
          paymentMethod: paymentMethod,
          createdAt: new Date().toISOString(),
          status: "pending",
          appointmentData: {
            user_id: userInfo.user_id,
            appointment_date: format(selectedDate, "yyyy-MM-dd"),
            appointment_time: formattedExamTime,
            services: selectedServices,
            medical_history: medicalHistory,
            price_apm: Math.floor(totalAmount),
          },
        })
      );

      // Thanh toán tiền mặt
      const requestBody = {
        bookingData: {
          appointment_id: appointmentId || null,
          user_id: userInfo.user_id,
          serviceData: serviceId,
          payment_method: paymentMethod,
          exam_date: format(selectedDate, "yyyy-MM-dd"),
          exam_time: formattedExamTime,
        },
      };

      const res = await axiosClient.post(
        "/v1/services/bookingService",
        requestBody,
        { timeout: 15000 }
      );
      // console.log(res.data.data.order.order_id);

      if (res && res.data && res.data.success) {
        completeBookingProcess(res.data);
      } else {
        throw new Error("Không thể hoàn tất đặt lịch, vui lòng thử lại");
      }
    } catch (err) {
      console.error("❌ Payment error:", err);

      if (err.response) {
        // Lỗi từ server
        setPaymentErrorMessage(
          `Lỗi máy chủ (${err.response.status}): ${
            err.response.data?.message || "Vui lòng liên hệ hỗ trợ"
          }`
        );
      } else if (err.request) {
        // Không nhận được phản hồi
        setPaymentErrorMessage(
          "Không nhận được phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng."
        );
      } else {
        setPaymentErrorMessage(`Lỗi: ${err.message}`);
      }

      setPaymentError(true);
    } finally {
      setLoading(false);
      setPaymentProcessing(false);
    }
  };

  return {
    loading,
    paymentError,
    paymentErrorMessage,
    paymentProcessing,
    webhookStatus,
    processPayment,
    setPaymentError,
  };
};

export default usePaymentProcessing;