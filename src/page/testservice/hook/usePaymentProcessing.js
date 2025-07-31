import { useState } from "react";
import { format } from "date-fns";
import axiosClient from "../../../services/axiosClient";

export const usePaymentProcessing = ({
  userInfo,
  selectedServices,
  selectedDate,
  selectedTimeSlot,
  calculateTotalAmount,
  appointmentId,
  completeBookingProcess,
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(false);
  const [paymentErrorMessage, setPaymentErrorMessage] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const formatExamTime = (timeSlot) => {
    if (!timeSlot) return "";

    const startTime = timeSlot.split(" - ")[0];

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
      if (!userInfo.user_id)
        throw new Error("Thiếu thông tin user ID - Vui lòng đăng nhập lại");
      if (selectedServices.length === 0) throw new Error("Chưa chọn dịch vụ");
      if (!selectedDate || !selectedTimeSlot)
        throw new Error("Chưa chọn ngày hoặc giờ hẹn");

      const services = selectedServices;
      const totalAmount = calculateTotalAmount();
      const formattedExamTime = formatExamTime(selectedTimeSlot);

      const requestBody = {
        bookingData: {
          appointment_id: appointmentId || null,
          user_id: userInfo.user_id,
          serviceData: services,
          payment_method: "cash",
          exam_date: format(selectedDate, "yyyy-MM-dd"),
          exam_time: formattedExamTime,
        },
      };

      const res = await axiosClient.post(
        "/v1/services/bookingService",
        requestBody,
        { timeout: 15000 }
      );

      if (res && res.data && res.data.success) {
        completeBookingProcess(res.data);
      } else {
        throw new Error("Không thể hoàn tất đặt lịch, vui lòng thử lại");
      }
    } catch (err) {
      console.error("❌ Payment error:", err);

      if (err.response) {
        setPaymentErrorMessage(
          `Lỗi máy chủ (${err.response.status}): ${
            err.response.data?.message || "Vui lòng liên hệ hỗ trợ"
          }`
        );
      } else if (err.request) {
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
    processPayment,
    setPaymentError,
  };
};

export default usePaymentProcessing;
