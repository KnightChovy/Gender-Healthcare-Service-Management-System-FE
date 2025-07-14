import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import FormInputText from "../../components/ui/FormInputText";
import { validateRulesLogin } from "../../components/Validation/validateRulesLogin";
import Navbar from "../../Layouts/LayoutHomePage/Navbar";
import { Footer } from "../../Layouts/LayoutHomePage/Footer";
import { loginUser, authUtils } from "../../utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEye, 
  faEyeSlash, 
  faUser, 
  faLock, 
  faHeart,
  faShieldAlt,
  faUserMd,
  faSpinner,
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState("customer");
  const [apiError, setApiError] = useState("");
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
    
    if (apiError) {
      setApiError("");
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

  const handleLogin = async (e) => {
    e.preventDefault();

    const errors = validate();

    if (Object.keys(errors).length > 0) {
      setShowErrors(true);
      focusFirstError(errors);
      return;
    }

    setIsLoading(true);
    setApiError("");

    try {
      const credentials = {
        username: formData.username,
        password: formData.password,
      };

      const response = await loginUser(credentials);

      if (response.success) {
        const responseData = response.data;

        const tokens = responseData.data?.tokens;
        const userData = responseData.data?.user;
        
        const accessToken = tokens.accessToken;
        const refreshToken = tokens.refreshToken;
        
        if (accessToken) {
          const tokenData = {
            accessToken: accessToken,
            refreshToken: refreshToken || ''
          };
          localStorage.setItem('authTokens', JSON.stringify(tokenData));
        } else {
          console.error('No access token to store!');
        }
        
        // Store user data in localStorage
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('userType', loginType);
        
        // Also use authUtils for consistency
        if (accessToken) {
          authUtils.setToken(accessToken);
        }
        authUtils.setUserData(userData);
        authUtils.setUserType(loginType);
        
        // Show success message
        console.log("Đăng nhập thành công:", response.data);
        
        // Navigate based on user role
        const userRole = userData?.role || userData?.user_type || 'user';
        
        switch (userRole) {
          case 'doctor':
            navigate('/doctor-dashboard');
            break;
          case 'manager':
            navigate('/manager-dashboard');
            break;
          case 'user':
          default:
            navigate('/');
            break;
        }
      } else {
        // Handle API error
        setApiError(response.error.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setApiError("Lỗi kết nối đến server. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const switchLoginType = (type) => {
    setLoginType(type);
    setFormData({ username: "", password: "" });
    setTouchedFields({});
    setShowErrors(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <div className="flex-1 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <FontAwesomeIcon 
                icon={loginType === "staff" ? faUserMd : faHeart} 
                className="h-8 w-8 text-white" 
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {loginType === "staff" ? "Đăng nhập Hệ thống" : "Chào mừng trở lại"}
            </h2>
            <p className="text-gray-600">
              {loginType === "staff" 
                ? "Truy cập hệ thống quản lý GenCare Center" 
                : "Đăng nhập để sử dụng dịch vụ chăm sóc sức khỏe"
              }
            </p>
          </div>

          {/* Login Type Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                loginType === "customer"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => switchLoginType("customer")}
            >
              <FontAwesomeIcon icon={faHeart} className="mr-2" />
              Khách hàng
            </button>
            <button
              type="button"
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                loginType === "staff"
                  ? "bg-white text-purple-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => switchLoginType("staff")}
            >
              <FontAwesomeIcon icon={faShieldAlt} className="mr-2" />
              Nhân viên
            </button>
          </div>

          {/* Login Form */}
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Tên đăng nhập
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-gray-400" />
                  </div>
                  <FormInputText
                    textHolder="Nhập tên đăng nhập"
                    textName="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("username")}
                    showErrors={shouldShowError("username")}
                    ref={(el) => (inputRefs.current.username = el)}
                    className="pl-10 block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  {shouldShowError("username") && validate().username && (
                    <p className="mt-1 text-sm text-red-600">{validate().username}</p>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faLock} className="h-5 w-5 text-gray-400" />
                  </div>
                  <FormInputText
                    textHolder="Nhập mật khẩu"
                    textName="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("password")}
                    showErrors={shouldShowError("password")}
                    ref={(el) => (inputRefs.current.password = el)}
                    className="pl-10 pr-10 block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={togglePasswordVisibility}
                  >
                    <FontAwesomeIcon 
                      icon={showPassword ? faEyeSlash : faEye} 
                      className="h-5 w-5 text-gray-400 hover:text-gray-600" 
                    />
                  </button>
                  {shouldShowError("password") && validate().password && (
                    <p className="mt-1 text-sm text-red-600">{validate().password}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link 
                to="/forget-password" 
                className="text-sm text-blue-600 hover:text-blue-500 hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* API Error Display */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="flex">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-red-800">{apiError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-all duration-200 ${
                loginType === "staff"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading ? "opacity-75 cursor-not-allowed" : "hover:shadow-lg transform hover:scale-105"
              }`}
            >
              {isLoading ? (
                <FontAwesomeIcon icon={faSpinner} className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Đăng nhập
                </>
              )}
            </button>

            {/* Register Link - Only for customers */}
            {loginType === "customer" && (
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Chưa có tài khoản?{" "}
                  <Link 
                    to="/register" 
                    className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
                  >
                    Đăng ký ngay
                  </Link>
                </p>
              </div>
            )}

            {/* Security Notice for Staff */}
            {loginType === "staff" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <div className="flex">
                  <FontAwesomeIcon icon={faShieldAlt} className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-yellow-800">
                      <strong>Lưu ý bảo mật:</strong> Chỉ nhân viên được ủy quyền mới có thể truy cập hệ thống.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </form>

          {/* Back to Home Link */}
          <div className="text-center">
            <Link 
              to="/" 
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 hover:underline"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Login;