import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosClient from "../../services/axiosClient";
import doctorService from "../../services/doctor.service";
import dayjs from "dayjs";
import { set } from "date-fns";

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

  const [doctor, setDoctor] = useState(null);
  const [schedule, setSchedule] = useState(initSchedule);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [bookedTimeSlots, setBookedTimeSlots] = useState([]); // Lưu danh sách slot đã book
  const [slotData, setSlotData] = useState([]);
  // Lấy thông tin user từ Redux
  const { user } = useSelector((state) => state.auth);

  // State cho notifications
  const [notification, setNotification] = useState({
    show: false,
    type: "", // 'success', 'error', 'warning', 'info'
    title: "",
    message: "",
  });

  useEffect(() => {
    const fetchProfileDoctor = async () => {
      try {
        setIsLoading(true);
        const response = await axiosClient.get(`/v1/doctors/profile`, {
          headers: {
            "x-access-token": localStorage.getItem("accessToken"),
          },
        });
        console.log("Doctor profile response:", response);
        const data = response.data;
        localStorage.setItem("doctorProfile", JSON.stringify(data.data));
        if (!data.success) {
          throw new Error(data.message || "Failed to fetch doctor profile");
        }

        setDoctor(data.data);
        console.log("Doctor profile data:", data.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching doctor profile:", error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileDoctor();
  }, []);

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
  const loadDoctorSchedule = async () => {
    try {
      const doctorId = doctor.doctor_id;

      console.log("📞 Gọi API với doctor_id:", doctorId);
      const response = await doctorService.fetchAvailableTimeslotsByDoctorId(
        doctorId
      );

      console.log("📥 API Response:", response);

      if (response?.data) {
        const scheduleData = response.data.schedules || [];
        console.log("📋 Schedule Data:", scheduleData);

        // Lưu vào state
        setSlotData(scheduleData);

        // Xử lý dữ liệu đã book - CẦN SỬA LOGIC NÀY
        const bookedSlots = [];

        scheduleData.forEach((schedule) => {
          // Kiểm tra nếu có timeslots array
          if (schedule.timeslots && Array.isArray(schedule.timeslots)) {
            schedule.timeslots.forEach((timeslot) => {
              // Chỉ lấy những timeslot đã được book (is_booked = true)
              if (timeslot) {
                const bookedSlot = {
                  date: schedule.date,
                  timeStart: timeslot.time_start
                    ? timeslot.time_start.substring(0, 5)
                    : "",
                  timeEnd: timeslot.time_end
                    ? timeslot.time_end.substring(0, 5)
                    : "",
                  timeRange:
                    timeslot.time_start && timeslot.time_end
                      ? `${timeslot.time_start.substring(
                          0,
                          5
                        )} - ${timeslot.time_end.substring(0, 5)}`
                      : "",
                  timeslot_id: timeslot.timeslot_id,
                  is_booked: timeslot.is_booked,
                  fullTimeslot: timeslot,
                };
                bookedSlots.push(bookedSlot);
              }
            });
          }
        });

        setBookedTimeSlots(bookedSlots);
        console.log("✅ Processed booked slots:", bookedSlots);
      } else {
        console.log(
          "❌ Không có dữ liệu schedule hoặc dữ liệu không phải array"
        );
        setBookedTimeSlots([]);
        setSlotData([]);
      }
    } catch (error) {
      console.error("❌ Lỗi khi tải schedule:", error);
      setBookedTimeSlots([]);
      setSlotData([]);
    }
  };

  // Load dữ liệu khi component mount hoặc khi thay đổi
  useEffect(() => {
    loadDoctorSchedule();
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
      console.log(
        `🟢 Slot đã đăng ký được phát hiện: ${dateStr} - ${timeSlot}`
      );
    }

    return isRegistered;
  };

  // Function để kiểm tra slot đã được book chưa
  const isTimeSlotBooked = (dayIndex, timeSlot) => {
    const currentDate = weekDates[dayIndex];
    const dateString = dayjs(currentDate).format("YYYY-MM-DD");

    // Tìm trong danh sách booked slots
    const isBooked = bookedTimeSlots.some(
      (slot) => slot.date === dateString && slot.timeRange === timeSlot
    );

    if (isBooked) {
      console.log(`🟢 Found booked slot: ${dateString} - ${timeSlot}`);
    }

    return isBooked;
  };

  // Function kiểm tra disable
  const shouldDisableSlot = (dayIndex, timeSlot) => {
    const date = weekDates[dayIndex];

    // 1. Ngày quá khứ
    if (isPastDate(date)) {
      return true;
    }

    // 2. Tuần hiện tại
    if (isCurrentWeek()) {
      return true;
    }

    // 3. Slot đã được book
    if (isTimeSlotBooked(dayIndex, timeSlot)) {
      return true;
    }

    return false;
  };

  // Xử lý khi click vào ô lịch
  const handleSlotClick = (day, timeSlot, dayIndex) => {
    console.log(`👆 Clicked: ${day} - ${timeSlot}`);

    // Kiểm tra slot đã book
    if (isTimeSlotBooked(dayIndex, timeSlot)) {
      console.log("🚫 Slot đã được đăng ký");
      showNotification(
        "warning",
        "Slot đã được đăng ký",
        "Khung giờ này đã được đăng ký trước đó."
      );
      return;
    }

    // Kiểm tra tuần hiện tại
    if (isCurrentWeek()) {
      console.log("🚫 Tuần hiện tại");
      showNotification(
        "warning",
        "Không thể đặt lịch",
        "Không thể đăng ký lịch cho tuần hiện tại."
      );
      return;
    }

    // Kiểm tra ngày quá khứ
    if (isPastDate(weekDates[dayIndex])) {
      console.log("🚫 Ngày quá khứ");
      showNotification(
        "warning",
        "Không thể chọn",
        "Không thể chọn ngày trong quá khứ."
      );
      return;
    }

    // Cho phép toggle
    console.log("✅ Toggle slot");
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

  // Function để reset tất cả các slot đã chọn
  const handleReset = () => {
    setSchedule(initSchedule);
    setBookedTimeSlots([]);
    showNotification(
      "info",
      "Đã đặt lại",
      "Tất cả các slot đã được đặt lại về trạng thái ban đầu."
    );
  };

  // Xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isCurrentWeek()) {
        showNotification(
          "warning",
          "Không thể đặt lịch",
          "Không thể đăng ký lịch cho tuần hiện tại."
        );
        setIsLoading(false);
        return;
      }

      // Lấy tất cả các ngày có slot được chọn
      const scheduleDaysWithSelectedSlots = Object.entries(schedule).filter(
        ([_, slots]) => Object.values(slots).some((isSelected) => isSelected)
      );

      if (scheduleDaysWithSelectedSlots.length === 0) {
        showNotification(
          "warning",
          "Chưa chọn slot",
          "Vui lòng chọn ít nhất một khung giờ làm việc!"
        );
        setIsLoading(false);
        return;
      }

      // Tạo schedule array cho tất cả các ngày có slot được chọn
      const scheduleArray = scheduleDaysWithSelectedSlots.map(
        ([day, timeSlotsObj]) => {
          const dayIndex = days.indexOf(day);
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

          return {
            date: formattedDate,
            timeSlots: selectedTimeSlots,
          };
        }
      );

      // Tạo payload theo định dạng mới
      const schedulePayload = {
        weekStartDate: dayjs(weekDates[0]).format("YYYY-MM-DD"), // Ngày đầu tuần (Thứ 2)
        schedule: scheduleArray,
      };

      console.log("📤 Sending schedule:", schedulePayload);

      const result = await doctorService.fetchRegisterDoctorSchedule(
        schedulePayload
      );
      console.log("✅ Registration result:", result);

      showNotification(
        "success",
        "Đăng ký thành công",
        "Lịch làm việc đã được đăng ký!"
      );

      // Reset form
      setSchedule(initSchedule);

      // Reload schedule data
      await loadDoctorSchedule();
    } catch (error) {
      console.error("❌ Registration error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Có lỗi xảy ra";
      showNotification("error", "Lỗi đăng ký", errorMessage);
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
                      const isSlotDisabled = shouldDisableSlot(
                        dayIndex,
                        timeSlot
                      );
                      const isSlotBooked = isTimeSlotBooked(dayIndex, timeSlot);
                      const isSlotSelected = schedule[day][timeSlot];

                      return (
                        <td
                          key={`${day}-${timeSlot}`}
                          className="py-4 px-4 border-b border-gray-200 text-center"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              handleSlotClick(day, timeSlot, dayIndex)
                            }
                            disabled={isSlotDisabled}
                            className={`w-8 h-8 rounded-md transition duration-150 ease-in-out flex items-center justify-center font-bold ${
                              isSlotBooked
                                ? "bg-green-500 text-white cursor-not-allowed shadow-lg border-2 border-green-400"
                                : isSlotDisabled
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                                : isSlotSelected
                                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                            title={
                              isSlotBooked
                                ? "🟢 ĐÃ ĐĂNG KÝ TRƯỚC ĐÓ"
                                : isCurrentWeek()
                                ? "⚠️ Tuần hiện tại - không thể đặt"
                                : isSlotDisabled
                                ? "❌ Không thể chọn"
                                : isSlotSelected
                                ? "🔵 Đã chọn - click để bỏ"
                                : "⚪ Click để chọn"
                            }
                          >
                            {isSlotBooked && (
                              <i className="fas fa-check-circle text-white text-sm"></i>
                            )}
                            {isSlotSelected && !isSlotBooked && (
                              <i className="fas fa-check text-white text-sm"></i>
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
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              <i className="fas fa-redo mr-2"></i>
              Đặt lại
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
