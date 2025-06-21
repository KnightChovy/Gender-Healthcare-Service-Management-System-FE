import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_MANAGER_APPOINTMENT } from "../../../constants/Apis";

export const ConsultSchedulerManagerment = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await axios(API_MANAGER_APPOINTMENT);
        if (res.data.success) {
          setAppointments(res.data.data);
        } else {
          setError(res.data.message || "Không thể tải lịch hẹn");
        }
      } catch (error) {
        setError("Lỗi kết nối", error.message);
      } finally {
        setLoading(true);
      }
    };
  });
  return (
    <div>
      <table>
        <thead>
          <th>ID</th>
          <th>Họ và tên</th>
          <th>Thời gian đặt lịch</th>
          <th>Loại tư vấn</th>
          <th>Bác sĩ</th>
          <th>Trạng thái</th>
        </thead>
        <tbody>
          <tr>
            <td>AP11223243</td>
            <td>Ngô Minh Tân</td>
            <td>9g30</td>
            <td>Nam khoa</td>
            <td>Nguyễn Bỉnh Khiêm</td>
            <td>
              <button>Xác nhận</button>
              <button>Hủy bỏ</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
