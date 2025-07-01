import { useEffect, useState } from "react";
import doctorService from "../../services/doctor.service";
import { useSelector } from "react-redux";

const AppointmentList = ({ appointments: propAppointments }) => {
  const [appointments, setAppointments] = useState([]);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Nếu có appointments được truyền từ props, sử dụng nó
    if (propAppointments && propAppointments.length > 0) {
      setAppointments(propAppointments);
    } else {
      // Nếu không, fetch từ API
      const fetchAppointments = async () => {
        try {
          const data = await doctorService.fetchDoctorAppointmentsById(
            user.user_id
          );
          setAppointments(data.data || []);
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu lịch hẹn:", error);
          setAppointments([]);
        }
      };

      fetchAppointments();
    }
  }, [user.user_id, propAppointments]);

  // Sắp xếp lịch hẹn theo ngày và giờ
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (dateA.getTime() === dateB.getTime()) {
      // Nếu cùng ngày, sắp xếp theo giờ bắt đầu
      const timeA = a.time_start || "00:00";
      const timeB = b.time_start || "00:00";
      return timeA.localeCompare(timeB);
    }
    return dateA - dateB;
  });

  // Lọc lịch hẹn sắp tới (chỉ hiển thị trạng thái PENDING, confirmed, completed)
  const upcomingAppointments = sortedAppointments.filter((app) => {
    const appointmentDate = new Date(app.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
      appointmentDate >= today &&
      (app.status === "pending" ||
        app.status === "PENDING" ||
        app.status === "confirmed" ||
        app.status === "completed" ||
        app.status === "COMPLETED")
    );
  });

  // Hàm format giờ cụ thể
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

  // Định dạng ngày để hiển thị
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  };

  // Lấy class cho trạng thái
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
      case "canceled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Chuyển đổi trạng thái sang tiếng Việt
  const translateStatus = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "Đã hoàn thành";
      case "cancelled":
      case "canceled":
        return "Đã hủy";
      case "pending":
        return "Chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "in_progress":
        return "Đang thực hiện";
      default:
        return status || "Không xác định";
    }
  };

  return (
    <div className="max-h-[400px] overflow-y-auto">
      {upcomingAppointments.length === 0 ? (
        <p className="text-center text-gray-500 py-6">
          Không có lịch hẹn sắp tới
        </p>
      ) : (
        upcomingAppointments.slice(0, 5).map((appointment) => (
          <div
            key={appointment.appointment_id}
            className="flex items-center py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
          >
            <div className="text-center px-3 py-2 bg-blue-50 rounded text-sm text-blue-700 min-w-[120px]">
              <div className="font-medium">{formatDate(appointment.date)}</div>
              <div className="text-xs">
                {formatAppointmentTime(
                  appointment.time_start,
                  appointment.time_end
                )}
              </div>
            </div>

            <div className="flex-1 px-4">
              <h3 className="font-medium text-gray-800">
                {appointment.first_name} {appointment.last_name}
              </h3>
              <p className="text-sm text-gray-600">
                {appointment.consultant_type || "Tư vấn chung"}
              </p>
              <span
                className={`inline-block text-xs px-2 py-1 rounded-full mt-1 ${getStatusClass(
                  appointment.status
                )}`}
              >
                {translateStatus(appointment.status)}
              </span>
            </div>

            <div className="flex gap-2">
              {appointment.status === "confirmed" &&
                appointment.google_meet_link && (
                  <a
                    href={appointment.google_meet_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-1"
                  >
                    <i className="fas fa-video text-xs"></i>
                    Meet
                  </a>
                )}
              <button className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                Chi tiết
              </button>
            </div>
          </div>
        ))
      )}
      {upcomingAppointments.length > 5 && (
        <div className="text-center py-3 border-t border-gray-100">
          <p className="text-sm text-blue-600">
            Và {upcomingAppointments.length - 5} lịch hẹn khác...
          </p>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
