import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import {
  faArrowLeft,
  faArrowRight,
  faEnvelope,
  faKey,
  faLock,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames/bind";
import styles from "./ForgetPassword.module.scss";
import axiosClient from "../../services/axiosClient";

const cx = classNames.bind(styles);

function ForgetPassword() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Validate email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "";
    }
    if (!emailRegex.test(email)) {
      return "Email không hợp lệ (VD: example@gmail.com)";
    }
    return "";
  };

  // Validate username
  const validateUsername = (username) => {
    if (!username) {
      return "";
    }
    if (username.length < 3) {
      return "Tên đăng nhập phải có ít nhất 3 ký tự";
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới";
    }
    return "";
  };

  // Validate OTP
  const validateOTP = (otp) => {
    if (!otp) {
      return "Vui lòng nhập mã OTP";
    }
    if (otp.length !== 6) {
      return "Mã OTP phải có 6 chữ số";
    }
    if (!/^\d+$/.test(otp)) {
      return "Mã OTP chỉ được chứa số";
    }
    return "";
  };

  // Validate password
  const validatePassword = (password) => {
    if (!password) {
      return "Vui lòng nhập mật khẩu";
    }
    if (password.length < 8) {
      return "Mật khẩu phải có ít nhất 8 ký tự";
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(password)) {
      return "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt";
    }
    return "";
  };

  // Validate confirm password
  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) {
      return "Vui lòng xác nhận mật khẩu";
    }
    if (confirmPassword !== password) {
      return "Mật khẩu xác nhận không khớp";
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Format OTP
    let formattedValue = value;
    if (name === "otp") {
      formattedValue = value.replace(/\D/g, "").slice(0, 6);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();

    // Validate both fields
    const emailError = validateEmail(formData.email);
    const usernameError = validateUsername(formData.username);

    // Check if at least one field is filled and valid
    const hasValidEmail = formData.email && !emailError;
    const hasValidUsername = formData.username && !usernameError;

    let newErrors = {};

    if (!hasValidEmail && !hasValidUsername) {
      if (!formData.email && !formData.username) {
        newErrors.general =
          "Vui lòng nhập ít nhất một trong hai: email hoặc tên đăng nhập";
      } else {
        if (formData.email && emailError) {
          newErrors.email = emailError;
        }
        if (formData.username && usernameError) {
          newErrors.username = usernameError;
        }
      }
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const data = {
        email: hasValidEmail ? formData.email : undefined,
        username: hasValidUsername ? formData.username : undefined,
      }
      const response = await axiosClient.post('/v1/emails/forget-password', data);

      if (response.data.status === 'success') {
        setStep(2);
      }
    } catch (error) {
      console.log("Error sending OTP:", error);
      setErrors({ general: "Có lỗi xảy ra, vui lòng thử lại." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    const otpError = validateOTP(formData.otp);
    if (otpError) {
      setErrors({ otp: otpError });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (formData.otp === "123456") {
        setStep(3);
      } else {
        setErrors({ otp: "Mã OTP không chính xác. Vui lòng thử lại." });
      }
    } catch (error) {
      console.log("Error verifying OTP:", error);
      setErrors({ general: "Có lỗi xảy ra, vui lòng thử lại." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const passwordError = validatePassword(formData.newPassword);
    const confirmPasswordError = validateConfirmPassword(
      formData.confirmPassword,
      formData.newPassword
    );

    if (passwordError || confirmPasswordError) {
      setErrors({
        newPassword: passwordError,
        confirmPassword: confirmPasswordError,
      });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const data = {
        username: formData.username,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      }
      const response = await axiosClient.patch('/v1/auth/forget-password', data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.success === true) {
        toast.success("Mật khẩu đã được đặt lại thành công!");
        navigate("/login");
      } else {
        setErrors({ general: "Có lỗi xảy ra, vui lòng thử lại." });
      }
    } catch (error) {
      console.log("Error resetting password:", error);
      setErrors({ general: "Có lỗi xảy ra, vui lòng thử lại." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
      setErrors({});
    } else {
      navigate("/login");
    }
  };

  // Get sent target for step 2 message
  const getSentTarget = () => {
    const targets = [];
    if (formData.email) targets.push(`email ${formData.email}`);
    if (formData.username) targets.push(`tài khoản ${formData.username}`);
    return targets.join(" và ");
  };

  return (
    <div className="wrapper">
      <div className={cx("forget-password-page")}>
        <div className={cx("forget-password-container")}>
          <button
            type="button"
            className={cx("back-button")}
            onClick={handleBack}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>{step === 1 ? "Quay lại đăng nhập" : "Quay lại"}</span>
          </button>

          <div className={cx("form-header")}>
            <h2>
              {step === 1 && "Quên mật khẩu"}
              {step === 2 && "Nhập mã OTP"}
              {step === 3 && "Đặt mật khẩu mới"}
            </h2>
            <p>
              {step === 1 && "Vui lòng nhập thông tin để nhận mã OTP"}
              {step === 2 && `Mã OTP đã được gửi đến ${getSentTarget()}`}
              {step === 3 && "Tạo mật khẩu mới cho tài khoản của bạn"}
            </p>
          </div>

          {errors.general && (
            <div className={cx("error-message", "general-error")}>
              {errors.general}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendOTP}>
              {/* Username Input */}
              <div className={cx("form-group")}>
                <div className={cx("input-container")}>
                  <div className={cx("input-icon")}>
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                  <input
                    type="text"
                    name="username"
                    placeholder="Nhập tên đăng nhập"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={cx("input-field", { error: errors.username })}
                  />
                </div>
                {errors.username && (
                  <span className={cx("error-text")}>{errors.username}</span>
                )}
              </div>

              {/* Email Input */}
              <div className={cx("form-group")}>
                <div className={cx("input-container")}>
                  <div className={cx("input-icon")}>
                    <FontAwesomeIcon icon={faEnvelope} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Nhập email (VD: example@gmail.com)"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={cx("input-field", { error: errors.email })}
                  />
                </div>
                {errors.email && (
                  <span className={cx("error-text")}>{errors.email}</span>
                )}
              </div>

              <button
                type="submit"
                className={cx("submit-button", { loading: isLoading })}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className={cx("spinner")}></div>
                ) : (
                  <>
                    <span>Gửi mã OTP</span>
                    <FontAwesomeIcon icon={faArrowRight} />
                  </>
                )}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOTP}>
              <div className={cx("form-group")}>
                <div className={cx("input-container")}>
                  <input
                    type="text"
                    name="otp"
                    placeholder="* * * * * *"
                    value={formData.otp}
                    onChange={handleInputChange}
                    className={cx("input-field", "otp-input", {
                      error: errors.otp,
                    })}
                    maxLength="6"
                  />
                </div>
                {errors.otp && (
                  <span className={cx("error-text")}>{errors.otp}</span>
                )}
              </div>

              <button
                type="submit"
                className={cx("submit-button", { loading: isLoading })}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className={cx("spinner")}></div>
                ) : (
                  <>
                    <span>Xác nhận</span>
                    <FontAwesomeIcon icon={faArrowRight} />
                  </>
                )}
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword}>
              <div className={cx("form-group")}>
                <div className={cx("input-container")}>
                  <div className={cx("input-icon")}>
                    <FontAwesomeIcon icon={faKey} />
                  </div>
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="Mật khẩu mới (ít nhất 8 ký tự)"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className={cx("input-field", { error: errors.newPassword })}
                  />
                </div>
                {errors.newPassword && (
                  <span className={cx("error-text")}>{errors.newPassword}</span>
                )}
              </div>

              <div className={cx("form-group")}>
                <div className={cx("input-container")}>
                  <div className={cx("input-icon")}>
                    <FontAwesomeIcon icon={faLock} />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Xác nhận mật khẩu mới"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={cx("input-field", {
                      error: errors.confirmPassword,
                    })}
                  />
                </div>
                {errors.confirmPassword && (
                  <span className={cx("error-text")}>
                    {errors.confirmPassword}
                  </span>
                )}
              </div>

              <div className={cx("password-requirements")}>
                <small>Mật khẩu phải chứa:</small>
                <ul>
                  <li
                    className={cx({
                      valid: /[a-z]/.test(formData.newPassword),
                    })}
                  >
                    Ít nhất 1 chữ thường
                  </li>
                  <li
                    className={cx({
                      valid: /[A-Z]/.test(formData.newPassword),
                    })}
                  >
                    Ít nhất 1 chữ hoa
                  </li>
                  <li
                    className={cx({ valid: /\d/.test(formData.newPassword) })}
                  >
                    Ít nhất 1 chữ số
                  </li>
                  <li
                    className={cx({
                      valid: /[!@#$%^&*]/.test(formData.newPassword),
                    })}
                  >
                    Ít nhất 1 ký tự đặc biệt
                  </li>
                  <li
                    className={cx({ valid: formData.newPassword.length >= 8 })}
                  >
                    Tối thiểu 8 ký tự
                  </li>
                </ul>
              </div>

              <button
                type="submit"
                className={cx("submit-button", { loading: isLoading })}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className={cx("spinner")}></div>
                ) : (
                  <>
                    <span>Đặt lại mật khẩu</span>
                    <FontAwesomeIcon icon={faArrowRight} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
