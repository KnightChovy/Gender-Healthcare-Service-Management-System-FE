import React, { useEffect, useState } from "react";
import axiosClient from "../../services/axiosClient";
import doctorService from "../../services/doctor.service";
const Schedule = () => {
  const days = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Chủ nhật",
  ];
  const timeSlots = ["07:30 - 11:30", "13:00 - 17:00"];

  // Khởi tạo lịch làm việc với tất cả ô chưa được chọn
  // và tất cả ngày đều có các khung giờ
  useEffect(() => {
    const fetchAvailableTimeSlots = async () => {
      try {
        const doctorAvailableTimeslots =
          await doctorService.fetchDoctorAvailableTimeslots();
        console.log("Available time slots:", doctorAvailableTimeslots);
      } catch (error) {
        console.error("Error fetching available time slots:", error);
      }
    };

    fetchAvailableTimeSlots();
  }, []);

  // State cho lịch làm việc
  const [schedule, setSchedule] = useState(
    days.reduce((acc, day) => {
      acc[day] = timeSlots.reduce((slots, time) => {
        slots[time] = false;
        return slots;
      }, {});
      return acc;
    }, {})
  );

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [Slots, setTimeSlots] = useState([]);

  // Lấy ngày hiện tại đầu ngày (00:00:00) để so sánh chính xác
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Tính tuần hiện tại
  const getWeekDates = () => {
    const current = new Date(selectedDate);
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1);

    const monday = new Date(current.setDate(diff));
    monday.setHours(0, 0, 0, 0); // Đặt về đầu ngày để so sánh chính xác

    const weekDates = [];

    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(monday);
      nextDate.setDate(monday.getDate() + i);
      weekDates.push(nextDate);
    }

    return weekDates;
  };

  const weekDates = getWeekDates();

  // Kiểm tra xem một ngày có phải là quá khứ không
  const isPastDate = (date) => {
    return date < today;
  };

  // Kiểm tra xem một ô thời gian có nên vô hiệu hóa không
  const isTimeSlotDisabled = (dayIndex, timeSlot) => {
    const date = weekDates[dayIndex];

    // Nếu ngày đã là quá khứ
    if (isPastDate(date)) {
      return true;
    }

    // Nếu ngày là hôm nay, kiểm tra thời gian
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      // Lấy giờ hiện tại
      const currentHour = new Date().getHours();

      // Lấy giờ bắt đầu của timeSlot
      const startHour = parseInt(timeSlot.split(":")[0]);

      // Nếu giờ hiện tại đã qua giờ bắt đầu của slot
      return currentHour >= startHour;
    }

    return false;
  };

  // Xử lý khi click vào ô lịch
  const handleToggleTimeSlot = (day, timeSlot, dayIndex) => {
    // Nếu ô đã vô hiệu hóa, không cho phép click
    if (isTimeSlotDisabled(dayIndex, timeSlot)) {
      return;
    }

    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [timeSlot]: !prev[day][timeSlot],
      },
    }));
  };

  // Xử lý khi chuyển đến tuần trước
  const handlePreviousWeek = () => {
    const prevWeek = new Date(selectedDate);
    prevWeek.setDate(prevWeek.getDate() - 7);

    // Không cho phép chọn tuần trong quá khứ
    const mondayOfPrevWeek = new Date(prevWeek);
    const day = mondayOfPrevWeek.getDay();
    // const diff = mondayOfPrevWeek.getDate() - day + (day === 0 ? -6 : 1);
    // mondayOfPrevWeek.setDate(diff);
    mondayOfPrevWeek.setHours(0, 0, 0, 0);

    if (mondayOfPrevWeek < today) {
      alert("Không thể chọn lịch làm việc trong quá khứ");
      return;
    }

    setSelectedDate(prevWeek);
  };

  // Định dạng ngày hiển thị
  const formatDate = (date) => {
    return date.getDate() + "/" + (date.getMonth() + 1);
  };

  // Xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Tạo đối tượng để nhóm các timeSlots theo ngày
      let schedules = {};

      // Xử lý từng ngày trong lịch
      Object.entries(schedule).forEach(([day, slots]) => {
        const dayIndex = days.indexOf(day);
        if (dayIndex === -1) return;

        const date = weekDates[dayIndex];
        const formattedDate = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

        // Duyệt qua các khung giờ
        console.log("slots:", slots);

        Object.entries(slots).forEach(([timeSlot, isSelected]) => {
          if (isSelected) {
            // Phân tích giờ từ chuỗi "08:00 - 11:00"
            const [start, end] = timeSlot.split(" - ");

            const slot = {
              time_start: start + ":00",
              time_end: end + ":00",
            };
            console.log("slot:", slot);

            setTimeSlots((prev) => [...prev, slot]);
          }
        });
        if (!schedules[formattedDate]) {
          schedules = {
            date: formattedDate,
            timeSlots: [...Slots],
          };
        }
      });

      console.log("Lịch làm việc:", schedules);

      // Chuyển đối tượng thành mảng
      const schedulesToSend = schedules;

      console.log("Dữ liệu gửi đi:", schedulesToSend);

      const accessToken = localStorage.getItem("accessToken"); // Lấy token từ localStorage

      const res = await fetch("http://52.4.72.106:3000/v1/doctors/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Thêm token vào header
          "x-access-token": accessToken, // Thêm thêm một trường token nếu API yêu cầu
        },
        body: JSON.stringify(schedulesToSend),
      });

      if (res.ok) {
        alert("Đăng ký lịch làm việc thành công!");
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Đăng ký thất bại");
      }
    } catch (error) {
      alert("Lỗi: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Đăng ký lịch làm việc
      </h1>

      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePreviousWeek}
          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
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
          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Tuần sau
          <i className="fas fa-chevron-right ml-2"></i>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <p className="text-gray-700 mb-2">
            Chọn khung giờ bạn có thể làm việc:
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr>
                  <th className="py-3 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giờ / Ngày
                  </th>
                  {days.map((day, index) => (
                    <th
                      key={day}
                      className="py-3 px-4 border-b border-gray-200 bg-gray-100 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div
                        className={
                          isPastDate(weekDates[index]) ? "text-gray-400" : ""
                        }
                      >
                        {day}
                      </div>
                      <div
                        className={`text-xs ${
                          isPastDate(weekDates[index]) ? "text-gray-400" : ""
                        }`}
                      >
                        {formatDate(weekDates[index])}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((timeSlot) => (
                  <tr key={timeSlot} className="bg-white">
                    <td className="py-4 px-4 border-b border-gray-200 text-sm font-medium text-gray-900">
                      {timeSlot}
                    </td>
                    {days.map((day, dayIndex) => (
                      <td
                        key={`${day}-${timeSlot}`}
                        className="py-4 px-4 border-b border-gray-200 text-center"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleTimeSlot(day, timeSlot, dayIndex)
                          }
                          disabled={isTimeSlotDisabled(dayIndex, timeSlot)}
                          className={`w-8 h-8 rounded-md transition duration-150 ease-in-out flex items-center justify-center ${
                            isTimeSlotDisabled(dayIndex, timeSlot)
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                              : schedule[day][timeSlot]
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                          aria-label={`Select ${timeSlot} on ${day}`}
                        >
                          {schedule[day][timeSlot] && (
                            <i className="fas fa-check"></i>
                          )}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
              <span>Đã chọn</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
              <span>Chưa chọn</span>
            </div>
          </div>
          <div>
            <button
              type="button"
              onClick={() => {
                const allFalse = days.reduce((acc, day) => {
                  acc[day] = timeSlots.reduce((slots, time) => {
                    slots[time] = false;
                    return slots;
                  }, {});
                  return acc;
                }, {});
                setSchedule(allFalse);
              }}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2 hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Xóa tất cả
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Đang xử lý...
                </>
              ) : (
                "Đăng ký lịch"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Schedule;
