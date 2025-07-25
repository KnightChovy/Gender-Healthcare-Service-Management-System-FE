import React, { useState, useRef } from "react";

import DateOfBirth from "./RegisterItems/DateOfBirth";
import FormInputText from "../../components/ui/FormInputText";
import GenderChoice from "./RegisterItems/GenderChoice";
import { validateRules } from "../../components/Validation/validateRulesRegister";
import { useNavigate, Link } from "react-router-dom";
import axiosClient from "../../services/axiosClient";
import classNames from "classnames/bind";
import styles from "./Register.module.scss";
import { API_REGISTER } from "../../constants/Apis";
import { toast } from "react-toastify";

const cx = classNames.bind(styles);

function Register() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    birthDate: {
      day: "",
      month: "",
      year: "",
    },
  });

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const inputRefs = useRef({
    firstname: null,
    lastname: null,
    username: null,
    email: null,
    phone: null,
    address: null,
    password: null,
    confirmPassword: null,
    birthDate: {
      day: null,
      month: null,
      year: null,
    },
  });

  const focusFirstError = (errors) => {
    const fieldOrder = [
      "firstname",
      "lastname",
      "username",
      "email",
      "phone",
      "address",
      "password",
      "confirmPassword",
      "gender",
    ];

    for (const field of fieldOrder) {
      if (errors[field] && inputRefs.current[field]) {
        inputRefs.current[field].focus();
        break;
      }
    }

    const { day, month, year } = formData.birthDate;
    if (!day || !month || !year) {
      const birthDateElement = document.querySelector(".date-of-birth");
      if (birthDateElement) {
        birthDateElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }

    if (!formData.gender && inputRefs.current.gender) {
      inputRefs.current.gender.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      const firstRadio = inputRefs.current.gender.querySelector(
        "input[type='radio']"
      );
      if (firstRadio) {
        firstRadio.focus();
      }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEmpty =
      !formData.firstname ||
      !formData.lastname ||
      !formData.username ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.birthDate.day ||
      !formData.birthDate.month ||
      !formData.birthDate.year ||
      !formData.gender;

    const errors = validate();
    try {
      if (isEmpty) {
        setShowErrors(true);
        focusFirstError(errors);
        return;
      }

      const formatBirthDate = () => {
        const { day, month, year } = formData.birthDate;
        const formattedDay = day.toString().padStart(2, "0");
        const formattedMonth = month.toString().padStart(2, "0");
        return `${year}-${formattedMonth}-${formattedDay}`;
      };

      const userData = {
        username: formData.username,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        birthday: formatBirthDate(),
        address: formData.address,
        first_name: formData.firstname,
        last_name: formData.lastname,
      };

      console.log("Sending data to API:", userData);

      const response = await axiosClient.post(API_REGISTER, userData);

      console.log("Registration successful:", response.data);

      toast.success("Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.");
      navigate("/login");
    } catch (error) {
      console.error("Error during registration:", error);

      let errorMessage = "Đăng ký thất bại: ";

      if (error.response) {
        const responseData = error.response.data;

        if (responseData.message) {
          errorMessage += responseData.message;
        }

        if (responseData.errors && responseData.errors.length > 0) {
          errorMessage += "\n• " + responseData.errors.join("\n• ");
        }
      } else {
        errorMessage +=
          "Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại sau.";
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const validate = () => validateRules(formData);

  return (
    <div>
      <div className={cx("register-container")}>
        <div className={cx("register-content")}>
          <div className={cx("register-introduction")}>
            <h2>Tạo một tài khoản mới</h2>
            <p>Nhanh chóng và dễ dàng</p>
          </div>

          <div className={cx("register-form")}>
            <form>
              <span style={{ display: "flex" }}>
                Họ và tên (<span style={{ marginTop: "2px" }}>*</span>)
              </span>
              <div className={cx("form-row")}>
                <FormInputText
                  ref={(el) => (inputRefs.current.firstname = el)}
                  type="text"
                  textHolder="firstName"
                  textName="firstname"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  validation={validate().firstname}
                  showErrors={showErrors}
                />
                <FormInputText
                  ref={(el) => (inputRefs.current.lastname = el)}
                  type="text"
                  textHolder="lastName"
                  textName="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  validation={validate().lastname}
                  showErrors={showErrors}
                />
              </div>

              <DateOfBirth
                ref={(el) => (inputRefs.current.birthDate = el)}
                onChange={(name, value) => handleInputChange(name, value)}
                showErrors={showErrors}
              />
              <GenderChoice
                ref={(el) => (inputRefs.current.gender = el)}
                onChange={(name, value) => handleInputChange(name, value)}
                showError={showErrors}
              />
              <span style={{ display: "flex" }}>
                Số điện thoại (<span style={{ marginTop: "2px" }}>*</span>)
              </span>
              <FormInputText
                ref={(el) => (inputRefs.current.phone = el)}
                type="text"
                textHolder="phone"
                textName="phone"
                value={formData.phone}
                onChange={handleInputChange}
                validation={validate().phone}
                showErrors={showErrors}
              />
              <span style={{ display: "flex" }}>
                Địa chỉ (<span style={{ marginTop: "2px" }}>*</span>)
              </span>
              <FormInputText
                ref={(el) => (inputRefs.current.address = el)}
                type="text"
                textHolder="address"
                textName="address"
                value={formData.address}
                onChange={handleInputChange}
                validation={validate().address}
                showErrors={showErrors}
              />
              <span style={{ display: "flex" }}>
                Địa chỉ Email (<span style={{ marginTop: "2px" }}>*</span>)
              </span>
              <FormInputText
                ref={(el) => (inputRefs.current.email = el)}
                type="email"
                textHolder="email"
                textName="email"
                value={formData.email}
                onChange={handleInputChange}
                validation={validate().email}
                showErrors={showErrors}
              />
              <span style={{ display: "flex" }}>
                Tên đăng nhập (<span style={{ marginTop: "2px" }}>*</span>)
              </span>
              <FormInputText
                ref={(el) => (inputRefs.current.username = el)}
                type="text"
                textHolder="username"
                textName="username"
                value={formData.username}
                onChange={handleInputChange}
                validation={validate().username}
                showErrors={showErrors}
              />
              <span style={{ display: "flex" }}>
                Mật khẩu (<span style={{ marginTop: "2px" }}>*</span>)
              </span>
              <FormInputText
                ref={(el) => (inputRefs.current.password = el)}
                type="password"
                textHolder="password"
                textName="password"
                value={formData.password}
                onChange={handleInputChange}
                validation={validate().password}
                showErrors={showErrors}
              />
              <span>Xác nhận mật khẩu</span>
              <FormInputText
                ref={(el) => (inputRefs.current.confirmPassword = el)}
                type="password"
                textHolder="confirmPassword"
                textName="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                validation={validate().confirmPassword}
              />

              <p>
                Bằng cách nhấp vào Đăng ký, bạn đồng ý với{" "}
                <a href="/terms" className={cx("terms-link")}>
                  {" "}
                  Điều khoản Dịch vụ{" "}
                </a>{" "}
                và{" "}
                <a href="/privacy" className={cx("privacy-link")}>
                  {" "}
                  Chính sách Bảo mật{" "}
                </a>{" "}
                của chúng tôi. Bạn có thể nhận được thông báo SMS từ chúng tôi
                và có thể từ chối bất cứ lúc nào.
              </p>
              <button
                type="submit"
                className={cx("register-button")}
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Đăng ký"}
              </button>
              <p className={cx("register-footer")}>
                Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
