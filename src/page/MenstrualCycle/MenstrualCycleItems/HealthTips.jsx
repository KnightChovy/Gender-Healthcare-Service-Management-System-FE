import React from "react";
import classNames from "classnames/bind";
import styles from "../MenstrualCycle.module.scss";
import { useState } from "react";

const cx = classNames.bind(styles);


function HealthTips({ currentPhase }) {
  const [wantsReminder, setWantsReminder] = useState(null);

  const getPhaseTips = (phase) => {
    switch (phase) {
      case "Kì kinh nguyệt":
        return {
          title: "Trong kì kinh nguyệt:",
          tips: [
            "Uống nhiều nước",
            "Nghỉ ngơi đầy đủ",
            "Tránh thực phẩm có caffeine cao",
            "Tập thể dục nhẹ nhàng",
          ],
        };
      case "Kì rụng trứng":
        return {
          title: "Trong kì rụng trứng:",
          tips: [
            "Thời điểm thụ thai cao nhất",
            "Chú ý vệ sinh cá nhân",
            "Tăng cường dinh dưỡng",
            "Theo dõi nhiệt độ cơ thể",
          ],
        };
      case "Kì hoàng thể":
        return {
          title: "Trong kì hoàng thể:",
          tips: [
            "Có thể xuất hiện triệu chứng PMS",
            "Tăng cường vitamin B6",
            "Giảm stress",
            "Ăn nhiều thực phẩm giàu magie",
          ],
        };
      default:
        return {
          title: "Trong kì nang trứng:",
          tips: [
            "Cơ thể chuẩn bị cho chu kì mới",
            "Tăng cường protein",
            "Tập thể dục điều độ",
            "Bổ sung acid folic",
          ],
        };
    }
  };

  const phaseTips = getPhaseTips(currentPhase);

  return (
    <div className={cx("health-tips", "col-span-1")}>
      <h2>Lời khuyên sức khỏe</h2>
      <div className={cx("tips-content")}>
        {currentPhase && (
          <div className={cx("tip")}>
            <h4>{phaseTips.title}</h4>
            <ul>
              {phaseTips.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        <div className={cx("general-tip")}>
          <h4>Lưu ý chung:</h4>
          <p>
            Hãy theo dõi thường xuyên và ghi chép các triệu chứng để có thông
            tin chính xác nhất về chu kì của bạn. Nếu có bất thường, hãy tham
            khảo ý kiến bác sĩ.
          </p>
        </div>

        <div className={cx("reminder-highlight")}>
          <div className={cx("reminder-icon")}>💊</div>
          <div className={cx("reminder-content")}>
            <h4>Nhận nhắc nhở uống thuốc?</h4>
            <p>
              Bạn có muốn nhận thông báo uống thuốc tránh thai hàng ngày không?
            </p>
            <div className={cx("opt-in-buttons")}>
              <button
                className={cx("opt-btn", { active: wantsReminder === true })}
                onClick={() => setWantsReminder(true)}
              >
                ✅ Có
              </button>
              <button
                className={cx("opt-btn", { active: wantsReminder === false })}
                onClick={() => setWantsReminder(false)}
              >
                ❌ Không
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HealthTips;
