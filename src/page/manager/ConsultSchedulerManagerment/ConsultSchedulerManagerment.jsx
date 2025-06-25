import React, { useEffect, useState } from "react";
import {
  API_MANAGER_APPOINTMENT,
  API_PAYMENT_REMINDER,
} from "../../../constants/Apis";
import axiosClient from "../../../services/axiosClient";
import { toast } from "react-toastify";

export const ConsultSchedulerManagerment = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await axiosClient.get(API_MANAGER_APPOINTMENT);
        console.log(res);

        if (res.data.success) {
          setAppointments(res.data.data);
        } else {
          setError(res.data.message || "Không thể tải lịch hẹn");
        }
      } catch (error) {
        setError(`Lỗi kết nối: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, []);
  const handleApproved = async (appointment_id) => {
    try {
      const res = await axiosClient.patch(
        `${API_MANAGER_APPOINTMENT}/${appointment_id}/approve`,
        { status: "confirmed" }
      );
      if (res.data.success) {
        setAppointments(
          appointments.map((apt) =>
            apt.appointment_id === appointment_id
              ? { ...apt, status: "confirmed" }
              : apt
          )
        );
        try {
          const resEmail = await axiosClient.post(API_PAYMENT_REMINDER, {
            appointment_id,
          });
          console.log(resEmail);

          if (resEmail.data?.data?.emailSent) {
            toast.success(
              `Đã gửi email xác nhận thanh toán đến ${resEmail.data.data.sentTo}`
            );
          } else {
            toast.warning("Cập nhật thành công nhưng không thể gửi email.");
          }
        } catch (emailErr) {
          toast.error("Không thể gửi email xác nhận.");
          console.error("Lỗi gửi email:", emailErr);
        }
      }
    } catch (error) {
      setError(`Không thể cập nhật trạng thái: ${error.message}`);
    }
  };
  const handleRejected = async (appointment_id) => {
    try {
      const res = await axiosClient.patch(
        `${API_MANAGER_APPOINTMENT}/${appointment_id}/approve`,
        { status: "rejected" }
      );
      if (res.data.success) {
        setAppointments(
          appointments.map((apt) =>
            apt.appointment_id === appointment_id
              ? { ...apt, status: "rejected" }
              : apt
          )
        );
      }
    } catch (error) {
      setError(`Không thể cập nhật trạng thái: ${error.message}`);
    }
  };
  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Đã xác nhận
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            Đã từ chối
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Đang chờ
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Quản Lý Lịch Hẹn Tư Vấn
      </h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Họ và tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian đặt lịch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại tư vấn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bác sĩ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    Không có lịch hẹn nào
                  </td>
                </tr>
              ) : (
                appointments.map((apt, index) => (
                  <tr
                    key={apt.appointment_id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {apt.appointment_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {apt.appointments_user.last_name +
                        " " +
                        apt.appointments_user.first_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {apt.appointment_time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {apt.consultant_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {apt.doctor_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex flex-col space-y-2">
                        <div>{getStatusBadge(apt.status)}</div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApproved(apt.appointment_id)}
                            disabled={apt.status !== "pending"}
                            className={`px-3 py-1 text-xs font-medium rounded ${
                              apt.status !== "pending"
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-green-600 text-white hover:bg-green-700 transition-colors"
                            }`}
                          >
                            Xác nhận
                          </button>
                          <button
                            onClick={() => handleRejected(apt.appointment_id)}
                            disabled={apt.status !== "pending"}
                            className={`px-3 py-1 text-xs font-medium rounded ${
                              apt.status !== "pending"
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-red-600 text-white hover:bg-red-700 transition-colors"
                            }`}
                          >
                            Từ chối
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
