import React from "react";
import { useState } from "react";
import classNames from "classnames/bind";
import styles from "../MenstrualCycle.module.scss";
import menstrualService from "../../../services/menstrual.service";

const cx = classNames.bind(styles);

function CycleInputForm({ cycleData, onDataChange }) {
  const [timer, setTimer] = useState(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const daysOfWeek = [
    { value: "monday", label: "Thứ 2", short: "T2" },
    { value: "tuesday", label: "Thứ 3", short: "T3" },
    { value: "wednesday", label: "Thứ 4", short: "T4" },
    { value: "thursday", label: "Thứ 5", short: "T5" },
    { value: "friday", label: "Thứ 6", short: "T6" },
    { value: "saturday", label: "Thứ 7", short: "T7" },
    { value: "sunday", label: "Chủ nhật", short: "CN" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validate ngày đầu kỳ kinh nguyệt
    if (name === "lastPeriodDate") {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // Đặt về cuối ngày hôm nay

      if (selectedDate > today) {
        alert(
          "⚠️ Không thể chọn ngày trong tương lai!\nVui lòng chọn ngày hôm nay hoặc trước đó."
        );
        return; // Không cập nhật state nếu ngày không hợp lệ
      }
    }

    onDataChange({ [name]: value });
  };

  const setQuickTime = (time) => {
    onDataChange({ birthControlTime: time });
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleDaySelection = (dayValue) => {
    setSelectedDays((prev) => {
      if (prev.includes(dayValue)) {
        return prev.filter((day) => day !== dayValue);
      } else {
        return [...prev, dayValue];
      }
    });
  };

  const selectAllDays = () => {
    const allDays = daysOfWeek.map((day) => day.value);
    setSelectedDays(allDays);
  };

  const clearAllDays = () => {
    setSelectedDays([]);
  };

  const setReminder = () => {
    if (!cycleData.birthControlTime) {
      alert("⚠️ Vui lòng chọn thời gian uống thuốc trước!");
      return;
    }

    if (selectedDays.length === 0) {
      alert("⚠️ Vui lòng chọn ít nhất một ngày trong tuần!");
      return;
    }

    if (isTimerActive) {
      clearTimeout(timer);
      setIsTimerActive(false);
      setTimer(null);
      alert("✅ Đã hủy tất cả hẹn giờ!");
      return;
    }

    // Thiết lập nhiều hẹn giờ cho các ngày đã chọn
    setupMultipleReminders();
  };

  const setupMultipleReminders = () => {
    const [hours, minutes] = cycleData.birthControlTime.split(":");
    const now = new Date();
    let nextReminderTime = null;

    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(now);
      checkDate.setDate(now.getDate() + i);
      checkDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const dayOfWeek = getDayValue(checkDate.getDay());

      if (selectedDays.includes(dayOfWeek) && checkDate > now) {
        nextReminderTime = checkDate;
        break;
      }
    }

    if (!nextReminderTime) {
      alert("❌ Không thể tìm thấy thời gian hẹn giờ tiếp theo!");
      return;
    }

    const timeUntilReminder = nextReminderTime.getTime() - now.getTime();

    const newTimer = setTimeout(() => {
      const dayName = daysOfWeek.find(
        (day) => day.value === getDayValue(nextReminderTime.getDay())
      )?.label;
      alert(`⏰ Đến giờ uống thuốc tránh thai rồi! (${dayName})`);

      // Tự động đặt hẹn giờ tiếp theo
      setIsTimerActive(false);
      setTimer(null);
      setTimeout(() => setupMultipleReminders(), 1000);
    }, timeUntilReminder);

    setTimer(newTimer);
    setIsTimerActive(true);

    const dayName = daysOfWeek.find(
      (day) => day.value === getDayValue(nextReminderTime.getDay())
    )?.label;
    const timeString = nextReminderTime.toLocaleString("vi-VN");
    const selectedDayNames = selectedDays
      .map((day) => daysOfWeek.find((d) => d.value === day)?.short)
      .join(", ");

    alert(
      `✅ Đã đặt hẹn giờ!\n📅 Ngày: ${selectedDayNames}\n⏰ Hẹn giờ tiếp theo: ${dayName}, ${timeString}`
    );
  };

  const getDayValue = (dayIndex) => {
    const dayMap = {
      0: "sunday",
      1: "monday",
      2: "tuesday",
      3: "wednesday",
      4: "thursday",
      5: "friday",
      6: "saturday",
    };
    return dayMap[dayIndex];
  };

  const handleConfirmSave = async () => {
    try {
      setIsSaving(true);

      // Kiểm tra dữ liệu hợp lệ
      if (!cycleData.lastPeriodDate) {
        alert("⚠️ Vui lòng chọn ngày đầu kì kinh nguyệt gần nhất!");
        return;
      }

      // Validate ngày không được là tương lai
      const selectedDate = new Date(cycleData.lastPeriodDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      if (selectedDate > today) {
        alert("⚠️ Ngày đầu kỳ kinh nguyệt không thể là ngày trong tương lai!");
        return;
      }

      // Validate ngày không được quá xa trong quá khứ (ví dụ: không quá 6 tháng)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      if (selectedDate < sixMonthsAgo) {
        const confirmOldDate = window.confirm(
          "⚠️ Ngày bạn chọn đã lâu hơn 6 tháng.\nDữ liệu dự đoán có thể không chính xác.\n\nBạn có muốn tiếp tục không?"
        );
        if (!confirmOldDate) return;
      }

      if (
        !cycleData.cycleLength ||
        cycleData.cycleLength < 21 ||
        cycleData.cycleLength > 35
      ) {
        alert("⚠️ Độ dài chu kì phải từ 21–35 ngày!");
        return;
      }

      if (
        !cycleData.periodLength ||
        cycleData.periodLength < 3 ||
        cycleData.periodLength > 8
      ) {
        alert("⚠️ Số ngày kinh nguyệt phải từ 3–8 ngày!");
        return;
      }

      // Format lại văn bản xác nhận
      const confirmText = [
        "💡 XÁC NHẬN LƯU CHU KỲ 💡",
        "",
        `📅 Ngày bắt đầu: ${new Date(
          cycleData.lastPeriodDate
        ).toLocaleDateString("vi-VN")}`,
        `🔄 Chu kỳ dài: ${cycleData.cycleLength} ngày`,
        `📊 Số ngày hành kinh: ${cycleData.periodLength} ngày`,
        "",
        "✅ Bạn có muốn lưu thông tin này không?",
      ].join("\n");

      const isConfirmed = window.confirm(confirmText);
      if (!isConfirmed) return;

      // Gọi API lưu lại
      await menstrualService.updateCycleData(cycleData);

      // Hiển thị alert thành công ngắn gọn
      alert("✅ Đã lưu thành công!\nDự đoán chu kỳ sẽ được cập nhật.");
    } catch (error) {
      console.error("Error saving cycle data:", error);
      alert("❌ Có lỗi xảy ra khi lưu thông tin!\nVui lòng thử lại sau.");
    } finally {
      setIsSaving(false);
    }
  };

  // Thêm helper function để lấy ngày hôm nay theo format YYYY-MM-DD
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className={cx("input-section", "col-span-1")}>
      <h2>Thông tin chu kì</h2>

      <div className={cx("form-group")} style={{ display: "block" }}>
        <span>Ngày đầu kì kinh nguyệt gần nhất:</span>
        <input
          type="date"
          name="lastPeriodDate"
          value={cycleData.lastPeriodDate}
          onChange={handleInputChange}
          max={getTodayString()} // Thêm thuộc tính max để ngăn chọn ngày tương lai
          style={{ width: "100%" }}
        />
        <small
          style={{
            color: "#666",
            fontSize: "0.8rem",
            marginTop: "4px",
            display: "block",
          }}
        >
          * Không thể chọn ngày trong tương lai
        </small>
      </div>

      <div className={cx("form-group")} style={{ display: "block" }}>
        <span>Độ dài chu kì (ngày):</span>
        <input
          type="number"
          name="cycleLength"
          value={cycleData.cycleLength}
          onChange={handleInputChange}
          min="21"
          max="35"
          style={{ width: "100%" }}
        />
      </div>

      <div className={cx("form-group")} style={{ display: "block" }}>
        <span>Số ngày kinh nguyệt:</span>
        <input
          type="number"
          name="periodLength"
          value={cycleData.periodLength}
          onChange={handleInputChange}
          min="3"
          max="8"
          style={{ width: "100%" }}
        />
      </div>

      <div className={cx("form-group")}>
        <button
          className={cx("confirm-btn")}
          onClick={handleConfirmSave}
          disabled={isSaving}
        >
          {isSaving ? "⏳ Đang lưu..." : "💾 Xác nhận lưu thông tin chu kì"}
        </button>
      </div>

      <div className={cx("form-group")}>
        <span>Thời gian uống thuốc tránh thai:</span>
        <div className={cx("time-input-container")}>
          <input
            type="time"
            name="birthControlTime"
            value={cycleData.birthControlTime}
            onChange={handleInputChange}
            min="06:00"
            max="23:00"
            className={cx("time-input")}
          />

          <button
            type="button"
            className={cx("current-time-btn")}
            onClick={() => setQuickTime(getCurrentTime())}
            title="Đặt thời gian hiện tại"
          >
            🕐 Bây giờ
          </button>
        </div>

        <div className={cx("quick-time-buttons")}>
          <span className={cx("quick-time-label")}>Thời gian phổ biến:</span>
          <div className={cx("time-buttons-grid")}>
            <button
              type="button"
              className={cx("quick-time-btn")}
              onClick={() => setQuickTime("07:00")}
            >
              7:00 AM
            </button>
            <button
              type="button"
              className={cx("quick-time-btn")}
              onClick={() => setQuickTime("08:00")}
            >
              8:00 AM
            </button>
            <button
              type="button"
              className={cx("quick-time-btn")}
              onClick={() => setQuickTime("12:00")}
            >
              12:00 CH
            </button>
            <button
              type="button"
              className={cx("quick-time-btn")}
              onClick={() => setQuickTime("18:00")}
            >
              6:00 CH
            </button>
            <button
              type="button"
              className={cx("quick-time-btn")}
              onClick={() => setQuickTime("20:00")}
            >
              8:00 CH
            </button>
            <button
              type="button"
              className={cx("quick-time-btn")}
              onClick={() => setQuickTime("22:00")}
            >
              10:00 CH
            </button>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-700">
              Chọn ngày trong tuần:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm"
                onClick={selectAllDays}
                title="Chọn tất cả ngày"
              >
                Cả tuần
              </button>
              <button
                type="button"
                className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                onClick={clearAllDays}
                title="Bỏ chọn tất cả"
              >
                Xóa hết
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {daysOfWeek.map((day) => (
              <label
                key={day.value}
                className={`flex flex-col items-center p-3 border rounded-md cursor-pointer transition-colors ${
                  selectedDays.includes(day.value)
                    ? "bg-pink-100 border-pink-500 text-pink-700"
                    : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedDays.includes(day.value)}
                  onChange={() => handleDaySelection(day.value)}
                  className="sr-only"
                />
                <span className="font-bold text-lg">{day.short}</span>
                <span className="text-xs mt-1">{day.label}</span>
              </label>
            ))}
          </div>

          {selectedDays.length > 0 && (
            <div className="mt-3 p-2 bg-green-100 text-green-700 rounded-md text-sm">
              <span>✅ Đã chọn: {selectedDays.length} ngày</span>
            </div>
          )}
        </div>

        <div className={cx("reminder-section")}>
          <button
            type="button"
            className={cx("reminder-btn", { active: isTimerActive })}
            onClick={setReminder}
            title={isTimerActive ? "Hủy hẹn giờ" : "Đặt hẹn giờ"}
            disabled={!cycleData.birthControlTime || selectedDays.length === 0}
          >
            {isTimerActive ? "🔕 Hủy hẹn giờ" : "⏰ Đặt hẹn giờ"}
          </button>

          {isTimerActive && (
            <div className={cx("reminder-status")}>
              <span className={cx("status-text")}>
                🔔 Đang hoạt động cho {selectedDays.length} ngày/tuần
              </span>
            </div>
          )}
        </div>

        <small
          style={{
            color: "#7f8c8d",
            fontSize: "0.85rem",
            marginTop: "5px",
            display: "block",
          }}
        >
          Thời gian nên đặt hẹn từ 6:00 sáng đến 11:00 tối
        </small>
      </div>
    </div>
  );
}

export default CycleInputForm;
