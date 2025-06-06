import DateOfBirth from "./RegisterItems/DateOfBirth";
import FormInputText from "../../components/ui/FormInputText";
import GenderChoice from "./RegisterItems/GenderChoice";
import { Navbar } from "../../components/Layouts/LayoutHomePage/Navbar";
import { validateRules } from "../../components/Validation/validateRulesRegister";
import React, { useState, useRef } from "react";
import classNames from "classnames/bind";
import styles from "../../assets/Register.module.scss";

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
    ];

    for (const field of fieldOrder) {
      if (errors[field] && inputRefs.current[field]) {
        inputRefs.current[field].focus();
        break;
      }
    }

    // Check birthDate
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

  const handleSubmit = (e) => {
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

    if (isEmpty) {
      setShowErrors(true);
      focusFirstError();
      return;
    }
    // Here you can handle form submission, e.g., send data to the server
    console.log("Form submitted:", formData);
  };

  const validate = () => validateRules(formData);

  return (
    <div>
      <header className="py-2 lg:py-3 sticky top-0 z-10 bg-white shadow-lg">
        <Navbar />
      </header>

      <div className={cx("register-container")}>
        <div className={cx("register-header")}>
          <h1>GenCare Center</h1>
        </div>

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
                  textHolder="firstName"
                  textName="firstname"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  validation={validate().firstname}
                  showErrors={showErrors}
                />
                <FormInputText
                  textHolder="lastName"
                  textName="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  validation={validate().lastname}
                  showErrors={showErrors}
                />
              </div>

              <DateOfBirth
                onChange={(name, value) => handleInputChange(name, value)}
                showErrors={showErrors}
              />
              <GenderChoice
                onChange={(name, value) => handleInputChange(name, value)}
              />
              <span style={{ display: "flex" }}>
                Số điện thoại (<span style={{ marginTop: "2px" }}>*</span>)
              </span>
              <FormInputText
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
                textHolder="password"
                textName="password"
                value={formData.password}
                onChange={handleInputChange}
                validation={validate().password}
                showErrors={showErrors}
              />
              <span>Xác nhận mật khẩu</span>
              <FormInputText
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
                của chúng tôi. Bạn có thể nhận được thông báo SMS từ chúng tôi và
                có thể từ chối bất cứ lúc nào.
              </p>
              <button
                type="submit"
                className={cx("register-button")}
                onClick={handleSubmit}
              >
                Đăng ký
              </button>
              <p className={cx("register-footer")}>
                Bạn đã có tài khoản? <a href="/login">Đăng nhập</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>

  );
}

export default Register;
