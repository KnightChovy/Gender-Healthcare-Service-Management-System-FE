import dayjs from "dayjs";
import React, { useState } from "react";
const doctorAppointments = [
  {
    appointment_id: "AP000009",
    user_id: "US000004",
    doctor_id: "DR000003",
    timeslot_id: "TS000001",
    rating: null,
    feedback: null,
    descriptions: "bị lý sinh yếu",
    price_apm: "200000.00",
    consultant_type: "Tư vấn chung",
    created_at: "2025-06-21T17:34:17.000Z",
    updated_at: "2025-06-21T17:34:43.000Z",
    status: "confirmed",
    appointment_time: "10:00:00",
    booking: 0,
    first_name: "phuc",
    email: "phuc@example.com",
    phone: "0356942879",
    time_end: "09:00:00",
    time_start: "08:00:00",
    date: "2025-06-23",
  },
  {
    appointment_id: "AP000008",
    user_id: "US000003",
    doctor_id: "DR000003",
    timeslot_id: "TS000001",
    rating: null,
    feedback: null,
    descriptions: null,
    price_apm: "250000.00",
    consultant_type: "Tư vấn tránh thai",
    created_at: "2025-06-21T17:10:11.000Z",
    updated_at: "2025-06-21T17:25:05.000Z",
    status: "confirmed",
    appointment_time: "14:00:00",
    booking: 1,
    first_name: "Jesicar",
    email: "jesicar123@yahoo.com",
    phone: "0987654321",
    time_end: "09:00:00",
    time_start: "08:00:00",
    date: "2025-06-23",
  },
  {
    appointment_id: "AP000007",
    user_id: "US000004",
    doctor_id: "DR000003",
    timeslot_id: "TS000001",
    rating: null,
    feedback: null,
    descriptions: null,
    price_apm: "200000.00",
    consultant_type: "Tư vấn chung",
    created_at: "2025-06-21T16:57:33.000Z",
    updated_at: "2025-06-21T17:21:47.000Z",
    status: "rejected",
    appointment_time: "14:30:00",
    booking: 0,
    first_name: "phuc",
    email: "phuc@example.com",
    phone: "0356942879",
    time_end: "09:00:00",
    time_start: "08:00:00",
    date: "2025-06-23",
  },
  {
    appointment_id: "AP000006",
    user_id: "US000004",
    doctor_id: "DR000003",
    timeslot_id: "TS000001",
    rating: null,
    feedback: null,
    descriptions: null,
    price_apm: "250000.00",
    consultant_type: "Tư vấn tránh thai",
    created_at: "2025-06-21T06:44:27.000Z",
    updated_at: "2025-06-21T06:44:27.000Z",
    status: "0",
    appointment_time: "10:00:00",
    booking: 0,
    first_name: "phuc",
    email: "phuc@example.com",
    phone: "0356942879",
    time_end: "09:00:00",
    time_start: "08:00:00",
    date: "2025-06-23",
  },
];
const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
const getWeekDates = (selectedDate) => {
  const today = dayjs(selectedDate);
  const startOfWeek = today.startOf("week");
  return Array.from({ length: 7 }, (_, i) =>
    startOfWeek.add(i, "day").toDate()
  );
};
// Component Calendar giả lập
const Calendar = ({ appointments }) => {
  const [viewMode, setViewMode] = useState("week");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const weekDates = getWeekDates(selectedDate);

  // Xử lý khi chuyển đến tuần trước
  const handlePreviousWeek = () => {
    console.log("Selected Date:", selectedDate);

    const prevWeek = new Date(selectedDate);
    prevWeek.setDate(prevWeek.getDate() - 7);

    const mondayOfPrevWeek = new Date(prevWeek);
    mondayOfPrevWeek.setHours(0, 0, 0, 0);

    if (mondayOfPrevWeek < dayjs().startOf("week").toDate()) {
      alert("Không thể chọn lịch làm việc trong quá khứ");
      return;
    }

    setSelectedDate(prevWeek);
  };

  // Định dạng ngày hiển thị
  const formatDate = (date) => {
    return date.getDate() + "/" + (date.getMonth() + 1);
  };

  const renderAppointments = (day) => {
    const startOfWeek = dayjs(weekDates[days.indexOf(day)]).startOf("week");
    const currentDay = startOfWeek.add(days.indexOf(day), "day");
    const filteredAppointments = doctorAppointments.filter((appointment) => {
      return dayjs(appointment.date).isSame(currentDay, "day");
    });

    return filteredAppointments.map((appointment) => {
      return (
        <div
          key={appointment.appointment_id}
          // render status
          className={`mb-1 p-2 rounded text-xs border-l-2 border-yellow-400 cursor-pointer ${
            appointment.status === "confirmed"
              ? "bg-green-200 border-green-400"
              : appointment.status === "rejected"
              ? "bg-red-200 border-red-400"
              : appointment.status === "pending"
              ? "bg-yellow-200 border-yellow-400"
              : "bg-gray-200 border-gray-400"
          }`}
        >
          <div className="font-medium text-gray-700">
            {appointment.time_start.split(":").slice(0, 2).join(":")} -{" "}
            {appointment.time_end.split(":").slice(0, 2).join(":")}
          </div>
          <div className="font-semibold">{appointment.first_name}</div>
          <div className="text-gray-600">{appointment.consultant_type}</div>
        </div>
      );
    });
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          className={`px-3 py-2 text-sm rounded-md ${
            viewMode === "day"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setViewMode("day")}
        >
          Ngày
        </button>
        <button
          className={`px-3 py-2 text-sm rounded-md ${
            viewMode === "week"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setViewMode("week")}
        >
          Tuần
        </button>
        <button
          className={`px-3 py-2 text-sm rounded-md ${
            viewMode === "month"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setViewMode("month")}
        >
          Tháng
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-6 w-full">
          <button
            onClick={handlePreviousWeek}
            disabled={dayjs(selectedDate)
              .startOf("week")
              .isSame(dayjs(), "week")}
            className="cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 :disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-chevron-left mr-2"></i>
            Tuần trước
          </button>

          <h2 className="text-lg font-medium text-gray-900">
            Từ {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
          </h2>

          <button
            onClick={() => {
              const nextWeek = new Date(selectedDate);
              nextWeek.setDate(nextWeek.getDate() + 7);
              setSelectedDate(nextWeek);
            }}
            className="cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 text-center"
          >
            Tuần sau
            <i className="fas fa-chevron-right ml-2"></i>
          </button>
        </div>
      </div>

      {viewMode === "week" && (
        <div className="grid grid-cols-7 gap-1 h-[400px]">
          {days.map((day, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded flex flex-col"
            >
              <div className="text-center py-2 bg-gray-50 border-b border-gray-200">
                <div className="text-xs text-gray-500">{day}</div>
                <div className="text-sm font-medium">
                  {dayjs(weekDates[index]).format("DD/MM")}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-1">
                {index === days.length - 1 && (
                  <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                    Không có lịch hẹn
                  </div>
                )}

                {renderAppointments(day)}
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode !== "week" && (
        <div className="h-[400px] flex flex-col items-center justify-center text-gray-500 border border-dashed border-gray-300 rounded-md">
          <p>Hiển thị lịch theo {viewMode === "day" ? "ngày" : "tháng"}</p>
          <p className="mt-2">Giao diện đang được phát triển</p>
        </div>
      )}
    </div>
  );
};

export default Calendar;
