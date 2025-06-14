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

  // Xử lý khi submit form
  const handleSubmit = (e) => {
    e.preventDefault();

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

    console.log("Lịch làm việc đã đăng ký:", selectedSlots);
    alert("Đăng ký lịch làm việc thành công!");
    // Ở đây bạn sẽ gọi API để lưu lịch làm việc
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Đăng ký lịch làm việc
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <p className="text-gray-700 mb-2">
            Chọn khung giờ bạn có thể làm việc:
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày
                  </th>
                  {timeSlots.map((slot) => (
                    <th
                      key={slot}
                      className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {slot}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {days.map((day) => (
                  <tr key={day}>
                    <td className="py-4 px-4 border-b border-gray-200 text-sm font-medium text-gray-900">
                      {day}
                    </td>
                    {timeSlots.map((time) => (
                      <td
                        key={`${day}-${time}`}
                        className="py-4 px-4 border-b border-gray-200 text-center"
                      >
                        <button
                          type="button"
                          onClick={() => handleToggleTimeSlot(day, time)}
                          className={`w-6 h-6 rounded ${
                            schedule[day][time]
                              ? "bg-blue-500 hover:bg-blue-600"
                              : "bg-gray-200 hover:bg-gray-300"
                          }`}
                          aria-label={`Select ${time} on ${day}`}
                        />
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
              <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
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
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2 hover:bg-gray-300 transition-colors"
            >
              Xóa tất cả
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Đăng ký lịch
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Schedule;
