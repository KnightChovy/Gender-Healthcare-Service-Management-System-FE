import React from "react";
import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "../MenstrualCycle.module.scss";
import menstrualService from "../../../services/menstrual.service";
import * as Yup from "yup";

const cx = classNames.bind(styles);

function CycleInputForm({ cycleData, onDataChange, onSaveSuccess }) {
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Yup validation schema
  const validationSchema = Yup.object().shape({
    lastPeriodDate: Yup.date()
      .required("Ngày đầu kì kinh nguyệt là bắt buộc")
      .max(new Date(), "Không thể chọn ngày trong tương lai")
      .min(
        new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000),
        "Ngày không được quá 6 tháng trước"
      ),
    cycleLength: Yup.number()
      .required("Độ dài chu kì là bắt buộc")
      .integer("Độ dài chu kì phải là số nguyên")
      .min(21, "Độ dài chu kì phải từ 21 ngày")
      .max(35, "Độ dài chu kì không được quá 35 ngày")
      .typeError("Độ dài chu kì phải là số"),
    periodLength: Yup.number()
      .required("Số ngày kinh nguyệt là bắt buộc")
      .integer("Số ngày kinh nguyệt phải là số nguyên")
      .min(3, "Số ngày kinh nguyệt phải từ 3 ngày")
      .max(8, "Số ngày kinh nguyệt không được quá 8 ngày")
      .typeError("Số ngày kinh nguyệt phải là số"),
    birthControlTime: Yup.string()
      .matches(
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Thời gian phải có định dạng HH:MM"
      )
      .nullable(),
  });

  // Validate single field
  const validateField = async (fieldName, value) => {
    try {
      await Yup.reach(validationSchema, fieldName).validate(value);
      setValidationErrors((prev) => ({
        ...prev,
        [fieldName]: null,
      }));
      return true;
    } catch (error) {
      setValidationErrors((prev) => ({
        ...prev,
        [fieldName]: error.message,
      }));
      return false;
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    console.log(`Input changed: ${name} = ${value}`); // Debug log

    let processedValue = value;

    // Only allow numeric input for cycleLength and periodLength
    if ((name === "cycleLength" || name === "periodLength") && value) {
      // Remove any non-digit characters
      processedValue = value.replace(/[^0-9]/g, "");

      // Update the input field to show only numeric value
      if (processedValue !== value) {
        e.target.value = processedValue;
      }
    }

    // Update the parent state
    onDataChange({ [name]: processedValue });

    // Validate the field
    await validateField(name, processedValue);
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

  const sendAllEmail = async () => {
    try {
      const result = await menstrualService.sendAllEmail();
      console.log("Email sent successfully:", result);
    } catch (error) {
      console.error("Error sending email reminders:", error);
    }
  };

  const handleConfirmSave = async () => {
    if (isSaving) return; // Prevent double submission

    setIsSaving(true);
    console.log("=== STARTING SAVE PROCESS ===");
    console.log("Current cycleData:", cycleData);

    try {
      // Check authentication first
      const accessToken = localStorage.getItem("accessToken");
      console.log("Access token exists:", !!accessToken);
      if (!accessToken) {
        alert("❌ Bạn cần đăng nhập để lưu dữ liệu!");
        setIsSaving(false);
        return;
      }

      // Validate all data using Yup schema
      try {
        await validationSchema.validate(cycleData, { abortEarly: false });
        // Clear all validation errors if validation passes
        setValidationErrors({});
      } catch (validationError) {
        console.log("Validation errors:", validationError.errors);

        // Set validation errors for display
        const errors = {};
        if (validationError.inner) {
          validationError.inner.forEach((error) => {
            errors[error.path] = error.message;
          });
        }
        setValidationErrors(errors);

        // Show first error to user
        alert(`⚠️ Dữ liệu không hợp lệ:\n${validationError.errors[0]}`);
        setIsSaving(false);
        return;
      }

      // Convert to numbers for additional checks
      const cycleLength = parseInt(cycleData.cycleLength);
      const periodLength = parseInt(cycleData.periodLength);

      // Validate ngày không được quá xa trong quá khứ (warning only)
      const selectedDate = new Date(cycleData.lastPeriodDate);
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      if (selectedDate < sixMonthsAgo) {
        const confirmOldDate = window.confirm(
          "⚠️ Ngày bạn chọn đã lâu hơn 6 tháng.\nDữ liệu dự đoán có thể không chính xác.\n\nBạn có muốn tiếp tục không?"
        );
        if (!confirmOldDate) {
          setIsSaving(false);
          return;
        }
      }

      // Format lại văn bản xác nhận
      const confirmText = [
        "💡 XÁC NHẬN LƯU CHU KỲ 💡",
        "",
        `📅 Ngày bắt đầu: ${new Date(
          cycleData.lastPeriodDate
        ).toLocaleDateString("vi-VN")}`,
        `🔄 Chu kỳ dài: ${cycleLength} ngày`,
        `📊 Số ngày hành kinh: ${periodLength} ngày`,
        "",
        "✅ Bạn có muốn lưu thông tin này không?",
      ].join("\n");

      const confirmSave = window.confirm(confirmText);
      if (!confirmSave) {
        setIsSaving(false); // Reset saving state
        return;
      }

      // Gọi API để lưu dữ liệu
      const saveData = {
        lastPeriodDate: cycleData.lastPeriodDate,
        cycleLength: cycleLength,
        periodLength: periodLength,
        pillTime: cycleData.birthControlTime || "", // Changed from birthControlTime to pillTime
      };

      // Validate data format before sending
      if (
        !saveData.lastPeriodDate ||
        !saveData.cycleLength ||
        !saveData.periodLength
      ) {
        throw new Error("Missing required fields in saveData");
      }

      const result = await menstrualService.updateCycleData(saveData);

      // Simplified success handling
      alert("✅ Đã lưu thông tin chu kỳ thành công!");

      // Call the refresh callback if provided
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (error) {
      console.error("Error saving cycle data:", error);

      // Detailed error logging
      if (error.response) {
        // Handle specific error codes
        switch (error.response.status) {
          case 401:
            alert("❌ Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
            break;
          case 400: {
            const errorMsg =
              error.response.data?.message || "Dữ liệu không hợp lệ";
            alert(`❌ Lỗi dữ liệu: ${errorMsg}`);
            break;
          }
          case 403:
            alert("❌ Bạn không có quyền thực hiện thao tác này!");
            break;
          case 500:
            alert("❌ Lỗi server. Vui lòng thử lại sau!");
            break;
          default:
            alert(
              `❌ Lỗi từ server (${error.response.status}): ${
                error.response.data?.message || "Không xác định"
              }`
            );
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert(
          "❌ Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng!"
        );
      } else {
        console.error("Error:", error.message);
        alert(`❌ Có lỗi xảy ra: ${error.message}`);
      }
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
          value={cycleData?.lastPeriodDate || ""}
          onChange={handleInputChange}
          max={getTodayString()}
          style={{
            width: "100%",
            borderColor: validationErrors.lastPeriodDate
              ? "#ff4444"
              : undefined,
          }}
        />
        {validationErrors.lastPeriodDate && (
          <div
            style={{
              color: "#ff4444",
              fontSize: "0.8rem",
              marginTop: "4px",
              display: "block",
            }}
          >
            {validationErrors.lastPeriodDate}
          </div>
        )}
        <small
          style={{
            color: "#666",
            fontSize: "0.8rem",
            marginTop: "4px",
            display: "block",
          }}
        >
          * Chọn ngày bắt đầu chu kỳ kinh nguyệt gần nhất
        </small>
      </div>

      <div className={cx("form-group")} style={{ display: "block" }}>
        <span>Độ dài chu kì (ngày):</span>
        <input
          type="number"
          name="cycleLength"
          value={cycleData?.cycleLength || ""}
          onChange={handleInputChange}
          min="21"
          max="35"
          style={{
            width: "100%",
            borderColor: validationErrors.cycleLength ? "#ff4444" : undefined,
          }}
          placeholder="Nhập số từ 21-35"
        />
        {validationErrors.cycleLength && (
          <div
            style={{
              color: "#ff4444",
              fontSize: "0.8rem",
              marginTop: "4px",
              display: "block",
            }}
          >
            {validationErrors.cycleLength}
          </div>
        )}
        <small
          style={{
            color: "#666",
            fontSize: "0.8rem",
            marginTop: "4px",
            display: "block",
          }}
        >
          * Nhập độ dài chu kỳ kinh nguyệt (21-35 ngày)
        </small>
      </div>

      <div className={cx("form-group")} style={{ display: "block" }}>
        <span>Số ngày kinh nguyệt:</span>
        <input
          type="number"
          name="periodLength"
          value={cycleData?.periodLength || ""}
          onChange={handleInputChange}
          min="3"
          max="8"
          style={{
            width: "100%",
            borderColor: validationErrors.periodLength ? "#ff4444" : undefined,
          }}
          placeholder="Nhập số từ 3-8"
        />
        {validationErrors.periodLength && (
          <div
            style={{
              color: "#ff4444",
              fontSize: "0.8rem",
              marginTop: "4px",
              display: "block",
            }}
          >
            {validationErrors.periodLength}
          </div>
        )}
        <small
          style={{
            color: "#666",
            fontSize: "0.8rem",
            marginTop: "4px",
            display: "block",
          }}
        >
          * Nhập số ngày hành kinh (3-8 ngày)
        </small>
      </div>

      <div className={cx("form-group")}>
        <span>Thời gian uống thuốc tránh thai:</span>
        <div className={cx("time-input-container")}>
          <input
            type="time"
            name="birthControlTime"
            value={cycleData?.birthControlTime || ""}
            onChange={handleInputChange}
            min="06:00"
            max="23:00"
            className={cx("time-input")}
            style={{
              borderColor: validationErrors.birthControlTime
                ? "#ff4444"
                : undefined,
            }}
          />
          {validationErrors.birthControlTime && (
            <div
              style={{
                color: "#ff4444",
                fontSize: "0.8rem",
                marginTop: "4px",
                display: "block",
                width: "100%",
              }}
            >
              {validationErrors.birthControlTime}
            </div>
          )}

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

        <div className={cx("form-group")}>
          <button
            className={cx("confirm-btn")}
            onClick={() => {
              handleConfirmSave();
              // sendAllEmail();
            }}
            disabled={isSaving}
          >
            {isSaving ? "⏳ Đang lưu..." : "💾 Xác nhận lưu và nhận thông báo"}
          </button>
        </div>

        <small
          style={{
            color: "#7f8c8d",
            fontSize: "0.85rem",
            marginTop: "5px",
            display: "block",
          }}
        >
          Khi bạn lưu thông tin, hệ thống sẽ gửi thông báo nhắc nhở uống thuốc
          tránh thai qua email cho bạn.
        </small>
      </div>
    </div>
  );
}

export default CycleInputForm;
