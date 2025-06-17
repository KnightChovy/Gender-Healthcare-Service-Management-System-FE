import React, { useEffect, useState, useRef } from "react";

export const ConsultSchedulerManagerment = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const dataLoaded = useRef(false);

  useEffect(() => {
    if (!dataLoaded.current) {
      try {
        const singleAppointmentData =
          localStorage.getItem("pendingAppointment");

        const appointmentsListData = localStorage.getItem("appointmentsList");

        const results = [];
        const seenIds = new Set();

        if (singleAppointmentData) {
          const parsedData = JSON.parse(singleAppointmentData);
          results.push(parsedData);
          seenIds.add(parsedData.id);
        }

        if (appointmentsListData) {
          const parsedList = JSON.parse(appointmentsListData);

          parsedList.forEach((item) => {
            if (!seenIds.has(item.id)) {
              results.push(item);
              seenIds.add(item.id);
            }
          });
        }

        setAppointments(results);

        dataLoaded.current = true;
      } catch (error) {
        console.error("Error retrieving data from localStorage:", error);
        setError("Không thể đọc dữ liệu đặt lịch từ bộ nhớ");
      }
    }
  }, []);

  const handleSetStatus = (id, action) => {
    const reasonReject =
      action === "reject" ? prompt("Lý do từ chối") : undefined;

    const updatedAppointments = appointments.map((appointment) => {
      if (appointment.id === id) {
        return {
          ...appointment,
          status: action === "T" ? "approved" : "rejected",
          reasonReject,
        };
      }
      return appointment;
    });

    setAppointments(updatedAppointments);

    try {
      localStorage.setItem(
        "appointmentsList",
        JSON.stringify(updatedAppointments)
      );

      const singleAppointmentData = localStorage.getItem("pendingAppointment");
      if (singleAppointmentData) {
        const pendingAppointment = JSON.parse(singleAppointmentData);
        if (pendingAppointment.id === id) {
          localStorage.removeItem("pendingAppointment");
        }
      }

      alert(`Đặt lịch đã ${action === "T" ? "được chấp nhận" : "bị từ chối"}`);
    } catch (error) {
      console.error("Error updating localStorage:", error);
      alert("Không thể cập nhật trạng thái. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Danh sách đặt lịch chờ duyệt</h2>

      {error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Mã đặt lịch</th>
                  <th className="px-4 py-3 text-left">Tên bệnh nhân</th>
                  <th className="px-4 py-3 text-left">Tên bác sĩ</th>
                  <th className="px-4 py-3 text-left">Ngày hẹn</th>
                  <th className="px-4 py-3 text-left">Giờ hẹn</th>
                  <th className="px-4 py-3 text-left">Loại tư vấn</th>
                  <th className="px-4 py-3 text-left">Trạng thái</th>
                  <th className="px-4 py-3 text-left">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {appointment.id}
                    </td>
                    <td className="px-4 py-3">{appointment.fullName}</td>
                    <td className="px-4 py-3">{appointment.doctorName}</td>
                    <td className="px-4 py-3">{appointment.appointmentDate}</td>
                    <td className="px-4 py-3">{appointment.appointmentTime}</td>
                    <td className="px-4 py-3">
                      <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                        {appointment.consultant_type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {appointment.status === "0" ? (
                        <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800">
                          Chờ xác nhận
                        </span>
                      ) : appointment.status === "confirmed" ? (
                        <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">
                          Đã xác nhận
                        </span>
                      ) : appointment.status === "cancelled" ? (
                        <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-800">
                          Đã hủy
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800">
                          {appointment.status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {appointment.status === "0" && (
                        <div className="flex space-x-2">
                          <button
                            className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors flex items-center"
                            onClick={() => handleSetStatus(appointment.id, "T")}
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              ></path>
                            </svg>
                            Chấp nhận
                          </button>
                          <button
                            className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors flex items-center"
                            onClick={() => handleSetStatus(appointment.id, "F")}
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              ></path>
                            </svg>
                            Hủy bỏ
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {appointments.length === 0 && (
            <div className="alert alert-info">
              Không có đặt lịch nào trong bộ nhớ
            </div>
          )}
        </>
      )}
    </div>
  );
};
