import React, { useEffect, useState } from "react";

export const ConsultSchedulerManagerment = () => {
  const [booking, setBooking] = useState([]);

  useEffect(() => {
    fetch("API")
      .then((res) => res.json())
      .then(setBooking);
  }, []);
  const handleSetStatus = (id, action) => {
    const reasonReject =
      action === "reject" ? prompt("Lý do từ chối") : undefined;
    fetch("API/appointment/${id}/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, reasonReject }),
    })
      .then((res) => res.json())
      .then((result) => {
        alert(`Đặt lịch đã ${result.status}`);
        setBooking((appoint) =>
          appoint.filter((booking) => booking._id !== id)
        );
      });
  };
  return (
    <div className="container mt-4">
      <h2 className="mb-3">Danh sách đặt lịch chờ duyệt</h2>
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
              <td>{bk.user.name}</td>
              <td>{bk.doctor.name}</td>
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
    </div>
  );
};
