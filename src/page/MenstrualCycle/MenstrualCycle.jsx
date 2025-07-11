import React, { useState, useEffect } from "react";
import Header from "./MenstrualCycleItems/Header";
import CycleInputForm from "./MenstrualCycleItems/CycleInputForm";
import CurrentStatus from "./MenstrualCycleItems/CurrentStatus";
import NotificationSettings from "./MenstrualCycleItems/NotificationSettings";
import HealthTips from "./MenstrualCycleItems/HealthTips";
import classNames from "classnames/bind";
import styles from "./MenstrualCycle.module.scss";
import menstrualService from "../../services/menstrual.service";

const cx = classNames.bind(styles);

function MenstrualCycle() {
  const [cycleData, setCycleData] = useState({
    lastPeriodDate: "2025-07-06",
    cycleLength: 28,
    periodLength: 5,
    pillTime: "08:00",
    // notifications: { nextPeriod: true, ovulation: true, fertilityWindow: true, periodStart: true },
  });

  const [predictions, setPredictions] = useState({
    nextPeriod: null,
    ovulationDate: null,
    fertilityWindow: { start: null, end: null },
  });

  const [currentPhase, setCurrentPhase] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await menstrualService.getCycleData();
      console.log("Fetched cycle data:", data);
      setCycleData(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (cycleData.lastPeriodDate) {
      const startPeriod = new Date(cycleData.lastPeriodDate);

      // Tính ngày bắt đầu kỳ tiếp theo
      const nextPeriodDate = new Date(startPeriod);
      nextPeriodDate.setDate(nextPeriodDate.getDate() + cycleData.cycleLength);

      // Tính ngày rụng trứng
      const ovulationDate = new Date(nextPeriodDate);
      ovulationDate.setDate(ovulationDate.getDate() - 14);

      // Cửa sổ thụ thai
      const fertilityStart = new Date(ovulationDate);
      fertilityStart.setDate(fertilityStart.getDate() - 5);

      const fertilityEnd = new Date(ovulationDate);
      fertilityEnd.setDate(fertilityEnd.getDate() + 1);

      setPredictions({
        nextPeriod: nextPeriodDate,
        ovulationDate: ovulationDate,
        fertilityWindow: {
          start: fertilityStart,
          end: fertilityEnd,
        },
      });

      // Tính currentPhase
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
    }
  }, [cycleData]);

  const handleCycleDataChange = (newData) => {
    setCycleData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  return (
    <div className={cx("menstrual-cycle")}>
      <Header />

      <div className={cx("cycle-grid")}>
        <CycleInputForm
          cycleData={cycleData}
          onDataChange={handleCycleDataChange}
        />

        <CurrentStatus
          className="col-span-2"
          predictions={predictions}
          currentPhase={currentPhase}
        />

        <HealthTips currentPhase={currentPhase} />

        {/* <NotificationSettings
          notifications={cycleData.notifications}
          onNotificationChange={handleCycleDataChange}
        /> */}
      </div>
    </div>
  );
}

export default MenstrualCycle;
