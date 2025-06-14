import React, { useState } from "react";

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
  const timeSlots = [
    "08:00 - 10:00",
    "10:00 - 12:00",
    "13:00 - 15:00",
    "15:00 - 17:00",
  ];

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

  // Xử lý khi click vào ô lịch
  const handleToggleTimeSlot = (day, timeSlot) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [timeSlot]: !prev[day][timeSlot],
      },
    }));
  };

  // Tính tuần hiện tại
  const getWeekDates = () => {
    const current = new Date(selectedDate);
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1);

    const monday = new Date(current.setDate(diff));
    const weekDates = [];

    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(monday);
      nextDate.setDate(monday.getDate() + i);
      weekDates.push(nextDate);
    }

    return weekDates;
  };

  const weekDates = getWeekDates();

  // Định dạng ngày hiển thị
  const formatDate = (date) => {
    return date.getDate() + "/" + (date.getMonth() + 1);
  };

  // Xử lý khi submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Lọc ra các slot đã được chọn
    const selectedSlots = Object.entries(schedule).reduce(
      (selected, [day, slots]) => {
        const daySlots = Object.entries(slots)
          .filter(([_, isSelected]) => isSelected)
          .map(([time]) => time);

        if (daySlots.length > 0) {
          selected[day] = daySlots;
        }

        return selected;
      },
      {}
    );

    // Simulating API call
    setTimeout(() => {
      console.log("Lịch làm việc đã đăng ký:", selectedSlots);
      alert("Đăng ký lịch làm việc thành công!");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Đăng ký lịch làm việc
      </h1>

      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => {
            const prevWeek = new Date(selectedDate);
            prevWeek.setDate(prevWeek.getDate() - 7);
            setSelectedDate(prevWeek);
          }}
          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <i className="fas fa-chevron-left mr-2"></i>
          Tuần trước
        </button>

        <h2 className="text-lg font-medium text-gray-900">
          Tuần từ {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
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
                    Ngày
                  </th>
                  {timeSlots.map((slot) => (
                    <th
                      key={slot}
                      className="py-3 px-4 border-b border-gray-200 bg-gray-100 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {slot}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {days.map((day, index) => (
                  <tr
                    key={day}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="py-4 px-4 border-b border-gray-200 text-sm font-medium text-gray-900">
                      <div>{day}</div>
                      <div className="text-xs text-gray-500">
                        {formatDate(weekDates[index])}
                      </div>
                    </td>
                    {timeSlots.map((time) => (
                      <td
                        key={`${day}-${time}`}
                        className="py-4 px-4 border-b border-gray-200 text-center"
                      >
                        <button
                          type="button"
                          onClick={() => handleToggleTimeSlot(day, time)}
                          className={`w-8 h-8 rounded-md transition duration-150 ease-in-out flex items-center justify-center ${
                            schedule[day][time]
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                          aria-label={`Select ${time} on ${day}`}
                        >
                          {schedule[day][time] && (
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
