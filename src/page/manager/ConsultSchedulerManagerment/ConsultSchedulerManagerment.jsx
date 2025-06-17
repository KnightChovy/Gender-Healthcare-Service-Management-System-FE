import React, { useEffect, useState } from "react";

export const ConsultSchedulerManagerment = () => {
  const [booking, setBooking] = useState([]);
  const [localAppointment, setLocalAppointment] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://52.4.72.106:3000/v1/appointments")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setBooking(data);
      })
      .catch((err) => {
        console.error("Error fetching booking data:", err);
        setError("Failed to load appointment data");
      });

    // Get data from localStorage (for the local appointment)
    const appointmentData = localStorage.getItem("appointmentData");
    if (appointmentData) {
      try {
        setLocalAppointment(JSON.parse(appointmentData));
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    }
  }, []);

  const handleSetStatus = (id, action) => {
    const reasonReject =
      action === "reject" ? prompt("Lý do từ chối") : undefined;

    // Fix the template literal in the URL
    fetch(`http://your-actual-api-url/appointment/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, reasonReject }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        alert(`Đặt lịch đã ${result.status}`);
        setBooking((appoint) =>
          appoint.filter((booking) => booking._id !== id)
        );
      })
      .catch((err) => {
        console.error("Error updating status:", err);
        alert("Không thể cập nhật trạng thái. Vui lòng thử lại sau.");
      });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Danh sách đặt lịch chờ duyệt</h2>

      {/* Display localStorage appointment if available */}
      {localAppointment && (
        <div className="card mb-4">
          <div className="card-header bg-info text-white">
            Thông tin đặt lịch từ localStorage
          </div>
          <div className="card-body">
            <h5 className="card-title">{localAppointment.fullName}</h5>
            <p className="card-text">
              <strong>Bác sĩ:</strong> {localAppointment.doctorName}
              <br />
              <strong>Ngày khám:</strong> {localAppointment.appointmentDate}
              <br />
              <strong>Giờ khám:</strong> {localAppointment.appointmentTime}
              <br />
              <strong>Loại tư vấn:</strong> {localAppointment.consultationType}
              <br />
              <strong>Trạng thái:</strong> {localAppointment.status}
            </p>
            <button className="btn btn-primary">Xử lý đặt lịch này</button>
          </div>
        </div>
      )}

      {error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Tên bệnh nhân</th>
                <th>Tên bác sĩ</th>
                <th>Thời gian</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {booking.map((bk) => (
                <tr key={bk._id}>
                  <td>{bk.user?.name || "N/A"}</td>
                  <td>{bk.doctor?.name || "N/A"}</td>
                  <td>{new Date(bk.create_at).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleSetStatus(bk.appointment_id, "T")}
                    >
                      Chấp nhận
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleSetStatus(bk.appointment_id, "F")}
                    >
                      Hủy bỏ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {booking.length === 0 && (
            <div className="alert alert-info">
              Không có đặt lịch nào đang chờ duyệt
            </div>
          )}
        </>
      )}
    </div>
  );
};
