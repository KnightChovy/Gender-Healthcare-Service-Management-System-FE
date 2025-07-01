import React, { useState, useEffect } from "react";
import Calendar from "../../components/doctor/Calender";
import AppointmentList from "../../components/doctor/AppointmentList";
import { doctorAppointments } from "../../components/Data/Doctor"; // Import từ file có sẵn
import { useSelector } from "react-redux";
import doctorService from "../../services/doctor.service";

const DoctorDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy dữ liệu lịch hẹn từ API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user?.user_id) {
          throw new Error("Không tìm thấy thông tin bác sĩ");
        }

        const response = await doctorService.fetchDoctorAppointmentsById(
          user.user_id
        );

        if (response?.data) {
          setAppointments(response.data);
        } else {
          // Fallback về dữ liệu mock nếu API không trả về dữ liệu
          console.warn("API không trả về dữ liệu, sử dụng dữ liệu mock");
          setAppointments(doctorAppointments || []);
        }
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu lịch hẹn:", err);
        setError(err.message);
        // Fallback về dữ liệu mock khi có lỗi
        setAppointments(doctorAppointments || []);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user?.user_id]);

  // Tính toán thống kê từ dữ liệu thật
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Đếm lịch hẹn hôm nay
  const todayAppointments = appointments.filter((app) => {
    const appDate = new Date(app.date);
    return appDate >= today && appDate < tomorrow;
  });

  // Đếm lịch hẹn tuần này
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Chủ nhật là ngày đầu tuần
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  const weeklyAppointments = appointments.filter((app) => {
    const appDate = new Date(app.date);
    return appDate >= startOfWeek && appDate < endOfWeek;
  });

  // Đếm theo trạng thái
  const completedAppointments = appointments.filter(
    (app) => app.status === "completed" || app.status === "COMPLETED"
  );
  const pendingAppointments = appointments.filter(
    (app) =>
      app.status === "pending" ||
      app.status === "PENDING" ||
      app.status === "confirmed"
  );
  const inProgressAppointments = appointments.filter(
    (app) => app.status === "in_progress" || app.status === "IN_PROGRESS"
  );

  const stats = {
    todayAppointments: todayAppointments.length,
    weeklyAppointments: weeklyAppointments.length,
    completedAppointments: completedAppointments.length,
    pendingAppointments: pendingAppointments.length,
    inProgressAppointments: inProgressAppointments.length,
  };

  // Hàm format giờ cụ thể cho appointment
  const formatAppointmentTime = (timeStart, timeEnd) => {
    if (!timeStart || !timeEnd) return "Chưa xác định";

    const formatTime = (time) => {
      if (time.includes(":")) {
        return time.split(":").slice(0, 2).join(":");
      }
      return time;
    };

    return `${formatTime(timeStart)} - ${formatTime(timeEnd)}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6 max-w-[85rem] mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[85rem] mx-auto">
      {error && (
        <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          <p className="font-medium">Lưu ý:</p>
          <p>Có lỗi khi tải dữ liệu từ server. Hiển thị dữ liệu mẫu.</p>
        </div>
      )}

      <h1 className="text-2xl text-blue-600 font-medium mb-8">
        Xin chào, Bác sĩ {user?.last_name} {user?.first_name}!
      </h1>

      {/* Lịch làm việc hôm nay và tuần này */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Lịch hôm nay */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <i className="fas fa-calendar-day text-blue-600 mr-2"></i>
            Lịch hẹn hôm nay
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {todayAppointments.length > 0 ? (
              todayAppointments.map((appointment) => (
                <div
                  key={appointment.appointment_id}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {appointment.first_name} {appointment.last_name}
                      </p>
                      <p className="text-sm text-blue-600 font-medium">
                        {appointment.appointment_time || "Chưa chọn giờ"}
                      </p>

                      <p className="text-sm text-gray-600">
                        {appointment.consultant_type || "Tư vấn chung"}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        appointment.status === "completed" ||
                        appointment.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "confirmed"
                          ? "bg-blue-100 text-blue-800"
                          : appointment.status === "pending" ||
                            appointment.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {appointment.status === "completed" ||
                      appointment.status === "COMPLETED"
                        ? "Hoàn thành"
                        : appointment.status === "confirmed"
                        ? "Đã xác nhận"
                        : appointment.status === "pending" ||
                          appointment.status === "PENDING"
                        ? "Chờ xác nhận"
                        : appointment.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                Không có lịch hẹn nào hôm nay
              </p>
            )}
          </div>
        </div>

        {/* Lịch tuần này */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <i className="fas fa-calendar-week text-blue-600 mr-2"></i>
            Lịch hẹn tuần này
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {weeklyAppointments.length > 0 ? (
              weeklyAppointments.slice(0, 5).map((appointment) => (
                <div
                  key={appointment.appointment_id}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {appointment.first_name} {appointment.last_name}
                      </p>
                      <p className="text-sm text-blue-600 font-medium">
                        {new Date(appointment.date).toLocaleDateString("vi-VN")}{" "}
                        - {appointment.appointment_time || "Chưa chọn giờ"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {appointment.consultant_type || "Tư vấn chung"}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        appointment.status === "completed" ||
                        appointment.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "confirmed"
                          ? "bg-blue-100 text-blue-800"
                          : appointment.status === "pending" ||
                            appointment.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {appointment.status === "completed" ||
                      appointment.status === "COMPLETED"
                        ? "Hoàn thành"
                        : appointment.status === "confirmed"
                        ? "Đã xác nhận"
                        : appointment.status === "pending" ||
                          appointment.status === "PENDING"
                        ? "Chờ xác nhận"
                        : appointment.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                Không có lịch hẹn nào tuần này
              </p>
            )}
            {weeklyAppointments.length > 5 && (
              <p className="text-sm text-blue-600 text-center py-2">
                Và {weeklyAppointments.length - 5} lịch hẹn khác...
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl text-gray-700 font-medium mb-4 pb-2 border-b border-gray-200">
              Lịch làm việc của tôi
            </h2>
            <Calendar appointments={appointments} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
