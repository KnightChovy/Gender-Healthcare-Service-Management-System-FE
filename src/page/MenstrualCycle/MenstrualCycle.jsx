import React, { useState, useEffect } from "react";
import Header from "./MenstrualCycleItems/Header";
import CycleInputForm from "./MenstrualCycleItems/CycleInputForm";
import CurrentStatus from "./MenstrualCycleItems/CurrentStatus";
import HealthTips from "./MenstrualCycleItems/HealthTips";
import classNames from "classnames/bind";
import styles from "./MenstrualCycle.module.scss";
import menstrualService from "../../services/menstrual.service";
import { useNavigate } from "react-router-dom";
const cx = classNames.bind(styles);

function MenstrualCycle() {
  const [isFemale, setIsFemale] = useState(null);
  const [cycleData, setCycleData] = useState(null);
  const [predictions, setPredictions] = useState({
    nextPeriod: null,
    ovulationDate: null,
    fertilityWindow: { start: null, end: null },
  });
  const [currentPhase, setCurrentPhase] = useState("");

  const navigate = useNavigate();

  // Function to fetch cycle data
  const fetchCycleData = async () => {
    try {
      // Check network connectivity
      if (!navigator.onLine) {
        setCycleData({
          lastPeriodDate: "",
          cycleLength: "",
          periodLength: "",
          birthControlTime: "",
        });
        return;
      }

      const existingData = await menstrualService.getCycleData();

      if (existingData) {
        // API trả về cycle data

        // Format ngày từ ISO string sang YYYY-MM-DD
        let formattedDate = "";
        if (existingData.lastPeriodDate) {
          const date = new Date(existingData.lastPeriodDate);
          formattedDate = date.toISOString().split("T")[0];
        }

        setCycleData({
          lastPeriodDate: formattedDate,
          cycleLength: existingData.cycleLength
            ? String(existingData.cycleLength)
            : "",
          periodLength: existingData.periodLength
            ? String(existingData.periodLength)
            : "",
          birthControlTime: existingData.pillTime || "",
        });
      } else {
        // Không có dữ liệu, set dữ liệu trống
        setCycleData({
          lastPeriodDate: "",
          cycleLength: "",
          periodLength: "",
          birthControlTime: "",
        });
      }
    } catch (error) {
      // Nếu lỗi, vẫn set dữ liệu trống để người dùng nhập mới
      setCycleData({
        lastPeriodDate: "",
        cycleLength: "",
        periodLength: "",
        birthControlTime: "",
      });
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setIsFemale(user?.gender === "female");
  }, []);

  useEffect(() => {
    if (!isFemale) return; // không fetch nếu không phải nữ

    fetchCycleData();
  }, [isFemale]);

  useEffect(() => {
    // Chỉ tính toán khi có đầy đủ dữ liệu hợp lệ
    if (
      !cycleData ||
      !cycleData.lastPeriodDate ||
      !cycleData.cycleLength ||
      !cycleData.periodLength ||
      cycleData.lastPeriodDate.trim() === "" ||
      cycleData.cycleLength.trim() === "" ||
      cycleData.periodLength.trim() === ""
    ) {
      // Reset predictions nếu không có đủ dữ liệu
      setPredictions({
        nextPeriod: null,
        ovulationDate: null,
        fertilityWindow: { start: null, end: null },
      });
      setCurrentPhase("");
      return;
    }

    // Convert string sang number để validate
    const cycleLength = parseInt(cycleData.cycleLength);
    const periodLength = parseInt(cycleData.periodLength);

    // Validate range
    if (
      isNaN(cycleLength) ||
      isNaN(periodLength) ||
      cycleLength < 21 ||
      cycleLength > 35 ||
      periodLength < 3 ||
      periodLength > 8
    ) {
      // Reset predictions nếu dữ liệu không hợp lệ
      setPredictions({
        nextPeriod: null,
        ovulationDate: null,
        fertilityWindow: { start: null, end: null },
      });
      setCurrentPhase("");
      return;
    }

    const startPeriod = new Date(cycleData.lastPeriodDate);

    // Kiểm tra ngày có hợp lệ không
    if (isNaN(startPeriod.getTime())) {
      setPredictions({
        nextPeriod: null,
        ovulationDate: null,
        fertilityWindow: { start: null, end: null },
      });
      setCurrentPhase("");
      return;
    }

    // Tính toán các ngày quan trọng
    const nextPeriodDate = new Date(startPeriod);
    nextPeriodDate.setDate(nextPeriodDate.getDate() + cycleLength);

    const ovulationDate = new Date(nextPeriodDate);
    ovulationDate.setDate(ovulationDate.getDate() - 14);

    const fertilityStart = new Date(ovulationDate);
    fertilityStart.setDate(fertilityStart.getDate() - 5);

    const fertilityEnd = new Date(ovulationDate);
    fertilityEnd.setDate(fertilityEnd.getDate() + 1);

    setPredictions({
      nextPeriod: nextPeriodDate,
      ovulationDate,
      fertilityWindow: { start: fertilityStart, end: fertilityEnd },
    });

    // Xác định giai đoạn hiện tại
    const today = new Date();
    // Set today to beginning of day for accurate comparison
    today.setHours(0, 0, 0, 0);

    const endPeriod = new Date(startPeriod);
    endPeriod.setDate(endPeriod.getDate() + periodLength - 1); // -1 because period includes start date

    if (today >= startPeriod && today <= endPeriod) {
      setCurrentPhase("Kì kinh nguyệt");
    } else if (today >= fertilityStart && today <= fertilityEnd) {
      setCurrentPhase("Kì rụng trứng");
    } else if (today > fertilityEnd && today < nextPeriodDate) {
      setCurrentPhase("Kì hoàng thể");
    } else {
      setCurrentPhase("Kì nang trứng");
    }
  }, [cycleData]);

  const handleCycleDataChange = (newData) => {
    setCycleData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  // Function to refresh data after successful save
  const handleDataRefresh = () => {
    fetchCycleData();
  };

  if (isFemale === false) {
    return (
      <div className={cx("access-denied")}>
        <div className={cx("warning-box")}>
          <div className={cx("warning-icon")}>⚢</div>
          <h2>Chỉ dành cho người dùng nữ</h2>
          <p>
            Trang này được thiết kế riêng cho các bạn nữ để theo dõi chu kỳ một
            cách hiệu quả.
            <br />
            Vui lòng quay lại trang chủ hoặc chỉnh sửa thông tin tài khoản nếu
            cần.
          </p>
          <button onClick={() => navigate("/")} className={cx("back-home-btn")}>
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  // Only show loading if isFemale is still null (checking gender)
  // BUT NOT if cycleData is available (even empty object is valid)
  if (isFemale === null) {
    return <p>⏳ Đang tải dữ liệu...</p>;
  }

  // Show different loading only if female user but no cycleData loaded yet
  if (isFemale === true && cycleData === null) {
    return <p>⏳ Đang tải thông tin chu kỳ...</p>;
  }

  return (
    <div className={cx("menstrual-cycle")}>
      <Header />

      <div className={cx("cycle-grid")}>
        <div className={cx("top-row")}>
          <CycleInputForm
            cycleData={cycleData}
            onDataChange={handleCycleDataChange}
            onSaveSuccess={handleDataRefresh}
          />

          <CurrentStatus
            predictions={predictions}
            currentPhase={currentPhase}
          />
        </div>

        <div className={cx("bottom-row")}>
          <HealthTips currentPhase={currentPhase} />
        </div>
      </div>
    </div>
  );
}

export default MenstrualCycle;
