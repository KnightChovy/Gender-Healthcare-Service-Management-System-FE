import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import FormInputText from "../../components/ui/FormInputText";
import { validateRulesLogin } from "../../components/Validation/validateRulesLogin";

function Login() {
  const [isStaff, setIsStaff] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showErrors, setShowErrors] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const navigate = useNavigate();

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

  const handleLogin = (e) => {
    e.preventDefault();

    const errors = validate();

    if (Object.keys(errors).length > 0) {
      setShowErrors(true);
      focusFirstError(errors);
      return;
    }

    if (formData.username && formData.password) {
      if (isStaff) {
        console.log("Nhân viên đăng nhập:", formData);
      } else {
        console.log("Khách hàng đăng nhập:", formData);
      }
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div
      className="h-screen bg-cover bg-center py-40"
      style={{
        backgroundImage: "url('/assets/login.jpg')",
      }}
    >
      <div className="bg-red-500 w-[800px] h-[350px] z-10 mx-auto flex">
        {isStaff ? (
          <>
            <div className="bg-yellow-400 w-[400px] h-[350px] p-4">
              <div className="text-lg font-bold mb-4">Hello Staff!</div>
              <div className="mb-4">
                Nếu bạn không phải nhân viên, vui lòng đăng nhập tại đây!
              </div>
              <button
                onClick={() => setIsStaff(false)}
                className="text-blue-600 underline cursor-pointer"
              >
                Đăng nhập với tư cách khách hàng←
              </button>
            </div>
            <div className="bg-blue-500 w-[400px] h-[350px] p-4">
              <div className="text-lg font-bold mb-4">
                Nhân viên đăng nhập tại đây!
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <FormInputText
                    textHolder="Nhập tên đăng nhập"
                    textName="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("username")}
                    validation={validate().username}
                    showErrors={shouldShowError("username")}
                    ref={(el) => (inputRefs.current.username = el)}
                  />
                </div>
                <div>
                  <FormInputText
                    textHolder="Nhập mật khẩu"
                    textName="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("password")}
                    validation={validate().password}
                    showErrors={shouldShowError("password")}
                    ref={(el) => (inputRefs.current.password = el)}
                    type="password"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-white text-blue-500 p-2 rounded font-bold hover:bg-gray-100"
                >
                  Đăng nhập
                </button>
                <div className="text-center mt-4">
                  <span className="text-white">Bạn chưa có tài khoản? </span>
                  <button
                    type="button"
                    onClick={handleRegister}
                    className="text-yellow-300 underline cursor-pointer font-semibold"
                  >
                    Đăng ký
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <>
            <div className="bg-green-500 w-[400px] h-[350px] p-4">
              <div className="text-lg font-bold mb-4">
                Khách hàng đăng nhập tại đây!
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <FormInputText
                    textHolder="Nhập tên đăng nhập"
                    textName="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("username")}
                    validation={validate().username}
                    showErrors={shouldShowError("username")}
                    ref={(el) => (inputRefs.current.username = el)}
                  />
                </div>
                <div>
                  <FormInputText
                    textHolder="Nhập mật khẩu"
                    textName="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("password")}
                    validation={validate().password}
                    showErrors={shouldShowError("password")}
                    ref={(el) => (inputRefs.current.password = el)}
                    type="password"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-white text-green-500 p-2 rounded font-bold hover:bg-gray-100"
                >
                  Đăng nhập
                </button>
                <div className="text-center mt-4">
                  <span className="text-white">Bạn chưa có tài khoản? </span>
                  <button
                    type="button"
                    onClick={handleRegister}
                    className="text-yellow-300 underline cursor-pointer font-semibold"
                  >
                    Đăng ký
                  </button>
                </div>
              </form>
            </div>
            <div className="bg-purple-500 w-[400px] h-[350px] p-4">
              <div className="text-lg font-bold mb-4">Hello!</div>
              <div className="mb-4">
                Nếu bạn là nhân viên, đăng nhập tại đây!
              </div>
              <button
                onClick={() => setIsStaff(true)}
                className="text-blue-600 underline cursor-pointer"
              >
                Đăng nhập với tư cách nhân viên←
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
