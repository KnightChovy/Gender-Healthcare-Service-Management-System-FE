import React from "react";
import { useState, useEffect, forwardRef } from "react";

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

    const validateInput = (inputValue) => {
      if (!validation) return "";

      if (validation.required && !inputValue.trim()) {
        return `${textHolder} là bắt buộc`;
      }

      if (validation.minLength && inputValue.length < validation.minLength) {
        return `${textHolder} phải có ít nhất ${validation.minLength} ký tự`;
      }

      if (validation.pattern && !validation.pattern.test(inputValue)) {
        return validation.message || `${textHolder} không hợp lệ`;
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
        setError(`${textHolder} là bắt buộc`);
        setTouched(true);
      }
    }, [showErrors, value, textHolder]);

    // Determine if should show error styling
    const hasError = (error && touched) || (showErrors && !value.trim());

    return (
      <div className="form-input-text-container">
        <div className="form-input-text">
          <input
            ref={ref}
            type={type}
            name={textName}
            placeholder={textHolder}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            className={hasError ? "error" : ""}
          />
          {error && touched && <span className="error-key">!</span>}
        </div>
        {error && touched && <span className="error-message">{error}</span>}
      </div>
    );
  }
);

FormInputText.displayName = "FormInputText";

export default FormInputText;
