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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertModalData, setAlertModalData] = useState({
    title: "",
    message: "",
    type: "info",
  });
  const [showConfirmWarningModal, setShowConfirmWarningModal] = useState(false);
  const [pendingSaveData, setPendingSaveData] = useState(null);

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
      .min(1, "Độ dài chu kỳ phải lớn hơn 0")
      .integer("Độ dài chu kì phải là số nguyên")
      .typeError("Độ dài chu kì phải là số"),
    periodLength: Yup.number()
      .required("Số ngày kinh nguyệt là bắt buộc")
      .min(1, "Độ dài chu kỳ phải lớn hơn 0")
      .integer("Số ngày kinh nguyệt phải là số nguyên")
      .typeError("Số ngày kinh nguyệt phải là số"),
    birthControlTime: Yup.string()
      .matches(
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Thời gian phải có định dạng HH:MM"
      )
      .nullable(),
  });

  // Hàm hiển thị alert modal
  const showAlert = (message, title = "", type = "info") => {
    setAlertModalData({ title, message, type });
    setShowAlertModal(true);
  };

  const hideAlert = () => {
    setShowAlertModal(false);
    setAlertModalData({ title: "", message: "", type: "info" });
  };

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

  const performSave = async (saveData) => {
    try {
      const result = await menstrualService.updateCycleData(saveData);
      setShowSuccessModal(true);

      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (error) {
      console.error("Error saving cycle data:", error);

      if (error.response) {
        switch (error.response.status) {
          case 401:
            showAlert(
              "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!",
              "Lỗi xác thực",
              "error"
            );
            break;
          case 400: {
            const errorMsg =
              error.response.data?.message || "Dữ liệu không hợp lệ";
            showAlert(`Lỗi dữ liệu: ${errorMsg}`, "Lỗi dữ liệu", "error");
            break;
          }
          case 403:
            showAlert(
              "Bạn không có quyền thực hiện thao tác này!",
              "Lỗi phân quyền",
              "error"
            );
            break;
          case 500:
            showAlert(
              "Lỗi server. Vui lòng thử lại sau!",
              "Lỗi server",
              "error"
            );
            break;
          default:
            showAlert(
              `Lỗi từ server (${error.response.status}): ${
                error.response.data?.message || "Không xác định"
              }`,
              "Lỗi không xác định",
              "error"
            );
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
        showAlert(
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng!",
          "Lỗi kết nối",
          "error"
        );
      } else {
        console.error("Error:", error.message);
        showAlert(`Có lỗi xảy ra: ${error.message}`, "Lỗi", "error");
      }
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
        showAlert(
          "Bạn cần đăng nhập để lưu dữ liệu!",
          "Yêu cầu đăng nhập",
          "warning"
        );
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
        showAlert(
          `Dữ liệu không hợp lệ:\n${validationError.errors[0]}`,
          "Lỗi xác thực dữ liệu",
          "warning"
        );
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
        // Prepare data and show warning modal instead of confirm
        const saveData = {
          lastPeriodDate: cycleData.lastPeriodDate,
          cycleLength: cycleLength,
          periodLength: periodLength,
          pillTime: cycleData.birthControlTime || "",
        };
        setPendingSaveData(saveData);
        setShowConfirmWarningModal(true);
        setIsSaving(false);
        return;
      }

      // Prepare data for modal
      const saveData = {
        lastPeriodDate: cycleData.lastPeriodDate,
        cycleLength: cycleLength,
        periodLength: periodLength,
        pillTime: cycleData.birthControlTime || "",
      };

      // Validate data format before showing modal
      if (
        !saveData.lastPeriodDate ||
        !saveData.cycleLength ||
        !saveData.periodLength
      ) {
        throw new Error("Missing required fields in saveData");
      }

      // Set modal data and show modal
      setModalData({
        lastPeriodDate: new Date(cycleData.lastPeriodDate).toLocaleDateString(
          "vi-VN"
        ),
        cycleLength: cycleLength,
        periodLength: periodLength,
        saveData: saveData,
      });
      setShowConfirmModal(true);
      setIsSaving(false); // Reset saving state since we're showing modal
    } catch (error) {
      console.error("Error preparing save data:", error);
      showAlert(`Có lỗi xảy ra: ${error.message}`, "Lỗi", "error");
      setIsSaving(false);
    }
  };

  const handleModalConfirm = async () => {
    setShowConfirmModal(false);
    setIsSaving(true);

    try {
      await performSave(modalData.saveData);
    } finally {
      setIsSaving(false);
      setModalData(null);
    }
  };

  const handleModalCancel = () => {
    setShowConfirmModal(false);
    setModalData(null);
    setIsSaving(false);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
  };

  const handleWarningModalConfirm = () => {
    setShowConfirmWarningModal(false);
    if (pendingSaveData) {
      // Prepare data for main modal
      const cycleLength = parseInt(pendingSaveData.cycleLength);
      const periodLength = parseInt(pendingSaveData.periodLength);

      setModalData({
        lastPeriodDate: new Date(
          pendingSaveData.lastPeriodDate
        ).toLocaleDateString("vi-VN"),
        cycleLength: cycleLength,
        periodLength: periodLength,
        saveData: pendingSaveData,
      });
      setShowConfirmModal(true);
      setPendingSaveData(null);
    }
  };

  const handleWarningModalCancel = () => {
    setShowConfirmWarningModal(false);
    setPendingSaveData(null);
    setIsSaving(false);
  };

  // Thêm helper function để lấy ngày hôm nay theo format YYYY-MM-DD
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <>
      {/* Alert Modal */}
      {showAlertModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={hideAlert}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "32px",
              maxWidth: "500px",
              width: "90%",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
              position: "relative",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                fontSize: "3rem",
                marginBottom: "16px",
                color:
                  alertModalData.type === "error"
                    ? "#dc3545"
                    : alertModalData.type === "warning"
                    ? "#ffc107"
                    : "#17a2b8",
              }}
            >
              {alertModalData.type === "error"
                ? "❌"
                : alertModalData.type === "warning"
                ? "⚠️"
                : "ℹ️"}
            </div>

            {alertModalData.title && (
              <h3
                style={{
                  margin: "0 0 16px 0",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color:
                    alertModalData.type === "error"
                      ? "#dc3545"
                      : alertModalData.type === "warning"
                      ? "#856404"
                      : "#0c5460",
                }}
              >
                {alertModalData.title}
              </h3>
            )}

            <p
              style={{
                margin: "0 0 24px 0",
                fontSize: "1rem",
                color: "#6c757d",
                lineHeight: "1.5",
                whiteSpace: "pre-line",
              }}
            >
              {alertModalData.message}
            </p>

            <button
              onClick={hideAlert}
              style={{
                padding: "12px 32px",
                borderRadius: "6px",
                border: "none",
                backgroundColor:
                  alertModalData.type === "error"
                    ? "#dc3545"
                    : alertModalData.type === "warning"
                    ? "#ffc107"
                    : "#17a2b8",
                color: alertModalData.type === "warning" ? "#212529" : "white",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "500",
              }}
              onMouseOver={(e) => {
                const colors = {
                  error: "#c82333",
                  warning: "#e0a800",
                  info: "#138496",
                };
                e.target.style.backgroundColor =
                  colors[alertModalData.type] || colors.info;
              }}
              onMouseOut={(e) => {
                const colors = {
                  error: "#dc3545",
                  warning: "#ffc107",
                  info: "#17a2b8",
                };
                e.target.style.backgroundColor =
                  colors[alertModalData.type] || colors.info;
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Warning Confirmation Modal */}
      {showConfirmWarningModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={handleWarningModalCancel}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "32px",
              maxWidth: "500px",
              width: "90%",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
              position: "relative",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                fontSize: "3rem",
                marginBottom: "16px",
                color: "#ffc107",
              }}
            >
              ⚠️
            </div>

            <h3
              style={{
                margin: "0 0 16px 0",
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#856404",
              }}
            >
              Cảnh báo về dữ liệu
            </h3>

            <p
              style={{
                margin: "0 0 24px 0",
                fontSize: "1rem",
                color: "#6c757d",
                lineHeight: "1.5",
              }}
            >
              Ngày bạn chọn đã lâu hơn 6 tháng.
              <br />
              Dữ liệu dự đoán có thể không chính xác.
              <br />
              <br />
              Bạn có muốn tiếp tục không?
            </p>

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
              }}
            >
              <button
                onClick={handleWarningModalCancel}
                style={{
                  padding: "12px 24px",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                  backgroundColor: "#f8f9fa",
                  color: "#6c757d",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "500",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#e9ecef")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#f8f9fa")}
              >
                Hủy
              </button>
              <button
                onClick={handleWarningModalConfirm}
                style={{
                  padding: "12px 24px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#ffc107",
                  color: "#212529",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "500",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#e0a800")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#ffc107")}
              >
                Tiếp tục
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirmModal && modalData && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={handleModalCancel}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "500px",
              width: "90%",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              <h3
                style={{
                  margin: "0 0 16px 0",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#2c3e50",
                }}
              >
                💡 XÁC NHẬN LƯU CHU KỲ 💡
              </h3>

              <div
                style={{
                  textAlign: "left",
                  backgroundColor: "#f8f9fa",
                  padding: "16px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                }}
              >
                <div style={{ marginBottom: "8px" }}>
                  <strong>📅 Ngày bắt đầu:</strong> {modalData.lastPeriodDate}
                </div>
                <div style={{ marginBottom: "8px" }}>
                  <strong>🔄 Chu kỳ dài:</strong> {modalData.cycleLength} ngày
                </div>
                <div>
                  <strong>📊 Số ngày hành kinh:</strong>{" "}
                  {modalData.periodLength} ngày
                </div>
              </div>

              <p
                style={{
                  margin: "0",
                  fontSize: "1rem",
                  color: "#34495e",
                }}
              >
                ✅ Bạn có muốn lưu thông tin này không?
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
              }}
            >
              <button
                onClick={handleModalCancel}
                style={{
                  padding: "10px 20px",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                  backgroundColor: "#f8f9fa",
                  color: "#6c757d",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "500",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#e9ecef")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#f8f9fa")}
              >
                ❌ Hủy
              </button>
              <button
                onClick={handleModalConfirm}
                disabled={isSaving}
                style={{
                  padding: "10px 20px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: isSaving ? "#6c757d" : "#007bff",
                  color: "white",
                  cursor: isSaving ? "not-allowed" : "pointer",
                  fontSize: "1rem",
                  fontWeight: "500",
                }}
                onMouseOver={(e) => {
                  if (!isSaving) e.target.style.backgroundColor = "#0056b3";
                }}
                onMouseOut={(e) => {
                  if (!isSaving) e.target.style.backgroundColor = "#007bff";
                }}
              >
                {isSaving ? "⏳ Đang lưu..." : "✅ Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={handleSuccessModalClose}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "32px",
              maxWidth: "400px",
              width: "90%",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
              position: "relative",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                fontSize: "3rem",
                marginBottom: "16px",
                color: "#28a745",
              }}
            >
              ✅
            </div>

            <h3
              style={{
                margin: "0 0 16px 0",
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#28a745",
              }}
            >
              Thành công!
            </h3>

            <p
              style={{
                margin: "0 0 24px 0",
                fontSize: "1rem",
                color: "#6c757d",
                lineHeight: "1.5",
              }}
            >
              Đã lưu thông tin chu kỳ thành công!
              <br />
              Hệ thống sẽ gửi thông báo nhắc nhở qua email cho bạn.
            </p>

            <button
              onClick={handleSuccessModalClose}
              style={{
                padding: "12px 32px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#28a745",
                color: "white",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "500",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#218838")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#28a745")}
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      <div className={cx("input-section", "col-span-1")}>
        <h2>Thông tin chu kì</h2>

        <div className={cx("form-group")} style={{ display: "block" }}>
          <span>Ngày đầu kì kinh nguyệt gần nhất:</span>

          <small
            style={{
              color: "#666",
              fontSize: "0.8rem",
              marginTop: "4px",
              display: "block",
            }}
          >
            * Bạn chỉ có thể chọn ngày trong quá khứ hoặc hôm nay. Không thể
            chọn ngày trong tương lai.
          </small>
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
        </div>

        <div className={cx("form-group")} style={{ display: "block" }}>
          <span>Độ dài chu kì (ngày):</span>
          <input
            type="number"
            name="cycleLength"
            value={cycleData?.cycleLength || ""}
            onChange={handleInputChange}
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
          {cycleData?.cycleLength > 35 || cycleData?.cycleLength < 21 ? (
            <div
              style={{
                color: "#e67e22",
                fontSize: "0.85rem",
                marginTop: "4px",
                display: "block",
              }}
            >
              ⚠️ Chu kỳ bạn nhập nằm ngoài khoảng phổ biến (21–35 ngày).
              <div>
                <small style={{ color: "#aaa", fontSize: "0.75rem" }}>
                  * Nếu bạn có chu kỳ hoặc số ngày hành kinh bất thường, vẫn có
                  thể lưu và sử dụng bình thường.
                </small>
              </div>
            </div>
          ) : null}
        </div>

        <div className={cx("form-group")} style={{ display: "block" }}>
          <span>Số ngày kinh nguyệt:</span>
          <input
            type="number"
            name="periodLength"
            value={cycleData?.periodLength || ""}
            onChange={handleInputChange}
            style={{
              width: "100%",
              borderColor: validationErrors.periodLength
                ? "#ff4444"
                : undefined,
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
          {cycleData?.periodLength > 8 || cycleData?.periodLength < 3 ? (
            <div
              style={{
                color: "#e67e22",
                fontSize: "0.85rem",
                marginTop: "4px",
                display: "block",
              }}
            >
              ⚠️ Số ngày kinh nguyệt bạn nhập nằm ngoài khoảng phổ biến (3–8
              ngày).
              <div>
                <small style={{ color: "#aaa", fontSize: "0.75rem" }}>
                  * Nếu bạn có chu kỳ hoặc số ngày hành kinh bất thường, vẫn có
                  thể lưu và sử dụng bình thường.
                </small>
              </div>
            </div>
          ) : null}
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
              {isSaving
                ? "⏳ Đang lưu..."
                : "💾 Xác nhận lưu và nhận thông báo"}
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
    </>
  );
}

export default CycleInputForm;
