import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "../Register.module.scss";

const cx = classNames.bind(styles);

function GenderChoice({ onChange, showError }) {
  const [selectedGender, setSelectedGender] = useState('');

  const handleGenderChange = (value) => {
    setSelectedGender(value);
    if (onChange) {
      onChange("gender", value);
    }
  };

  return (
    <div className={cx("gender-choice")}>
      <span style={{ display: "flex" }}>
        Giới tính (<span style={{ marginTop: "2px" }}>*</span>)
      </span>
      <div className={cx("gender-options")}>
        <label className={cx("gender-item", {hasError: showError})}>
          Nam{" "}
          <input
            type="radio"
            name="gender"
            value="male"
            checked={selectedGender === "male"}
            onChange={(e) => handleGenderChange(e.target.value)}
          />
        </label>
        <label className={cx("gender-item", {hasError: showError})}>
          Nữ{" "}
          <input
            type="radio"
            name="gender"
            value="female"
            checked={selectedGender === "female"}
            onChange={(e) => handleGenderChange(e.target.value)}
          />
        </label>
      </div>

      {showError && (
        <span className={cx("error-message")}>
          Vui lòng chọn giới tính
        </span>
      )}
    </div>
  );
}

export default GenderChoice;
