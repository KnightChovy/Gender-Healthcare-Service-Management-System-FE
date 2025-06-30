import DateOfBirth from "../../components/ui/DateOfBirth";
import FormInputText from "../../components/ui/FormInputText";
import GenderChoice from "../../components/ui/GenderChoice";
import { validateRules } from "../../components/Validation/validateRulesRegister";
import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../Layouts/LayoutHomePage/Navbar";
import { Footer } from "../../Layouts/LayoutHomePage/Footer";
import { registerUser } from "../../utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faExclamationTriangle, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

function Register() {
  const navigate = useNavigate();
  
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
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
    
    // Clear API error and success message when user starts typing
    if (apiError) {
      setApiError("");
    }
    if (successMessage) {
      setSuccessMessage("");
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

    if (isEmpty) {
      setShowErrors(true);
      focusFirstError();
      return;
    }

    // Validate form data
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setShowErrors(true);
      focusFirstError(errors);
      return;
    }

    setIsLoading(true);
    setApiError("");
    setSuccessMessage("");

    try {
      // Prepare user data for API
      const userData = {
        firstName: formData.firstname,
        lastName: formData.lastname,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        password: formData.password,
        dateOfBirth: `${formData.birthDate.year}-${formData.birthDate.month.padStart(2, '0')}-${formData.birthDate.day.padStart(2, '0')}`,
        gender: formData.gender,
      };

      // Call the register API
      const response = await registerUser(userData);

      if (response.success) {
        setSuccessMessage("Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập.");
        console.log("Registration successful:", response.data);
        
        // Clear form
        setFormData({
          firstname: "",
          lastname: "",
          username: "",
          email: "",
          phone: "",
          address: "",
          password: "",
          confirmPassword: "",
          birthDate: { day: "", month: "", year: "" },
          gender: "",
        });
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        // Handle API error
        setApiError(response.error.message || "Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setApiError("Lỗi kết nối đến server. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const validate = () => validateRules(formData);

  return (
    <div>
      <Navbar />

      <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center font-sans p-5">

        <div className="text-center mb-5">
          <h1 className="text-gray-900 text-3xl font-bold m-0">GenCare Center</h1>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-md">
          <div className="text-center mb-5 pb-5 border-b border-gray-300">
            <h2 className="text-gray-900 text-xl font-semibold mb-2">Tạo một tài khoản mới</h2>
            <p className="text-gray-600 text-sm">Nhanh chóng và dễ dàng</p>
          </div>

          <div className="flex flex-col gap-3">
            <form>
              <span className="flex text-gray-600 text-xs font-semibold mb-2">
                Họ và tên (<span className="mt-0.5 text-red-500">*</span>)
              </span>
              <div className="flex gap-2 mb-3">
                <FormInputText
                  textHolder="firstName"
                  textName="firstname"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  showErrors={showErrors}
                />
                <FormInputText
                  textHolder="lastName"
                  textName="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
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
              <span className="flex text-gray-600 text-xs font-semibold mb-2">
                Tên đăng nhập (<span className="mt-0.5 text-red-500">*</span>)
              </span>
              <FormInputText
                textHolder="username"
                textName="username"
                value={formData.username}
                onChange={handleInputChange}
                showErrors={showErrors}
              />
              <span className="flex text-gray-600 text-xs font-semibold mb-2">
                Địa chỉ Email (<span className="mt-0.5 text-red-500">*</span>)
              </span>
              <FormInputText
                textHolder="email"
                textName="email"
                value={formData.email}
                onChange={handleInputChange}
                showErrors={showErrors}
              />
              <span className="flex text-gray-600 text-xs font-semibold mb-2">
                Số điện thoại (<span className="mt-0.5 text-red-500">*</span>)
              </span>
              <FormInputText
                textHolder="phone"
                textName="phone"
                value={formData.phone}
                onChange={handleInputChange}
                showErrors={showErrors}
              />
              <span className="flex text-gray-600 text-xs font-semibold mb-2">
                Địa chỉ (<span className="mt-0.5 text-red-500">*</span>)
              </span>
              <FormInputText
                textHolder="address"
                textName="address"
                value={formData.address}
                onChange={handleInputChange}
                showErrors={showErrors}
              />
              <span className="flex text-gray-600 text-xs font-semibold mb-2">
                Mật khẩu (<span className="mt-0.5 text-red-500">*</span>)
              </span>
              <FormInputText
                textHolder="password"
                textName="password"
                value={formData.password}
                onChange={handleInputChange}
                showErrors={showErrors}
              />
              <span className="block text-gray-600 text-xs font-semibold mb-2">Xác nhận mật khẩu</span>
              <FormInputText
                textHolder="confirmPassword"
                textName="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />

              <p className="text-gray-500 text-xs leading-4 my-4 text-center">
                Bằng cách nhấp vào Đăng ký, bạn đồng ý với{" "}
                <Link to="/terms" className="text-blue-600 no-underline hover:underline">
                  Điều khoản Dịch vụ
                </Link>{" "}
                và{" "}
                <Link to="/privacy" className="text-blue-600 no-underline hover:underline">
                  Chính sách Bảo mật
                </Link>{" "}
                của chúng tôi. Bạn có thể nhận được thông báo SMS từ chúng tôi và
                có thể từ chối bất cứ lúc nào.
              </p>

              {/* Success Message */}
              {successMessage && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-3">
                  <div className="flex">
                    <FontAwesomeIcon icon={faCheckCircle} className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-green-800">{successMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {apiError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
                  <div className="flex">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-red-800">{apiError}</p>
                    </div>
                  </div>
                </div>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-gradient-to-b from-green-400 to-green-600 bg-green-500 border border-green-800 rounded-md text-white cursor-pointer text-lg font-semibold py-3 px-4 shadow-inner mt-3 transition-colors flex items-center justify-center ${
                  isLoading 
                    ? "opacity-75 cursor-not-allowed" 
                    : "hover:bg-green-600"
                }`}
                onClick={handleSubmit}
              >
                {isLoading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="h-5 w-5 animate-spin mr-2" />
                    Đang đăng ký...
                  </>
                ) : (
                  "Đăng ký"
                )}
              </button>
              <p className="text-center text-sm text-gray-600 mt-4">
                Bạn đã có tài khoản? <Link to="/login" className="text-blue-600 hover:underline">Đăng nhập</Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Register;
