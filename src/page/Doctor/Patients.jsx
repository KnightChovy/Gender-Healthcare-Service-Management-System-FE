import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import doctorService from "../../services/doctor.service";

const Patients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchPatients = async () => {
      if (user && user.user_id) {
        try {
          // Lấy tất cả cuộc hẹn của bác sĩ
          const data = await doctorService.fetchDoctorAppointmentsById(
            user.user_id
          );

          if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
            // Xử lý dữ liệu để tạo danh sách bệnh nhân duy nhất từ tất cả cuộc hẹn
            const appointmentsData = data.data;
            const uniquePatients = [];
            const patientMap = new Map();

            appointmentsData.forEach((appointment) => {
              const patientId = appointment.user_id; // Sử dụng user_id thay vì patient_id
              if (!patientMap.has(patientId)) {
                // Tạo thông tin bệnh nhân mới
                const newPatient = {
                  user_id: patientId,
                  appointment_id: appointment.appointment_id,
                  first_name: appointment.first_name || "Chưa có tên",
                  phone: appointment.phone || "Chưa có thông tin",
                  email: appointment.email || "Chưa có email",
                  consultant_type:
                    appointment.consultant_type || "Tư vấn chung",
                  date: appointment.date,
                  appointment_time: appointment.appointment_time,
                  status: appointment.status || "pending",
                  price_apm: appointment.price_apm || "0",
                  booking: appointment.booking || 1,
                  timeslot_id: appointment.timeslot_id,
                  time_start: appointment.time_start,
                  time_end: appointment.time_end,
                  birthday: appointment.birthday || "Chưa có thông tin",
                  visitCount: 1,
                  appointmentHistory: [
                    {
                      appointment_id: appointment.appointment_id,
                      date: appointment.date,
                      appointment_time: appointment.appointment_time,
                      consultant_type: appointment.consultant_type || "Tư vấn",
                      status: appointment.status || "pending",
                      price_apm: appointment.price_apm || "0",
                    },
                  ],
                };

                patientMap.set(patientId, newPatient);
                uniquePatients.push(newPatient);
              } else {
                // Cập nhật thông tin bệnh nhân đã có
                const existingPatient = patientMap.get(patientId);
                existingPatient.visitCount += 1;

                // Cập nhật lần khám gần nhất (so sánh theo date + appointment_time)
                const currentAppointmentDateTime = new Date(
                  `${appointment.date} ${appointment.appointment_time}`
                );
                const existingAppointmentDateTime = new Date(
                  `${existingPatient.date} ${existingPatient.appointment_time}`
                );

                if (currentAppointmentDateTime > existingAppointmentDateTime) {
                  existingPatient.date = appointment.date;
                  existingPatient.appointment_time =
                    appointment.appointment_time;
                  existingPatient.consultant_type =
                    appointment.consultant_type ||
                    existingPatient.consultant_type;
                  existingPatient.status =
                    appointment.status || existingPatient.status;
                  existingPatient.price_apm =
                    appointment.price_apm || existingPatient.price_apm;
                }

                // Thêm vào lịch sử khám
                existingPatient.appointmentHistory.push({
                  appointment_id: appointment.appointment_id,
                  date: appointment.date,
                  appointment_time: appointment.appointment_time,
                  consultant_type: appointment.consultant_type || "Tư vấn",
                  status: appointment.status || "pending",
                  price_apm: appointment.price_apm || "0",
                });
              }
            });

            // Sắp xếp theo lần khám gần nhất
            uniquePatients.sort((a, b) => {
              const dateA = new Date(`${a.date} ${a.appointment_time}`);
              const dateB = new Date(`${b.date} ${b.appointment_time}`);
              return dateB - dateA;
            });

            setPatients(uniquePatients);
          } else {
            // Fallback về mock data nếu không có dữ liệu từ API
            console.log("Không có dữ liệu từ API, sử dụng mock data");
            setPatients(mockPatients);
          }
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu bệnh nhân:", error);
          // Fallback về mock data khi có lỗi
          setPatients(mockPatients);
        }
      } else {
        // Fallback về mock data nếu không có user
        setPatients(mockPatients);
      }
    };

    fetchPatients();
  }, [user?.user_id]);

  console.log("Patients:", patients);

  // Filter patients based on search term
  const filteredPatients = (patients || []).filter(
    (patient) =>
      (patient.first_name &&
        patient.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (patient.phone && patient.phone.includes(searchTerm)) ||
      (patient.email &&
        patient.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (patient.consultant_type &&
        patient.consultant_type
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
  );

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có thông tin";
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  // Format time
  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString.substring(0, 5); // Lấy HH:MM từ HH:MM:SS
  };

  // Format price
  const formatPrice = (price) => {
    if (!price) return "0";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(parseFloat(price));
  };

  // Get status text in Vietnamese
  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "completed":
        return "Hoàn thành";
      case "rejected":
        return "Đã hủy";
      case "pending":
        return "Chờ xác nhận";
      default:
        return status;
    }
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // View patient details
  const viewPatientDetails = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  return (
    <div className="space-y-6">
      {/* Header and search */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Danh sách bệnh nhân
          </h1>
          <div className="mt-4 md:mt-0 w-full md:w-1/3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Tìm kiếm theo tên, SĐT, email, loại tư vấn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* List of patients */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {filteredPatients.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <i className="fas fa-user-slash text-3xl mb-2"></i>
            <p>Không tìm thấy bệnh nhân nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bệnh nhân
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Liên hệ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại tư vấn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lần khám gần nhất
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
                {filteredPatients.map((patient, index) => (
                  <tr
                    key={patient.user_id || `patient-${index}`}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                            {patient.first_name
                              ? patient.first_name.charAt(0).toUpperCase()
                              : "U"}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {patient.first_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {patient.user_id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {patient.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {patient.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {patient.consultant_type}
                      </div>
                      <div className="text-xs text-gray-500">
                        {patient.visitCount} lần khám
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{formatDate(patient.date)}</div>
                      <div className="text-xs">
                        {formatTime(patient.appointment_time)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusBadge(
                          patient.status
                        )}`}
                      >
                        {getStatusText(patient.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => viewPatientDetails(patient)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Patient details modal */}
      {isModalOpen && selectedPatient && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-medium text-gray-900">
                Thông tin chi tiết bệnh nhân
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
                {/* Patient Avatar and Basic Info */}
                <div className="lg:col-span-1">
                  <div className="text-center">
                    <div className="aspect-square w-32 h-32 rounded-full bg-blue-200 flex items-center justify-center text-4xl text-blue-700 mx-auto mb-4">
                      <i className="fas fa-user"></i>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-1">
                      {selectedPatient.first_name}
                    </h2>
                    <p className="text-gray-600 mb-4">
                      ID: {selectedPatient.user_id}
                    </p>

                    <div className="bg-gray-50 rounded-lg p-4 text-left">
                      <h4 className="font-medium text-gray-900 mb-3">
                        Thống kê
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tổng lượt khám:</span>
                          <span className="font-medium">
                            {selectedPatient.visitCount}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Khám gần nhất:</span>
                          <span className="font-medium">
                            {formatDate(selectedPatient.date)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tổng chi phí:</span>
                          <span className="font-medium">
                            {selectedPatient.appointmentHistory
                              ? formatPrice(
                                  selectedPatient.appointmentHistory.reduce(
                                    (total, apt) =>
                                      total + parseFloat(apt.price_apm || 0),
                                    0
                                  )
                                )
                              : formatPrice(selectedPatient.price_apm)}
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
                        Thông tin liên hệ
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <div className="w-24 text-gray-500 text-sm">
                            Họ tên:
                          </div>
                          <div className="text-gray-900 font-medium">
                            {selectedPatient.first_name}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-24 text-gray-500 text-sm">
                            Mã BN:
                          </div>
                          <div className="text-gray-900 font-medium">
                            {selectedPatient.user_id}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-24 text-gray-500 text-sm">
                            Điện thoại:
                          </div>
                          <div className="text-gray-900 font-medium">
                            {selectedPatient.phone}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-24 text-gray-500 text-sm">
                            Email:
                          </div>
                          <div className="text-gray-900 font-medium">
                            {selectedPatient.email}
                          </div>
                        </div>
                        <div className="md:col-span-2 flex items-start">
                          <div className="w-24 text-gray-500 text-sm">
                            Tư vấn hiện tại:
                          </div>
                          <div className="text-gray-900 font-medium">
                            {selectedPatient.consultant_type}
                          </div>
                        </div>
                        <div className="md:col-span-2 flex items-start">
                          <div className="w-24 text-gray-500 text-sm">
                            Ngày sinh:
                          </div>
                          <div className="text-gray-900 font-medium">
                            {selectedPatient.birthday}
                          </div>
                        </div>
                        <div className="md:col-span-2 flex items-center">
                          <div className="w-24 text-gray-500 text-sm">
                            Trạng thái:
                          </div>
                          <span
                            className={`ml-2 px-3 py-1 text-sm rounded-full font-medium ${getStatusBadge(
                              selectedPatient.status
                            )}`}
                          >
                            {getStatusText(selectedPatient.status)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Appointment History */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">
                        Lịch sử khám bệnh
                      </h4>
                      <div className="bg-gray-50 rounded-lg overflow-hidden">
                        <div className="max-h-64 overflow-y-auto">
                          {selectedPatient.appointmentHistory &&
                          selectedPatient.appointmentHistory.length > 0 ? (
                            <div className="divide-y divide-gray-200">
                              {selectedPatient.appointmentHistory.map(
                                (appointment, index) => (
                                  <div
                                    key={index}
                                    className="p-4 hover:bg-gray-100"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <div className="font-medium text-gray-900">
                                          {appointment.consultant_type}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                          {formatDate(appointment.date)} -{" "}
                                          {formatTime(
                                            appointment.appointment_time
                                          )}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                          Mã cuộc hẹn:{" "}
                                          {appointment.appointment_id}
                                        </div>
                                      </div>
                                      <div className="text-right ml-4">
                                        <span
                                          className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusBadge(
                                            appointment.status
                                          )}`}
                                        >
                                          {getStatusText(appointment.status)}
                                        </span>
                                        <div className="text-sm font-medium text-gray-900 mt-1">
                                          {formatPrice(appointment.price_apm)}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          ) : (
                            <div className="p-4 text-center text-gray-500">
                              Chưa có lịch sử khám bệnh
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  // Chuyển đến trang nhập kết quả tư vấn với thông tin bệnh nhân
                  navigate(`/doctor/consultation-result/${selectedPatient.appointment_id}`);
                  closeModal();
                }}
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <i className="fas fa-calendar-plus mr-2"></i>
                Nhập kết quả tư vấn
              </button>
              <button
                onClick={() => {
                  // TODO: Chuyển đến trang hồ sơ bệnh án
                  closeModal();
                }}
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                <i className="fas fa-file-medical mr-2"></i>
                Xem hồ sơ bệnh án
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
