import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import FormInputText from "../../components/ui/FormInputText";

import { validateRulesLogin } from "../../components/Validation/validateRulesLogin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faUser,
  faLock,
  faBuilding,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames/bind";
import styles from "./Login.module.scss";
import { Footer } from "../../components/Layouts/LayoutHomePage/Footer";
import { Navbar } from "../../components/ui/Navbar";

const cx = classNames.bind(styles);

function Login() {
  const [showStaffLogin, setShowStaffLogin] = useState(false);
  
  // Tách riêng formData cho từng form
  const [customerFormData, setCustomerFormData] = useState({
    username: "",
    password: "",
  });
  
  const [staffFormData, setStaffFormData] = useState({
    username: "",
    password: "",
  });

  // Tách riêng error states cho từng form
  const [customerShowErrors, setCustomerShowErrors] = useState(false);
  const [customerTouchedFields, setCustomerTouchedFields] = useState({});
  
  const [staffShowErrors, setStaffShowErrors] = useState(false);
  const [staffTouchedFields, setStaffTouchedFields] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Tách riêng refs cho từng form
  const customerInputRefs = useRef({
    username: null,
    password: null,
  });

  const staffInputRefs = useRef({
    username: null,
    password: null,
  });

  // Validation functions cho từng form
  const validateCustomer = () => validateRulesLogin(customerFormData);
  const validateStaff = () => validateRulesLogin(staffFormData);

  const focusFirstError = (errors, inputRefs) => {
    if (errors.username && inputRefs.current.username) {
      inputRefs.current.username.focus();
    } else if (errors.password && inputRefs.current.password) {
      inputRefs.current.password.focus();
    }
  };

  // Customer form handlers
  const handleCustomerInputChange = (name, value) => {
    setCustomerFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (customerShowErrors) {
      setCustomerShowErrors(false);
    }
  };

  const handleCustomerBlur = (fieldName) => {
    setCustomerTouchedFields((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
  };

  const shouldShowCustomerError = (fieldName) => {
    return customerTouchedFields[fieldName] || customerShowErrors;
  };

  // Staff form handlers
  const handleStaffInputChange = (name, value) => {
    setStaffFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (staffShowErrors) {
      setStaffShowErrors(false);
    }
  };

  const handleStaffBlur = (fieldName) => {
    setStaffTouchedFields((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
  };

  const shouldShowStaffError = (fieldName) => {
    return staffTouchedFields[fieldName] || staffShowErrors;
  };

  const handleLogin = async (e, isStaff = false) => {
    e.preventDefault();

    // Sử dụng data và validation tương ứng với form đang submit
    const formData = isStaff ? staffFormData : customerFormData;
    const validate = isStaff ? validateStaff : validateCustomer;
    const inputRefs = isStaff ? staffInputRefs : customerInputRefs;
    const setShowErrors = isStaff ? setStaffShowErrors : setCustomerShowErrors;

    const isEmpty = !formData.username || !formData.password;
    const errors = validate();

    try {
      if (isEmpty) {
        setShowErrors(true);
        focusFirstError(errors, inputRefs);
        return;
      }

      setIsLoading(true);
      setShowErrors('');

      if (process.env.NODE_ENV === "development") {
        // Giả lập đăng nhập thành công sau 1 giây
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mô phỏng đăng nhập thành công
        localStorage.setItem("token", "demo-token-12345");
        setSuccess(true);
      } else {
        // Thêm credentials để gửi cookies nếu cần
        const res = await fetch("http://44.204.71.234:3000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          const data = await res.json();
          localStorage.setItem("token", data.token);
          setSuccess(true);
        } else {
          const errorData = await res.json();
          setShowErrors(
            errorData.message ||
              "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
          );
        }
      }

      if (success) {
        if (isStaff) {
          console.log("Nhân viên/Admin đăng nhập:", formData);
          navigate("/admin-dashboard");
        } else {
          console.log("Khách hàng đăng nhập:", formData);
          navigate("/dashboardcustomer");
        }
      }
    } catch (error) {
      setShowErrors("Lỗi kết nối. Vui lòng thử lại sau.");
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStaffLogin = () => {
    setShowStaffLogin(!showStaffLogin);
    
    // Reset tất cả states cho cả 2 form
    setCustomerFormData({
      username: "",
      password: "",
    });
    setStaffFormData({
      username: "",
      password: "",
    });
    
    setCustomerTouchedFields({});
    setStaffTouchedFields({});
    setCustomerShowErrors(false);
    setStaffShowErrors(false);
  };

  return (
    <div>
      <header className="py-2 lg:py-3 sticky top-0 z-10 bg-white shadow-lg">
        <Navbar />
      </header>

      <div className={cx("login-page")}>
        <div
          className={cx("container", { "right-panel-active": showStaffLogin })}
          id="container"
        >
          {/* Admin/Staff Login Form */}
          <div className={cx("form-container", "staff-container")}>
            <form onSubmit={(e) => handleLogin(e, true)}>
              <div className={cx("form-header")}>
                <div className={cx("icon-container", "staff-icon")}>
                  <FontAwesomeIcon icon={faBuilding} />
                </div>
                <h1>Đăng nhập Hệ thống</h1>
                <p className={cx("subtitle")}>
                  Dành cho nhân viên và quản trị viên
                </p>
              </div>

              {staffShowErrors && typeof staffShowErrors === 'string' && (
                <div className={cx("error-message", "general-error")}>
                  {staffShowErrors}
                </div>
              )}

              <div className={cx("form-group")}>
                <div className={cx("input-icon")}>
                  <FontAwesomeIcon icon={faUser} />
                </div>
                <div className={cx("input-field")}>
                  <FormInputText
                    textHolder="username"
                    textName="username"
                    value={staffFormData.username}
                    onChange={handleStaffInputChange}
                    onBlur={() => handleStaffBlur("username")}
                    validation={validateStaff().username}
                    showErrors={shouldShowStaffError("username")}
                    ref={(el) => (staffInputRefs.current.username = el)}
                  />
                </div>
              </div>

              <div className={cx("form-group")}>
                <div className={cx("input-icon")}>
                  <FontAwesomeIcon icon={faLock} />
                </div>
                <div className={cx("input-field")}>
                  <FormInputText
                    textHolder="password"
                    textName="password"
                    type="password"
                    value={staffFormData.password}
                    onChange={handleStaffInputChange}
                    onBlur={() => handleStaffBlur("password")}
                    validation={validateStaff().password}
                    showErrors={shouldShowStaffError("password")}
                    ref={(el) => (staffInputRefs.current.password = el)}
                  />
                </div>
              </div>

              <div className={cx("form-options", "staff-options")}>
                <Link to="/forgetpassword" className={cx("forgot-password")}>
                  Quên mật khẩu?
                </Link>
              </div>

              <button
                type="submit"
                className={cx("login-button", "staff-button", {
                  loading: isLoading,
                })}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className={cx("spinner")}></div>
                ) : (
                  <>
                    <span>Đăng nhập</span>
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className={cx("button-icon")}
                    />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Customer Login Form */}
          <div className={cx("form-container", "customer-container")}>
            <form
              className={cx("form-lg")}
              onSubmit={(e) => handleLogin(e, false)}
            >
              <div className={cx("form-header")}>
                <div className={cx("icon-container", "customer-icon")}>
                  <FontAwesomeIcon icon={faUserAlt} />
                </div>
                <h1>Đăng nhập Khách hàng</h1>
                <p className={cx("subtitle")}>
                  Chào mừng bạn đến với GenCare Center
                </p>
              </div>

              {customerShowErrors && typeof customerShowErrors === 'string' && (
                <div className={cx("error-message", "general-error")}>
                  {customerShowErrors}
                </div>
              )}

              <div className={cx("form-group")}>
                <div className={cx("input-icon")}>
                  <FontAwesomeIcon icon={faUser} />
                </div>
                <div className={cx("input-field")}>
                  <FormInputText
                    textHolder="username"
                    textName="username"
                    value={customerFormData.username}
                    onChange={handleCustomerInputChange}
                    onBlur={() => handleCustomerBlur("username")}
                    validation={validateCustomer().username}
                    showErrors={shouldShowCustomerError("username")}
                    ref={(el) => (customerInputRefs.current.username = el)}
                  />
                </div>
              </div>

              <div className={cx("form-group")}>
                <div className={cx("input-icon")}>
                  <FontAwesomeIcon icon={faLock} />
                </div>
                <div className={cx("input-field")}>
                  <FormInputText
                    textHolder="password"
                    textName="password"
                    type="password"
                    value={customerFormData.password}
                    onChange={handleCustomerInputChange}
                    onBlur={() => handleCustomerBlur("password")}
                    validation={validateCustomer().password}
                    showErrors={shouldShowCustomerError("password")}
                    ref={(el) => (customerInputRefs.current.password = el)}
                  />
                </div>
              </div>

              <div className={cx("form-options", "customer-options")}>
                <Link to="/forgetpassword" className={cx("forgot-password")}>
                  Quên mật khẩu?
                </Link>
              </div>

              <button
                type="submit"
                className={cx("login-button", "customer-button", {
                  loading: isLoading,
                })}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className={cx("spinner")}></div>
                ) : (
                  <>
                    <span>Đăng nhập</span>
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className={cx("button-icon")}
                    />
                  </>
                )}
              </button>

              <div className={cx("register-link")}>
                <span>Chưa có tài khoản?</span>
                <Link to="/register" className={cx("register-button")}>
                  <span>Đăng ký ngay</span>
                </Link>
              </div>
            </form>
          </div>

          {/* Overlay */}
          <div className={cx("overlay-container")}>
            <div className={cx("overlay")}>
              <div className={cx("overlay-panel", "overlay-left")}>
                <h1 className={cx("title")}>
                  <span className={cx("welcome-text")}>Dành cho</span>
                  <span className={cx("role-text")}>Khách hàng</span>
                </h1>
                <p>Đăng nhập để quản lý sức khỏe và đặt lịch hẹn của bạn</p>
                <button
                  className={cx("ghost")}
                  id="login"
                  onClick={toggleStaffLogin}
                >
                  <span>Đăng nhập khách hàng</span>
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    className={cx("button-icon")}
                  />
                </button>
              </div>

              <div className={cx("overlay-panel", "overlay-right")}>
                <h1 className={cx("title")}>
                  <span className={cx("welcome-text")}>Dành cho</span>
                  <span className={cx("role-text")}>Nhân viên</span>
                </h1>
                <p>Đăng nhập để truy cập hệ thống quản lý dịch vụ y tế</p>
                <button
                  className={cx("ghost")}
                  id="register"
                  onClick={toggleStaffLogin}
                >
                  <span>Đăng nhập hệ thống</span>
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className={cx("button-icon")}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-gray-100 text-gray-700 text-sm">
        <Footer />
      </footer>
    </div>
  );
}

export default Login;
