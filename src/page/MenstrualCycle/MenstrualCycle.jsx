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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setIsFemale(user?.gender === "female");
  }, []);

  useEffect(() => {
    if (!isFemale) return; // không fetch nếu không phải nữ
    const fetchData = async () => {
      try {
        const data = await menstrualService.getCycleData();
        console.log("Fetched cycle data:", data);
        setCycleData(
          data || {
            lastPeriodDate: null,
            cycleLength: 28,
            periodLength: 5,
            pillTime: "08:00",
          }
        );
      } catch (err) {
        console.error("Error fetching cycle data:", err);
      }
    };
    fetchData();
  }, [isFemale]);

  useEffect(() => {
    if (!cycleData || !cycleData.lastPeriodDate) return;

    const startPeriod = new Date(cycleData.lastPeriodDate);
    const nextPeriodDate = new Date(startPeriod);
    nextPeriodDate.setDate(nextPeriodDate.getDate() + cycleData.cycleLength);

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

    const today = new Date();
    const endPeriod = new Date(startPeriod);
    endPeriod.setDate(endPeriod.getDate() + cycleData.periodLength);

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

  if (isFemale === null || !cycleData) {
    return <p>⏳ Đang tải dữ liệu...</p>;
  }
  return (
    <div className={cx("menstrual-cycle")}>
      <Header />

      <div className={cx("cycle-grid")}>
        <div className={cx("top-row")}>
          <CycleInputForm
            cycleData={cycleData}
            onDataChange={handleCycleDataChange}
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
