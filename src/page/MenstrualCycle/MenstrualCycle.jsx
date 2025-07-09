import React, { useState, useEffect } from "react";
import Header from "./MenstrualCycleItems/Header";
import CycleInputForm from "./MenstrualCycleItems/CycleInputForm";
import CurrentStatus from "./MenstrualCycleItems/CurrentStatus";
import NotificationSettings from "./MenstrualCycleItems/NotificationSettings";
import HealthTips from "./MenstrualCycleItems/HealthTips";
import classNames from "classnames/bind";
import styles from "./MenstrualCycle.module.scss";
import menstrualService from "../../services/menstrual.service";
import { set } from "date-fns/set";

const cx = classNames.bind(styles);

function MenstrualCycle() {
  const [cycleData, setCycleData] = useState({
    lastPeriodDate: "2025-07-06",
    cycleLength: 28,
    periodLength: 5,
    pillTime: "08:00",
    // notifications: {
    //   nextPeriod: true,
    //   ovulation: true,
    //   fertilityWindow: true,
    //   periodStart: true,
    // },
  });

  const [predictions, setPredictions] = useState({
    nextPeriod: null,
    ovulationDay: null,
    fertilityWindow: { start: null, end: null },
  });

  const [currentPhase, setCurrentPhase] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await menstrualService.getCycleData();
      console.log("Fetched cycle data:", data.periodRange.end);
      setCycleData(data);
    };
    fetchData();
    console.log("Predictions:", predictions);
  }, []);

  useEffect(() => {
    if (cycleData.lastPeriodDate) {
      const nextPeriodDate = new Date(cycleData.lastPeriodDate);
      nextPeriodDate.setDate(nextPeriodDate.getDate() + cycleData.cycleLength);
      const ovulationDate = new Date(nextPeriodDate);
      ovulationDate.setDate(ovulationDate.getDate() - 14);
      const fertilityStart = new Date(ovulationDate);
      fertilityStart.setDate(fertilityStart.getDate() - 6);
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
