import React, { useEffect, useState } from "react";
import axiosClient from "../../services/axiosClient";
import doctorService from "../../services/doctor.service";
import dayjs from "dayjs";

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
  const initSchedule = days.reduce((acc, day) => {
    acc[day] = timeSlots.reduce((slots, timeSlot) => {
      slots[timeSlot] = false;
      return slots;
    }, {});
    return acc;
  }, {});
  // State cho lịch làm việc
  const [schedule, setSchedule] = useState(initSchedule);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // Lấy ngày hiện tại đầu ngày (00:00:00) để so sánh chính xác
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Tính tuần hiện tại
  const getWeekDates = () => {
    const current = new Date(selectedDate);
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1);

    const monday = new Date(current.setDate(diff));
    monday.setHours(0, 0, 0, 0);

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

    if (isPastDate(date)) {
      return true;
    }

    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      const currentHour = new Date().getHours();
      const startHour = parseInt(timeSlot.split(":")[0]);
      return currentHour >= startHour;
    }

    return false;
  };

  // Xử lý khi click vào ô lịch
  const handleToggleTimeSlot = (day, timeSlot, dayIndex) => {
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

    const mondayOfPrevWeek = new Date(prevWeek);
    const day = mondayOfPrevWeek.getDay();
    const diff = mondayOfPrevWeek.getDate() - day + (day === 0 ? -6 : 1);
    mondayOfPrevWeek.setHours(0, 0, 0, 0);

    if (mondayOfPrevWeek < today) {
      alert("Không thể chọn lịch làm việc trong quá khứ");
      return;
    }

    setSelectedDate(prevWeek);
    setSchedule(initSchedule);
  };

  // Định dạng ngày hiển thị
  const formatDate = (date) => {
    return date.getDate() + "/" + (date.getMonth() + 1);
  };

  // Xử lý khi submit form - SỬ DỤNG SERVICE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const scheduleDaysWithSelectedSlots = Object.entries(schedule).filter(
        ([_, slots]) => Object.values(slots).some((isSelected) => isSelected)
      );

      if (scheduleDaysWithSelectedSlots.length === 0) {
        alert("Vui lòng chọn ít nhất một khung giờ làm việc!");
        setIsLoading(false);
        return;
      }

      const [firstDay, timeSlotsObj] = scheduleDaysWithSelectedSlots[0];
      const dayIndex = days.indexOf(firstDay);
      const dateObject = weekDates[dayIndex];
      const formattedDate = dayjs(dateObject).format("YYYY-MM-DD");

      const selectedTimeSlots = Object.entries(timeSlotsObj)
        .filter(([_, isSelected]) => isSelected)
        .map(([timeSlot]) => {
          const [startTime, endTime] = timeSlot.split(" - ");
          return {
            time_start: `${startTime}:00`,
            time_end: `${endTime}:00`,
          };
        });

      const formattedSchedule = {
        date: formattedDate,
        timeSlots: selectedTimeSlots,
      };

      console.log("Dữ liệu gửi đi:", formattedSchedule);

      // Gọi API
      const result = await doctorService.fetchRegisterDoctorSchedule(
        formattedSchedule
      );
      console.log("Kết quả từ API:", result);

      alert("Đăng ký lịch làm việc thành công!");

      // Reset lịch
      const allFalse = days.reduce((acc, day) => {
        acc[day] = timeSlots.reduce((slots, time) => {
          slots[time] = false;
          return slots;
        }, {});
        return acc;
      }, {});
      setSchedule(allFalse);
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Lỗi ${error.response.status}: ${error.response.statusText}`;
        alert("Lỗi: " + errorMessage);
      } else if (error.request) {
        alert("Lỗi kết nối: Không thể kết nối đến server.");
      } else {
        alert("Lỗi: " + error.message);
      }
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
            setSchedule(initSchedule);
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
