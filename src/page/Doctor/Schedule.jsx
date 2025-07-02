import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosClient from "../../services/axiosClient";
import doctorService from "../../services/doctor.service";
import dayjs from "dayjs";

const Schedule = () => {
  // 1. Bỏ Chủ nhật - chỉ từ Thứ 2 đến Thứ 7
  const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
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
  const [registeredSlots, setRegisteredSlots] = useState({}); // 3. Lưu các slot đã đăng ký

  // Lấy thông tin user từ Redux
  const { user } = useSelector((state) => state.auth);

  // State cho notifications
  const [notification, setNotification] = useState({
    show: false,
    type: "", // 'success', 'error', 'warning', 'info'
    title: "",
    message: "",
  });

  // Lấy ngày hiện tại đầu ngày (00:00:00) để so sánh chính xác
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Tính tuần hiện tại (Thứ 2 đến Thứ 7)
  const getWeekDates = () => {
    const current = new Date(selectedDate);
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1);

    const monday = new Date(current.setDate(diff));
    monday.setHours(0, 0, 0, 0);

    const weekDates = [];

    // Chỉ lấy 6 ngày: Thứ 2 đến Thứ 7 (bỏ Chủ nhật)
    for (let i = 0; i < 6; i++) {
      const nextDate = new Date(monday);
      nextDate.setDate(monday.getDate() + i);
      weekDates.push(nextDate);
    }

    return weekDates;
  };

  const weekDates = getWeekDates();

  // 3. Function để lấy lịch đã đăng ký từ API
  const fetchRegisteredSlots = async () => {
    if (!user?.user_id) return;

    try {
      console.log("Đang lấy lịch đã đăng ký cho doctor:", user.user_id);
      const response = await doctorService.fetchAvailableTimeslotsByDoctorId(
        user.user_id
      );

      console.log("Dữ liệu từ API:", response);

      if (response?.data && Array.isArray(response.data)) {
        const registered = {};

        response.data.forEach((slot) => {
          if (slot.date && slot.time_start && slot.time_end) {
            const slotDate = slot.date;
            // Chuyển đổi time từ HH:MM:SS thành HH:MM - HH:MM format
            const startTime = slot.time_start.substring(0, 5); // 07:30
            const endTime = slot.time_end.substring(0, 5); // 11:30
            const timeSlotKey = `${startTime} - ${endTime}`;

            if (!registered[slotDate]) {
              registered[slotDate] = {};
            }
            registered[slotDate][timeSlotKey] = true;

            console.log(`Đã đăng ký: ${slotDate} - ${timeSlotKey}`);
          }
        });

        console.log("Registered slots:", registered);
        setRegisteredSlots(registered);
      } else {
        console.log("Không có dữ liệu lịch đã đăng ký");
        setRegisteredSlots({});
      }
    } catch (error) {
      console.error("Lỗi khi lấy lịch đã đăng ký:", error);
      setRegisteredSlots({});
    }
  };

  // Load dữ liệu khi component mount hoặc khi user/selectedDate thay đổi
  useEffect(() => {
    fetchRegisteredSlots();
  }, [user?.user_id, selectedDate]);

  // Function để hiển thị notification
  const showNotification = (type, title, message) => {
    setNotification({
      show: true,
      type,
      title,
      message,
    });

    // Tự động ẩn sau 5 giây
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 5000);
  };

  // Function để đóng notification
  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, show: false }));
  };

  // Kiểm tra xem một ngày có phải là quá khứ không
  const isPastDate = (date) => {
    return date < today;
  };

  // 2. Kiểm tra xem có phải là tuần hiện tại không
  const isCurrentWeek = () => {
    const currentWeekMonday = new Date(today);
    const currentDay = currentWeekMonday.getDay();
    const diff =
      currentWeekMonday.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
    currentWeekMonday.setDate(diff);
    currentWeekMonday.setHours(0, 0, 0, 0);

    const selectedWeekMonday = weekDates[0];

    return selectedWeekMonday.getTime() === currentWeekMonday.getTime();
  };

  // 3. Kiểm tra xem slot đã được đăng ký chưa
  const isSlotRegistered = (dayIndex, timeSlot) => {
    const date = weekDates[dayIndex];
    const dateStr = dayjs(date).format("YYYY-MM-DD");
    const isRegistered =
      registeredSlots[dateStr] && registeredSlots[dateStr][timeSlot];

    if (isRegistered) {
      console.log(`Slot đã đăng ký: ${dateStr} - ${timeSlot}`);
    }

    return isRegistered;
  };

  // Kiểm tra xem một ô thời gian có nên vô hiệu hóa không
  const isTimeSlotDisabled = (dayIndex, timeSlot) => {
    const date = weekDates[dayIndex];

    // 1. Không thể chọn ngày trong quá khứ
    if (isPastDate(date)) {
      return true;
    }

    // 2. Trong tuần hiện tại không được đặt lịch nữa
    if (isCurrentWeek()) {
      return true;
    }

    // 3. Slot đã được đăng ký thì không được sửa (QUAN TRỌNG)
    if (isSlotRegistered(dayIndex, timeSlot)) {
      return true;
    }

    return false;
  };

  // Xử lý khi click vào ô lịch
  const handleToggleTimeSlot = (day, timeSlot, dayIndex) => {
    // Kiểm tra nếu slot đã được đăng ký
    if (isSlotRegistered(dayIndex, timeSlot)) {
      showNotification(
        "warning",
        "Không thể thay đổi",
        "Lịch này đã được đăng ký và không thể chỉnh sửa."
      );
      return;
    }

    // Kiểm tra các điều kiện vô hiệu hóa khác
    if (isTimeSlotDisabled(dayIndex, timeSlot)) {
      if (isCurrentWeek()) {
        showNotification(
          "warning",
          "Không thể đặt lịch",
          "Trong tuần hiện tại không được đặt lịch nữa. Vui lòng chọn tuần kế tiếp."
        );
      } else if (isPastDate(weekDates[dayIndex])) {
        showNotification(
          "warning",
          "Không thể chọn",
          "Không thể chọn lịch làm việc trong quá khứ."
        );
      }
      return;
    }

    // Nếu không có vấn đề gì, cho phép toggle
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
    mondayOfPrevWeek.setDate(diff);
    mondayOfPrevWeek.setHours(0, 0, 0, 0);

    // Không cho phép quay về tuần trong quá khứ
    if (mondayOfPrevWeek < today) {
      showNotification(
        "warning",
        "Không thể chọn",
        "Không thể chọn lịch làm việc trong quá khứ"
      );
      return;
    }

    setSelectedDate(prevWeek);
    setSchedule(initSchedule);
  };

  // Xử lý khi chuyển đến tuần sau
  const handleNextWeek = () => {
    const nextWeek = new Date(selectedDate);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setSelectedDate(nextWeek);
    setSchedule(initSchedule);
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
      // 2. Kiểm tra xem có phải đang cố đặt lịch cho tuần hiện tại không
      if (isCurrentWeek()) {
        showNotification(
          "warning",
          "Không thể đặt lịch",
          "Trong tuần hiện tại không được đặt lịch nữa. Vui lòng chọn tuần kế tiếp."
        );
        setIsLoading(false);
        return;
      }

      const scheduleDaysWithSelectedSlots = Object.entries(schedule).filter(
        ([_, slots]) => Object.values(slots).some((isSelected) => isSelected)
      );

      if (scheduleDaysWithSelectedSlots.length === 0) {
        showNotification(
          "warning",
          "Vui lòng chọn",
          "Vui lòng chọn ít nhất một khung giờ làm việc!"
        );
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

      showNotification(
        "success",
        "Thành công",
        "Đăng ký lịch làm việc thành công!"
      );

      // Reset lịch và refresh dữ liệu đã đăng ký
      const allFalse = days.reduce((acc, day) => {
        acc[day] = timeSlots.reduce((slots, time) => {
          slots[time] = false;
          return slots;
        }, {});
        return acc;
      }, {});
      setSchedule(allFalse);

      // 3. Tải lại danh sách lịch đã đăng ký
      await fetchRegisteredSlots();
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Lỗi ${error.response.status}: ${error.response.statusText}`;
        showNotification("error", "Lỗi", errorMessage);
      } else if (error.request) {
        showNotification(
          "error",
          "Lỗi kết nối",
          "Không thể kết nối đến server."
        );
      } else {
        showNotification("error", "Lỗi", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      {/* Notification Toast */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ease-in-out ${
            notification.show
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0"
          }`}
        >
          <div
            className={`rounded-lg shadow-lg p-4 ${
              notification.type === "success"
                ? "bg-green-50 border border-green-200"
                : notification.type === "error"
                ? "bg-red-50 border border-red-200"
                : notification.type === "warning"
                ? "bg-yellow-50 border border-yellow-200"
                : "bg-blue-50 border border-blue-200"
            }`}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <i
                  className={`text-xl ${
                    notification.type === "success"
                      ? "fas fa-check-circle text-green-400"
                      : notification.type === "error"
                      ? "fas fa-times-circle text-red-400"
                      : notification.type === "warning"
                      ? "fas fa-exclamation-triangle text-yellow-400"
                      : "fas fa-info-circle text-blue-400"
                  }`}
                ></i>
              </div>
              <div className="ml-3 flex-1">
                <h3
                  className={`text-sm font-medium ${
                    notification.type === "success"
                      ? "text-green-800"
                      : notification.type === "error"
                      ? "text-red-800"
                      : notification.type === "warning"
                      ? "text-yellow-800"
                      : "text-blue-800"
                  }`}
                >
                  {notification.title}
                </h3>
                <p
                  className={`mt-1 text-sm ${
                    notification.type === "success"
                      ? "text-green-700"
                      : notification.type === "error"
                      ? "text-red-700"
                      : notification.type === "warning"
                      ? "text-yellow-700"
                      : "text-blue-700"
                  }`}
                >
                  {notification.message}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  onClick={closeNotification}
                  className={`rounded-md inline-flex ${
                    notification.type === "success"
                      ? "text-green-400 hover:text-green-500"
                      : notification.type === "error"
                      ? "text-red-400 hover:text-red-500"
                      : notification.type === "warning"
                      ? "text-yellow-400 hover:text-yellow-500"
                      : "text-blue-400 hover:text-blue-500"
                  } focus:outline-none`}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900">
            Từ {formatDate(weekDates[0])} - {formatDate(weekDates[5])}
          </h2>
          {isCurrentWeek() && (
            <p className="text-sm text-red-600 mt-1">
              (Tuần hiện tại - không thể đặt lịch)
            </p>
          )}
        </div>

        <button
          onClick={handleNextWeek}
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
                          isPastDate(weekDates[index]) || isCurrentWeek()
                            ? "text-gray-400"
                            : ""
                        }
                      >
                        {day}
                      </div>
                      <div
                        className={`text-xs ${
                          isPastDate(weekDates[index]) || isCurrentWeek()
                            ? "text-gray-400"
                            : ""
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
                    {days.map((day, dayIndex) => {
                      const isDisabled = isTimeSlotDisabled(dayIndex, timeSlot);
                      const isRegistered = isSlotRegistered(dayIndex, timeSlot);
                      const isSelected = schedule[day][timeSlot];

                      return (
                        <td
                          key={`${day}-${timeSlot}`}
                          className="py-4 px-4 border-b border-gray-200 text-center"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleTimeSlot(day, timeSlot, dayIndex)
                            }
                            disabled={isDisabled}
                            className={`w-8 h-8 rounded-md transition duration-150 ease-in-out flex items-center justify-center ${
                              isRegistered
                                ? "bg-green-500 text-white cursor-not-allowed shadow-md"
                                : isDisabled
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                                : isSelected
                                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                            title={
                              isRegistered
                                ? "✅ Đã đăng ký - không thể chỉnh sửa"
                                : isCurrentWeek()
                                ? "⚠️ Tuần hiện tại không được đặt lịch"
                                : isDisabled
                                ? "❌ Không thể chọn"
                                : isSelected
                                ? "🔵 Đã chọn - nhấn để bỏ chọn"
                                : "⚪ Nhấn để chọn"
                            }
                            aria-label={`Select ${timeSlot} on ${day}`}
                          >
                            {isRegistered && (
                              <i className="fas fa-check text-white"></i>
                            )}
                            {isSelected && !isRegistered && (
                              <i className="fas fa-check text-white"></i>
                            )}
                          </button>
                        </td>
                      );
                    })}
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
              <span>Đang chọn</span>
            </div>
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              <span>Đã đăng ký</span>
            </div>
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
              <span>Chưa chọn</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-100 rounded mr-2 opacity-50"></div>
              <span>Không thể chọn</span>
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
              disabled={isLoading || isCurrentWeek()}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2 hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Xóa tất cả
            </button>
            <button
              type="submit"
              disabled={isLoading || isCurrentWeek()}
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
