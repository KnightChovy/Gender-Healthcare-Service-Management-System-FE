import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // vẫn cần import để giữ base style

// import file CSS chính của ứng dụng
function MenstrualCalendar({ predictions }) {
  const [value, setValue] = useState(new Date());

  const isSameDay = (d1, d2) =>
    d1?.getDate() === d2?.getDate() &&
    d1?.getMonth() === d2?.getMonth() &&
    d1?.getFullYear() === d2?.getFullYear();

  const isInRange = (date, start, end) => date >= start && date <= end;

  const getTileClassName = ({ date }) => {
    if (isSameDay(date, predictions.nextPeriod)) {
      return "custom-period";
    }
    if (isSameDay(date, predictions.ovulationDate)) {
      return "custom-ovulation";
    }
    if (
      isInRange(
        date,
        predictions.fertilityWindow.start,
        predictions.fertilityWindow.end
      )
    ) {
      return "custom-fertile";
    }
    return "";
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Chu kỳ kinh nguyệt</h2>

      <div className="max-w-md mx-auto border rounded-lg shadow-sm overflow-hidden">
        <Calendar
          onChange={setValue}
          value={value}
          tileClassName={getTileClassName}
          className="w-full"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-4 items-center text-sm">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-red-400 rounded"></span> Kì kinh nguyệt
          tiếp theo
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-yellow-300 rounded"></span> Ngày rụng
          trứng dự kiến
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-blue-400 rounded"></span> Khoảng thời gian
          thụ thai được ước tính
        </div>
      </div>
    </div>
  );
}

export default MenstrualCalendar;
