import React from "react";
import classNames from "classnames/bind";
import styles from "../MenstrualCycle.module.scss";
import MenstrualCalendar from "./MenstrualCalendar";

const cx = classNames.bind(styles);

function CurrentStatus({ predictions, currentPhase }) {
  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("vi-VN");
  };

  const getDaysUntil = (targetDate) => {
    if (!targetDate) return 0;
    const today = new Date();
    const diffTime = targetDate - today;
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (days < 0) {
      return `${Math.abs(days)} ngày trước`;
    } else if (days === 0) {
      return "Hôm nay";
    } else {
      return `Còn ${days} ngày`;
    }
  };

  const getPhaseColor = (phase) => {
    switch (phase) {
      case "Kì kinh nguyệt":
        return "#ff6b6b";
      case "Kì rụng trứng":
        return "#4ecdc4";
      case "Kì hoàng thể":
        return "#45b7d1";
      default:
        return "#96ceb4";
    }
  };

  return (
    <div className={cx("current-status", "col-span-1")}>
      <div className={cx("calendar-container")}>
        <MenstrualCalendar predictions={predictions} />
      </div>

      <div
        className={cx("phase-indicator")}
        style={{ backgroundColor: getPhaseColor(currentPhase) }}
      >
        <h3>{currentPhase}</h3>
      </div>

      {predictions.nextPeriod && (
        <div className={cx("status-grid")}>
          <div className={cx("status-item", "fertility")}>
            <h4>Kì kinh nguyệt tiếp theo</h4>
            <p className={cx("date")}>{formatDate(predictions.nextPeriod)}</p>
            <p className={cx("days")}>{getDaysUntil(predictions.nextPeriod)}</p>
          </div>

          <div className={cx("status-egg")}>
            <h4>Ngày rụng trứng dự kiến</h4>
            <p className={cx("date")}>
              {formatDate(predictions.ovulationDate)}
            </p>
            <p className={cx("days")}>
              {getDaysUntil(predictions.ovulationDate)}
            </p>
          </div>

          <div className={cx("status-fertility")}>
            <h4>Khoảng thời gian thụ thai được ước tính</h4>
            <p className={cx("date")}>
              {formatDate(predictions.fertilityWindow.start)} -{" "}
              {formatDate(predictions.fertilityWindow.end)}
            </p>
            <p className={cx("warning")}>Khả năng mang thai cao</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default CurrentStatus;
