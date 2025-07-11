import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import FormInputText from "../../components/ui/FormInputText";
import axiosClient from "../../services/axiosClient";
import { validateRulesLogin } from "../../components/Validation/validateRulesLogin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faUser,
  faLock,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";

import classNames from "classnames/bind";
import styles from "./Login.module.scss";

import { useDispatch } from "react-redux";
import { doLogin } from "../../store/feature/auth/authenSlice";
import { toast } from "react-toastify";
import { API_LOGIN } from "../../constants/Apis";

const cx = classNames.bind(styles);

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showErrors, setShowErrors] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const inputRefs = useRef({
    username: null,
    password: null,
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
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleBlur = (fieldName) => {
    setTouchedFields((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
  };

  const shouldShowError = (fieldName) => {
    return touchedFields[fieldName] || showErrors === true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const isEmpty = !formData.username || !formData.password;
    const errors = validate();

    try {
      if (isEmpty) {
        setShowErrors(true);
        focusFirstError(errors);
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const res = await axiosClient.post(API_LOGIN, {
          username: formData.username,
          password: formData.password,
        });

        console.log("API response:", res.data);

        const userData = res.data.data?.user;
        const accessToken = res.data.data?.tokens?.accessToken;

        dispatch(
          doLogin({
            user: userData,
            access_token: accessToken,
          })
        );

        toast.success("Đăng nhập thành công", {
          autoClose: 1000,
          position: "top-right",
        });

        const userRole = userData.role?.toLowerCase();
        console.log("Role nè: ", userRole);
        if (!userRole) {
          console.warn(
            "Không tìm thấy thông tin role trong dữ liệu người dùng"
          );
          navigate("/");
          return;
        }
        switch (userRole) {
          case "admin":
            navigate("/admin");
            break;
          case "doctor":
            navigate("/doctor/dashboard");
            break;
          case "manager":
            navigate("/manager");
            break;
          case "staff":
            navigate("/staff");
            break;
          case "user":
            navigate("/");
            break;
        }
      } catch (error) {
        console.error("Login error: ", error);

        toast.error("Đăng nhập thất bại", {
          autoClose: 1000,
          position: "top-right",
        });

        if (error.response) {
          setErrorMessage(
            error.response.data?.message ||
              "Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập."
          );
        } else {
          setErrorMessage("Lỗi kết nối đến máy chủ. Vui lòng thử lại sau.");
        }
      }
    } catch (error) {
      setErrorMessage("Đã xảy ra lỗi không mong muốn");
      console.log("Login failed: ", error);

      toast.error("Đăng nhập thất bại", {
        autoClose: 1000,
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className={cx("login-page")}>
        <div className={cx("unified-container")}>
          <div className={cx("form-container")}>
            <form onSubmit={handleLogin}>
              <div className={cx("form-header")}>
                <div className={cx("icon-container")}>
                  <FontAwesomeIcon icon={faUserCircle} />
                </div>
                <h1>Đăng nhập</h1>
                <p className={cx("subtitle")}>
                  Chào mừng bạn đến với GenCare Center
                </p>
              </div>

              {errorMessage && (
                <div className={cx("error-message")}>{errorMessage}</div>
              )}

              <div className={cx("form-group")}>
                <div className={cx("input-icon")}>
                  <FontAwesomeIcon icon={faUser} />
                </div>
                <div className={cx("input-field")}>
                  <FormInputText
                    textHolder="username"
                    textName="username"
                    value={formData.username}
                    onChange={(name, value) => handleInputChange(name, value)}
                    onBlur={() => handleBlur("username")}
                    validation={validate().username}
                    showErrors={shouldShowError("username")}
                    ref={(el) => (inputRefs.current.username = el)}
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
                    value={formData.password}
                    onChange={(name, value) => handleInputChange(name, value)}
                    onBlur={() => handleBlur("password")}
                    validation={validate().password}
                    showErrors={shouldShowError("password")}
                    ref={(el) => (inputRefs.current.password = el)}
                  />
                </div>
              </div>

              <div className={cx("form-options")}>
                <Link to="/forgetpassword" className={cx("forgot-password")}>
                  Quên mật khẩu?
                </Link>
              </div>

              <button
                type="submit"
                className={cx("login-button", {
                  loading: isLoading,
                })}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className={cx("spinner")}></div>
                ) : (
                  <>
                    <span>Đăng nhập </span>
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className={cx("button-icon")}
                    />
                  </>
                )}
              </button>

              <div className={cx("register-link")}>
                <span>Chưa có tài khoản? </span>
                <Link to="/register" className={cx("register-button")}>
                  <span>Đăng ký ngay</span>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
