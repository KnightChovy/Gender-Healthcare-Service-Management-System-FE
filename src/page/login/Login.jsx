import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import FormInputText from "../../components/ui/FormInputText";
import { validateRulesLogin } from "../../components/Validation/validateRulesLogin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faUser, faLock, faBuilding, faUserAlt } from "@fortawesome/free-solid-svg-icons";
import "./Login.css";

function Login() {
  const [showStaffLogin, setShowStaffLogin] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [showErrors, setShowErrors] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const inputRefs = useRef({
    username: null,
    password: null
  });

  const validate = () => validateRulesLogin(formData);

  const focusFirstError = (errors) => {
    if (errors.username && inputRefs.current.username) {
      inputRefs.current.username.focus();
    } else if (errors.password && inputRefs.current.password) {
      inputRefs.current.password.focus();
    }
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (showErrors) {
      setShowErrors(false);
    }
  };

  const handleBlur = (fieldName) => {
    setTouchedFields((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
  };

  const shouldShowError = (fieldName) => {
    return touchedFields[fieldName] || showErrors;
  };

  const handleLogin = async (e, isStaff = false) => {
    e.preventDefault();

    const errors = validate();

    if (Object.keys(errors).length > 0) {
      setShowErrors(true);
      focusFirstError(errors);
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (formData.username && formData.password) {
        if (isStaff) {
          console.log("Nhân viên/Admin đăng nhập:", formData);
          navigate('/admin-dashboard');
        } else {
          console.log("Khách hàng đăng nhập:", formData);
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStaffLogin = () => {
    setShowStaffLogin(!showStaffLogin);
    // Reset form data when switching between forms
    setFormData({
      username: "",
      password: ""
    });
    setTouchedFields({});
    setShowErrors(false);
  };

  return (
    <div className="login-page">
      <div className={`container ${showStaffLogin ? 'right-panel-active' : ''}`} id="container">
        {/* Admin/Staff Login Form */}
        <div className="form-container staff-container">
          <form onSubmit={(e) => handleLogin(e, true)}>
            <div className="form-header">
              <div className="icon-container staff-icon">
                <FontAwesomeIcon icon={faBuilding} />
              </div>
              <h1>Đăng nhập Hệ thống</h1>
              <p className="subtitle">Dành cho nhân viên và quản trị viên</p>
            </div>
            
            <div className="form-group">
              <div className="input-icon">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div className="input-field">
                <FormInputText
                  textHolder="Tên đăng nhập"
                  textName="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("username")}
                  validation={validate().username}
                  showErrors={shouldShowError("username")}
                  ref={(el) => (inputRefs.current.username = el)}
                />
                <small className="error-message">{shouldShowError("username") && validate().username}</small>
              </div>
            </div>
            
            <div className="form-group">
              <div className="input-icon">
                <FontAwesomeIcon icon={faLock} />
              </div>
              <div className="input-field">
                <FormInputText
                  textHolder="Mật khẩu"
                  textName="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("password")}
                  validation={validate().password}
                  showErrors={shouldShowError("password")}
                  ref={(el) => (inputRefs.current.password = el)}
                />
                <small className="error-message">{shouldShowError("password") && validate().password}</small>
              </div>
            </div>
            
            <div className="form-options staff-options">
              <a href="/" className="forgot-password">Quên mật khẩu?</a>
            </div>
            
            <button 
              type="submit" 
              className={`login-button staff-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <span>Đăng nhập</span>
                  <FontAwesomeIcon icon={faArrowRight} className="button-icon" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Customer Login Form */}
        <div className="form-container customer-container">
          <form className="form-lg" onSubmit={(e) => handleLogin(e, false)}>
            <div className="form-header">
              <div className="icon-container customer-icon">
                <FontAwesomeIcon icon={faUserAlt} />
              </div>
              <h1>Đăng nhập Khách hàng</h1>
              <p className="subtitle">Chào mừng bạn đến với GenCare Center</p>
            </div>
            
            <div className="form-group">
              <div className="input-icon">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div className="input-field">
                <FormInputText
                  textHolder="Tên đăng nhập"
                  textName="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("username")}
                  validation={validate().username}
                  showErrors={shouldShowError("username")}
                  ref={(el) => (inputRefs.current.username = el)}
                />
                <small className="error-message">{shouldShowError("username") && validate().username}</small>
              </div>
            </div>
            
            <div className="form-group">
              <div className="input-icon">
                <FontAwesomeIcon icon={faLock} />
              </div>
              <div className="input-field">
                <FormInputText
                  textHolder="Mật khẩu"
                  textName="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("password")}
                  validation={validate().password}
                  showErrors={shouldShowError("password")}
                  ref={(el) => (inputRefs.current.password = el)}
                />
                <small className="error-message">{shouldShowError("password") && validate().password}</small>
              </div>
            </div>

            <div className="form-options customer-options">
              <a href="/" className="forgot-password">Quên mật khẩu?</a>
            </div>
            
            <button 
              type="submit" 
              className={`login-button customer-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <span>Đăng nhập</span>
                  <FontAwesomeIcon icon={faArrowRight} className="button-icon" />
                </>
              )}
            </button>
            
            <div className="register-link">
              <span>Chưa có tài khoản?</span>
              <a href="/">Đăng ký ngay</a>
            </div>
          </form>
        </div>

        {/* Overlay */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 className="title">
                <span className="welcome-text">Dành cho</span>
                <span className="role-text">Khách hàng</span>
              </h1>
              <p>Đăng nhập để quản lý sức khỏe và đặt lịch hẹn của bạn</p>
              <button className="ghost" id="login" onClick={toggleStaffLogin}>
                <span>Đăng nhập khách hàng</span>
                <FontAwesomeIcon icon={faArrowLeft} className="button-icon" />
              </button>
            </div>

            <div className="overlay-panel overlay-right">
              <h1 className="title">
                <span className="welcome-text">Dành cho</span>
                <span className="role-text">Nhân viên</span>
              </h1>
              <p>
                Đăng nhập để truy cập hệ thống quản lý dịch vụ y tế
              </p>
              <button className="ghost" id="register" onClick={toggleStaffLogin}>
                <span>Đăng nhập hệ thống</span>
                <FontAwesomeIcon icon={faArrowRight} className="button-icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;