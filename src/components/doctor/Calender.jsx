import React, { useState } from "react";

// Component Calendar giả lập
const Calendar = ({ appointments }) => {
  const [viewMode, setViewMode] = useState("week");

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
        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
          &lt;
        </button>
        <h3 className="text-lg font-medium text-gray-800">
          {viewMode === "day"
            ? "14 tháng 6, 2025"
            : viewMode === "week"
            ? "14 - 20 tháng 6, 2025"
            : "Tháng 6, 2025"}
        </h3>
        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
          &gt;
        </button>
      </div>

      {viewMode === "week" && (
        <div className="grid grid-cols-7 gap-1 h-[400px]">
          {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded flex flex-col"
            >
              <div className="text-center py-2 bg-gray-50 border-b border-gray-200">
                <div className="text-xs text-gray-500">{day}</div>
                <div className="text-sm font-medium">{14 + index}</div>
              </div>
              <div className="flex-1 overflow-y-auto p-1">
                {index === 0 && (
                  <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                    Không có lịch hẹn
                  </div>
                )}
                {index === 1 && (
                  <>
                    <div className="mb-1 p-2 rounded text-xs bg-yellow-50 border-l-2 border-yellow-400 cursor-pointer">
                      <div className="font-medium text-gray-700">
                        09:00 - 09:30
                      </div>
                      <div className="font-semibold">Nguyễn Thị An</div>
                      <div className="text-gray-600">
                        Khám sức khỏe tổng quát
                      </div>
                    </div>
                    <div className="mb-1 p-2 rounded text-xs bg-green-50 border-l-2 border-green-400 cursor-pointer">
                      <div className="font-medium text-gray-700">
                        10:00 - 10:30
                      </div>
                      <div className="font-semibold">Trần Văn Bình</div>
                      <div className="text-gray-600">Tư vấn dinh dưỡng</div>
                    </div>
                    <div className="mb-1 p-2 rounded text-xs bg-red-50 border-l-2 border-red-400 cursor-pointer">
                      <div className="font-medium text-gray-700">
                        11:00 - 11:30
                      </div>
                      <div className="font-semibold">Lê Thị Cúc</div>
                      <div className="text-gray-600">Siêu âm</div>
                    </div>
                  </>
                )}
                {index === 2 && (
                  <>
                    <div className="mb-1 p-2 rounded text-xs bg-yellow-50 border-l-2 border-yellow-400 cursor-pointer">
                      <div className="font-medium text-gray-700">
                        09:00 - 09:30
                      </div>
                      <div className="font-semibold">Phạm Văn Đạt</div>
                      <div className="text-gray-600">Khám thai định kỳ</div>
                    </div>
                    <div className="mb-1 p-2 rounded text-xs bg-yellow-50 border-l-2 border-yellow-400 cursor-pointer">
                      <div className="font-medium text-gray-700">
                        14:00 - 14:30
                      </div>
                      <div className="font-semibold">Hoàng Thị Hoa</div>
                      <div className="text-gray-600">Tư vấn sức khỏe</div>
                    </div>
                  </>
                )}
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
