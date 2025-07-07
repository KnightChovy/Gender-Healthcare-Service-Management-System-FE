import React, { useState } from "react";
import { format, isWeekend, isBefore, addDays } from "date-fns";
import { vi } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const AppointmentDate = ({
  selectedDate,
  setSelectedDate,
  timeSlots,
  selectedTimeSlot,
  handleTimeSlotSelect,
  selectedServices,
  formatPrice,
  calculateTotalAmount,
  handleNextStep,
  handlePreviousStep,
}) => {
  const today = new Date();

  // Tạo style cho DayPicker
  const dayPickerStyles = {
    caption: { color: "#3B82F6" },
    selected: { backgroundColor: "#3B82F6" },
    day: {
      margin: "2px",
      borderRadius: "4px",
    },
  };

  // Disable những ngày không cho phép đặt lịch
  const disabledDays = (date) => {
    // Không cho phép đặt lịch vào cuối tuần
    if (isWeekend(date)) return true;

    // Không cho phép đặt lịch trước ngày hiện tại
    if (isBefore(date, today)) return true;

    // Chỉ cho phép đặt lịch trong vòng 30 ngày
    if (isBefore(addDays(today, 30), date)) return true;

    return false;
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 bg-blue-50">
        <h2 className="text-lg font-medium text-gray-900">
          Bước 2: Chọn ngày và giờ hẹn
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Vui lòng chọn ngày và khung giờ phù hợp cho lịch xét nghiệm của bạn
        </p>
      </div>

      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chọn ngày */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Chọn ngày
            </h3>
            <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={disabledDays}
                weekStartsOn={1}
                locale={vi}
                styles={dayPickerStyles}
                modifiersStyles={{
                  selected: {
                    backgroundColor: "#3B82F6",
                    fontWeight: "bold",
                    color: "white",
                  },
                  today: {
                    border: "2px solid #60A5FA",
                  },
                  disabled: {
                    color: "#d1d5db",
                  },
                }}
              />
            </div>
          </div>

          {/* Chọn giờ */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Chọn giờ</h3>
            {selectedDate ? (
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((timeSlot) => (
                  <button
                    key={timeSlot}
                    className={`py-2 px-4 rounded text-center ${
                      selectedTimeSlot === timeSlot
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    }`}
                    onClick={() => handleTimeSlotSelect(timeSlot)}
                  >
                    {timeSlot}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 italic">
                Vui lòng chọn ngày trước
              </div>
            )}
          </div>
        </div>

        {/* Thông tin lịch đã chọn */}
        {selectedDate && selectedTimeSlot && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-2">
              Thông tin lịch hẹn đã chọn
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Ngày xét nghiệm:</span>{" "}
                <span className="font-medium">
                  {format(selectedDate, "EEEE, dd/MM/yyyy", { locale: vi })}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Giờ xét nghiệm:</span>{" "}
                <span className="font-medium">{selectedTimeSlot}</span>
              </div>
            </div>
          </div>
        )}

        {/* Thông tin dịch vụ đã chọn */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Dịch vụ đã chọn
          </h3>
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tên dịch vụ
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Giá
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedServices.map((service) => (
                  <tr key={service.service_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {service.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatPrice(service.price)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Tổng cộng
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right text-blue-600">
                    {formatPrice(calculateTotalAmount())}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-between">
        <button
          onClick={handlePreviousStep}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Quay lại
        </button>
        <button
          onClick={handleNextStep}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={!selectedDate || !selectedTimeSlot}
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
};

export default AppointmentDate;
