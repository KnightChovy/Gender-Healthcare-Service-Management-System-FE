import { useEffect, useState } from "react";
import doctorService from "../../services/doctor.service";
import { useSelector } from "react-redux";

const AppointmentList = ({}) => {
  const [appointments, setAppointments] = useState([]);
  const { user } = useSelector((state) => state.auth);

  useEffect(async () => {
    // Lấy ngày hiện tại khi component được mount
    const data = await doctorService.fetchDoctorAppointmentsById(user.user_id);
    setAppointments(data.data);
  }, []);
  // Sắp xếp lịch hẹn theo ngày và giờ
  const sortedAppointments = [...appointments].sort(
    (a, b) => new Date(a.startTime) - new Date(b.startTime)
  );

  // Lọc lịch hẹn sắp tới (chỉ hiển thị trạng thái PENDING)
  const upcomingAppointments = sortedAppointments.filter(
    (app) => app.status === "PENDING"
  );

  // Định dạng ngày giờ để hiển thị
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString("vi-VN", {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Lấy class cho trạng thái
  const getStatusClass = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-50 text-green-700";
      case "CANCELLED":
        return "bg-red-50 text-red-700";
      case "PENDING":
        return "bg-yellow-50 text-yellow-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  // Chuyển đổi trạng thái sang tiếng Việt
  const translateStatus = (status) => {
    switch (status) {
      case "COMPLETED":
        return "Đã hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      case "PENDING":
        return "Đang chờ";
      default:
        return status;
    }
  };

  return (
    <div className="max-h-[400px] overflow-y-auto">
      {upcomingAppointments.length === 0 ? (
        <p className="text-center text-gray-500 py-6">
          Không có lịch hẹn sắp tới
        </p>
      ) : (
        upcomingAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="flex items-center py-4 border-b border-gray-100 last:border-b-0"
          >
            <div className="text-center px-3 py-2 bg-gray-100 rounded text-sm text-gray-700 min-w-[80px]">
              {formatDateTime(appointment.startTime)}
            </div>

            <div className="flex-1 px-4">
              <h3 className="font-medium text-gray-800">
                {appointment.patientName}
              </h3>
              <p className="text-sm text-gray-600">{appointment.serviceName}</p>
              <span
                className={`inline-block text-xs px-2 py-1 rounded-full mt-1 ${getStatusClass(
                  appointment.status
                )}`}
              >
                {translateStatus(appointment.status)}
              </span>
            </div>

            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                Chi tiết
              </button>
              <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                Hoàn thành
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AppointmentList;
