import { useState, useEffect } from "react";
import PropTypes from "prop-types";

function DateOfBirth({ onChange, showErrors }) {
  const [birthDate, setBirthDate] = useState({
    day: "",
    month: "",
    year: "",
  });
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({
    day: false,
    month: false,
    year: false,
  });

  const validateDate = (day, month, year) => {
    const date = new Date(year, month - 1, day);
    if (
      date.getDate() !== parseInt(day) ||
      date.getMonth() !== parseInt(month) - 1 ||
      date.getFullYear() !== parseInt(year)
    ) {
      return "Ngày sinh không hợp lệ";
    }

    const today = new Date();
    const birthYear = parseInt(year);
    const currentYear = today.getFullYear();
    const age = currentYear - birthYear;

    if (age < 13) {
      return "Bạn phải ít nhất 13 tuổi để đăng ký";
    }

    if (age > 120) {
      return "Ngày sinh không hợp lệ";
    }

    if (today < date) {
      return "Ngày sinh không thể trong tương lai";
    }

    return "";
  };

  const handleDateChange = (field, value) => {
    const newBirthDate = {
      ...birthDate,
      [field]: value,
    };

    setBirthDate(newBirthDate);

    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    if (error) {
      setError("");
    }

    if (touched.day || touched.month || touched.year) {
      const errorMessage = validateDate(
        newBirthDate.day,
        newBirthDate.month,
        newBirthDate.year
      );
      setError(errorMessage);
    }

    if (onChange) {
      onChange("birthDate", newBirthDate);
    }
  };

  useEffect(() => {
    if (showErrors && (!birthDate.day || !birthDate.month || !birthDate.year)) {
      setError("Vui lòng chọn đầy đủ ngày, tháng, năm sinh");
      setTouched({
        day: true,
        month: true,
        year: true,
      });
    }
  }, [showErrors, birthDate.day, birthDate.month, birthDate.year]);

  const getDaysInMonth = (month, year) => {
    if (!month || !year) return 31; // Default to 31 days if month or year is not selected
    return new Date(year, month, 0).getDate();
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { value: "01", label: "Tháng 1" },
    { value: "02", label: "Tháng 2" },
    { value: "03", label: "Tháng 3" },
    { value: "04", label: "Tháng 4" },
    { value: "05", label: "Tháng 5" },
    { value: "06", label: "Tháng 6" },
    { value: "07", label: "Tháng 7" },
    { value: "08", label: "Tháng 8" },
    { value: "09", label: "Tháng 9" },
    { value: "10", label: "Tháng 10" },
    { value: "11", label: "Tháng 11" },
    { value: "12", label: "Tháng 12" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const maxDays = getDaysInMonth(
    parseInt(birthDate.month),
    parseInt(birthDate.year)
  );
  const validDays = days.filter((day) => day <= maxDays);

  const hasError =
    error && (touched.day || touched.month || touched.year || showErrors);

  return (
    <div className="mb-4">
      <span className="flex text-gray-600 text-xs font-semibold mb-2">
        Ngày sinh nhật (<span className="mt-0.5 text-red-500">*</span>)
      </span>
      <div className="flex gap-2">
        <select
          value={birthDate.day}
          onChange={(e) => handleDateChange("day", e.target.value)}
          className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
            hasError 
              ? 'border-red-500 bg-red-50 text-red-700' 
              : 'border-gray-300 bg-white text-gray-900'
          }`}
        >
          <option value="">Ngày</option>
          {validDays.map((day) => (
            <option key={day} value={day.toString().padStart(2, "0")}>
              {day}
            </option>
          ))}
        </select>

        <select
          value={birthDate.month}
          onChange={(e) => handleDateChange("month", e.target.value)}
          className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
            hasError 
              ? 'border-red-500 bg-red-50 text-red-700' 
              : 'border-gray-300 bg-white text-gray-900'
          }`}
        >
          <option value="">Tháng</option>
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>

        <select
          value={birthDate.year}
          onChange={(e) => handleDateChange("year", e.target.value)}
          className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
            hasError 
              ? 'border-red-500 bg-red-50 text-red-700' 
              : 'border-gray-300 bg-white text-gray-900'
          }`}
        >
          <option value="">Năm</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      {hasError && <span className="block text-red-500 text-xs mt-1 ml-1">{error}</span>}
    </div>
  );
}

DateOfBirth.propTypes = {
  onChange: PropTypes.func.isRequired,
  showErrors: PropTypes.bool,
};

DateOfBirth.defaultProps = {
  showErrors: false,
};

export default DateOfBirth;
