import React, { useState } from "react";
import PropTypes from "prop-types";

function GenderChoice({ onChange }) {
  const [selectedGender, setSelectedGender] = useState("M");

  const handleGenderChange = (value) => {
    setSelectedGender(value);
    if (onChange) {
      onChange("gender", value);
    }
  };

  return (
    <div className="mb-4">
      <span className="flex text-gray-600 text-xs font-semibold mb-2">
        Giới tính (<span className="mt-0.5 text-red-500">*</span>)
      </span>
      <div className="flex gap-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="gender"
            value="M"
            checked={selectedGender === "M"}
            onChange={(e) => handleGenderChange(e.target.value)}
            className="mr-2 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <span className="text-gray-700">Nam</span>
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="gender"
            value="F"
            checked={selectedGender === "F"}
            onChange={(e) => handleGenderChange(e.target.value)}
            className="mr-2 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <span className="text-gray-700">Nữ</span>
        </label>
      </div>
    </div>
  );
}

GenderChoice.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default GenderChoice;
