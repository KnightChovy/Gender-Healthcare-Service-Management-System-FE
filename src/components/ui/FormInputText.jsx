import React, { useState, useEffect, forwardRef } from "react";
import PropTypes from "prop-types";

const FormInputText = forwardRef(
  (
    {
      textHolder,
      textName,
      type = "text",
      validation,
      value,
      onChange,
      showErrors,
    },
    ref
  ) => {
    const [error, setError] = useState("");
    const [touched, setTouched] = useState(false);

    const getPlaceholder = (textHolder) => {
      const placeholderMap = {
        'firstName': 'Nhập tên',
        'lastName': 'Nhập họ',
        'email': 'Nhập địa chỉ email ví dụ: abc@example.com',
        'phone': 'Nhập số điện thoại',
        'password': 'Nhập mật khẩu',
        'confirmPassword': 'Nhập lại mật khẩu',
        'address': 'Nhập địa chỉ',
        'username': 'Nhập tên đăng nhập',
      }

      if (placeholderMap[textHolder]) {
        return placeholderMap[textHolder];
      }
    };

    const getErrorHolder = (textHolder) => {
      const errorMap = {
        'firstName': 'Tên',
        'lastName': 'Họ',
        'email': 'Email',
        'phone': 'Số điện thoại',
        'password': 'Mật khẩu',
        'confirmPassword': 'Mật khẩu xác nhận',
        'address': 'Địa chỉ',
        'username': 'Tên đăng nhập',
      }

      if (errorMap[textHolder]) {
        return errorMap[textHolder];
      }
    };

    const validateInput = (inputValue) => {
      if (!validation) return "";

      if (validation.required && !inputValue.trim()) {
        return `Nhập ${getErrorHolder(textHolder)} là bắt buộc`;
      }

      if (validation.minLength && inputValue.length < validation.minLength) {
        return `${getErrorHolder(textHolder)} phải có ít nhất ${validation.minLength} ký tự`;
      }

      if (validation.pattern && !validation.pattern.test(inputValue)) {
        return validation.message || `${getErrorHolder(textHolder)} không hợp lệ`;
      }

      if (validation.confirmPassword && inputValue !== value) {
        return "Mật khẩu xác nhận không khớp";
      }

      return "";
    };

    const handleChange = (e) => {
      const inputValue = e.target.value;
      onChange(textName, inputValue);

      if (error) {
        setError("");
      }

      if (touched) {
        const errorMessage = validateInput(inputValue);
        setError(errorMessage);
      }
    };

    const handleBlur = () => {
      setTouched(true);
      const errorMessage = validateInput(value);
      setError(errorMessage);
    };

    useEffect(() => {
      if (showErrors && !value.trim()) {
        setError(`Nhập ${getErrorHolder(textHolder)} là bắt buộc`);
        setTouched(true);
      }
    }, [showErrors, value, textHolder]);

    // Determine if should show error styling
    const hasError = (error && touched) || (showErrors && !value.trim());

    return (
      <div className="relative mb-4">
        <div className="relative">
          <input
            ref={ref}
            type={type}
            name={textName}
            placeholder={getPlaceholder(textHolder)}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
              hasError 
                ? 'border-red-500 bg-red-50 text-red-700' 
                : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400'
            }`}
          />
          {error && touched && (
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 font-bold">
              !
            </span>
          )}
        </div>
        {error && touched && (
          <span className="block text-red-500 text-xs mt-1 ml-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);

FormInputText.displayName = "FormInputText";

FormInputText.propTypes = {
  textHolder: PropTypes.string.isRequired,
  textName: PropTypes.string.isRequired,
  type: PropTypes.string,
  validation: PropTypes.object,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  showErrors: PropTypes.bool,
};

FormInputText.defaultProps = {
  type: "text",
  validation: {},
  showErrors: false,
};

export default FormInputText;
