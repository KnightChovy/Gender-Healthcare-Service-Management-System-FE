import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
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
  const navigate = useNavigate();
  const location = useLocation();
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Hiển thị thông báo success nếu có
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      setShowSuccessMessage(true);

      // Ẩn thông báo sau 5 giây
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
        setSuccessMessage("");
      }, 5000);

      // Clear location state
      navigate(location.pathname, { replace: true });

      return () => clearTimeout(timer);
    }
  }, [location.state, navigate, location.pathname]);

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

  // Format appointment time - chỉ hiển thị giờ cụ thể
  const formatAppointmentTime = (timeStr) => {
    if (!timeStr) return "Chưa xác định";

    // Nếu là khung giờ (có dấu -), chỉ lấy giờ bắt đầu
    if (timeStr.includes(" - ")) {
      const [startTime] = timeStr.split(" - ");
      return startTime;
    }

    return timeStr;
  };

  // Lấy khung giờ làm việc dựa trên giờ hẹn
  const getWorkingPeriod = (timeStr) => {
    if (!timeStr) return "";

    const hour = parseInt(timeStr.split(":")[0]);

    if (hour >= 7 && hour < 12) {
      return "Ca sáng (07:30 - 11:30)";
    } else if (hour >= 13 && hour < 17) {
      return "Ca chiều (13:00 - 17:00)";
    } else {
      return "Ngoài giờ hành chính";
    }
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
        const request =
          await doctorService.fetchEmailRequestAppointmentFeedback(
            appointmentId
          );
        console.log("Email request feedback:", request);
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

  // View appointment details
  const viewAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  // Format price
  const formatPrice = (price) => {
    if (!price) return "0";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(parseFloat(price));
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="p-6 max-w-[85rem] mx-auto">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <i className="fas fa-check-circle text-green-600 mr-2"></i>
            <span className="text-green-800 text-sm font-medium">
              {successMessage}
            </span>
            <button
              onClick={() => setShowSuccessMessage(false)}
              className="ml-auto text-green-600 hover:text-green-800"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}

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

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bệnh nhân
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày & Giờ hẹn
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
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
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
                      <div className="text-sm text-gray-900 font-medium">
                        {appointment.date}
                      </div>
                      <div className="text-sm text-blue-600 font-semibold">
                        {formatAppointmentTime(appointment.appointment_time)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getWorkingPeriod(appointment.appointment_time)}
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
                        {appointment.status === "pending" &&
                          "Đang chờ xác nhận"}
                        {appointment.status === "completed" && "Đã hoàn thành"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => viewAppointmentDetails(appointment)}
                        >
                          Chi tiết
                        </button>

                        {appointment.status === "confirmed" && (
                          <>
                            <button
                              className={`ml-2 ${
                                !isToday(appointment.date)
                                  ? "opacity-50 "
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
                              href="https://meet.google.com/gzq-fqau-uix"
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

        {/* Modal chi tiết cuộc hẹn */}
        {isModalOpen && selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
                <h3 className="text-xl font-medium text-gray-900">
                  Chi tiết cuộc hẹn tư vấn
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Appointment Info */}
                  <div className="lg:col-span-1">
                    <div className="text-center">
                      <div className="aspect-square w-32 h-32 rounded-full bg-blue-200 flex items-center justify-center text-4xl text-blue-700 mx-auto mb-4">
                        <i className="fas fa-calendar-alt"></i>
                      </div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-1">
                        {selectedAppointment.first_name}{" "}
                        {selectedAppointment.last_name}
                      </h2>
                      <p className="text-gray-600 mb-4">
                        Mã cuộc hẹn: {selectedAppointment.appointment_id}
                      </p>

                      <div className="bg-gray-50 rounded-lg p-4 text-left">
                        <h4 className="font-medium text-gray-900 mb-3">
                          Thông tin cuộc hẹn
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Ngày hẹn:</span>
                            <span className="font-medium">
                              {formatDate(selectedAppointment.date)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Giờ hẹn:</span>
                            <span className="font-medium">
                              {formatAppointmentTime(
                                selectedAppointment.appointment_time
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Ca làm việc:</span>
                            <span className="font-medium text-xs">
                              {getWorkingPeriod(
                                selectedAppointment.appointment_time
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Chi phí:</span>
                            <span className="font-medium">
                              {formatPrice(selectedAppointment.price_apm)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Patient Details */}
                  <div className="lg:col-span-2">
                    <div className="space-y-6">
                      {/* Personal Information */}
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-4">
                          Thông tin bệnh nhân
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center">
                            <div className="w-24 text-gray-500 text-sm">
                              Họ tên:
                            </div>
                            <div className="text-gray-900 font-medium">
                              {selectedAppointment.first_name}{" "}
                              {selectedAppointment.last_name}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-24 text-gray-500 text-sm">
                              Mã BN:
                            </div>
                            <div className="text-gray-900 font-medium">
                              {selectedAppointment.user_id}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-24 text-gray-500 text-sm">
                              Điện thoại:
                            </div>
                            <div className="text-gray-900 font-medium">
                              {selectedAppointment.phone}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-24 text-gray-500 text-sm">
                              Email:
                            </div>
                            <div className="text-gray-900 font-medium">
                              {selectedAppointment.email}
                            </div>
                          </div>
                          <div className="md:col-span-2 flex items-start">
                            <div className="w-24 text-gray-500 text-sm">
                              Dịch vụ:
                            </div>
                            <div className="text-gray-900 font-medium">
                              {selectedAppointment.serviceName ||
                                selectedAppointment.consultant_type}
                            </div>
                          </div>
                          <div className="md:col-span-2 flex items-center">
                            <div className="w-24 text-gray-500 text-sm">
                              Trạng thái:
                            </div>
                            <span
                              className={`ml-2 px-3 py-1 text-sm rounded-full font-medium ${getStatusClass(
                                selectedAppointment.status
                              )}`}
                            >
                              {selectedAppointment.status === "confirmed" &&
                                "Đã được xác nhận, chờ thực hiện"}
                              {selectedAppointment.status === "rejected" &&
                                "Đã hủy"}
                              {selectedAppointment.status === "pending" &&
                                "Đang chờ xác nhận"}
                              {selectedAppointment.status === "completed" &&
                                "Đã hoàn thành"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Additional Information */}
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-4">
                          Thông tin thêm
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Ngày tạo:</span>
                              <span className="font-medium">
                                {formatDate(selectedAppointment.created_at)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Bác sĩ:</span>
                              <span className="font-medium">
                                {selectedAppointment.doctor_id}
                              </span>
                            </div>
                            {selectedAppointment.time_start && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Khung giờ:
                                </span>
                                <span className="font-medium">
                                  {formatAppointmentTime(
                                    selectedAppointment.time_start
                                  )}{" "}
                                  -{" "}
                                  {formatAppointmentTime(
                                    selectedAppointment.time_end
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Đóng
                  </button>

                  {selectedAppointment.status === "confirmed" && (
                    <>
                      <button
                        onClick={() => {
                          closeModal();
                          navigate(
                            `/doctor/consultation-result/${selectedAppointment.appointment_id}`
                          );
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                      >
                        Nhập kết quả tư vấn
                      </button>

                      {isToday(selectedAppointment.date) && (
                        <button
                          onClick={() => {
                            closeModal();
                            handleStatusChange(
                              selectedAppointment.appointment_id
                            );
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                        >
                          Hoàn thành cuộc hẹn
                        </button>
                      )}
                    </>
                  )}

                  {selectedAppointment.status === "completed" && (
                    <button
                      onClick={() => {
                        closeModal();
                        navigate(
                          `/doctor/consultation-result/${selectedAppointment.appointment_id}`
                        );
                      }}
                      className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700"
                    >
                      Xem kết quả tư vấn
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;
