import React from "react";
import classNames from "classnames/bind";
import styles from "../MenstrualCycle.module.scss";

const cx = classNames.bind(styles);

const ALL_PHASE_TIPS = {
  "Kì nang trứng": {
    title: "Trong kì nang trứng:",
    tips: [
      "Cơ thể chuẩn bị cho chu kì mới",
      "Tăng cường protein",
      "Tập thể dục điều độ",
      "Bổ sung acid folic",
    ],
  },
  "Kì kinh nguyệt": {
    title: "Trong kì kinh nguyệt:",
    tips: [
      "Uống nhiều nước",
      "Nghỉ ngơi đầy đủ",
      "Tránh thực phẩm có caffeine cao",
      "Tập thể dục nhẹ nhàng",
    ],
  },
  "Kì rụng trứng": {
    title: "Trong kì rụng trứng:",
    tips: [
      "Thời điểm thụ thai cao nhất",
      "Chú ý vệ sinh cá nhân",
      "Tăng cường dinh dưỡng",
      "Theo dõi nhiệt độ cơ thể",
    ],
  },
  "Kì hoàng thể": {
    title: "Trong kì hoàng thể:",
    tips: [
      "Có thể xuất hiện triệu chứng PMS",
      "Tăng cường vitamin B6",
      "Giảm stress",
      "Ăn nhiều thực phẩm giàu magie",
    ],
  },
};

function HealthTips() {
  return (
    <div className={cx("health-tips", "col-span-1")}>
      <h2>Lời khuyên sức khỏe</h2>
      <div className={cx("general-tip-upgraded")}>
        <div className={cx("general-tip-icon")}>💡</div>
        <div>
          <div className={cx("general-tip-title")}>Lưu ý chung:</div>
          <div className={cx("general-tip-content")}>
            Hãy theo dõi chu kỳ đều đặn và ghi chú các thay đổi như đau bụng,
            tâm trạng hoặc lượng máu kinh. Bạn có thể dùng ứng dụng hoặc sổ tay
            để tiện theo dõi. Nếu chu kỳ kéo dài bất thường, trễ kinh nhiều ngày
            hoặc triệu chứng khó chịu kéo dài, hãy tham khảo bác sĩ sớm nhé!
          </div>
        </div>
      </div>

      <div className={cx("tips-content")}>
        {Object.entries(ALL_PHASE_TIPS).map(([phase, data]) => (
          <div key={phase} className={cx("tip")}>
            <h4>{data.title}</h4>
            <ul>
              {data.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HealthTips;
