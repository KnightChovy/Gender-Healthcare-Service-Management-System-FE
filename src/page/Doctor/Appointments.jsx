import React, { useState } from "react";

// Mock data for doctor appointments
const doctorAppointments = [
  {
    id: 1,
    patientId: "P001",
    patientName: "Nguyễn Thị An",
    startTime: "2025-06-15T08:00:00",
    endTime: "2025-06-15T09:00:00",
    serviceName: "Khám sức khỏe tiền hôn nhân",
    status: "PENDING",
    notes: "Sưng, mủ và đau ở bẹn hạch.",
  },
  {
    id: 2,
    patientId: "P002",
    patientName: "Trần Văn Bình",
    startTime: "2025-06-15T09:30:00",
    endTime: "2025-06-15T10:30:00",
    serviceName: "Khám sức khỏe tiền hôn nhân",
    status: "PENDING",
  },
  {
    id: 3,
    patientId: "P003",
    patientName: "Lê Thị Cúc",
    startTime: "2025-06-14T14:00:00",
    endTime: "2025-06-14T15:00:00",
    serviceName: "Khám sức khỏe tiền hôn nhân",
    status: "COMPLETED",
    notes: "Sưng và đau ở đầu dương vật, cũng như tinh hoàn.  ",
  },
  {
    id: 4,
    patientId: "P004",
    patientName: "Phạm Văn Đạt",
    startTime: "2025-06-14T10:00:00",
    endTime: "2025-06-14T11:00:00",
    serviceName: "Khám sức khỏe tiền hôn nhân",
    status: "CANCELLED",
  },
  {
    id: 5,
    patientId: "P005",
    patientName: "Hoàng Thị Em",
    startTime: "2025-06-16T08:00:00",
    endTime: "2025-06-16T09:00:00",
    serviceName: "Khám sức khỏe tiền hôn nhân",
    status: "PENDING",
    notes: "Thai 5 tháng, siêu âm 4D",
  },
];

const Appointments = () => {
  const [appointments, setAppointments] = useState(doctorAppointments || []);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter appointments by status and search term
  const filteredAppointments = appointments.filter((app) => {
    const matchesStatus = filterStatus === "ALL" || app.status === filterStatus;
    const matchesSearch =
      app.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Status color mapping
  const getStatusClass = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
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
  const handleStatusChange = (id, newStatus) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((app) =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Quản lý lịch hẹn
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
            <option value="PENDING">Đang chờ</option>
            <option value="COMPLETED">Đã hoàn thành</option>
            <option value="CANCELLED">Đã hủy</option>
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
                <tr key={appointment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          {appointment.patientName.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.patientName}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {appointment.patientId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDateTime(appointment.startTime)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Đến {formatDateTime(appointment.endTime).split(",")[1]}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {appointment.serviceName}
                    </div>
                    {appointment.notes && (
                      <div className="text-xs text-gray-500">
                        {appointment.notes}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                        appointment.status
                      )}`}
                    >
                      {appointment.status === "COMPLETED" && "Đã hoàn thành"}
                      {appointment.status === "CANCELLED" && "Đã hủy"}
                      {appointment.status === "PENDING" && "Đang chờ"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button
                        className="text-indigo-600 hover:text-indigo-900"
                        onClick={() =>
                          alert(
                            `Xem chi tiết cuộc hẹn với ${appointment.patientName}`
                          )
                        }
                      >
                        Chi tiết
                      </button>

                      {appointment.status === "PENDING" && (
                        <>
                          <button
                            className="text-green-600 hover:text-green-900"
                            onClick={() =>
                              handleStatusChange(appointment.id, "COMPLETED")
                            }
                          >
                            Hoàn thành
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() =>
                              handleStatusChange(appointment.id, "CANCELLED")
                            }
                          >
                            Hủy
                          </button>
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

export default Appointments;
