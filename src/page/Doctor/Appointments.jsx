import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import doctorService from "../../services/doctor.service";
import axiosClient from "../../services/axiosClient";

// Mock data for doctor appointments

const isToday = (dateStr) => {
  const today = new Date();
  const target = new Date(dateStr);
  return (
    target.getDate() === today.getDate() &&
    target.getMonth() === today.getMonth() &&
    target.getFullYear() === today.getFullYear()
  );
};


const DoctorAppointments = () => {
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (user && user.user_id) {
        try {
          // Lấy ngày hiện tại khi component được mount
          const data = await doctorService.fetchDoctorAppointmentsById(
            user.user_id
          );
          setDoctorAppointments(data.data);
        } catch (error) {
          console.error("Error fetching appointments:", error);
        }
      }
    };

    fetchAppointments();
  }, [user?.user_id]);
  console.log("DoctorAppointments:", doctorAppointments);

  // Filter appointments by status and search term
  const filteredAppointments = doctorAppointments.filter((app) => {
    const matchesStatus = filterStatus === "ALL" || app.status === filterStatus;
    const matchesSearch =
      (app.first_name &&
        app.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (app.last_name &&
        app.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (app.serviceName &&
        app.serviceName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  // Status color mapping
  const getStatusClass = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date-time
  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle status change
  const handleStatusChange = async (appointmentId) => {
    try {
      console.log("Đang cập nhật trạng thái cho appointment:", appointmentId);

      const appointment = {
        appointment_id: appointmentId,
        status: "completed", // Cập nhật trạng thái thành "completed"
        doctor_id: user.user_id, // Thêm ID bác sĩ để xác định
      };

      const res = await doctorService.fetchDoctorAppointmentsCompleted(
        user.user_id,
        appointment
      );

      console.log("Kết quả từ API:", res);

      if (res) {
        // Cập nhật state local với ID đúng
        setDoctorAppointments((prevAppointments) =>
          prevAppointments.map((app) =>
            app.appointment_id === appointmentId || app.id === appointmentId
              ? { ...app, status: "completed" }
              : app
          )
        );

        alert("Đã hoàn thành cuộc hẹn thành công!");
      } else {
        throw new Error(res?.message || "Cập nhật không thành công");
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
      alert(
        "Lỗi khi cập nhật trạng thái: " + (error.message || "Đã xảy ra lỗi")
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Quản lý lịch hẹn tư vấn
      </h1>

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Tìm kiếm theo tên bệnh nhân hoặc dịch vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div>
          <select
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:border-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="pending">Đang chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận, chờ thực hiện</option>
            <option value="rejected">Đã hủy</option>
            <option value="completed">Đã hoàn thành</option>
          </select>
        </div>
      </div>

      {/* Appointments table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bệnh nhân
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời gian
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dịch vụ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  Không tìm thấy lịch hẹn nào
                </td>
              </tr>
            ) : (
              filteredAppointments.map((appointment) => (
                <tr key={appointment.appointment_id || appointment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          {appointment.first_name
                            ? appointment.first_name.charAt(0)
                            : "N"}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.first_name} {appointment.last_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {appointment.date}
                    </div>
                    <div className="text-xs text-gray-500">
                      {appointment.appointment_time}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {appointment.serviceName || appointment.consultant_type}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                        appointment.status
                      )}`}
                    >
                      {appointment.status === "confirmed" &&
                        "Đã được xác nhận, chờ thực hiện"}
                      {appointment.status === "rejected" && "Đã hủy"}
                      {appointment.status === "pending" && "Đang chờ xác nhận"}
                      {appointment.status === "completed" && "Đã hoàn thành"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button
                        className="text-indigo-600 hover:text-indigo-900"
                        onClick={() =>
                          alert(
                            `Xem chi tiết cuộc hẹn với ${appointment.first_name} ${appointment.last_name}`
                          )
                        }
                      >
                        Chi tiết
                      </button>

                      {appointment.status === "confirmed" && (
                        <>
                          <button
                            className={`ml-10 mr-0 ${
                              !isToday(appointment.date)
                                ? "opacity-50 cursor-not-allowed"
                                : "text-green-600 hover:text-green-900"
                            }`}
                            disabled={!isToday(appointment.date)}
                            onClick={() =>
                              handleStatusChange(appointment.appointment_id)
                            }
                          >
                            Hoàn thành
                          </button>

                          <a
                            href="https://meet.google.com/ymf-dwbi-uhy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`ml-4 ${
                              !isToday(appointment.date)
                                ? "text-blue-300 pointer-events-none"
                                : "text-blue-600 hover:text-blue-900"
                            }`}
                          >
                            Vào Google Meet
                          </a>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorAppointments;
