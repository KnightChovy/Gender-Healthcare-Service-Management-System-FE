import { useState } from "react";
import { format } from "date-fns";
import axiosClient from "../../../services/axiosClient";

export const usePaymentProcessing = ({
  userInfo,
  selectedServices,
  selectedDate,
  selectedTimeSlot,
  medicalHistory,
  paymentMethod,
  calculateTotalAmount,
  appointmentId,
  completeBookingProcess,
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(false);
  const [paymentErrorMessage, setPaymentErrorMessage] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState(null);

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

      // Lưu session thanh toán vào localStorage
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
            appointment_time: selectedTimeSlot,
            services: selectedServices,
            medical_history: medicalHistory,
            price_apm: Math.floor(totalAmount),
          },
        })
      );

      if (paymentMethod === "cash") {
        // Thanh toán tiền mặt
        const requestBody = {
          bookingData: {
            appointment_id: appointmentId || null,
            user_id: userInfo.user_id,
            serviceData: serviceId,
            payment_method: paymentMethod,
            appointment_date: format(selectedDate, "yyyy-MM-dd"),
            appointment_time: selectedTimeSlot,
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
      } else if (paymentMethod === "vnpay") {
        // Thanh toán VNPay
        const accessToken = localStorage.getItem("accessToken");

        const paymentData = {
          user_id: parseInt(userInfo.user_id),
          price: Math.floor(totalAmount),
          appointment_id: appointmentId || null,
          serviceData: serviceId,
          appointment_date: format(selectedDate, "yyyy-MM-dd"),
          appointment_time: selectedTimeSlot,
        };

        const response = await axiosClient.post(
          "/v2/payment/create-checkout-session",
          paymentData,
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": accessToken,
            },
          }
        );

        if (!response.data || !response.data.url) {
          throw new Error("Không nhận được URL thanh toán từ máy chủ");
        }

        // Chuyển hướng đến trang thanh toán
        window.location.href = response.data.url;
        return;
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
